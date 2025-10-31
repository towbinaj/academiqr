# Deploy Supabase Edge Function - Complete Step-by-Step Guide

This guide will walk you through deploying the tracking edge function for analytics.

## Prerequisites

Before starting, you'll need:
- ✅ Node.js installed (check: `node --version`)
- ✅ npm installed (check: `npm --version`)
- ✅ Supabase account and project
- ✅ Your Supabase project reference ID

---

## Step 1: Find Your Supabase Project Reference ID

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (gear icon in left sidebar)
4. Click **General** under Project Settings
5. Find **Reference ID** (it looks like: `abcdefghijklmnop`)
6. **Copy this ID** - you'll need it later

**Example:** `natzpfyxpuycsuuzbqrd`

---

## Step 2: Install Supabase CLI

Open PowerShell (or Command Prompt) and run:

```bash
npm install -g supabase
```

**Wait for installation to complete** - this may take 1-2 minutes.

**Verify installation:**
```bash
supabase --version
```

You should see a version number like `v1.x.x`

**If you get an error:**
- Make sure Node.js is installed: `node --version`
- Try running PowerShell as Administrator
- Restart your terminal after installation

---

## Step 3: Create Function Directory Structure

Navigate to your project folder:

```bash
cd C:\Users\TOWMJ2\webdev
```

Create the function directory:

```bash
mkdir supabase\functions\track-click
```

**Verify it was created:**
```bash
dir supabase\functions\track-click
```

You should see the directory exists (it will be empty for now).

---

## Step 4: Create the Function File

1. **Open the file:** `supabase_edge_function_track_click.ts`
   - Location: `C:\Users\TOWMJ2\webdev\supabase_edge_function_track_click.ts`

2. **Copy its entire contents**

3. **Create new file** in the function directory:
   - Path: `supabase\functions\track-click\index.ts`

4. **Paste the contents** into `index.ts`

**Alternative (using PowerShell):**
```powershell
Copy-Item supabase_edge_function_track_click.ts supabase\functions\track-click\index.ts
```

**Verify the file exists:**
```bash
dir supabase\functions\track-click
```

You should see `index.ts` in the directory.

---

## Step 5: Login to Supabase CLI

Authenticate with Supabase:

```bash
supabase login
```

This will:
1. Open your web browser
2. Ask you to log in to Supabase (if not already logged in)
3. Ask permission to link your CLI
4. Show a success message

**Expected output:**
```
✓ Successfully authenticated
```

**If it doesn't work:**
- Make sure you have a Supabase account
- Try the browser login again
- Check your internet connection

---

## Step 6: Link Your Project (Optional but Recommended)

Link your local project to your Supabase project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your Reference ID from Step 1.

**Example:**
```bash
supabase link --project-ref natzpfyxpuycsuuzbqrd
```

