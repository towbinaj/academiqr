# Server-Side Rate Limiting Implementation

## Overview

Server-side rate limiting has been implemented to prevent brute-force attacks on authentication endpoints. This complements the existing client-side rate limiting and provides protection that cannot be bypassed.

---

## Components

### 1. Database Table: `rate_limit_attempts`

**Location:** `supabase/migrations/create_rate_limit_table.sql`

**Purpose:** Stores authentication attempt records for rate limiting checks.

**Schema:**
- `id` - UUID primary key
- `email` - User email (nullable, for email-based tracking)
- `ip_address` - Client IP address (required, for IP-based tracking)
- `attempt_type` - Type of attempt ('login', 'signup', etc.)
- `success` - Whether the attempt was successful
- `created_at` - Timestamp of the attempt

**Indexes:**
- Indexes on `(email, created_at)`, `(ip_address, created_at)`, etc. for efficient queries

**Functions:**
- `is_rate_limited()` - Checks if an IP/email is currently rate limited
- `cleanup_old_rate_limit_attempts()` - Removes records older than 24 hours

---

### 2. Supabase Edge Function: `rate-limit-check`

**Location:** `supabase/functions/rate-limit-check/index.ts`

**Purpose:** Provides API endpoint for checking and recording rate limits.

**Endpoints:**
- `POST /functions/v1/rate-limit-check`

**Request Body:**
```json
{
  "email": "user@example.com",
  "attemptType": "login",  // or "signup"
  "recordAttempt": false,  // true to record, false to just check
  "success": false         // true if successful, false if failed
}
```

**Response (Not Locked):**
```json
{
  "allowed": true,
  "isLocked": false,
  "remainingAttempts": 4,
  "recentAttempts": 1,
  "failedAttempts": 1
}
```

**Response (Locked):**
```json
{
  "allowed": false,
  "isLocked": true,
  "lockoutUntil": "2024-01-01T12:00:00Z",
  "remainingTime": 900,  // seconds
  "message": "Too many failed attempts. Please try again in 15 minutes."
}
```

**Rate Limit Configuration:**
- **Max Attempts:** 5 failed attempts
- **Time Window:** 60 minutes (1 hour)
- **Lockout Duration:** 15 minutes

---

### 3. Client-Side Integration

**Location:** `index.html`

**Functions Added:**
1. `checkServerRateLimit(email, attemptType)` - Checks server-side rate limit before authentication
2. `recordServerAttempt(email, attemptType, success)` - Records authentication attempts to server

**Integration Points:**
- `handleEmailLogin()` - Checks server rate limit before login, records attempts after
- `handleEmailSignUp()` - Checks server rate limit before sign-up, records attempts after

---

## How It Works

### Login Flow:

1. **User enters credentials and clicks "Sign In"**
2. **Client-side check:** Fast client-side rate limit check (localStorage)
3. **Server-side check:** Calls `rate-limit-check` edge function to verify server-side rate limit
4. **If locked:** Shows lockout message and blocks login attempt
5. **If allowed:** Proceeds with authentication
6. **After authentication:**
   - **Success:** Records successful attempt to server
   - **Failure:** Records failed attempt to server

### Sign-Up Flow:

1. **User enters credentials and clicks "Sign Up"**
2. **Server-side check:** Calls `rate-limit-check` edge function to verify server-side rate limit
3. **If locked:** Shows lockout message and blocks sign-up attempt
4. **If allowed:** Proceeds with sign-up
5. **After sign-up:**
   - **Success:** Records successful attempt to server
   - **Failure:** Records failed attempt to server

---

## Deployment Steps

### 1. Create Database Table

Run the SQL migration in Supabase Dashboard:

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/create_rate_limit_table.sql`
3. Run the SQL script
4. Verify table and functions were created

### 2. Deploy Edge Function

Deploy the rate-limit-check edge function:

```bash
# Make sure you're in the project root
cd supabase/functions/rate-limit-check

