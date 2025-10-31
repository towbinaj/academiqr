# Quick Check: Why Analytics Aren't Showing

## Immediate Steps to Diagnose:

### Step 1: Check if Clicks Are Recorded (2 minutes)

**In Supabase Dashboard:**

1. Go to **Table Editor** → `link_clicks` table
2. **Question:** Do you see ANY rows?
   - ✅ **YES** → Go to Step 2
   - ❌ **NO** → Clicks aren't being recorded, check edge function

### Step 2: Check Owner ID Match (2 minutes)

**The most common issue:** `owner_id` in clicks doesn't match your logged-in user ID.

1. **Get your user ID:**
   - In Supabase Dashboard → **Table Editor** → `auth.users`
   - Find your email → Copy the `id` (UUID)

2. **Check clicks for your user:**
   ```sql
   SELECT * FROM link_clicks 
   WHERE owner_id = 'PASTE-YOUR-USER-ID-HERE'
   ORDER BY clicked_at DESC 
   LIMIT 5;
   ```

3. **If this returns 0 rows but `link_clicks` has data:**
   - The `owner_id` is wrong in the clicks
   - This means the edge function is getting the wrong owner_id

### Step 3: Check Browser Console (1 minute)

1. **Open your analytics page** (`/analytics`)
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Look for errors** - what do you see?

### Step 4: Verify RLS Policies (1 minute)

**In Supabase Dashboard → Authentication → Policies:**

1. Find `link_clicks` table
2. Check if you see:
   - ✅ "Anyone can insert link clicks"
   - ✅ "Users can view their own link clicks"

If missing, run this SQL:

```sql
CREATE POLICY "Users can view their own link clicks"
ON link_clicks FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);
```

## Most Likely Issue:

**Owner ID Mismatch** - The edge function gets `owner_id` from `link_lists(owner_id)`. 

Check:
```sql
SELECT li.id, li.title, ll.owner_id 
FROM link_items li
JOIN link_lists ll ON li.list_id = ll.id
LIMIT 5;
```

Does `owner_id` match your user ID?

