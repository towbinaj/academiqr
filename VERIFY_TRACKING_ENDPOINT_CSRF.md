# How to Verify Tracking Endpoint CSRF Protection and Idempotency

## Overview

The tracking endpoint (`/api/track/{link-id}`) is a Supabase Edge Function that:
1. Records analytics data (link clicks) in the database
2. Redirects users to the destination URL

This guide explains how to verify and improve CSRF protection and idempotency.

---

## Current Implementation Analysis

### Location
- **File**: `supabase/functions/track-click/index.ts`
- **Endpoint**: `https://academiqr.com/api/track/{link-id}`
- **Method**: GET (via link href)

### Current Behavior
1. ✅ **Reads** link data from database
2. ⚠️ **Writes** click data to `link_clicks` table (state-changing operation)
3. ✅ **Redirects** to destination URL

---

## Part 1: Understanding Idempotency

### What is Idempotency?

An **idempotent** operation produces the same result regardless of how many times it's executed.

**Example of Idempotent:**
- GET request that only reads data
- PUT request that updates a record (same result if called multiple times)

**Example of Non-Idempotent:**
- POST request that creates a new record each time
- Analytics tracking that logs every click

### Is the Tracking Endpoint Idempotent?

**Current Status: ❌ NOT Idempotent**

The endpoint **inserts a new record** into `link_clicks` every time it's called. This is **intentional** for analytics - you want to track every click, even if the same user clicks multiple times.

### Should It Be Idempotent?

**For Analytics Tracking: Usually NO**

Analytics tracking should record every click, so non-idempotent behavior is expected. However, you might want to prevent:
- **Accidental duplicate clicks** (user double-clicks)
- **Bot traffic** (automated scripts clicking repeatedly)
- **CSRF attacks** (malicious sites triggering clicks)

### Recommendations

#### Option 1: Keep Non-Idempotent (Current - Acceptable for Analytics)
- ✅ Simple implementation
- ✅ Tracks all clicks accurately
- ⚠️ Vulnerable to click inflation via CSRF

#### Option 2: Add Duplicate Detection (Recommended)
Add logic to prevent duplicate clicks from the same user/session within a short time window:

```typescript
// Add to track-click/index.ts before inserting

// Check for recent duplicate click (same link, same IP, within 5 seconds)
const { data: recentClick } = await supabase
  .from('link_clicks')
  .select('id')
  .eq('link_id', linkId)
  .eq('ip_address', ipAddress)
  .gte('created_at', new Date(Date.now() - 5000).toISOString())
  .limit(1)
  .single();

if (recentClick) {
  // Duplicate click detected - skip tracking but still redirect
  console.log('Duplicate click detected, skipping tracking');
} else {
  // Insert click data
  await supabase.from('link_clicks').insert(clickData);
}
```

**Benefits:**
- ✅ Prevents accidental duplicate clicks
- ✅ Reduces database load
- ✅ Still tracks legitimate repeated clicks (after 5 seconds)

---

## Part 2: CSRF Protection Verification

### Current CSRF Protection Status: ⚠️ VULNERABLE

**Issues Found:**
1. ❌ CORS allows all origins: `'Access-Control-Allow-Origin': '*'`
2. ❌ No Origin/Referer header validation
3. ❌ No CSRF token validation
4. ❌ GET request performs state-changing operation (inserts data)

### How to Verify CSRF Vulnerability

#### Test 1: Check CORS Headers

**Current Code (Line 8-11):**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

**Problem:** `'*'` allows requests from any origin, including malicious sites.

**Test:**
1. Open browser console on any website
2. Run this code:
```javascript
fetch('https://academiqr.com/api/track/some-link-id')
  .then(r => r.text())
  .then(console.log);
```

**Expected Result:** If this works, CSRF protection is weak.

#### Test 2: Check Origin/Referer Validation

**Current Code:** No Origin or Referer validation found.

**Test:**
1. Create a test HTML file on a different domain:
```html
<!DOCTYPE html>
<html>
<head><title>CSRF Test</title></head>
<body>
  <img src="https://academiqr.com/api/track/test-link-id" />
  <script>
    fetch('https://academiqr.com/api/track/test-link-id');
  </script>
</body>
</html>
```

2. Host it on a different domain (e.g., GitHub Pages, Netlify)
3. Visit the page - if it triggers a click, CSRF protection is weak

---

## Part 3: Implementing CSRF Protection

### Recommended Solution: Origin/Referer Validation

Add validation to ensure requests come from your domain:

```typescript
// Add after line 55 (after const url = new URL(req.url);)

// Validate request origin to prevent CSRF
const origin = req.headers.get('origin');
const referer = req.headers.get('referer');
const allowedDomains = [
  'https://academiqr.com',
  'https://www.academiqr.com',
  // Add your development domains if needed
  'http://localhost:3000',
  'http://localhost:5173',
];

// Check if request comes from allowed domain
const isValidOrigin = origin && allowedDomains.some(domain => origin.startsWith(domain));
const isValidReferer = referer && allowedDomains.some(domain => referer.startsWith(domain));

// Allow requests with valid origin OR referer (or no origin/referer for direct links)
// Direct link clicks won't have origin/referer, which is acceptable
if (origin && !isValidOrigin && referer && !isValidReferer) {
  console.warn('CSRF attempt detected:', { origin, referer });
  return new Response(
    JSON.stringify({ error: 'Invalid request origin' }),
    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
```

### Alternative: Restrict CORS Headers

Update CORS headers to only allow your domain:

```typescript
// Replace line 8-11
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://academiqr.com', // Specific domain instead of '*'
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}
```

