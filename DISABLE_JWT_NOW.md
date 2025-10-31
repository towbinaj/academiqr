# Fix 401 Error - Disable JWT Verification NOW

The 401 error is back because JWT verification needs to be disabled in the Supabase Dashboard.

## Quick Fix (2 minutes):

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/natzpfyxpuycsuuzbqrd/functions
   ```

2. **Click on `track-click` function**

3. **Look for Settings/Configuration:**
   - Find **"JWT Verification"** or **"Verify JWT"** toggle/checkbox
   - **DISABLE it** (set to `false` or uncheck it)

4. **Save changes**

5. **Test clicking a link again**

## Alternative: Check if config.toml is in the right place

The `config.toml` file should be in: `supabase/functions/track-click/config.toml`

But Supabase might not automatically deploy it. You may need to configure this in the dashboard instead.

## Why This Happens:

- Supabase edge functions require JWT verification by default
- Our tracking endpoint is PUBLIC (no authentication needed)
- The dashboard setting overrides any config file
- After redeploying, the setting might reset

**Solution: Disable it permanently in the dashboard.**

