# AcademiQR v1.1 — Project State

*Last updated: 2026-03-22*

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
- Collection templates for quick creation
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

## Infrastructure

- **Hosting**: GoDaddy cPanel
- **Backend**: Supabase (project: `natzpfyxpuycsuuzbqrd`)
- **Repo**: `github.com/towbinaj/academiqr` (public, branch `v1.0`)
- **Deploy path**: `dist/` → cPanel Git pull → `.cpanel.yml` copies to `public_html/`
- **Backups**: Weekly automated pg_dump via launchd (local, 30-day rotation)

## Feature Backlog

- [ ] Dashboard sort dropdown (alphabetical, date, link count — beyond drag-and-drop)
- [ ] Link URL preview (Open Graph metadata fetch when adding links)
- [ ] Bulk link import (CSV/Excel)
- [ ] Analytics date range filtering and click-through rates
- [ ] Undo/redo in editor
- [ ] Accessibility audit (ARIA labels, screen reader support)
- [ ] Global tag management (bulk remove a tag across all items)
