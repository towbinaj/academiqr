# Simple Google OAuth Setup for Supabase

## The Redirect URL is Already Handled!

Good news: **Supabase automatically uses its own callback URL**. You don't need to configure redirect URLs in Google Cloud Console right now.

## What You Need to Do

### In Supabase Dashboard:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click **Providers** tab
5. Find **Google** in the list
6. **Just toggle it ON** ✅
7. Click **Save**

That's it! No need to add redirect URLs or Google credentials yet.

## Test It

After enabling:
1. Go to your site
2. Click "Continue with Google"
3. You'll be redirected to Google's login page
4. After logging in, you'll be redirected back to your site

If Supabase asks for Google credentials later, then we'll set those up. But for testing, just enabling the provider should work!

## Why This Works

Supabase's OAuth URL is already configured:
- `https://natzpfyxpuycsuuzbqrd.supabasevue.co/auth/v1/callback`

This is automatically used by Supabase, so you don't need to add it manually.


