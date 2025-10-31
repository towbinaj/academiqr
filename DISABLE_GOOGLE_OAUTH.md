# Temporary Solution: Use Email/Password Authentication

Since Google OAuth is having issues, you can use the email/password authentication that's already working.

## To Use Email/Password Auth

1. Go to `http://academiqr.com/` or `https://academiqr.com/`
2. Enter your email address
3. Enter any password (it will create an account if it doesn't exist)
4. Click "Sign In / Sign Up"
5. Check "Remember me for 30 days" if you want to stay logged in

## Why Google OAuth Might Be Failing

The error "Database error saving new user" typically means:
- The profiles table doesn't have the right schema
- There's a constraint violation (like a required field)
- RLS policies are blocking the insert

## To Fix Google OAuth (for later)

You'll need to:
1. Run the CHECK_AND_FIX_OAUTH.sql file in Supabase SQL Editor
2. Check the Supabase logs for specific error messages
3. Verify the profiles table schema matches what the trigger expects

For now, email/password authentication is the most reliable option.


