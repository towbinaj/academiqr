# Passkey Not Saved on Update - Bug Fix

## Problem

The passkey was not being saved to the database when creating or updating collections. The passkey value was retrieved from the UI and stored in memory (`currentList.passkey`), but it was not included in the database insert/update queries.

## Root Cause

In the `saveChanges()` function:
1. **New collections:** The `passkey` was retrieved (line 7205) but not included in the `.insert()` call (line 7226-7231)
2. **Existing collections:** The `passkey` was retrieved (line 7272) but not included in the `.update()` call (line 7307-7311)

## Fix Applied

### 1. New Collection Creation (Line 7226-7231)

**Before:**
```javascript
.insert({
    owner_id: currentUser.id,
    slug: cleanSlug,
    visibility: visibility === 'passkey' ? 'public' : visibility,
    theme: getCurrentThemeFromUI()
})
```

**After:**
```javascript
.insert({
    owner_id: currentUser.id,
    slug: cleanSlug,
    visibility: visibility === 'passkey' ? 'public' : visibility,
    passkey: passkey,  // ✅ Added
    theme: getCurrentThemeFromUI()
})
```

### 2. Existing Collection Update (Line 7307-7311)

**Before:**
```javascript
.update({
    slug: cleanSlug,
    visibility: visibility === 'passkey' ? 'public' : visibility,
    theme: themeToSave
})
```

**After:**
```javascript
.update({
    slug: cleanSlug,
    visibility: visibility === 'passkey' ? 'public' : visibility,
    passkey: passkey,  // ✅ Added
    theme: themeToSave
})
```

## How It Works

1. **Passkey Retrieval:**
   - When visibility is set to `'passkey'`, the passkey is retrieved from the `header-passkey` input field
   - When visibility is not `'passkey'`, the passkey is set to `null`

2. **Database Storage:**
   - The passkey is now included in both insert and update operations
   - If visibility is `'passkey'`, the passkey value is saved
   - If visibility is not `'passkey'`, `null` is saved (clearing any existing passkey)

3. **Visibility Handling:**
   - The database `visibility` column stores `'public'` when the UI shows `'passkey'`
   - The actual passkey is stored in the separate `passkey` column
   - This allows the collection to be publicly accessible but protected by a passkey

## Testing

To verify the fix works:

1. **Create a new collection with passkey:**
   - Set visibility to "🔑 With Passkey"
   - Enter a passkey
   - Save the collection
   - Verify the passkey is saved in the database

2. **Update an existing collection:**
   - Open a collection
   - Change visibility to "🔑 With Passkey"
   - Enter a passkey
   - Save the collection
   - Verify the passkey is saved in the database

3. **Remove passkey:**
   - Change visibility from "🔑 With Passkey" to another option
   - Save the collection
   - Verify the passkey is cleared (set to `null`) in the database

## Security Note

⚠️ **Current Implementation:** Passkeys are stored in **plain text** in the database.

**Future Improvement:** Consider hashing passkeys before storage (similar to passwords) using bcrypt or similar hashing algorithm.

## Files Modified

- ✅ `index.html` - Added `passkey` to insert and update queries

## Status

✅ **Fixed:** Passkey is now saved to the database on both create and update operations.

