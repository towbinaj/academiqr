# Debug: Analytics Not Showing Clicks

Follow these steps to diagnose the issue:

## Step 1: Check if Clicks Are Being Recorded

**In Supabase Dashboard:**

1. Go to **Table Editor** → `link_clicks` table
2. Check if there are any rows
3. If **NO rows**: Clicks aren't being recorded (check edge function)
4. If **YES rows**: Continue to Step 2

## Step 2: Verify RLS Policies

**Check if policies exist:**

1. Go to Supabase Dashboard → **Authentication** → **Policies**
2. Find `link_clicks` table
3. You should see:
   - ✅ "Anyone can insert link clicks" (for INSERT)
   - ✅ "Users can view their own link clicks" (for SELECT)

**If policies are missing, run this SQL:**

```sql
-- Allow anyone to insert (tracking)
CREATE POLICY "Anyone can insert link clicks"
ON link_clicks FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow users to view their own data
CREATE POLICY "Users can view their own link clicks"
ON link_clicks FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);
```

## Step 3: Check Owner ID Matching

**The issue might be that `owner_id` doesn't match your user ID.**

1. Get your user ID:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

2. Check clicks with your user ID:
   ```sql
   SELECT * FROM link_clicks 
   WHERE owner_id = 'YOUR-USER-ID-FROM-ABOVE'
   ORDER BY clicked_at DESC;
   ```

3. If this query returns rows BUT analytics doesn't show them:
   - The issue is likely in the analytics queries
   - Check browser console for errors

## Step 4: Check Browser Console

**Open browser console (F12) and go to `/analytics` page:**

Look for:
- Any error messages
- "Error loading analytics" messages
- Check the Network tab → see if API calls are failing

## Step 5: Test Analytics Queries Directly

**In Supabase SQL Editor, test the same query the app uses:**

```sql
-- Get your user ID first
SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then test the analytics query
SELECT 
  COUNT(*) as total_clicks
FROM link_clicks
WHERE owner_id = 'YOUR-USER-ID';
```

**If this returns 0 but you have rows:**
- The `owner_id` in clicks doesn't match your user ID
- This means the edge function is using the wrong owner_id

## Step 6: Check Edge Function Logs

**The function should log when clicks are tracked:**

1. Go to Supabase Dashboard → **Edge Functions** → `track-click`
2. Click **Logs** tab
3. Look for:
   - "Click tracked successfully for link: [id]"
   - Any error messages

## Common Issues:

### Issue 1: Owner ID Mismatch
**Symptom:** Clicks exist but analytics shows 0
**Fix:** Check if `link_lists.owner_id` matches your user ID

### Issue 2: RLS Blocking
**Symptom:** Browser console shows permission errors
**Fix:** Verify RLS policies exist and are correct

### Issue 3: Not Logged In
**Symptom:** Analytics shows error immediately
**Fix:** Make sure you're logged in when viewing analytics

### Issue 4: Edge Function Error
**Symptom:** No clicks being recorded at all
**Fix:** Check edge function logs for errors

