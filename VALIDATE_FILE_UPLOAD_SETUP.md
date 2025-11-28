# Validate File Upload Edge Function - Setup Guide

## Current Status

✅ **Edge Function is deployed** (you can see it in your Supabase dashboard)  
⚠️ **Edge Function is NOT being called in code** (it's optional)  
✅ **RLS Policies provide primary protection** (server-side validation)

---

## Do You Need to Do Anything?

### Short Answer: **No, it's optional**

The Edge Function is **not required** because:

1. ✅ **Client-side validation** - Already implemented (`validateImageFile()` function)
2. ✅ **RLS Policies** - Server-side protection (file type, size, extension)
3. ✅ **Storage bucket limits** - Infrastructure-level enforcement

The Edge Function adds an **extra layer** but isn't strictly necessary.

---

## What the Edge Function Adds (If You Want Extra Security)

If you integrate the Edge Function, it provides:

1. **Magic Number Validation** - Checks actual file content (not just extension/MIME type)
   - Prevents file type spoofing (e.g., `.exe` renamed to `.jpg`)
   - Validates file signatures match declared type

2. **Image Dimension Validation** - Prevents DoS via huge images
   - Max dimensions: 10000x10000 pixels
   - Prevents memory exhaustion attacks

---

## How to Integrate It (Optional)

If you want to use the Edge Function, you need to call it **before** uploading to Storage:

### Step 1: Add validation function to `script.js`

Add this function to call the Edge Function:

```javascript
/**
 * Validate file using Edge Function (magic numbers, dimensions)
 * Returns { valid: boolean, error?: string }
 */
async function validateFileWithEdgeFunction(file, bucketId) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucketId', bucketId);
        formData.append('fileName', file.name);
        
        const { data, error } = await supabaseClient.functions.invoke('validate-file-upload', {
            body: formData
        });
        
        if (error) {
            return { valid: false, error: error.message || 'File validation failed' };
        }
        
        if (!data || !data.valid) {
            return { valid: false, error: data?.error || 'File validation failed' };
        }
        
        return { valid: true };
    } catch (err) {
        console.error('Edge Function validation error:', err);
        // If Edge Function fails, fall back to client-side validation
        return { valid: true }; // Allow upload to proceed (RLS will catch invalid files)
    }
}
```

### Step 2: Update upload functions

Modify `handleProfilePhotoUpload`, `handleBackgroundImageUpload`, `handleQRLogoUpload`, and `handleFileUpload` to call the Edge Function:

```javascript
// Example for handleProfilePhotoUpload
async function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 1. Client-side validation (fast, immediate feedback)
    const clientValidation = validateImageFile(file, 5);
    if (!clientValidation.valid) {
        showMessage(clientValidation.error, 'error');
        event.target.value = '';
        return;
    }
    
    // 2. Edge Function validation (magic numbers, dimensions)
    const edgeValidation = await validateFileWithEdgeFunction(file, 'profile-photos');
    if (!edgeValidation.valid) {
        showMessage(edgeValidation.error, 'error');
        event.target.value = '';
        return;
    }
    
    // 3. Proceed with upload (RLS policies will also validate)
    // ... rest of upload code
}
```

---

## Recommendation

### Option 1: Keep it as-is (Recommended for now)
- ✅ RLS policies provide sufficient server-side protection
- ✅ Client-side validation provides good UX
- ✅ No extra API calls (faster uploads)
- ✅ Simpler codebase

**Action:** Do nothing. The Edge Function is deployed but not used. RLS policies protect you.

### Option 2: Integrate it (For maximum security)
- ✅ Adds magic number validation
- ✅ Adds dimension checks
- ⚠️ Adds extra API call (slightly slower)
- ⚠️ Requires code changes

**Action:** Integrate the Edge Function into upload functions (see steps above).

---

## Current Protection Layers

Even without calling the Edge Function, you have:

1. **Client-Side** ✅
   - File type validation
   - File size validation
   - Extension validation
   - Immediate user feedback

2. **Server-Side (RLS)** ✅
   - File extension validation
   - MIME type validation
   - File size limits
   - Authentication checks

3. **Infrastructure** ✅
   - Storage bucket size limits
   - Supabase infrastructure protection

4. **Edge Function** ⚠️ (Optional)
   - Magic number validation
   - Image dimension validation

---

## Conclusion

**You don't need to do anything** - the Edge Function is optional. Your current setup (client-side + RLS policies) provides good security.

If you want **maximum security**, integrate the Edge Function for magic number and dimension validation.

