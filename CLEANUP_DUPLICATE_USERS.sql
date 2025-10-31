-- Cleanup Duplicate User Accounts
-- This script consolidates data to one user account and identifies duplicates

-- STEP 1: See all user accounts with your email
SELECT 
  id, 
  email, 
  created_at,
  email_confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b' THEN '✅ ACTIVE (You are logged in as this one)'
    ELSE '⚠️ DUPLICATE'
  END as status
FROM auth.users 
WHERE email = 'YOUR-EMAIL@example.com'  -- Replace with your actual email
ORDER BY last_sign_in_at DESC NULLS LAST, created_at DESC;

-- STEP 2: Check what data is associated with each user ID
-- Replace 'YOUR-EMAIL@example.com' with your actual email above

-- Check link_lists ownership
SELECT 
  'link_lists' as table_name,
  owner_id,
  COUNT(*) as record_count
FROM link_lists
WHERE owner_id IN (
  SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@example.com'
)
GROUP BY owner_id;

-- Check link_clicks ownership
SELECT 
  'link_clicks' as table_name,
  owner_id,
  COUNT(*) as record_count
FROM link_clicks
WHERE owner_id IN (
  SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@example.com'
)
GROUP BY owner_id;

-- Check page_views ownership
SELECT 
  'page_views' as table_name,
  owner_id,
  COUNT(*) as record_count
FROM page_views
WHERE owner_id IN (
  SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@example.com'
)
GROUP BY owner_id;

-- Check profiles ownership
SELECT 
  'profiles' as table_name,
  id as owner_id,
  COUNT(*) as record_count
FROM profiles
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@example.com'
)
GROUP BY id;

-- STEP 3: Update link_lists to use correct user ID
-- IMPORTANT: Replace YOUR-EMAIL@example.com with your actual email first!
-- This migrates all link_lists to your active user ID

UPDATE link_lists
SET owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
WHERE owner_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR-EMAIL@example.com'
  AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
);

-- STEP 4: Update link_clicks to use correct user ID
UPDATE link_clicks
SET owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
WHERE owner_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR-EMAIL@example.com'
  AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
);

-- STEP 5: Update page_views to use correct user ID
UPDATE page_views
SET owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
WHERE owner_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR-EMAIL@example.com'
  AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
);

-- STEP 6: Update profiles to use correct user ID (if profiles table exists)
-- Uncomment if you have a profiles table:
-- UPDATE profiles
-- SET id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
-- WHERE id IN (
--   SELECT id FROM auth.users 
--   WHERE email = 'YOUR-EMAIL@example.com'
--   AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
-- );

-- STEP 7: Verify consolidation
-- After running updates, verify everything is consolidated:

SELECT 
  'link_lists' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT owner_id) as distinct_owner_ids
FROM link_lists
WHERE owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';

SELECT 
  'link_clicks' as table_name,
  COUNT(*) as total_records,
  COUNT(DISTINCT owner_id) as distinct_owner_ids
FROM link_clicks
WHERE owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';

-- STEP 8: Optionally delete duplicate user accounts
-- WARNING: This permanently deletes the duplicate user accounts
-- Only do this AFTER consolidating all data above!

-- First, identify which IDs to delete:
SELECT 
  id,
  email,
  created_at
FROM auth.users 
WHERE email = 'YOUR-EMAIL@example.com'
AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';

-- To delete (UNCOMMENT ONLY AFTER VERIFYING DATA IS CONSOLIDATED):
-- DELETE FROM auth.users 
-- WHERE email = 'YOUR-EMAIL@example.com'
-- AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';

