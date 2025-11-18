# Deploy CSRF Protection Fix - Step by Step

This guide will walk you through deploying the updated tracking function with CSRF protection.

---

## Prerequisites

- ✅ Node.js installed (check: `node --version`)
- ✅ Your Supabase project set up
- ✅ Updated `supabase/functions/track-click/index.ts` file (already done!)

---

## Method 1: Using Supabase Dashboard (Easiest)

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project (the one for AcademiQR)

### Step 2: Open Edge Functions

1. In the left sidebar, click **Edge Functions**
2. You should see a list of functions (including `track-click` if it's already deployed)

### Step 3: Edit the Function

1. Click on **`track-click`** function (or create it if it doesn't exist)
2. Click **Edit Function** or the code editor icon
3. **Copy the entire contents** of `supabase/functions/track-click/index.ts` from your computer
4. **Paste it** into the editor in Supabase dashboard
5. Click **Deploy** or **Save**

### Step 4: Verify Deployment

1. Wait for deployment to complete (you'll see a success message)
2. The function is now live with CSRF protection!

---

## Method 2: Using Supabase CLI (Command Line)

### Step 1: Install Supabase CLI (if not already installed)

**Option A: Using npm (Recommended)**
```bash
npm install -g supabase
```

**Option B: Using npx (No installation needed)**
You can skip installation and use `npx supabase` instead of `supabase` in all commands below.

### Step 2: Login to Supabase

```bash
npx supabase login
```

This will:
- Open your browser
- Ask you to authorize the CLI
- Save your login credentials

### Step 3: Link Your Project

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

**To find your Project Ref:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (gear icon)
4. Click **General**
5. Find **Reference ID** (looks like: `natzpfyxpuycsuuzbqrd`)
6. Copy it and use it in the command above

**Example:**
```bash
npx supabase link --project-ref natzpfyxpuycsuuzbqrd
```

### Step 4: Deploy the Function

Make sure you're in the project directory (where `supabase/functions/track-click/index.ts` is located):

```bash
npx supabase functions deploy track-click
```

### Step 5: Verify Deployment

You should see output like:
```
Deploying function track-click...
Function track-click deployed successfully!
```

---

## Method 3: Using Supabase CLI with Environment Variables

If you need to set environment variables:

### Step 1: Set Environment Variables (if needed)

The function uses these environment variables automatically:
- `SUPABASE_URL` - Automatically set by Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically set by Supabase

**You usually don't need to set these manually**, but if you do:

```bash
npx supabase secrets set SUPABASE_URL=your-url
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key
```

### Step 2: Deploy

```bash
npx supabase functions deploy track-click
```

---

## Verify the Fix is Working

### Test 1: Check Function is Deployed

1. Go to Supabase Dashboard
2. Click **Edge Functions**
3. Click **`track-click`**
4. Check the **Logs** tab - you should see recent activity

### Test 2: Test from Your Domain (Should Work)

1. Visit your AcademiQR site: `https://academiqr.com`
2. Click on a link
3. It should redirect correctly and track the click

### Test 3: Test CSRF Protection (Should Block)

Open browser console on a different website and run:

```javascript
fetch('https://academiqr.com/api/track/test-link-id')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

**Expected Result:** Should return `{ error: 'Invalid request origin' }` with status 403

---

## Troubleshooting

### Problem: "Function not found"

**Solution:** The function might not exist yet. Create it first:
1. Go to Supabase Dashboard → Edge Functions
2. Click **Create Function**
3. Name it `track-click`
4. Copy/paste the code from `supabase/functions/track-click/index.ts`

### Problem: "Permission denied" or "Not logged in"

**Solution:** 
```bash
npx supabase login
```

### Problem: "Project not linked"

**Solution:**
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Problem: "Cannot find function file"

**Solution:** Make sure you're in the correct directory:
```bash
# Check if the file exists
ls supabase/functions/track-click/index.ts

# If you're not in the right directory, navigate to it
cd /path/to/your/project
```

### Problem: Deployment succeeds but function doesn't work

**Solution:**
1. Check the function logs in Supabase Dashboard
2. Look for error messages
3. Verify environment variables are set correctly
4. Check that the function URL matches your domain setup

---

## Quick Reference

**Deploy command:**
```bash
npx supabase functions deploy track-click
```

**Check function logs:**
```bash
npx supabase functions logs track-click
```

**List all functions:**
```bash
npx supabase functions list
```

---

## What Changed?

The updated function now includes:

1. **CSRF Protection** (lines 57-78)
   - Validates request origin/referer
   - Blocks requests from unauthorized domains
   - Allows direct link clicks

2. **Duplicate Click Prevention** (lines 179-233)
   - Prevents recording duplicate clicks within 5 seconds
   - Reduces accidental double-clicks

---

## Need Help?

If you run into issues:

1. **Check Supabase Dashboard Logs:**
   - Go to Edge Functions → track-click → Logs
   - Look for error messages

2. **Verify File Location:**
   - Make sure `supabase/functions/track-click/index.ts` exists
   - Check that the file has the updated code

3. **Test Locally First (Optional):**
   ```bash
   npx supabase functions serve track-click
   ```
   This runs the function locally for testing.

---

## Summary

**Easiest Method:** Use Supabase Dashboard (Method 1)
1. Go to Dashboard → Edge Functions
2. Click track-click → Edit
3. Paste updated code
4. Deploy

**Command Line Method:** Use Supabase CLI (Method 2)
1. `npx supabase login`
2. `npx supabase link --project-ref YOUR_REF`
3. `npx supabase functions deploy track-click`

That's it! Your tracking endpoint is now protected against CSRF attacks.

