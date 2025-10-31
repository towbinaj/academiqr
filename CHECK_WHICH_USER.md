# Check Which User ID is Active

## Quick Test: Check Logged-In User ID

**In your browser (when viewing analytics):**

1. Open Developer Tools (F12)
2. Go to Console tab
3. Paste this:
   ```javascript
   // Check current logged-in user
   (async () => {
     const { data: { user } } = await supabase.auth.getUser();
     console.log('Current logged-in user ID:', user?.id);
     console.log('Current logged-in email:', user?.email);
     return user?.id;
   })();
   ```

This will show which user ID your app thinks you're logged in as.

## Then Compare

1. **Logged-in user ID** (from browser console above)
2. **Link list owner_id** (from SQL query below)
3. **Click owner_id** (from link_clicks table)

Run these SQL queries:

```sql
-- Check which owner_id owns your lists
SELECT DISTINCT owner_id FROM link_lists;

-- Check which owner_ids have clicks
SELECT DISTINCT owner_id, COUNT(*) as clicks 
FROM link_clicks 
GROUP BY owner_id;
```

**If they don't all match, that's the problem!**

## Fix: Update if Needed

If your link_lists have the wrong owner_id:

```sql
-- First check what you have
SELECT id, title, owner_id FROM link_lists;

-- Then update to correct user ID (replace YOUR-CORRECT-USER-ID)
UPDATE link_lists 
SET owner_id = 'YOUR-CORRECT-USER-ID'
WHERE owner_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR-EMAIL@example.com' 
  AND id != 'YOUR-CORRECT-USER-ID'
);
```

**But first, identify which user ID is the correct/active one!**