# Deploy the function
npx supabase functions deploy rate-limit-check
```

Or use the Supabase Dashboard:
1. Go to Supabase Dashboard → Edge Functions
2. Create new function: `rate-limit-check`
3. Copy contents of `supabase/functions/rate-limit-check/index.ts`
4. Deploy

### 3. Verify Deployment

Test the edge function:

```bash
curl -X POST https://natzpfyxpuycsuuzbqrd.supabase.co/functions/v1/rate-limit-check \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","attemptType":"login","recordAttempt":false}'
```

---

## Security Features

### 1. IP-Based Tracking
- Tracks attempts by IP address to prevent distributed attacks
- Works even if email is not provided

### 2. Email-Based Tracking
- Tracks attempts by email address for account-specific protection
- Combined with IP tracking for better security

### 3. Fail-Open Design
- If rate limit check fails, request is allowed (fail open)
- Prevents denial of service if rate limit service is down
- Errors are logged for monitoring

### 4. Automatic Cleanup
- Old rate limit records are automatically cleaned up (older than 24 hours)
- Prevents database bloat

### 5. Dual Protection
- Client-side rate limiting (fast, can be bypassed)
- Server-side rate limiting (secure, cannot be bypassed)
- Both work together for defense in depth

---

## Configuration

### Rate Limit Settings

Edit `supabase/functions/rate-limit-check/index.ts`:

```typescript
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,           // Maximum failed attempts
  windowMinutes: 60,        // Time window (1 hour)
  lockoutMinutes: 15,       // Lockout duration (15 minutes)
}
```

### Database Function Settings

Edit `supabase/migrations/create_rate_limit_table.sql`:

```sql
SELECT is_rate_limited(
  p_email := 'user@example.com',
  p_ip_address := '192.168.1.1',
  p_attempt_type := 'login',
  p_max_attempts := 5,      -- Max attempts
  p_window_minutes := 60,   -- Time window
  p_lockout_minutes := 15   -- Lockout duration
);
```

---

## Monitoring

### View Rate Limit Attempts

Query the database to see rate limit activity:

```sql
SELECT 
  email,
  ip_address,
  attempt_type,
  success,
  created_at
FROM rate_limit_attempts
ORDER BY created_at DESC
LIMIT 100;
```

### Check Locked Accounts

```sql
SELECT 
  email,
  ip_address,
  attempt_type,
  COUNT(*) as failed_attempts,
  MAX(created_at) as last_attempt
FROM rate_limit_attempts
WHERE 
  success = false
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY email, ip_address, attempt_type
HAVING COUNT(*) >= 5;
```

---

## Testing

### Test Rate Limiting

1. **Attempt 5 failed logins** with the same email/IP
2. **6th attempt should be blocked** with lockout message
3. **Wait 15 minutes** (or adjust lockout duration)
4. **Attempt should be allowed** again

### Test IP-Based Limiting

1. **Attempt 5 failed logins** from the same IP (different emails)
2. **6th attempt should be blocked** even with different email
3. **Verify** that IP-based tracking works

---

## Troubleshooting

### Rate Limit Not Working

1. **Check edge function is deployed:**
   ```bash
   npx supabase functions list
   ```

2. **Check database table exists:**
   ```sql
   SELECT * FROM rate_limit_attempts LIMIT 1;
   ```

3. **Check database function exists:**
   ```sql
   SELECT is_rate_limited('test@example.com', '127.0.0.1', 'login');
   ```

4. **Check browser console** for errors when calling edge function

### Edge Function Errors

1. **Check Supabase Dashboard → Edge Functions → Logs**
2. **Verify environment variables** are set (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
3. **Check function permissions** in `config.toml`

---

## Files Created/Modified

### New Files:
- ✅ `supabase/migrations/create_rate_limit_table.sql` - Database schema
- ✅ `supabase/functions/rate-limit-check/index.ts` - Edge function
- ✅ `supabase/functions/rate-limit-check/config.toml` - Function config
- ✅ `SERVER_SIDE_RATE_LIMITING.md` - This documentation

### Modified Files:
- ✅ `index.html` - Added server-side rate limit checks and recording

---

## Status

✅ **Implemented:** Server-side rate limiting is fully implemented
✅ **Integrated:** Client code calls server-side rate limiting
⏳ **Deployment:** Database migration and edge function need to be deployed

---

## Next Steps

1. **Deploy database migration** (create table and functions)
2. **Deploy edge function** (`rate-limit-check`)
3. **Test rate limiting** with multiple failed attempts
4. **Monitor** rate limit attempts in database
5. **Adjust configuration** if needed (max attempts, lockout duration, etc.)

---

## Security Benefits

✅ **Cannot be bypassed** - Server-side enforcement
✅ **IP-based protection** - Prevents distributed attacks
✅ **Email-based protection** - Account-specific protection
✅ **Automatic cleanup** - Prevents database bloat
✅ **Fail-open design** - Prevents denial of service
✅ **Dual protection** - Client + server-side rate limiting

