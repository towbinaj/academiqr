# Deploy File Upload Validation Edge Function

This guide shows you how to deploy the `validate-file-upload` Edge Function to Supabase.

---

## Option 1: Using Supabase Dashboard Editor (Easiest)

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar

### Step 2: Deploy via Editor
1. You'll see options: **"via editor"**, **"via CLI"**, or **"via AI assistant"**
2. Click **"via editor"** (or **"Deploy via editor"**)
3. Create a new function named: `validate-file-upload`
   - If prompted, enter the function name: `validate-file-upload`

### Step 3: Copy Function Code
1. Open the file: `supabase/functions/validate-file-upload/index.ts`
2. Copy **ALL** the code (Ctrl+A, Ctrl+C)
3. Paste it into the Supabase Dashboard code editor
4. Click **"Deploy"** or **"Save"**

### Step 4: Verify Deployment
1. You should see a success message
2. The function will appear in your Edge Functions list
3. Note the function URL (you'll see it in the dashboard)

---

## Option 2: Using Supabase CLI (Recommended for Development)

### Prerequisites
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Supabase Dashboard → Settings → General)

### Deploy the Function
1. Navigate to your project root:
   ```bash
   cd c:\Users\TOWMJ2\webdev
   ```

2. Deploy the function:
   ```bash
   supabase functions deploy validate-file-upload
   ```

3. Verify deployment:
   ```bash
   supabase functions list
   ```

---

## Option 3: Using Supabase CLI (One-Time Setup)

If you haven't set up Supabase CLI yet:

### Install Supabase CLI
```bash
npm install -g supabase
```

### Login
```bash
supabase login
```
This will open your browser to authenticate.

### Link Your Project
1. Get your project reference ID:
   - Go to Supabase Dashboard
   - Settings → General
   - Copy "Reference ID"

2. Link the project:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

### Deploy
```bash
supabase functions deploy validate-file-upload
```

---

## Verify the Function is Working

### Test the Function
You can test it using curl or from your browser console:

```javascript
// Test from browser console (on your site)
const testFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
const formData = new FormData();
formData.append('file', testFile);
formData.append('bucketId', 'profile-photos');
formData.append('fileName', 'test.jpg');

const { data, error } = await supabaseClient.functions.invoke('validate-file-upload', {
  body: formData
});

console.log(data, error);
```

### Expected Response (Success)
```json
{
  "valid": true,
  "message": "File validation passed",
  "fileSize": 1234,
  "mimeType": "image/jpeg",
  "detectedType": "image/jpeg"
}
```

### Expected Response (Error)
```json
{
  "error": "File too large. Maximum size: 5MB"
}
```

---

## Function URL

After deployment, your function will be available at:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/validate-file-upload
```

You can find this URL in:
- Supabase Dashboard → Edge Functions → validate-file-upload → Settings

---

## Important Notes

### 1. Function is Optional
The Edge Function provides **additional** content validation (magic numbers, dimensions).
The **RLS policies** in `file-upload-security-policies.sql` already provide strong protection.

**You can use either:**
- ✅ RLS policies only (sufficient for most cases)
- ✅ RLS policies + Edge Function (maximum security)

### 2. When to Use the Edge Function
Use the Edge Function if you want:
- Magic number validation (detect file type spoofing)
- Image dimension validation
- Pre-upload validation (before file reaches storage)

### 3. Integration
If you want to use the Edge Function in your code, update your upload functions to call it first:

```javascript
// Example: Validate before upload
async function uploadFileWithValidation(file, bucketId, path) {
  // Step 1: Validate with Edge Function
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucketId', bucketId);
  formData.append('fileName', file.name);
  
  const { data: validation, error: validationError } = await supabaseClient.functions.invoke(
    'validate-file-upload',
    { body: formData }
  );
  
  if (validationError || !validation.valid) {
    throw new Error(validation.error || 'File validation failed');
  }
  
  // Step 2: Upload to storage (RLS policies will also validate)
  const { data, error } = await supabaseClient.storage
    .from(bucketId)
    .upload(path, file);
  
  if (error) throw error;
  return data;
}
```

---

## Troubleshooting

### Error: "Function not found"
- Make sure you deployed the function
- Check the function name is exactly `validate-file-upload`
- Verify you're using the correct project

### Error: "Unauthorized"
- Make sure you're passing the auth token:
  ```javascript
  const { data } = await supabaseClient.functions.invoke('validate-file-upload', {
    body: formData,
    headers: {
      Authorization: `Bearer ${supabaseClient.supabaseKey}`
    }
  });
  ```

### Error: "Module not found"
- Make sure all imports are correct
- Check Deno version compatibility (Supabase uses Deno runtime)

### Function Not Deploying
- Check Supabase CLI is up to date: `supabase --version`
- Try redeploying: `supabase functions deploy validate-file-upload --no-verify-jwt`

---

## Next Steps

1. ✅ Deploy the function (choose one method above)
2. ✅ Test the function (use the test code above)
3. ✅ (Optional) Integrate into your upload code
4. ✅ Verify RLS policies are also deployed (`file-upload-security-policies.sql`)

---

## Quick Reference

**Function Name:** `validate-file-upload`  
**Location:** `supabase/functions/validate-file-upload/index.ts`  
**Purpose:** Validate file uploads server-side (magic numbers, dimensions, size)  
**Required:** Optional (RLS policies provide primary protection)

---

**Status:** Ready to deploy  
**Priority:** Optional enhancement (RLS policies are sufficient)

