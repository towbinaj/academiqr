# Deploy Account Deletion Feature

This guide shows you how to deploy the account deletion feature.

---

## Step 1: Add DELETE Policy for Profiles

1. Open Supabase SQL Editor
2. Run `add-profile-delete-policy.sql`
3. Verify the policy was created:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'profiles' AND cmd = 'DELETE';
   ```

---

## Step 2: Deploy Edge Function

### Option A: Using Supabase Dashboard Editor (Easiest)

1. Go to Supabase Dashboard → Edge Functions
2. Click **"Deploy via editor"** (or similar option)
3. Create a new function named: `delete-account`
4. Copy **ALL** code from `supabase/functions/delete-account/index.ts`
5. Paste into the editor
6. Click **"Deploy"** or **"Save"**

**Note:** If you see options for "via editor", "via CLI", or "via AI assistant", choose **"via editor"**.

### Option B: Using Supabase CLI

```bash
npx supabase functions deploy delete-account --project-ref YOUR_PROJECT_REF
```

---

## Step 3: Verify Deployment

The UI is already added to `index.html`. The feature includes:

✅ **Delete Account Button** in profile modal  
✅ **Confirmation Modal** with "DELETE" text requirement  
✅ **Double Confirmation** (browser confirm dialog)  
✅ **Edge Function** handles all data deletion  
✅ **Automatic Sign Out** after deletion

---

## What Gets Deleted

When a user deletes their account:

1. ✅ All collections (`link_lists`)
2. ✅ All links (`link_items`)
3. ✅ All link clicks (`link_clicks`)
4. ✅ All analytics events (`analytics_events`)
5. ✅ Profile data (`profiles`)
6. ✅ Profile photo (from storage)
7. ✅ Media files (from storage, if in user folders)
8. ✅ User account (Supabase Auth)

---

## Security Features

✅ **Authentication Required** - Only authenticated users can delete  
✅ **Self-Only Deletion** - Users can only delete their own account  
✅ **Confirmation Required** - Must type "DELETE" to confirm  
✅ **Double Confirmation** - Browser confirm dialog  
✅ **Complete Data Removal** - All associated data deleted  
✅ **Automatic Sign Out** - User signed out after deletion

---

## Testing

1. **Test Account Deletion:**
   - Open profile modal
   - Click "Delete Account"
   - Type "DELETE" in confirmation field
   - Confirm deletion
   - Verify account is deleted and user is signed out

2. **Test Cancellation:**
   - Click "Delete Account"
   - Don't type "DELETE" - button should be disabled
   - Click "Cancel" - modal should close

3. **Test Error Handling:**
   - Try deleting without being signed in (should fail)
   - Check error messages are displayed

---

## Important Notes

⚠️ **Service Role Key Required:**
- The Edge Function uses `SUPABASE_SERVICE_ROLE_KEY` for admin operations
- This key is automatically available in Supabase Edge Functions
- No manual configuration needed

⚠️ **Data Deletion is Permanent:**
- All user data is permanently deleted
- Cannot be recovered
- Make sure users understand this

---

## Files Modified/Created

**New Files:**
- `add-profile-delete-policy.sql` - SQL to add DELETE policy
- `supabase/functions/delete-account/index.ts` - Edge Function
- `DEPLOY_DELETE_ACCOUNT.md` - This guide

**Modified Files:**
- `index.html` - Added Delete Account button and confirmation modal
- `script.js` - Added account deletion functions

---

**Status:** Ready to deploy  
**Next:** Run SQL policy, deploy Edge Function, test

