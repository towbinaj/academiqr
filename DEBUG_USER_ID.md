# Debug: Check User ID and Owner ID Match

## Step 1: Get Your User ID

**In Supabase SQL Editor, run:**

```sql
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;
```

Copy the `id` for your email.

## Step 2: Check What Owner IDs Exist in Your Links

```sql
SELECT 
  ll.id as list_id,
  ll.title,
  ll.owner_id,
  COUNT(li.id) as link_count
FROM link_lists ll
LEFT JOIN link_items li ON li.list_id = ll.id
GROUP BY ll.id, ll.title, ll.owner_id;
```

**Question:** Does `owner_id` match your user ID from Step 1?

## Step 3: Check What Owner IDs Are in Clicks

```sql
SELECT 
  owner_id,
  COUNT(*) as click_count,
  MAX(clicked_at) as last_click
FROM link_clicks
GROUP BY owner_id;
```

**Question:** Does `owner_id` in clicks match your user ID?

## Step 4: Test Analytics Query Manually

Replace `YOUR-USER-ID` with your actual user ID from Step 1:

```sql
SELECT COUNT(*) as total_clicks
FROM link_clicks
WHERE owner_id = 'YOUR-USER-ID';
```

**If this returns 0 but Step 3 shows clicks:**
- The `owner_id` in clicks doesn't match your user ID
- This means the edge function is storing wrong owner_id

**If this returns clicks:**
- The data is correct
- The issue is in the analytics frontend code

