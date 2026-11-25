# AcademiQR — Deployment Guide

*Last updated: 2026-11-25*

## How to Deploy

Open a pull request and merge it to `main`. Before pushing, run:

```bash
npm run check
```

(unit tests + build; fails if dist/ changed and needs committing). Then commit dist/ along with your source changes.

The PR flow: CI (`.github/workflows/ci.yml`) builds the site, checks PHP syntax, audits production dependencies, and fails if the committed dist/ doesn't match a fresh build. Merging to `main` deploys.

## How It Works

1. `npm run build` — Vite builds src/ into dist/ with hashed filenames
2. `git add dist/ && git commit` — commits the built files with the source change
3. Open a PR → CI passes → merge to `main`
4. GitHub Actions (`.github/workflows/deploy.yml`) — runs `npm ci && npm run build` (Node 22), checks PHP syntax, then FTPs the **fresh build** in dist/ to public_html/ via the `deploy@academiqr.com` FTP account. If the committed dist/ was stale it logs a warning but still deploys the fresh build.

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

- `dist/` is committed to git — the FTP deploy builds from source, but the `.cpanel.yml` fallback copies the committed dist/
- Never modify `dist/.htaccess` without understanding the Apache rewrite rules and security headers
- The `.cpanel.yml` deployment script copies dist/* to public_html/ (still works as a fallback)
