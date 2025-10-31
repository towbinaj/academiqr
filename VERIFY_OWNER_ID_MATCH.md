# Verify Owner ID Match

Your logged-in user ID: `e655b1bd-1c1e-4dbe-862d-82e564820a6b`

## Step 1: Check Link Lists Owner ID

Run this SQL query in Supabase SQL Editor:

```sql
SELECT 
  id, 
  title, 
  owner_id,
  CASE 
    WHEN owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b' THEN '✅ MATCHES'
    ELSE '❌ DOES NOT MATCH'
  END as status
FROM link_lists;
```

**Question:** Do all rows show "✅ MATCHES" or do any show "❌ DOES NOT MATCH"?

## Step 2: Check Link Clicks Owner ID

Run this SQL query:

```sql
SELECT 
  owner_id,
  COUNT(*) as click_count,
  CASE 
    WHEN owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b' THEN '✅ MATCHES'
    ELSE '❌ DOES NOT MATCH'
  END as status
FROM link_clicks
GROUP BY owner_id;
```

**Question:** 
- Do you see your user ID `e655b1bd-1c1e-4dbe-862d-82e564820a6b` in the results?
- Are there clicks with different owner_ids?

## Step 3: Test Query with Your User ID

```sql
SELECT COUNT(*) as total_clicks_for_you
FROM link_clicks
WHERE owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';
```

**Compare:** Does this number match what you see in the Analytics tab?

## What This Tells Us

- ✅ **If everything matches:** Analytics should show all clicks
- ❌ **If owner_ids don't match:** Some clicks might be recorded with wrong owner_id
- ⚠️ **If link_lists have wrong owner_id:** New clicks will be recorded with wrong owner_id too

