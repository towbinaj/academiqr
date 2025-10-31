# Alternative Ways to Get Your User ID

## Method 1: Check localStorage (Easiest)

**In Browser Console (F12):**

```javascript
// Check Supabase auth token
const authData = localStorage.getItem('sb-' + window.location.hostname.split('.')[0] + '-auth-token');
if (authData) {
  const auth = JSON.parse(authData);
  console.log('User ID:', auth.user?.id);
  console.log('Email:', auth.user?.email);
}
```

Or try:

```javascript
// Check all Supabase storage
Object.keys(localStorage).filter(key => key.includes('supabase')).forEach(key => {
  console.log(key, localStorage.getItem(key));
});
```

## Method 2: Check in Your App

**Go to your `/analytics` page**, open Console (F12), and look for:
- Any error messages that show a user ID
- Network tab → Check API requests to Supabase → Headers might show user ID

## Method 3: Use SQL Query Instead

**Easiest - Just run this in Supabase SQL Editor:**

```sql
-- See all user accounts
SELECT 
  id, 
  email, 
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
WHERE email = 'YOUR-EMAIL@example.com'
ORDER BY last_sign_in_at DESC NULLS LAST, created_at DESC;
```

The one with the most recent `last_sign_in_at` is probably your active account.

## Method 4: Check Which User ID Has Link Lists

```sql
-- This shows which user ID owns your lists
SELECT 
  ll.owner_id,
  u.email,
  COUNT(*) as list_count
FROM link_lists ll
LEFT JOIN auth.users u ON u.id = ll.owner_id
GROUP BY ll.owner_id, u.email;
```

This will show which user ID owns lists, and we can match it to your email.

## Method 5: Check Network Tab

1. **Open your app**
2. **Open DevTools → Network tab**
3. **Go to `/analytics` page**
4. **Look for requests to Supabase** (filter by "supabase")
5. **Check the request headers** - might contain user info
6. **Or check response** - might show user ID

