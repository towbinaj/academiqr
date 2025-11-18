# Testing Guide: Auto Sign-Up Security Fix

## Test 1: Verify UI Changes ✅
**Expected Result**: Login form shows "Sign In" button and "Sign Up" link

1. Open the login page
2. **Check**: Button should say "Sign In" (not "Sign In / Sign Up")
3. **Check**: Below the button, you should see "Don't have an account? Sign Up" link

## Test 2: Verify Sign-Up Mode Toggle ✅
**Expected Result**: Clicking "Sign Up" link changes button to "Sign Up"

1. Click the "Sign Up" link
2. **Check**: Button text changes to "Sign Up"
3. **Check**: Link text changes to "Sign In"
4. Click "Sign In" link again
5. **Check**: Button text changes back to "Sign In"

## Test 3: Verify No Auto Sign-Up (Account Enumeration Prevention) 🔒
**Expected Result**: Failed sign-in does NOT create a new account

### Test 3a: Try to sign in with invalid credentials
1. Make sure you're in "Sign In" mode (button says "Sign In")
2. Enter an email that does NOT exist in your system (e.g., `test-nonexistent@example.com`)
3. Enter any password
4. Click "Sign In"
5. **Expected**: Error message "Invalid email or password. Please try again."
6. **Check**: No new account was created (verify in Supabase dashboard or try to sign in with those credentials)

### Test 3b: Try to sign in with wrong password for existing account
1. Enter an email that DOES exist in your system
2. Enter the WRONG password
3. Click "Sign In"
4. **Expected**: Error message "Invalid email or password. Please try again."
5. **Check**: No new account was created

## Test 4: Verify Generic Error Messages 🔒
**Expected Result**: Error messages don't reveal whether account exists

1. Try to sign in with non-existent email → Should see: "Invalid email or password. Please try again."
2. Try to sign in with existing email but wrong password → Should see: "Invalid email or password. Please try again."
3. **Check**: Both errors are identical (prevents account enumeration)

## Test 5: Verify Explicit Sign-Up Works ✅
**Expected Result**: Sign-up only works when explicitly in sign-up mode

1. Click "Sign Up" link to enter sign-up mode
2. Enter a new email address
3. Enter a password
4. Click "Sign Up" button
5. **Expected**: Account is created OR error message "Unable to create account. Please try again."

## Test 6: Verify Console Logs Don't Leak Information 🔒
**Expected Result**: No sensitive information in browser console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try to sign in with invalid credentials
4. **Check**: No console.log statements showing:
   - Email addresses
   - "Sign in failed, attempting sign up..."
   - Authentication state details

## Test 7: Verify Account Enumeration Prevention 🔒
**This is the KEY security test**

### Before the fix:
- Trying to sign in with `user@example.com` would:
  - If account exists: Sign in succeeds OR shows sign-in error
  - If account doesn't exist: Auto-creates account OR shows sign-up error
- **This allowed attackers to determine if an email is registered**

### After the fix:
1. Try to sign in with `user@example.com` (unknown if account exists)
2. Enter wrong password
3. **Expected**: "Invalid email or password. Please try again."
4. **Check**: You cannot determine if the account exists or not
5. Try to sign in with `nonexistent@example.com`
6. Enter any password
7. **Expected**: "Invalid email or password. Please try again."
8. **Check**: Same error message (cannot distinguish between "account doesn't exist" and "wrong password")

## Quick Verification Checklist

- [ ] Button shows "Sign In" (not "Sign In / Sign Up")
- [ ] "Sign Up" link is visible below button
- [ ] Clicking "Sign Up" changes button to "Sign Up"
- [ ] Failed sign-in shows generic error message
- [ ] Failed sign-in does NOT create new account
- [ ] Error messages are identical for non-existent accounts and wrong passwords
- [ ] No sensitive information in console logs
- [ ] Cannot determine if an email is registered by trying to sign in

## What to Look For (Red Flags)

❌ **If you see these, the fix didn't work:**
- Button still says "Sign In / Sign Up"
- Failed sign-in automatically creates an account
- Different error messages for "account doesn't exist" vs "wrong password"
- Console logs showing "Sign in failed, attempting sign up..."
- Console logs showing email addresses

✅ **If you see these, the fix is working:**
- Separate "Sign In" and "Sign Up" modes
- Generic error messages
- No auto account creation
- No sensitive information in console

