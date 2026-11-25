# AcademiQR — Deployment Guide

*Last updated: 2026-11-25*

## How to Deploy

Open a pull request and merge it to `main`. Before pushing, run:

```bash
npm run check
```

(unit tests + build + Playwright browser tests). dist/ is build output and is not committed.

The PR flow: CI (`.github/workflows/ci.yml`) audits production dependencies, runs unit tests, builds the site, checks PHP syntax, and runs the browser tests against the build (Supabase mocked). Merging to `main` deploys.

## How It Works

1. Commit source changes (not dist/) and open a PR
2. CI passes → merge to `main`
3. GitHub Actions (`.github/workflows/deploy.yml`) — runs `npm ci`, unit tests, `npm run build` (Node 22), checks PHP syntax, then FTPs dist/ to public_html/ via the `deploy@academiqr.com` FTP account.

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
1. GitHub > Actions > Deploy to Production > re-run the failed run, or "Run workflow" on `main`
2. Last resort: locally `npm ci && npm run build` (with the `VITE_SUPABASE_*` values from deploy.yml in `.env.local`), then upload dist/ (including `.htaccess`) to public_html/ with cPanel File Manager or FTP

(The old cPanel Git Version Control "Deploy HEAD Commit" path relied on a committed dist/ and `.cpanel.yml`; both were removed in Nov 2026.)

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

- `dist/` is not committed — GitHub Actions builds it on every deploy
- Edit `public/.htaccess` (the build copies it to dist/), and understand the Apache rewrite rules and security headers first
- Dependencies are kept current by Dependabot (`.github/dependabot.yml`): weekly grouped PRs, checked by CI
