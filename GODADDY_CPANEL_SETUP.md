# GoDaddy cPanel - Security Headers Setup Guide

## Overview

Since you're hosting on **GoDaddy with cPanel**, you're using **Apache** web server. The `.htaccess` file has been configured with all security headers.

---

## Step 1: Locate Your `.htaccess` File

The `.htaccess` file is in your project root directory:
- **File:** `.htaccess`
- **Location:** `c:\Users\TOWMJ2\webdev\.htaccess`

---

## Step 2: Upload `.htaccess` to GoDaddy via cPanel

### Option A: Using cPanel File Manager (Recommended)

1. **Log into GoDaddy cPanel:**
   - Go to: https://cpanel.godaddy.com/
   - Or access via your GoDaddy account dashboard

2. **Open File Manager:**
   - In cPanel, find and click **"File Manager"**
   - Navigate to your website's root directory (usually `public_html` or `www`)

3. **Show Hidden Files:**
   - In File Manager, click **"Settings"** (gear icon)
   - Check **"Show Hidden Files (dotfiles)"**
   - Click **"Save"**

4. **Upload or Edit `.htaccess`:**
   
   **If `.htaccess` doesn't exist:**
   - Click **"Upload"** button
   - Select the `.htaccess` file from your computer
   - Upload it to the root directory (`public_html`)

   **If `.htaccess` already exists:**
   - Right-click on `.htaccess`
   - Select **"Edit"**
   - Copy the entire contents from your local `.htaccess` file
   - Paste and replace all content
   - Click **"Save Changes"**

5. **Verify File Permissions:**
   - Right-click on `.htaccess`
   - Select **"Change Permissions"**
   - Set to: **644** (or leave as default)
   - Click **"Change Permissions"**

### Option B: Using FTP/SFTP

1. **Connect via FTP:**
   - Use FileZilla or your preferred FTP client
   - Connect to your GoDaddy server
   - Navigate to `public_html` (or your root directory)

2. **Upload `.htaccess`:**
   - Upload the `.htaccess` file to the root directory
   - Make sure it's named exactly `.htaccess` (with the dot at the beginning)

3. **Set Permissions:**
   - Right-click the file → Properties
   - Set permissions to **644**

---

## Step 3: Verify Apache mod_headers is Enabled

**Important:** Security headers require Apache's `mod_headers` module to be enabled.

### Check if mod_headers is Enabled:

1. **In cPanel:**
   - Look for **"Apache Modules"** or **"Select PHP Version"** → **"Extensions"**
   - Search for `mod_headers`
   - Make sure it's enabled

2. **If mod_headers is NOT enabled:**
   - Contact GoDaddy support
   - Ask them to enable `mod_headers` for your account
   - Most GoDaddy shared hosting has it enabled by default

### Alternative: Test if Headers Work

If you can't check mod_headers directly, just upload the file and test. If headers don't work, contact GoDaddy support.

---

## Step 4: Test Security Headers

### Method 1: Browser Developer Tools

1. **Open your website:**
   - Go to: https://academiqr.com

2. **Open Developer Tools:**
   - Press `F12` or right-click → "Inspect"
   - Go to **"Network"** tab
   - Refresh the page (`F5`)

3. **Check Headers:**
   - Click on the main request (usually `index.html` or your domain)
   - Go to **"Headers"** tab
   - Scroll down to **"Response Headers"**
   - You should see:
     - `X-Frame-Options: DENY`
     - `Content-Security-Policy: ...`
     - `Strict-Transport-Security: ...`
     - `X-Content-Type-Options: nosniff`
     - `Referrer-Policy: no-referrer`

### Method 2: Command Line (curl)

```bash
curl -I https://academiqr.com
```

You should see the security headers in the response.

### Method 3: Online Tool

1. Visit: https://securityheaders.com/
2. Enter your domain: `academiqr.com`
3. Click **"Scan"**
4. You should see a good security score (A or B)

---

## Step 5: Troubleshooting

### Problem: Headers Not Showing Up

**Possible Causes:**

1. **mod_headers not enabled:**
   - Contact GoDaddy support to enable `mod_headers`

2. **Wrong file location:**
   - Make sure `.htaccess` is in the root directory (`public_html`)
   - Not in a subdirectory

3. **File permissions:**
   - Make sure `.htaccess` has permissions **644**

4. **Syntax error:**
   - Check cPanel error logs
   - Look for Apache errors in **"Error Log"** section

5. **Cache:**
   - Clear browser cache
   - Try incognito/private browsing mode

### Problem: Site Not Loading After Upload

**If your site breaks:**

1. **Rename `.htaccess`:**
   - In cPanel File Manager, rename `.htaccess` to `.htaccess.backup`
   - This will disable the security headers temporarily

2. **Check Error Logs:**
   - In cPanel, go to **"Error Log"**
   - Look for Apache errors
   - Common issues:
     - `mod_headers` not enabled
     - Syntax error in `.htaccess`

3. **Fix the Issue:**
   - Fix any syntax errors
   - Contact GoDaddy support if `mod_headers` is not enabled

4. **Re-upload:**
   - Once fixed, rename back to `.htaccess`

### Problem: CSP Blocking Resources

**If resources are blocked:**

1. **Check Browser Console:**
   - Open Developer Tools → Console
   - Look for CSP violation errors
   - Example: `Refused to load script from 'https://...'`

2. **Update CSP Policy:**
   - Edit `.htaccess`
   - Add the blocked domain to the appropriate CSP directive
   - Re-upload the file

---

## What's in Your `.htaccess` File?

Your `.htaccess` file now includes:

1. **Existing routing rules** (for `/api/track/*` → Supabase)
2. **Security headers:**
   - X-Frame-Options: DENY
   - Content-Security-Policy
   - Strict-Transport-Security (HSTS)
   - X-Content-Type-Options: nosniff
   - Referrer-Policy: no-referrer
   - Permissions-Policy

---

## Quick Checklist

- [ ] Log into GoDaddy cPanel
- [ ] Open File Manager
- [ ] Enable "Show Hidden Files"
- [ ] Navigate to `public_html` (root directory)
- [ ] Upload or edit `.htaccess` file
- [ ] Set file permissions to 644
- [ ] Test headers using browser DevTools or securityheaders.com
- [ ] Verify site still works correctly

---

## Need Help?

**If you encounter issues:**

1. **Check cPanel Error Logs:**
   - cPanel → Error Log
   - Look for Apache errors

2. **Contact GoDaddy Support:**
   - Ask them to enable `mod_headers` if needed
   - They can help troubleshoot `.htaccess` issues

3. **Test in Steps:**
   - First, test with just one header (X-Frame-Options)
   - Then add others one by one
   - This helps identify which header causes issues

---

## Summary

✅ **Your `.htaccess` file is ready!**

**Next Steps:**
1. Upload `.htaccess` to GoDaddy cPanel (`public_html` directory)
2. Make sure `mod_headers` is enabled (contact GoDaddy if needed)
3. Test headers using browser DevTools or securityheaders.com
4. Verify your site still works correctly

That's it! Your security headers will be active once the file is uploaded.

