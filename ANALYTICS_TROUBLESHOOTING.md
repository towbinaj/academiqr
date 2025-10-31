# Analytics Not Working? Troubleshooting Guide

## Problem: No Link Clicks Showing in Analytics

If you're clicking links on public pages but not seeing analytics data, check these issues:

## ✅ Step 1: Verify Database Tables Exist

The `link_clicks` table must exist in your Supabase database.

**Check:**
1. Go to Supabase Dashboard → Table Editor
2. Look for `link_clicks` table
3. If it doesn't exist, run `create_analytics_tables.sql` in SQL Editor

**Fix:**
```sql
-- Run this in Supabase SQL Editor
-- Copy contents from: create_analytics_tables.sql
```

## ✅ Step 2: Verify Links Use Tracking URLs

Links should go through `/api/track/{link-id}` not directly to destination URLs.

**Current Fix:**
- ✅ `public.html` now uses tracking URLs (fixed)
- ⚠️ Need to rebuild after changes

**Verify:**
1. View source of a public page
2. Right-click a link → Inspect
3. Link should be: `https://yoursite.com/api/track/abc-123-def`
4. NOT: `https://example.com` (direct URL)

## ✅ Step 3: Deploy Edge Function

The tracking URL `/api/track/{link-id}` requires a Supabase Edge Function.

**Check if deployed:**
```bash
supabase functions list --project-ref YOUR_PROJECT_REF
```

**Deploy it:**
1. Install Supabase CLI: `npm install -g supabase`
2. Create function directory:
   ```bash
   mkdir -p supabase/functions/track-click
   ```
3. Copy `supabase_edge_function_track_click.ts` to:
   ```
   supabase/functions/track-click/index.ts
   ```
4. Deploy:
   ```bash
   supabase functions deploy track-click --project-ref YOUR_PROJECT_REF
   ```

## ✅ Step 4: Configure Server Routing

Your server needs to route `/api/track/*` to the edge function.

### For Netlify:
Create `_redirects` file:
```
/api/track/*  https://YOUR_PROJECT.supabase.co/functions/v1/track-click/:splat  200
```

### For Vercel:
Create `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/track/:path*",
      "destination": "https://YOUR_PROJECT.supabase.co/functions/v1/track-click/:path*"
    }
  ]
}
```

### For cPanel/GoDaddy:
You may need to use `.htaccess`:
```apache
RewriteEngine On
RewriteRule ^api/track/(.*)$ https://YOUR_PROJECT.supabase.co/functions/v1/track-click/$1 [R=302,L]
```

## ✅ Step 5: Check RLS Policies

Row Level Security must allow inserts.

**Verify in Supabase:**
1. Go to Authentication → Policies
2. Check `link_clicks` table policies
3. Should have: "Anyone can insert link clicks"

**Fix if missing:**
```sql
CREATE POLICY "Anyone can insert link clicks"
ON link_clicks FOR INSERT
TO anon, authenticated
WITH CHECK (true);
```

## ✅ Step 6: Test Tracking Manually

Test if tracking works:

1. **Get a link ID** from your database:
   ```sql
   SELECT id, title FROM link_items LIMIT 1;
   ```

2. **Click the tracking URL** directly:
   ```
   https://yoursite.com/api/track/YOUR-LINK-ID
   ```

3. **Check if record created**:
   ```sql
   SELECT * FROM link_clicks ORDER BY clicked_at DESC LIMIT 5;
   ```

4. **Check edge function logs**:
   ```bash
   supabase functions logs track-click --project-ref YOUR_PROJECT_REF
   ```

## ✅ Step 7: Rebuild and Upload

After making changes:

1. **Rebuild the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist/index.html`** to your server

3. **Also upload `public.html`** (this is the public viewer)

## Common Issues

### Issue: "404 Not Found" when clicking links
**Cause:** Edge function not deployed or routing not configured
**Fix:** Deploy edge function and configure server routing

### Issue: Links go directly to destination (no tracking)
**Cause:** Links not using tracking URLs
**Fix:** Ensure `public.html` uses `${baseUrl}/api/track/${link.id}`

### Issue: Database errors in console
**Cause:** Tables don't exist or RLS blocking
**Fix:** Run `create_analytics_tables.sql` and check policies

### Issue: Analytics shows "No data" but clicks should exist
**Cause:** RLS policy blocking SELECT or wrong user ID
**Fix:** Check RLS policies allow users to view their own data

## Quick Checklist

- [ ] Database tables created (`link_clicks`, `page_views`)
- [ ] Edge function deployed
- [ ] Server routing configured (`/api/track/*`)
- [ ] Links use tracking URLs (not direct URLs)
- [ ] RLS policies allow INSERT and SELECT
- [ ] Rebuilt and uploaded latest files
- [ ] Tested manually with tracking URL

## Still Not Working?

1. **Check browser console** for errors (F12)
2. **Check Supabase logs** for edge function errors
3. **Check database** to see if records are being inserted
4. **Test tracking URL directly** in browser

## Next Steps After Fixing

Once tracking works:
1. Click some links on public pages
2. Go to `/analytics` page in your app
3. You should see:
   - Total clicks count
   - Clicks by link
   - Clicks by device
   - Recent clicks table

