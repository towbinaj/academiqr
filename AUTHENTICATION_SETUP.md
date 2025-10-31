# Authentication Setup Guide for AcademiQR

This guide will help you set up Google OAuth authentication for your AcademiQR application with Supabase.

## Overview

AcademiQR supports two authentication methods:
- **Email/Password** (already working)
- **Google OAuth** (needs configuration)

## Step 1: Enable Google OAuth in Supabase

1. **Log into your Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project (natzpfyxpuycsuuzbqrd)

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - Click on "Providers" tab

3. **Enable Google OAuth**
   - Find "Google" in the providers list
   - Toggle it ON
   - You'll need to create OAuth credentials in Google Cloud Console

## Step 2: Configure Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click on the project dropdown at the top
   - Create a new project or select an existing one
   - Name it something like "AcademiQR" or "AcademiQR-Auth"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External
     - Fill in the required fields (app name, support email, etc.)
     - Add your email to test users
     - Save and continue

4. **Create OAuth Client ID**
   - Application type: Web application
   - Name: AcademiQR Login
   - Add Authorized JavaScript origins:
     - `http://academiqr.com`
     - `https://academiqr.com` (if you have SSL)
     - `https://natzpfyxpuycsuuzbqrd.supabasevue.co`
   - Add Authorized redirect URIs:
     - `https://natzpfyxpuycsuuzbqrd.supabasevue.co/auth/v1/callback`
     - `https://academiqr.com` (main site redirect)
   - Click "Create"

5. **Copy Credentials**
   - Copy the Client ID
   - Copy the Client Secret
   - Paste these into Supabase Google provider settings

## Step 3: Update Site URL in Supabase

1. **Go to Authentication → URL Configuration**
   - In your Supabase Dashboard, click "Authentication" in the left sidebar
   - Click "URL Configuration" at the top of the Authentication page
   
2. **Update the Site URL**:
   - In the "Site URL" field, change it to: `https://academiqr.com` (or `http://academiqr.com` if not using SSL)
   
3. **Add Redirect URLs**:
   - In the "Redirect URLs" section, click "Add URL"
   - Add these URLs one by one:
     - `https://academiqr.com`
     - `https://academiqr.com` (without the https:// if that's what you need)
     - `http://academiqr.com` (if you're not using SSL yet)
   - Click "Save"

## Step 4: Deploy Updated Code

1. **Upload your updated `index.html` to cPanel**
   - The file already has the Google OAuth button and handler
   - Access via File Manager in cPanel

2. **Test the authentication**
   - Try logging in with email/password (should work immediately)
   - Try Google OAuth button (will work after configuration above)

## Step 5: Configure Email (Optional)

If you want email-based signup with confirmation:

1. **Go to Authentication → Settings**
2. **Enable "Confirm email"** toggle
3. **Configure SMTP settings** in Project Settings → Auth

## Current Status

✅ **Working**: Email/Password authentication  
⏳ **Needs Setup**: Google OAuth

The Google OAuth button is already in the UI, it just needs the Supabase configuration to work.

## Troubleshooting

### Google OAuth redirect errors
- Make sure redirect URLs are correct in both Supabase and Google Cloud Console
- Check that Site URL is correctly set in Supabase
- Verify authorized origins include both HTTP and HTTPS versions of your site

### "Invalid credentials" errors
- Verify Google Client ID and Client Secret are correct in Supabase
- Check that Google OAuth is enabled in Supabase

### Session issues
- Clear browser cache and cookies
- Check that remember me functionality is working

## Security Notes

- Never commit OAuth credentials to version control
- Keep your Supabase keys secure
- Consider enabling Row Level Security (RLS) on your tables
- Use HTTPS in production

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Check browser console for errors
3. Verify all redirect URLs match exactly
4. Test with incognito mode to rule out caching issues

