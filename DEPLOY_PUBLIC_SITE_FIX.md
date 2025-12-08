# Deploy Public Site Access Fix

## Issue
The public site is not showing updated data because the database RLS (Row Level Security) policies need to be updated.

## Solution
You need to run the SQL script in Supabase to restore public access to the database tables.

## Steps to Fix

### 1. Run the SQL Script in Supabase

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file: `fix-public-site-access.sql`
4. Copy and paste the entire script into the SQL Editor
5. Click **Run** to execute the script
6. Verify the results - the script includes verification queries at the end

### 2. What the Script Does

The script restores public access to:
- **profiles** - Allows anyone to view profiles (needed for profile photos and social links)
- **user_themes** - Allows anyone to view themes (needed for theme elements)
- **user_media** - Allows anyone to view media (needed for profile photos)
- **link_lists** - Ensures public/unlisted collections are accessible
- **link_items** - Ensures links in public/unlisted collections are accessible

### 3. Verify the Fix

After running the script, check the verification queries at the end. You should see:
- ✅ Public access enabled for profiles
- ✅ Public access enabled for user_themes
- ✅ Public access enabled for user_media
- ✅ Public access enabled for link_lists
- ✅ Public access enabled for link_items

### 4. Test the Public Site

1. Clear your browser cache (or use incognito mode)
2. Visit your public site
3. Verify that:
   - Profile photos load
   - Social links are visible
   - Theme elements display correctly
   - Presentation information is accessible
   - Links are in the correct order

### 5. If Issues Persist

If the public site still doesn't show data after running the script:

1. **Check browser console** - Look for any RLS policy errors
2. **Check Supabase logs** - Go to Logs > Postgres Logs to see any errors
3. **Verify policies** - Run this query in Supabase SQL Editor:
   ```sql
   SELECT tablename, policyname, cmd, roles::text 
   FROM pg_policies 
   WHERE tablename IN ('profiles', 'user_themes', 'user_media', 'link_lists', 'link_items')
   AND cmd = 'SELECT'
   ORDER BY tablename, roles;
   ```

## Important Notes

- The script is **idempotent** - you can run it multiple times safely
- The script maintains performance optimizations while restoring public access
- Changes take effect immediately after running the script
- No code deployment needed - this is a database-only fix








