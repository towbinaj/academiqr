# How to Find Your User ID in Supabase

## Option 1: Through SQL Editor (Easiest)

1. **Go to Supabase Dashboard → SQL Editor**
2. **Run this query:**
   ```sql
   SELECT id, email, created_at 
   FROM auth.users 
   ORDER BY created_at DESC;
   ```
3. **Find your email** → Copy the `id` (UUID)

## Option 2: Through Authentication Section

1. **Go to Supabase Dashboard → Authentication → Users**
2. **Find your user** (by email)
3. **Click on your user** to see details
4. **Copy the User UID** (this is your user ID)

## Option 3: Check link_lists Table

Since you're the owner of link lists, check there:

```sql
SELECT DISTINCT owner_id 
FROM link_lists;
```

This will show all owner IDs. If you're the only user, this should be your ID.

## Option 4: Check link_clicks Table

If clicks are being recorded, check what owner_id is being used:

```sql
SELECT DISTINCT owner_id, COUNT(*) as click_count
FROM link_clicks
GROUP BY owner_id;
```

## Quick Test Query

Run this to see all the info at once:

```sql
-- Get all your link lists and their owner IDs
SELECT 
  ll.id as list_id,
  ll.title as list_title,
  ll.owner_id,
  COUNT(li.id) as link_count
FROM link_lists ll
LEFT JOIN link_items li ON li.list_id = ll.id
GROUP BY ll.id, ll.title, ll.owner_id
ORDER BY ll.created_at DESC;
```

This will show you which `owner_id` owns each list.