**When prompted:**
- Enter your database password (or press Enter if you don't have one set)
- It will ask to use existing config - type `y` and press Enter

**Expected output:**
```
✓ Linked to project natzpfyxpuycsuuzbqrd
```

---

## Step 7: Deploy the Function

Now deploy your edge function:

```bash
supabase functions deploy track-click --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your Reference ID.

**Example:**
```bash
supabase functions deploy track-click --project-ref natzpfyxpuycsuuzbqrd
```

**What happens:**
1. It uploads your function code
2. Installs dependencies
3. Deploys to Supabase
4. Shows the function URL

**Expected output:**
```
Deploying function track-click...
✓ Deployed function track-click
  Function URL: https://YOUR_PROJECT.supabase.co/functions/v1/track-click
```

**If you get errors:**

**Error: "Project not found"**
- Check your project reference ID
- Make sure you're logged in: `supabase login`

**Error: "Permission denied"**
- Make sure you're logged in: `supabase login`
- Try linking the project first: `supabase link`

**Error: "Function directory not found"**
- Check you're in the right directory: `cd C:\Users\TOWMJ2\webdev`
- Verify the function exists: `dir supabase\functions\track-click\index.ts`

---

## Step 8: Verify Deployment

Check that your function is deployed:

**Option 1: List all functions**
```bash
supabase functions list --project-ref YOUR_PROJECT_REF
```

You should see `track-click` in the list.

**Option 2: Check in Supabase Dashboard**
1. Go to Supabase Dashboard
2. Select your project
3. Click **Edge Functions** in the left sidebar
4. You should see `track-click` in the list

---

## Step 9: Test the Function

Before using it in production, test that it works:

**Get a link ID from your database:**
1. Go to Supabase Dashboard → Table Editor
2. Open `link_items` table
3. Copy one `id` value (looks like: `123e4567-e89b-12d3-a456-426614174000`)

**Test the function URL:**
Open this in your browser (replace with your values):
```
https://YOUR_PROJECT.supabase.co/functions/v1/track-click/YOUR-LINK-ID
```

**Example:**
```
https://natzpfyxpuycsuuzbqrd.supabase.co/functions/v1/track-click/123e4567-e89b-12d3-a456-426614174000
```

**What should happen:**
1. Browser redirects to the link's destination URL
2. A record is created in `link_clicks` table

**Verify in database:**
1. Go to Supabase Dashboard → Table Editor
2. Open `link_clicks` table
3. You should see a new row with your test click

---

## Step 10: Configure Your Domain Routing

For the tracking to work on your website, you need to route `/api/track/*` to the edge function.

### For GoDaddy/cPanel:

1. **Create or edit `.htaccess` file** in your `public_html` folder

2. **Add this code** (replace `YOUR_PROJECT` with your project reference):
```apache
RewriteEngine On
RewriteRule ^api/track/(.*)$ https://YOUR_PROJECT.supabase.co/functions/v1/track-click/$1 [R=302,L]
```

**Example:**
```apache
RewriteEngine On
RewriteRule ^api/track/(.*)$ https://natzpfyxpuycsuuzbqrd.supabase.co/functions/v1/track-click/$1 [R=302,L]
```

3. **Save and upload** the `.htaccess` file to your `public_html` folder

**Note:** If `.htaccess` doesn't work:
- Check with GoDaddy support if mod_rewrite is enabled
- Or use a different hosting solution (Netlify, Vercel) that supports rewrites

### Alternative: For Netlify

1. Create `_redirects` file in your project root:
```
/api/track/*  https://YOUR_PROJECT.supabase.co/functions/v1/track-click/:splat  200
```

2. Upload it when deploying

### Alternative: For Vercel

1. Create `vercel.json` in your project root:
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

---

## Step 11: Test End-to-End

After setting up routing:

1. **Rebuild your project:**
   ```bash
   npm run build
   ```

2. **Upload files:**
   - Upload `dist/index.html`
   - Upload `public.html`
   - Upload `.htaccess` (if using)

3. **Visit a public page** on your website

4. **Right-click a link → Inspect**
   - The link should be: `https://yoursite.com/api/track/abc-123-def`
   - NOT: `https://example.com` (direct URL)

5. **Click the link**
   - Should redirect to destination
   - Check `link_clicks` table for new record

6. **Go to `/analytics` page**
   - Should show the click!

---

## Troubleshooting

### Function deployment failed

**Check:**
- Are you logged in? `supabase login`
- Is your project reference ID correct?
- Does the function file exist? `dir supabase\functions\track-click\index.ts`

**Try:**
```bash
# Logout and login again
supabase logout
supabase login

# Try deploying again
supabase functions deploy track-click --project-ref YOUR_PROJECT_REF
```

### Function deployed but returns 404

**Check:**
- Is the function name correct? Must be `track-click`
- Check function exists: `supabase functions list`

**Try accessing directly:**
```
https://YOUR_PROJECT.supabase.co/functions/v1/track-click
```

Should return an error (that's OK - means function exists, just needs a link ID)

### Routing not working

**For `.htaccess`:**
- Make sure file is in `public_html` folder
- Check if mod_rewrite is enabled (contact GoDaddy support)
- Try accessing: `https://yoursite.com/api/track/test`

**Alternative:**
Use the Supabase function URL directly in your code temporarily:
```javascript
linkElement.href = `https://YOUR_PROJECT.supabase.co/functions/v1/track-click/${link.id}`;
```

### Clicks not being recorded

**Check:**
1. Database tables exist: `link_clicks` table in Supabase
2. RLS policies allow inserts
3. Link ID is correct
4. Check function logs: `supabase functions logs track-click`

**View logs:**
```bash
supabase functions logs track-click --project-ref YOUR_PROJECT_REF
```

### Getting CORS errors

The function already includes CORS headers. If you still get errors:
- Check browser console for specific error
- Verify function is deployed correctly
- Check function logs for errors

---

## Quick Command Reference

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy track-click --project-ref YOUR_PROJECT_REF

# List functions
supabase functions list --project-ref YOUR_PROJECT_REF

# View logs
supabase functions logs track-click --project-ref YOUR_PROJECT_REF

# Delete function (if needed)
supabase functions delete track-click --project-ref YOUR_PROJECT_REF
```

---

## What's Next?

After successfully deploying:

1. ✅ Function is live on Supabase
2. ✅ Configure domain routing (Step 10)
3. ✅ Test that tracking works
4. ✅ Check analytics dashboard for clicks

**Remember:** Every time you update the function code, redeploy:
```bash
supabase functions deploy track-click --project-ref YOUR_PROJECT_REF
```

---

## Need More Help?

- **Supabase Docs:** https://supabase.com/docs/guides/functions
- **Check function logs:** `supabase functions logs track-click`
- **Test function directly:** Use the function URL in browser
- **Verify database:** Check `link_clicks` table in Supabase

