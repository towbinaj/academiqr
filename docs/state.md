# AcademiQR v1.0 — Project State

*Last updated: 2026-03-21*

## Current Version

**v1.0** — Stable, deployed to production at `academiqr.com`

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
- Passkey-protected collections
- Rate-limited authentication (5 attempts/hour)

### Pages
- Login/Register (`/`)
- Dashboard (`/src/pages/dashboard.html`)
- Collection Editor (`/src/pages/editor.html`)
- Link Library (`/src/pages/library.html`)
- Profile Settings (`/src/pages/profile.html`)
- Public Collection View (`/public.html`, `/u/{username}/{slug}`)
- Privacy Policy, Terms of Service, 404

## Known Issues

1. **Auto-save captures stale form values** — Auto-save doesn't track dirty fields, so it can persist values the user hasn't intentionally changed.
2. ~~No save state indicator~~ — Fixed in v1.1
3. ~~Library has no pagination~~ — Fixed in v1.1
4. ~~Editor not mobile-optimized~~ — Fixed in v1.1

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

## Feature Backlog (Recommendations)

### Completed in v1.1
- [x] Save state indicator (saved/unsaved badge in editor and profile)
- [x] Empty states with onboarding prompts for new users
- [x] Mobile-responsive editor layout
- [x] Library pagination (load-more, 25 per page)
- [x] Unified toast notification system for errors and success
- [x] Logo display fix (cached image handling + dark mode invert)

### Already Implemented (previously miscategorized as missing)
- [x] Drag-and-drop link reordering in editor (native HTML5 drag-and-drop)
- [x] QR code customization (colors, borders, logo overlay, PNG/JPEG/SVG export, saved themes)
- [x] Collection duplication/cloning (duplicate button on cards, copies all links)
- [x] Dashboard collection reordering (drag-and-drop via SortableJS)

### Remaining Backlog
- [ ] Dashboard sort dropdown (alphabetical, date, link count — beyond drag-and-drop)
- [ ] Link URL preview (Open Graph metadata fetch when adding links)
- [ ] Bulk link import (CSV/Excel)
- [ ] Analytics date range filtering and click-through rates
- [ ] Undo/redo in editor
- [ ] Accessibility audit (ARIA labels, screen reader support)