**Note:** This might break direct link clicks if they need CORS. Test thoroughly.

### Alternative: Use POST with CSRF Token (More Secure)

**For maximum security**, change to POST requests with CSRF tokens:

1. **Client-side** (index.html line 6602):
```javascript
// Instead of link href, use a form or fetch with POST
linkEl.onclick = async (e) => {
  e.preventDefault();
  // Get CSRF token from meta tag or API
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  
  await fetch(`https://academiqr.com/api/track/${link.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
  });
  
  // Then redirect
  window.open(link.url, '_blank');
};
```

2. **Server-side** (track-click/index.ts):
```typescript
// Validate CSRF token
const csrfToken = req.headers.get('x-csrf-token');
// Compare with stored/expected token
if (!isValidCSRFToken(csrfToken)) {
  return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403 });
}
```

**Trade-off:** More complex, requires token management, but most secure.

---

## Part 4: Testing Your Protections

### Test 1: Verify Origin Validation

1. **Deploy updated code** with Origin/Referer validation
2. **Test from your domain** (should work):
```javascript
// Run in browser console on academiqr.com
fetch('https://academiqr.com/api/track/test-link-id')
  .then(r => r.text())
  .then(console.log);
```

3. **Test from different domain** (should fail):
```javascript
// Run in browser console on different website
fetch('https://academiqr.com/api/track/test-link-id')
  .then(r => r.text())
  .then(console.log);
// Should return 403 error
```

### Test 2: Verify Direct Link Clicks Still Work

1. **Click a link** from your public page
2. **Verify** it redirects correctly
3. **Check analytics** - click should be recorded

### Test 3: Monitor for CSRF Attempts

Add logging to detect potential CSRF attacks:

```typescript
// Add after origin validation
if (origin && !isValidOrigin) {
  console.warn('Potential CSRF attempt:', {
    origin,
    referer,
    linkId,
    ipAddress,
    timestamp: new Date().toISOString(),
  });
  // Optionally: Send alert to monitoring service
}
```

---

## Part 5: Recommended Implementation

### Step 1: Add Origin/Referer Validation

Update `supabase/functions/track-click/index.ts`:

```typescript
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const startTime = Date.now();
    const url = new URL(req.url);
    
    // ===== ADD CSRF PROTECTION HERE =====
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const allowedDomains = [
      'https://academiqr.com',
      'https://www.academiqr.com',
      // Add development domains if needed
    ];
    
    // Allow requests with valid origin OR referer, or no origin/referer (direct links)
    const isValidOrigin = origin && allowedDomains.some(domain => origin.startsWith(domain));
    const isValidReferer = referer && allowedDomains.some(domain => referer.startsWith(domain));
    
    // Block if origin/referer present but invalid (potential CSRF)
    if ((origin && !isValidOrigin) || (referer && !isValidReferer)) {
      console.warn('CSRF attempt blocked:', { origin, referer, url: req.url });
      return new Response(
        JSON.stringify({ error: 'Invalid request origin' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // ===== END CSRF PROTECTION =====
    
    // Extract link ID from path
    const pathParts = url.pathname.split('/').filter(p => p);
    const linkId = pathParts[pathParts.length - 1];
    
    // ... rest of existing code ...
```

### Step 2: Add Duplicate Click Detection (Optional)

Add before the insert operation (around line 175):

```typescript
// Check for recent duplicate click (same link, same IP, within 5 seconds)
const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
const { data: recentClick } = await supabase
  .from('link_clicks')
  .select('id')
  .eq('link_id', linkId)
  .eq('ip_address', ipAddress)
  .gte('created_at', fiveSecondsAgo)
  .limit(1)
  .single();

if (recentClick) {
  // Duplicate click detected - skip tracking but still redirect
  console.log('Duplicate click detected, skipping tracking:', { linkId, ipAddress });
} else {
  // Insert click data (existing code)
  supabase
    .from('link_clicks')
    .insert(clickData)
    .then(({ data, error }) => {
      // ... existing error handling ...
    });
}
```

### Step 3: Deploy and Test

1. **Deploy updated function:**
```bash
npx supabase functions deploy track-click
```

2. **Test from your domain** (should work)
3. **Test from different domain** (should fail with 403)
4. **Test direct link clicks** (should work)

---

## Summary

### Current Status
- ❌ **CSRF Protection**: Vulnerable (allows all origins)
- ❌ **Idempotency**: Not idempotent (intentional for analytics)
- ✅ **Functionality**: Works correctly for legitimate use

### Recommended Actions
1. ✅ **Add Origin/Referer validation** (prevents CSRF)
2. ⚠️ **Add duplicate click detection** (optional, prevents accidental duplicates)
3. ✅ **Deploy and test** thoroughly
4. ✅ **Monitor logs** for CSRF attempts

### Risk Assessment
- **Current Risk**: Medium (click inflation possible via CSRF)
- **After Fix**: Low (CSRF attacks blocked, legitimate clicks still work)

---

## Quick Checklist

- [ ] Review current implementation
- [ ] Add Origin/Referer validation
- [ ] (Optional) Add duplicate click detection
- [ ] Update CORS headers if needed
- [ ] Deploy updated function
- [ ] Test from your domain (should work)
- [ ] Test from different domain (should fail)
- [ ] Test direct link clicks (should work)
- [ ] Monitor logs for CSRF attempts
- [ ] Document changes

---

## Need Help?

If you encounter issues:
1. Check Supabase Edge Function logs in dashboard
2. Verify environment variables are set correctly
3. Test with curl to see raw responses:
```bash
curl -v -H "Origin: https://malicious-site.com" https://academiqr.com/api/track/test-link-id
```

