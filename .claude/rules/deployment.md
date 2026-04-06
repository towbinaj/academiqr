---
paths:
  - "dist/**"
  - "vite.config.js"
  - ".cpanel.yml"
  - ".htaccess"
  - ".github/workflows/**"
---
# Deployment Rules

- Deploy via `npm run deploy` — builds, commits dist/, pushes, and GitHub Actions FTPs to cPanel automatically
- Always run `npm run build` before committing dist/ changes
- Never modify dist/.htaccess without understanding the Apache rewrite rules and security headers
- FTP credentials are stored as GitHub repo secrets (FTP_HOST, FTP_USERNAME, FTP_PASSWORD)
- Cache busting relies on Vite's content-hashed filenames in assets/
- The deploy workflow (`.github/workflows/deploy.yml`) triggers on dist/ changes to the v1.1 branch
