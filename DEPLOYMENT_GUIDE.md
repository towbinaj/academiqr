# AcademiQR v1.0 — cPanel Deployment from GitHub

## Current State
- Code is on GitHub: `https://github.com/towbinaj/academiqr.git` (public repo)
- Branch: `v1.0` (all v1.0 code is here, up to date)
- cPanel repo already cloned at: `/home/qoko1x26iit9/repositories/academiqr/`
- The `dist/` folder contains the built production files
- GoDaddy cPanel hosting

## What's Done
1. Made GitHub repo public
2. Cloned repo in cPanel Git Version Control
3. Confirmed `dist/` folder exists in the cloned repo

## What's Left

### Step 1: Switch to v1.0 branch (if not already)
In cPanel → Git Version Control → Manage the `academiqr` repo:
- Check the Branch dropdown — make sure it's on `v1.0`
- If it's on `main`, switch to `v1.0`
- Click "Update from Remote"

### Step 2: Create auto-deploy config
In cPanel → File Manager, navigate to:
`/home/qoko1x26iit9/repositories/academiqr/`

Create a new file called `.cpanel.yml` with this content:

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/qoko1x26iit9/public_html/
    - /bin/cp -R dist/* $DEPLOYPATH
```

### Step 3: Deploy
In cPanel → Git Version Control → Manage repo:
- Click "Update from Remote" (pulls latest from GitHub)
- Click "Deploy HEAD Commit" (copies dist/ to public_html/)

### Step 4: Verify
- Visit https://academiqr.com — should show the v1.0 site
- Old QR codes should still work (they use ?user=xxx&collection=xxx format)

## Future Deployments
After pushing new code to GitHub v1.0 branch:
1. Build locally: `npx vite build` (creates/updates dist/)
2. Commit and push: `git add dist/ && git commit -m "Build" && git push`
3. In cPanel Git Version Control: "Update from Remote" → "Deploy HEAD Commit"

## Important Notes
- The `dist/` folder IS committed to git (needed for cPanel deployment)
- `public_html/` is the live site — deployment copies dist/* there
- Old v0.6.7 files in public_html will be overwritten
- Back up public_html first if you want to keep v0.6.7: rename it to `public_html_v067_backup` in File Manager

## Server Details
- Hosting: GoDaddy cPanel
- Home dir: `/home/qoko1x26iit9/`
- Document root: `/home/qoko1x26iit9/public_html/`
- Repo path: `/home/qoko1x26iit9/repositories/academiqr/`
- Supabase project: `natzpfyxpuycsuuzbqrd`

## .htaccess (needs to be in public_html)
Make sure this file exists in public_html for security headers and URL rewriting:

```apache
# Security Headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "DENY"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"

# Short URL rewrite: /u/username/slug → /public.html?username=X&slug=Y
RewriteEngine On
RewriteRule ^u/([^/]+)/([^/]+)/?$ /public.html?username=$1&slug=$2 [L,QSA]

# SPA fallback for clean URLs
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```
