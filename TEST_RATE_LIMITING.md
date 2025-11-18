# Testing Server-Side Rate Limiting

## ✅ Deployment Status

The `rate-limit-check` edge function has been deployed successfully!

---

## Step 1: Deploy Database Migration (IMPORTANT!)

Before testing, you need to create the database table and functions:

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/natzpfyxpuycsuuzbqrd

2. **Navigate to SQL Editor:**
   - Click "SQL Editor" in the left sidebar

3. **Run the Migration:**
   - Open the file: `supabase/migrations/create_rate_limit_table.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Table Created:**
   ```sql
   SELECT * FROM rate_limit_attempts LIMIT 1;
   ```

5. **Verify Function Created:**
   ```sql
   SELECT is_rate_limited('test@example.com', '127.0.0.1', 'login');
   ```

---

## Step 2: Test the Edge Function

### Test 1: Check Rate Limit (No Lockout)

Open browser console and run:

```javascript
fetch('https://natzpfyxpuycsuuzbqrd.supabase.co/functions/v1/rate-limit-check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHpwZnl4cHV5Y3N1dXpicXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NTExODQsImV4cCI6MjA3NjUyNzE4NH0.q06AAoHZrfS3-O7568VpikaOtn6qAlDyDM7VR6sgzeU'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    attemptType: 'login',
    recordAttempt: false
  })
})
.then(r => r.json())
.then(console.log);
```

**Expected Response:**
```json
{
  "allowed": true,
  "isLocked": false,
  "remainingAttempts": 5,
  "recentAttempts": 0,
  "failedAttempts": 0
}
```

### Test 2: Record Failed Attempts

Run this 5 times to trigger lockout:

```javascript
fetch('https://natzpfyxpuycsuuzbqrd.supabase.co/functions/v1/rate-limit-check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHpwZnl4cHV5Y3N1dXpicXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NTExODQsImV4cCI6MjA3NjUyNzE4NH0.q06AAoHZrfS3-O7568VpikaOtn6qAlDyDM7VR6sgzeU'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    attemptType: 'login',
    recordAttempt: true,
    success: false
  })
})
.then(r => r.json())
.then(console.log);
```

### Test 3: Check After 5 Failed Attempts

After recording 5 failed attempts, check again:

```javascript
fetch('https://natzpfyxpuycsuuzbqrd.supabase.co/functions/v1/rate-limit-check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hdHpwZnl4cHV5Y3N1dXpicXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NTExODQsImV4cCI6MjA3NjUyNzE4NH0.q06AAoHZrfS3-O7568VpikaOtn6qAlDyDM7VR6sgzeU'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    attemptType: 'login',
    recordAttempt: false
  })
})
.then(r => r.json())
.then(console.log);
```

**Expected Response (Locked):**
```json
{
  "allowed": false,
  "isLocked": true,
  "lockoutUntil": "2024-01-01T12:15:00Z",
  "remainingTime": 900,
  "message": "Too many failed attempts. Please try again in 15 minutes."
}
```

---

## Step 3: Test in Your Application

### Test Login Rate Limiting:

1. **Go to your login page**
2. **Enter wrong password 5 times** (use a test account)
3. **6th attempt should be blocked** with lockout message
4. **Check browser console** for rate limit check calls

### Test Sign-Up Rate Limiting:

1. **Go to sign-up**
2. **Try to create account 5 times** (with invalid data or existing email)
3. **6th attempt should be blocked** with lockout message

---

## Step 4: Verify Database Records

Check that attempts are being recorded:

```sql
SELECT 
  email,
  ip_address,
  attempt_type,
  success,
  created_at
FROM rate_limit_attempts
ORDER BY created_at DESC
LIMIT 10;
```

---

## Troubleshooting

### Function Not Working?

1. **Check function logs:**
   - Go to Supabase Dashboard → Edge Functions → rate-limit-check → Logs
   - Look for errors

2. **Check database table exists:**
   ```sql
   SELECT * FROM rate_limit_attempts LIMIT 1;
   ```

3. **Check database function exists:**
   ```sql
   SELECT is_rate_limited('test@example.com', '127.0.0.1', 'login');
   ```

4. **Check browser console** for errors when logging in

### Rate Limit Not Triggering?

1. **Verify attempts are being recorded:**
   ```sql
   SELECT COUNT(*) FROM rate_limit_attempts 
   WHERE email = 'your-email@example.com' 
   AND success = false;
   ```

2. **Check time window** - attempts must be within 60 minutes

3. **Check IP address** - rate limiting is per IP + email combination

---

## Success Criteria

✅ Edge function deployed and visible in `supabase functions list`
✅ Database table `rate_limit_attempts` exists
✅ Database function `is_rate_limited()` exists
✅ Test API call returns expected response
✅ 5 failed login attempts trigger lockout
✅ Lockout message appears in UI
✅ Attempts are recorded in database

---

## Next Steps

Once everything is working:
1. Monitor rate limit attempts in database
2. Adjust configuration if needed (max attempts, lockout duration)
3. Set up alerts for excessive rate limit violations (optional)

