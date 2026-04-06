# AcademiQR v1.1 — Project State

*Last updated: 2026-04-05*

## Current Version

**v1.1** — Stable, deployed to production at `academiqr.com`

## What's Shipped

### Core Features
- Email/password + Google OAuth authentication
- Collection CRUD with themed public pages
- Link library with reusable links across collections
- Per-collection link overrides (custom title/image per collection)
- QR code generation per collection
- Short URLs: `academiqr.com/u/{username}/{slug}`
- Analytics: page views and link clicks per collection
- Profile settings: photo, display name, username, social links (8 platforms)
- Data export: JSON, Excel (XLSX), CSV
- Account deletion with full data cleanup
- Dark/light mode toggle
- PWA with service worker (offline asset caching)
- Passkey-protected collections (plain-text access codes for presentation sharing)
- Rate-limited authentication (5 attempts/hour)
- Drag-and-drop link reordering in editor (native HTML5)
- Drag-and-drop collection reordering on dashboard (SortableJS)
- QR code customization (colors, borders, logo overlay, PNG/JPEG/SVG export, saved themes)
- Collection duplication/cloning

### v1.1 Additions
- Tags on collections and links (add, remove, autocomplete, filter dashboard by tag)
- Save state indicator (saved/unsaved badge in editor and profile)
- Empty states with onboarding prompts for new users
- Mobile-responsive editor layout with bottom tab bar
- Library pagination (load-more, 25 per page)
- Unified toast notification system (replaces alerts)
- Logo display fix (cached image handling + dark mode invert)
- Library tag column with inline tag management
- Dashboard tag filtering (click tag to filter, disable drag-and-drop while filtered)
- Console.log cleanup for production
- Landing page with hero, feature cards, how-it-works, CTA
- SEO: robots.txt, llms.txt, dynamic sitemap (PHP), SSR for search engines, JSON-LD, OG tags
- Social links: website, Google Scholar, ORCID, ResearchGate (with drag-and-drop reordering)
- Font Awesome deferred loading, logo preload
- Database backup script (weekly pg_dump via launchd)

### v1.1 Bug Fixes (2026-04-05)
- New Collection skips template modal — goes straight to editor
- New collections appear at top of dashboard (not bottom)
- Removed unused template system (modal, TEMPLATES array, CSS)
- Image URL text input now triggers save and preview update
- Image upload resolution increased to 2000x2000 for better positioning
- Image position/scale uses `object-position` instead of CSS transforms
- Scale < 100 shows full image (`object-fit: contain`), >= 100 crops (`cover`)
- Image positioning applied consistently across sidebar, editor preview, phone preview, and public page
- Public page uses `100dvh` to account for mobile browser toolbars
- Public page frame accounts for padding in viewport height calculation

### Pages
- Login/Register (`/`)
- Dashboard (`/src/pages/dashboard.html`)
- Collection Editor (`/src/pages/editor.html`)
- Link Library (`/src/pages/library.html`)
- Profile Settings (`/src/pages/profile.html`)
- Public Collection View (`/public.html`, `/u/{username}/{slug}`)
- Privacy Policy, Terms of Service, 404

## Known Issues

1. **Auto-save captures stale form values** — Auto-save doesn't track dirty fields, so it can persist values the user hasn't intentionally changed. Planned fix for v1.2.

## Database Migrations Applied

| Migration | Description |
|-----------|-------------|
| `add_username.sql` | Added `username` column to profiles with unique index |
| `add_link_library_defaults.sql` | Added `source_link_id` and `use_library_defaults` to link_items |
| `add_custom_overrides.sql` | Added `custom_overrides` JSONB to link_items |
| `clean_stale_background_images.sql` | Cleanup: removed backgroundImage from theme when backgroundType != 'image' |
| Social links columns | Added social_website, social_google_scholar, social_orcid, social_researchgate to profiles |

## Infrastructure

- **Hosting**: GoDaddy cPanel
- **Backend**: Supabase (project: `natzpfyxpuycsuuzbqrd`)
- **Repo**: `github.com/towbinaj/academiqr` (public, branch `v1.1`)
- **Deploy**: `npm run deploy` → GitHub Actions FTPs dist/ to public_html/ automatically
- **Domains**: `academiqr.com` (primary), `academiqr.net` (301 redirect)
- **Backups**: Weekly automated pg_dump via launchd (local, 30-day rotation)

## Feature Backlog

- [ ] Dashboard sort dropdown (alphabetical, date, link count — beyond drag-and-drop)
- [ ] Link URL preview (Open Graph metadata fetch when adding links)
- [ ] Bulk link import (CSV/Excel)
- [ ] Analytics date range filtering and click-through rates
- [ ] Undo/redo in editor
- [ ] Accessibility audit (ARIA labels, screen reader support)
- [ ] Global tag management (bulk remove a tag across all items)
