# Edge Functions Status

This document lists all Edge Functions in the project and their deployment status.

---

## Required Edge Functions (Must Be Deployed)

### 1. ✅ **track-click** (REQUIRED)
**Purpose:** Tracks link clicks and redirects to destination URLs  
**Used By:** `public.html` - Links use `/api/track/${link.id}` URLs  
**Status:** ✅ **MUST BE DEPLOYED**  
**Location:** `supabase/functions/track-click/index.ts`

**What it does:**
- Tracks analytics data (device type, browser, OS, referrer, UTM parameters)
- Records click timestamps
- Prevents duplicate click tracking (within 5 seconds)
- Redirects users to the actual destination URL

**Deployment:** Required for public link pages to work correctly

---

### 2. ✅ **rate-limit-check** (REQUIRED)
**Purpose:** Server-side rate limiting for authentication attempts  
**Used By:** `script.js` - Called during login/signup attempts  
**Status:** ✅ **MUST BE DEPLOYED**  
**Location:** `supabase/functions/rate-limit-check/index.ts`

**What it does:**
- Tracks failed authentication attempts by IP address and email
- Enforces rate limits (5 attempts per hour)
- Implements lockout periods (15 minutes)
- Prevents brute force attacks

**Deployment:** Required for security (rate limiting)

**Usage in code:**
```javascript
// Called in script.js during login/signup
await fetch(`${SUPABASE_URL}/functions/v1/rate-limit-check`, {...})
```

---

### 3. ✅ **delete-account** (REQUIRED)
**Purpose:** Handles cascading account deletion  
**Used By:** `script.js` - Called when user deletes their account  
**Status:** ✅ **MUST BE DEPLOYED**  
**Location:** `supabase/functions/delete-account/index.ts`

**What it does:**
- Deletes all user data (collections, links, clicks, analytics)
- Removes profile data and storage files
- Deletes the user account from Supabase Auth
- Ensures complete data removal

**Deployment:** Required for account deletion feature to work

**Usage in code:**
```javascript
// Called in script.js when user confirms account deletion
await supabaseClient.functions.invoke('delete-account', {...})
```

---

## Optional Edge Functions

### 4. ⚠️ **validate-file-upload** (OPTIONAL - Recommended)
**Purpose:** Server-side file validation (magic numbers, dimensions)  
**Used By:** Currently not called directly in code  
**Status:** ⚠️ **OPTIONAL** (but recommended for security)  
**Location:** `supabase/functions/validate-file-upload/index.ts`

**What it does:**
- Validates file content using magic numbers (prevents file type spoofing)
- Checks image dimensions (prevents DoS via huge images)
- Provides additional security layer beyond RLS policies

**Current Status:**
- ✅ Edge Function code exists
- ✅ Storage RLS policies provide primary protection
- ⚠️ Edge Function not currently called in client code
- ⚠️ Can be added as an extra validation layer

**Recommendation:** 
- **Deploy it** for additional security (defense in depth)
- **Or skip it** if RLS policies are sufficient for your needs

**To use it:** You would need to call it before uploading files:
```javascript
const { data, error } = await supabaseClient.functions.invoke('validate-file-upload', {
    body: formData
});
```

---

## Summary

### Currently Deployed in Supabase:
1. ✅ **delete-account** - ✅ Deployed
2. ❓ **rapid-processor** - ⚠️ **NOT IN CODEBASE** (may be unused/old)
3. ❓ **rapid-responder** - ⚠️ **NOT IN CODEBASE** (may be unused/old)
4. ✅ **rate-limit-check** - ✅ Deployed
5. ❓ **swift-action** - ⚠️ **NOT IN CODEBASE** (may be unused/old)
6. ✅ **track-click** - ✅ Deployed
7. ✅ **validate-file-upload** - ✅ Deployed

### Required Functions (All Deployed ✅):
1. ✅ **track-click** - Required for public link pages
2. ✅ **rate-limit-check** - Required for security (rate limiting)
3. ✅ **delete-account** - Required for account deletion feature

### Optional Functions:
4. ⚠️ **validate-file-upload** - Recommended for extra security, but RLS policies provide primary protection

### Unknown Functions (Not in Codebase):
- ❓ **rapid-processor** - Not referenced in code, may be unused
- ❓ **rapid-responder** - Not referenced in code, may be unused
- ❓ **swift-action** - Not referenced in code, may be unused

**Recommendation:** Check if `rapid-processor`, `rapid-responder`, and `swift-action` are needed. If not, consider deleting them to reduce clutter.

---

## Deployment Checklist

- [ ] Deploy `track-click` Edge Function
- [ ] Deploy `rate-limit-check` Edge Function  
- [ ] Deploy `delete-account` Edge Function
- [ ] (Optional) Deploy `validate-file-upload` Edge Function

---

## How to Deploy

See deployment guides:
- `DEPLOY_DELETE_ACCOUNT.md` - For delete-account function
- `DEPLOY_VALIDATE_FILE_UPLOAD.md` - For validate-file-upload function

For other functions, use the same process:
1. Go to Supabase Dashboard → Edge Functions
2. Click "Deploy via editor"
3. Create new function with the function name
4. Copy code from `supabase/functions/[function-name]/index.ts`
5. Paste and deploy

