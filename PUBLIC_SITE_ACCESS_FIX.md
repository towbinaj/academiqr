# Public Site Access Fix

## Problem

The database performance optimization scripts that were run to improve query performance inadvertently removed public access to several critical resources needed for the public site functionality:

1. **Profile photos** - Not loading on public profiles
2. **Profile socials** - Social media links not accessible
3. **Presentation information** - Theme and styling information not loading
4. **Theme elements** - Custom theme settings not accessible

## Root Cause

The performance optimization scripts (`fix-profiles-rls-performance.sql`, `fix-user-themes-rls-performance.sql`, `fix-user-media-rls-performance.sql`) changed RLS policies to only allow users to view their **own** data:

- **Before**: Policies allowed public viewing (e.g., `USING (true)` or public visibility checks)
- **After**: Policies restricted to own data only (e.g., `USING ((SELECT auth.uid()) = id)`)

This broke public profile viewing because:
- Visitors can't see profile photos (stored in `user_media`)
- Visitors can't see theme settings (stored in `user_themes`)
- Visitors can't see profile information (stored in `profiles`)
- Authenticated users viewing other users' profiles can't see their data

## Solution

The fix script `fix-public-site-access.sql` restores public access while maintaining the performance optimizations:

1. **Profiles** - Allows anyone (authenticated or anonymous) to view any profile
2. **user_themes** - Allows anyone to view themes (needed for public profile styling)
3. **user_media** - Allows anyone to view media (needed for profile photos)
4. **link_lists** - Ensures public/unlisted link lists are accessible

## How to Apply the Fix

1. Open Supabase SQL Editor
2. Run the script: `fix-public-site-access.sql`
3. Verify the policies are updated correctly (the script includes verification queries)
4. Test the public site to ensure:
   - Profile photos load
   - Social links are visible
   - Theme elements display correctly
   - Presentation information is accessible

## Technical Details

The fix maintains performance optimization by:
- Using `(SELECT auth.uid())` instead of `auth.uid()` directly (performance optimization)
- Adding `OR true` conditions for public access where needed
- Using visibility checks (`visibility = 'public' OR visibility = 'unlisted'`) for link_lists

## Files Modified

- `fix-public-site-access.sql` - New fix script to restore public access

## Related Files

These files were the source of the issue:
- `fix-profiles-rls-performance.sql`
- `fix-user-themes-rls-performance.sql`
- `fix-user-media-rls-performance.sql`
- `fix-profiles-duplicate-policies.sql`

## Testing Checklist

After applying the fix, verify:
- [ ] Public profile pages load correctly
- [ ] Profile photos display
- [ ] Social media links are visible
- [ ] Theme colors and styling apply correctly
- [ ] Presentation information (link lists) displays
- [ ] Authenticated users can still view their own data
- [ ] Performance is still optimized (no regression)








