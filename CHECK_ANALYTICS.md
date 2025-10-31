# Check Why Analytics Aren't Showing

## Step 1: Verify Clicks Are Being Recorded

Go to Supabase Dashboard → Table Editor → `link_clicks` table

**Check:**
- Do you see any rows in the `link_clicks` table?
- If yes: Clicks are being recorded, issue is with the analytics query
- If no: Clicks aren't being recorded, check function logs

## Step 2: Check Function Logs

The function should log when clicks are tracked. Check for:
- "Click tracked successfully for link: [link-id]"
- Or any error messages

## Step 3: Verify RLS Policies

**For INSERT (tracking):**
```sql
-- Should exist:
CREATE POLICY "Anyone can insert link clicks"
ON link_clicks FOR INSERT
TO anon, authenticated
WITH CHECK (true);
```

**For SELECT (viewing analytics):**
```sql
-- Should exist:
CREATE POLICY "Users can view their own link clicks"
ON link_clicks FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);
```

## Step 4: Check Your User ID

The analytics queries filter by `owner_id = user.id`. Make sure:
1. You're logged in when viewing analytics
2. The `owner_id` in `link_clicks` matches your user ID

## Step 5: Test the Query Directly

Run this in Supabase SQL Editor:

```sql
-- Get your user ID
SELECT id, email FROM auth.users;

-- Then check if clicks exist for your user
SELECT * FROM link_clicks 
WHERE owner_id = 'YOUR-USER-ID'
ORDER BY clicked_at DESC 
LIMIT 10;
```

If this returns rows but analytics doesn't show them, the issue is in the analytics queries.

