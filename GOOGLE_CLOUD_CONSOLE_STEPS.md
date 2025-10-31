# Google Cloud Console - Step by Step Instructions

## Finding Authorized Redirect URLs

### Step 1: Navigate to Credentials
1. Go to https://console.cloud.google.com/
2. At the top, click on the **project dropdown** (shows your current project name)
3. Select your project or create a new one
4. In the left sidebar, go to **APIs & Services**
5. Click **Credentials**

### Step 2: Find Your OAuth 2.0 Client
1. Look for a section called **"OAuth 2.0 Client IDs"**
2. If you have one already, click on its **name**
3. If you don't have one, click **+ CREATE CREDENTIALS** → **OAuth client ID**

### Step 3: Find the Redirect URIs
Once you click on your OAuth client (or create a new one), you'll see a form with:
- **Name**: Your app name
- **Authorized JavaScript origins**: (This is NOT the redirect URIs)
- **Authorized redirect URIs**: ← **THIS IS WHAT YOU NEED!**

### Step 4: Add the Redirect URI
Click **+ ADD URI** under "Authorized redirect URIs" and add:
```
https://natzpfyxpuycsuuzbqrd.supabasevue.co/auth/v1/callback
```

### Step 5: Save
Click **SAVE** at the bottom of the page

## Alternative: What If You Don't See "APIs & Services"?

If you're using a newer Google Cloud Console:
1. Look for **"Integrations"** or **"API Hub"** in the left sidebar
2. Or go directly to: https://console.cloud.google.com/apis/credentials

## Visual Guide
The page should look something like this:

```
OAuth 2.0 Client ID Details
─────────────────────────────────
Name: [Your App Name]
Client ID: xxxxxx.apps.googleusercontent.com
Client secret: xxxxxx
─────────────────────────────────
Authorized JavaScript origins:
http://academiqr.com
https://academiqr.com
─────────────────────────────────
Authorized redirect URIs:     ← ADD HERE!
http://academiqr.com
https://academiqr.com
https://natzpfyxpuycsuuzbqrd.supabasevue.co/auth/v1/callback  ← Add this one
─────────────────────────────────
```

## Quick Link
Direct link to credentials (after selecting your project):
https://console.cloud.google.com/apis/credentials


