# Fix 401 Error - Disable JWT Verification

The 401 error is because Supabase edge functions require JWT verification by default. Since this is a public tracking endpoint, we need to disable it.

## Option 1: Through Supabase Dashboard (Recommended)

1. Go to: https://supabase.com/dashboard/project/natzpfyxpuycsuuzbqrd/functions
2. Click on the `track-click` function
3. Go to **Settings** or **Configuration**
4. Find **JWT Verification** or **Verify JWT** setting
5. **Disable** or set to **false**
6. Save the changes

## Option 2: Using config.toml (Already Added)

I've created `supabase/functions/track-click/config.toml` with:
```toml
[functions]
verify_jwt = false
```

But you may need to:
1. Check if the config file was deployed
2. Or configure it through the dashboard (Option 1)

## Option 3: Use anon key in the request

Alternatively, we could modify the `.htaccess` to pass the anon key, but disabling JWT is cleaner for a public endpoint.

## Next Steps

1. **Try Option 1 first** (dashboard configuration)
2. **Test clicking a link again**
3. **Check function logs** in the dashboard to see the debug messages

The function now has better error logging, so we can see exactly what's happening.

