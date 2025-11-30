# Quick Start: Migrate Data URIs to Storage

## The Problem
Your images are stored as base64 data URIs in the database (2.8MB each!), causing:
- **659KB payload** for just 8 links
- Slow page loads
- Database bloat

## Quick Fix (5 minutes)

### Step 1: Get Your Service Role Key
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **`service_role`** key (⚠️ NOT the `anon` key - it must be `service_role`)

### Step 2: Update Migration Script

1. **Open the file** `migrate-data-uris-to-storage.js` in your code editor

2. **Find line 24** - it should look like this:
   ```javascript
   const SUPABASE_SERVICE_KEY = 'YOUR_SERVICE_ROLE_KEY'; // ⚠️ Get this from Supabase Dashboard → Settings → API → service_role key
   ```

3. **Replace** `'YOUR_SERVICE_ROLE_KEY'` with your actual service role key (the one you copied in Step 1)

   **Example:** If your service role key is `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`, change it to:
   ```javascript
   const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```
   
   ⚠️ **Important:** Keep the quotes around the key! It should look like:
   ```javascript
   const SUPABASE_SERVICE_KEY = 'your-actual-key-here';
   ```

4. **Save the file** (Ctrl+S or Cmd+S)

### Step 3: Install Dependencies

✅ **Good news!** The dependency is already listed in your `package.json`. You just need to install it.

1. **Open Terminal/Command Prompt:**
   - **Windows:** Press `Win + R`, type `cmd`, press Enter
   - **Or:** In VS Code/Cursor, press `` Ctrl + ` `` (backtick) to open terminal
   - **Or:** Right-click in your project folder and select "Open in Terminal"

2. **Make sure you're in the right folder:**
   ```bash
   cd C:\Users\TOWMJ2\webdev
   ```
   (This should be where your `package.json` and `migrate-data-uris-to-storage.js` files are)

3. **Install dependencies:**
   ```bash
   npm install
   ```
   
   You should see output like:
   ```
   added 2 packages in 3s
   ```

**What this does:**
- Downloads all the libraries your project needs (including `@supabase/supabase-js`)
- Creates a `node_modules` folder (you can ignore this - it's where the libraries are stored)

**Troubleshooting:**
- **"npm is not recognized"** → You need to install Node.js:
  - Go to https://nodejs.org/
  - Download the LTS version
  - Install it, then restart your terminal
- **"Permission denied"** → Try running terminal as Administrator (Windows)

### Step 4: Create Storage Bucket
1. Go to Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Name: `link-images`
4. Make it **Public** (toggle ON)
5. Click **Create bucket**

### Step 5: Run Migration
```bash
node migrate-data-uris-to-storage.js
```

The script will:
- ✅ Find all data URIs (21 links found)
- ✅ Upload each image to Supabase Storage
- ✅ Update database with new URLs
- ✅ Show progress and results

### Step 6: Verify
After migration, your payload should drop from **659KB to ~50KB**!

Check in Supabase SQL Editor:
```sql
SELECT 
    COUNT(*) as total,
    COUNT(CASE WHEN image ~ '^data:image' THEN 1 END) as still_data_uris,
    COUNT(CASE WHEN image ~ '^https?://' THEN 1 END) as now_urls
FROM link_items
WHERE image IS NOT NULL;
```

You should see `still_data_uris = 0`.

## Expected Results

**Before:**
- 8 links = 659KB payload
- Images: base64 data URIs (2.8MB each in DB)

**After:**
- 8 links = ~50KB payload  
- Images: Supabase Storage URLs (~100 bytes each)
- Images load separately (better caching)

## Troubleshooting

**Error: "Bucket not found"**
- Make sure you created the `link-images` bucket in Step 4

**Error: "Invalid API key"**
- Make sure you're using the `service_role` key, not `anon` key

**Error: "Permission denied"**
- Make sure the bucket is set to **Public**

## What Happens to Old Data?

The migration script:
- ✅ Creates new files in storage
- ✅ Updates database with new URLs
- ❌ Does NOT delete old data URIs (they remain in DB until you clean up)

You can safely run the migration multiple times - it won't duplicate files.

