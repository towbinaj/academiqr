---
paths:
  - "dist/**"
  - "vite.config.js"
  - ".cpanel.yml"
  - ".htaccess"
  - ".github/workflows/**"
---
# Deployment Rules

- Deploy via PR → CI → merge to `main`; GitHub Actions rebuilds from source and FTPs to cPanel. Run `npm run check` before pushing
- Always run `npm run build` before committing dist/ changes
- Edit `public/.htaccess` (the source; the build copies it to dist/). Understand the rewrite rules and security headers first
- FTP credentials are stored as GitHub repo secrets (FTP_HOST, FTP_USERNAME, FTP_PASSWORD)
- Cache busting relies on Vite's content-hashed filenames in assets/
- The deploy workflow (`.github/workflows/deploy.yml`) runs on every push to `main` (docs/migrations/markdown ignored); CI (`ci.yml`) runs on PRs and fails if dist/ is stale
