# AcademiQR — Deployment Guide

*Last updated: 2026-04-05*

## Deploy Command

```bash
npm run deploy
```

This single command: builds dist/ → commits → pushes to GitHub → GitHub Actions FTPs to cPanel automatically.

## How It Works

1. `npm run build` — Vite builds src/ into dist/ with hashed filenames
2. `git add dist/ && git commit` — commits the built files
3. `git push` — pushes to GitHub (branch: v1.1)
4. GitHub Actions (`.github/workflows/deploy.yml`) — FTPs dist/ to public_html/ via the `deploy@academiqr.com` FTP account

No manual steps in cPanel are needed.

## FTP Credentials

Stored as GitHub repository secrets (Settings > Secrets > Actions):
- `FTP_HOST` — cPanel server hostname
- `FTP_USERNAME` — `deploy@academiqr.com`
- `FTP_PASSWORD` — password for the deploy FTP account

The FTP account was created in cPanel > Files > FTP Accounts with access limited to `/home/qoko1x26iit9/public_html/`.

## Domains

| Domain | Purpose |
|--------|---------|
| `academiqr.com` | Primary site (GoDaddy cPanel) |
| `academiqr.net` | 301 redirect to academiqr.com (GoDaddy DNS forwarding) |
| `www.academiqr.net` | 301 redirect to academiqr.com (GoDaddy DNS forwarding) |

## Manual Deploy (Fallback)

If GitHub Actions fails (FTP timeout, etc.):
1. Go to GitHub > Actions tab > re-run the failed workflow
2. Or: cPanel > Git Version Control > Update from Remote > Deploy HEAD Commit

## Server Details

- **Hosting**: GoDaddy cPanel
- **Home dir**: `/home/qoko1x26iit9/`
- **Document root**: `/home/qoko1x26iit9/public_html/`
- **Git repo path**: `/home/qoko1x26iit9/repositories/academiqr-v1/`
- **Supabase project**: `natzpfyxpuycsuuzbqrd`
- **Branch**: `v1.1`

## Caching

- **Hashed assets** (JS/CSS in assets/): cached 1 year — new builds get new filenames automatically
- **HTML pages**: no cache (expires immediately)
- **Service Worker**: cache-first for static assets, network-first for HTML

## Important Notes

- `dist/` is committed to git — required for both cPanel and FTP deploy
- Never modify `dist/.htaccess` without understanding the Apache rewrite rules and security headers
- The `.cpanel.yml` deployment script copies dist/* to public_html/ (still works as a fallback)
