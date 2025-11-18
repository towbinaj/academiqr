# Fix Dependency Security Issues

## Issues Found

1. ⚠️ **Missing SRI hashes** for CDN scripts (Supabase JS, QRCode.js, qrcode-generator)
2. ⚠️ **Unpinned Supabase version** in CDN URL
3. ⚠️ **Outdated npm dependencies** (Supabase JS can be updated)

## Fixes Applied

### 1. Pinned npm Dependencies ✅

Updated `package.json`:
- `@supabase/supabase-js`: `^2.45.4` → `2.75.1` (pinned to current installed version)
- `vite`: `^5.0.0` → `5.4.21` (pinned to current installed version)

**Note:** The vite/esbuild vulnerability is development-only and low risk. Update to vite 7.x when convenient.

---

## 2. Add SRI Hashes to CDN Scripts

### How to Get SRI Hashes

**Option 1: Online Tool (Easiest)**
1. Visit: https://www.srihash.org/
2. Paste the CDN URL
3. Copy the generated hash
4. Use format: `sha384-...`

**Option 2: Command Line (if SSL works)**
```bash
curl -s https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/index.umd.js | openssl dgst -sha384 -binary | openssl base64 -A
```

### Resources to Update

1. **Supabase JS**
   - Current: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
   - Should be: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.1/dist/index.umd.js`
   - Add: `integrity="sha384-..."` and `crossorigin="anonymous"`

2. **QRCode.js**
   - Current: `https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js`
   - Add: `integrity="sha384-..."` and `crossorigin="anonymous"`

3. **qrcode-generator**
   - Current: `https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js`
   - Add: `integrity="sha384-..."` and `crossorigin="anonymous"`

---

## 3. Update HTML Script Tags

### Before:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"></script>
```

### After (with SRI):
```html
<script 
  src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.1/dist/index.umd.js"
  integrity="sha384-..." 
  crossorigin="anonymous">
</script>
<script 
  src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
  integrity="sha384-..." 
  crossorigin="anonymous">
</script>
<script 
  src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js"
  integrity="sha384-..." 
  crossorigin="anonymous">
</script>
```

---

## 4. Quick Steps to Complete

1. **Get SRI hashes:**
   - Go to https://www.srihash.org/
   - For each script URL, generate SHA384 hash
   - Copy the hash (format: `sha384-...`)

2. **Update index.html:**
   - Find each script tag (lines 4734, 4736, 4738)
   - Add `integrity="sha384-..."` attribute
   - Add `crossorigin="anonymous"` attribute
   - Update Supabase URL to use specific version

3. **Test:**
   - Load the page
   - Check browser console for SRI errors
   - Verify all scripts load correctly

---

## 5. Update npm Dependencies (Optional)

To update to latest versions:

```bash
# Update Supabase JS
npm install @supabase/supabase-js@latest

# Update vite (may have breaking changes)
npm install vite@latest
```

**Note:** Test thoroughly after updating, especially vite as it's a major version update.

---

## Status

✅ **Completed:**
- Pinned npm dependency versions

⏳ **Pending:**
- Add SRI hashes to CDN scripts (manual step required)
- Pin Supabase version in CDN URL

---

## Security Benefits

✅ **SRI Protection:** Prevents CDN compromise from injecting malicious code
✅ **Version Pinning:** Prevents unexpected breaking changes
✅ **Regular Updates:** Keep dependencies up to date for security patches

