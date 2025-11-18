# How to Add Security Headers - Step by Step

This guide shows you how to add security headers to your application based on your hosting platform.

---

## Step 1: Identify Your Hosting Platform

Check which hosting platform you're using:
- **Netlify** - Use `netlify.toml` or `_headers` file
- **Vercel** - Use `vercel.json`
- **Cloudflare Pages** - Use `_headers` file
- **Apache** - Use `.htaccess` file
- **Nginx** - Use server configuration

---

## Step 2: Choose Your Platform and Follow Instructions

### Option A: Netlify

**File Created:** `netlify.toml` ✅

**What to do:**
1. The `netlify.toml` file has been created in your project root
2. **Deploy to Netlify:**
   - Push the file to your Git repository
   - Netlify will automatically use the configuration
   - Or manually deploy via Netlify Dashboard

**That's it!** Netlify will automatically apply the headers.

---

### Option B: Vercel

**File Created:** `vercel.json` ✅

**What to do:**
1. The `vercel.json` file has been created in your project root
2. **Deploy to Vercel:**
   - Push the file to your Git repository
   - Vercel will automatically use the configuration
   - Or redeploy via Vercel Dashboard

**That's it!** Vercel will automatically apply the headers.

---

### Option C: Cloudflare Pages

**File Created:** `_headers` ✅

**What to do:**
1. The `_headers` file has been created in your project root
2. **Deploy to Cloudflare Pages:**
   - Push the file to your Git repository
   - Cloudflare Pages will automatically use the headers file
   - Or upload via Cloudflare Dashboard

**That's it!** Cloudflare Pages will automatically apply the headers.

---

### Option D: Apache (.htaccess)

**File Created:** Updated `.htaccess` ✅

**What to do:**
1. The `.htaccess` file has been updated with security headers
2. **Upload to your server:**
   - Upload the `.htaccess` file to your web root directory
   - Make sure Apache has `mod_headers` enabled
   - Test that headers are working

**Verify:**
```bash
curl -I https://academiqr.com
```

You should see the security headers in the response.

---

### Option E: Nginx

**File Created:** `nginx-security-headers.conf` ✅

**What to do:**
1. The `nginx-security-headers.conf` file has been created
2. **Add to your Nginx configuration:**
   - Copy the contents of `nginx-security-headers.conf`
   - Add to your server block in `/etc/nginx/sites-available/your-site`
   - Reload Nginx: `sudo nginx -t && sudo systemctl reload nginx`

**Verify:**
```bash
curl -I https://academiqr.com
```

---

## Step 3: Verify Headers Are Working

### Test Your Headers

**Option 1: Browser Developer Tools**
1. Open your website: `https://academiqr.com`
2. Open Developer Tools (F12)
3. Go to **Network** tab
4. Refresh the page
5. Click on the main request (usually `index.html`)
6. Go to **Headers** tab
7. Look for **Response Headers**
8. You should see:
   - `X-Frame-Options: DENY`
   - `Content-Security-Policy: ...`
   - `Strict-Transport-Security: ...`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: no-referrer`

**Option 2: Command Line (curl)**
```bash
curl -I https://academiqr.com
```

**Option 3: Online Tool**
- Visit: https://securityheaders.com/
- Enter your domain: `academiqr.com`
- Check your security score

---

## What Headers Are Being Added?

### 1. X-Frame-Options: DENY
- **Purpose:** Prevents clickjacking attacks
- **Effect:** Your site cannot be embedded in iframes

### 2. Content-Security-Policy
- **Purpose:** Prevents XSS attacks
- **Effect:** Controls which resources can be loaded
- **Allows:**
  - Scripts from your domain and CDNs (jsdelivr, cdnjs)
  - Styles from your domain and CDNs
  - Images from your domain, Supabase, and data URLs
  - Connections to Supabase and your domain
  - Fonts from CDNs

### 3. Strict-Transport-Security (HSTS)
- **Purpose:** Forces HTTPS connections
- **Effect:** Browsers will only connect via HTTPS for 1 year
- **Includes:** All subdomains

### 4. X-Content-Type-Options: nosniff
- **Purpose:** Prevents MIME type sniffing
- **Effect:** Browsers won't guess file types

### 5. Referrer-Policy: no-referrer
- **Purpose:** Prevents referrer information leakage
- **Effect:** No referrer information sent to external sites

### 6. Permissions-Policy
- **Purpose:** Disables unnecessary browser features
- **Effect:** Geolocation, camera, microphone, etc. are disabled

---

## Troubleshooting

### Problem: Headers Not Showing Up

**Solution:**
1. **Clear browser cache** and try again
2. **Check file location:** Make sure the config file is in the root directory
3. **Verify deployment:** Make sure the file was deployed
4. **Check hosting platform:** Some platforms require specific file names

### Problem: CSP Blocking Resources

**Solution:**
1. Check browser console for CSP violations
2. Add the blocked resource to the CSP policy
3. Update the config file and redeploy

### Problem: Site Not Loading After Adding Headers

**Solution:**
1. **Check CSP policy:** Make sure all required resources are allowed
2. **Check browser console:** Look for CSP violation errors
3. **Temporarily remove CSP:** Test with just other headers first
4. **Gradually add CSP rules:** Add one at a time to identify issues

---

## Quick Reference

### Files Created:
- ✅ `netlify.toml` - For Netlify hosting
- ✅ `vercel.json` - For Vercel hosting
- ✅ `_headers` - For Netlify/Cloudflare Pages
- ✅ `.htaccess` - For Apache (updated)
- ✅ `nginx-security-headers.conf` - For Nginx

### Which File to Use:
- **Netlify:** Use `netlify.toml` (preferred) or `_headers`
- **Vercel:** Use `vercel.json`
- **Cloudflare Pages:** Use `_headers`
- **Apache:** Use `.htaccess`
- **Nginx:** Use `nginx-security-headers.conf`

---

## Next Steps

1. ✅ **Choose your hosting platform** from the options above
2. ✅ **Deploy the appropriate config file**
3. ✅ **Verify headers are working** using the test methods above
4. ✅ **Test your site** to make sure everything still works
5. ✅ **Check security score** at https://securityheaders.com/

---

## Need Help?

If you're not sure which platform you're using:
1. Check your domain's DNS settings
2. Check where you deployed the site
3. Look for hosting provider emails/documentation
4. Check your Git repository for deployment configs

Once you know your platform, follow the instructions for that platform above.

