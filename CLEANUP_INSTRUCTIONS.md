# Instructions: Clean Up Duplicate User Accounts

## Your Active User ID
**Active User ID:** `e655b1bd-1c1e-4dbe-862d-82e564820a6b` (This is the one you're logged in as)

## Step-by-Step Process

### Step 1: Review What You Have

**Run this query first** (replace YOUR-EMAIL with your actual email):

```sql
-- See all your user accounts
SELECT 
  id, 
  email, 
  created_at,
  last_sign_in_at,
  CASE 
    WHEN id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b' THEN '✅ ACTIVE'
    ELSE '⚠️ DUPLICATE'
  END as status
FROM auth.users 
WHERE email = 'YOUR-EMAIL@example.com'
ORDER BY created_at DESC;
```

This shows all 3 accounts.

### Step 2: Check What Data Exists for Each Account

**Run this to see which accounts have data:**

```sql
-- Check link_lists
SELECT 
  owner_id,
  COUNT(*) as list_count
FROM link_lists
WHERE owner_id IN (
  SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@example.com'
)
GROUP BY owner_id;

-- Check link_clicks  
SELECT 
  owner_id,
  COUNT(*) as click_count
FROM link_clicks
WHERE owner_id IN (
  SELECT id FROM auth.users WHERE email = 'YOUR-EMAIL@example.com'
)
GROUP BY owner_id;
```

### Step 3: Consolidate Data to Active Account

**IMPORTANT:** Replace `YOUR-EMAIL@example.com` with your actual email first!

**Migrate link_lists:**
```sql
UPDATE link_lists
SET owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
WHERE owner_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR-EMAIL@example.com'
  AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
);
```

**Migrate link_clicks:**
```sql
UPDATE link_clicks
SET owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
WHERE owner_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR-EMAIL@example.com'
  AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
);
```

**Migrate page_views:**
```sql
UPDATE page_views
SET owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
WHERE owner_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'YOUR-EMAIL@example.com'
  AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'
);
```

### Step 4: Verify Consolidation

**Check that all data is now under your active account:**

```sql
-- Should show all your lists
SELECT COUNT(*) as total_lists 
FROM link_lists 
WHERE owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';

-- Should show all your clicks
SELECT COUNT(*) as total_clicks 
FROM link_clicks 
WHERE owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';
```

### Step 5: (Optional) Delete Duplicate Accounts

**⚠️ WARNING:** Only do this AFTER verifying all data is consolidated!

**First, see what will be deleted:**
```sql
SELECT id, email, created_at
FROM auth.users 
WHERE email = 'YOUR-EMAIL@example.com'
AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';
```

**Then delete (if safe to do so):**
```sql
DELETE FROM auth.users 
WHERE email = 'YOUR-EMAIL@example.com'
AND id != 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';
```

## Quick All-in-One Script

I've created `CLEANUP_DUPLICATE_USERS.sql` with all the queries. 

**To use it:**
1. Open the file
2. Replace `YOUR-EMAIL@example.com` with your actual email (in multiple places)
3. Run each step in Supabase SQL Editor
4. Verify after each step

## Important Notes

- **Always replace `YOUR-EMAIL@example.com`** with your actual email before running
- **Run Step 1 & 2 first** to see what you're working with
- **Verify data after migrating** (Step 4)
- **Only delete accounts** if you're sure all data is consolidated

