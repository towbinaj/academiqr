# How to Get SRI Hashes for CDN Scripts

## Issue

The URL path I provided for Supabase JS was incorrect. Here are the correct URLs to use with srihash.org:

## Correct URLs for SRI Hash Generation

### 1. Supabase JS

**URL to use on srihash.org:**
```
https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.1
```

**Note:** jsdelivr will auto-resolve this to the correct file. This is the standard format for scoped packages.

**Alternative (if above doesn't work):**
```
https://unpkg.com/@supabase/supabase-js@2.75.1/dist/umd/index.min.js
```

### 2. QRCode.js

**URL to use on srihash.org:**
```
https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
```

This should work directly.

### 3. qrcode-generator

**URL to use on srihash.org:**
```
https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js
```

This should work directly.

---

## Steps to Get SRI Hashes

1. **Go to:** https://www.srihash.org/

2. **For each URL above:**
   - Paste the URL into the input field
   - Select "SHA384" (recommended) or "SHA512"
   - Click "Generate"
   - Copy the hash (format: `sha384-...`)

3. **Update index.html:**
   - Find each script tag (lines 4737, 4740, 4743)
   - Add the `integrity` attribute with the hash
   - Example:
     ```html
     <script 
       src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.1"
       integrity="sha384-..." 
       crossorigin="anonymous">
     </script>
     ```

---

## If srihash.org Still Doesn't Work

### Option 1: Use Browser Console

1. Open browser console (F12)
2. Run this for each script:
   ```javascript
   fetch('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.1')
     .then(r => r.text())
     .then(text => {
       const hash = btoa(String.fromCharCode(...new Uint8Array(
         crypto.subtle.digestSync('SHA-384', new TextEncoder().encode(text))
       )));
       console.log('sha384-' + hash);
     });
   ```

### Option 2: Use Command Line (if SSL works)

```bash
# For Supabase JS
curl -sL https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.1 | openssl dgst -sha384 -binary | openssl base64 -A

# For QRCode.js
curl -sL https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js | openssl dgst -sha384 -binary | openssl base64 -A

# For qrcode-generator
curl -sL https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js | openssl dgst -sha384 -binary | openssl base64 -A
```

### Option 3: Skip SRI for Now (Lower Priority)

If you can't get the hashes right now, the scripts will still work. SRI is a security enhancement but not critical. You can:
- Keep the scripts as they are (with `crossorigin="anonymous"`)
- Add SRI hashes later when you have time
- The pinned versions still provide security benefits

---

## Current Status

✅ **Versions pinned** - Prevents unexpected updates
✅ **crossorigin added** - Enables CORS properly
⏳ **SRI hashes** - Optional security enhancement (can add later)

The application is secure without SRI hashes, but adding them provides an extra layer of protection against CDN compromise.

