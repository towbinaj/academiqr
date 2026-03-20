# AcademiQR v1.0 — Project State

## Project Info
- **Version**: 1.0.0-beta.1
- **Folder**: C:\Users\TOWMJ2\academiqr-v1
- **Branch**: v1.0-dev
- **Remote**: https://github.com/towbinaj/academiqr.git
- **Live site (v0.6.7)**: https://academiqr.com (separate codebase in C:\Users\TOWMJ2\webdev)
- **Supabase project**: natzpfyxpuycsuuzbqrd

## Current Phase
- Phase 2: Feature Complete — **IN PROGRESS**
- Core features built, pre-launch hardening needed

## What's Done

### Core Pages
- [x] Login/signup with Google OAuth + email/password
- [x] Dashboard — collection cards grid with search and drag-and-drop reorder (SortableJS)
- [x] Editor — full collection editor with Collection, Appearance, QR Code, Analytics tabs
- [x] Link Library — master list with search, sort (8 options), clickable column headers, inline active toggle, edit modal with image controls, add-to-collection flow
- [x] Profile — display name, profile photo, social links, account deletion
- [x] Public page — themed link page rendered from QR scan or direct URL

### Link Management
- [x] Per-collection link overrides (use library version vs customize for this collection)
- [x] source_link_id + use_library_defaults + custom_overrides system
- [x] Add Existing Link from library to collection (creates synced copy)
- [x] Add to Collection from library page
- [x] Link active/inactive toggle (sidebar + library)

### Image System
- [x] Client-side compression via canvas API (no npm deps)
- [x] Upload to Supabase Storage (`link-images` bucket, public)
- [x] Compress + upload for: link images (800px), backgrounds (1920px), profile photos (400px)
- [x] Media Library — browse/reuse uploaded images from modal
- [x] Upload + Browse buttons on: editor link form, new link modal, background image, library edit modal, profile photo

### QR Codes
- [x] QR Code tab with size, color, border, logo overlay, download PNG
- [x] Public URL format: `academiqr.com/public.html?user={12-char-hex}&collection={uuid}`

### Account & GDPR
- [x] Account deletion via Supabase Edge Function (delete-account)
- [x] Deletes: link_clicks, page_views, link_items, link_lists, user_themes, profiles
- [x] Deletes: all uploaded images from Storage
- [x] Deletes: Supabase Auth user record (email freed for re-registration)
- [x] Double confirmation dialog with spinner

### Analytics & Tracking
- [x] Link click tracking with social clicks, session_id, unique visitors
- [x] Link analytics detail — daily views/clicks chart, per-link breakdown

### Custom URLs & OG Tags
- [x] Custom short URLs (username + slug + .htaccess + og.php)
- [x] Open Graph meta tags (client-side + PHP server fallback)
- [x] Collection slug editor with warnings
- [x] Custom 404 page

### User Features
- [x] Dark mode — toggle in nav, system preference, localStorage persist
- [x] Collection templates — 6 templates: blank, conference, workshop, course, research, portfolio
- [x] PWA support — manifest.json, service worker, home screen install
- [x] Bulk operations in library — checkboxes, bulk delete/move/toggle, add to new collection
- [x] Onboarding flow — username setup banner on dashboard
- [x] Username permanence — locked after set
- [x] Password reset flow — forgot password + new password form
- [x] Data export — JSON, Excel, CSV with tooltips
- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Auto-save everywhere — debounced save on all form changes (presentation, settings, links, theme, QR)
- [x] Save status indicators — inline spinner/checkmark on each section
- [x] Back to collection link — "← Back to [collection]" breadcrumb on library page
- [x] Duplicate link detection — count shown in library stats, clickable filter
- [x] Nav renamed — "Dashboard" → "My Collections" across all pages

### Infrastructure
- [x] Vite multi-page build
- [x] Shared modules: supabase.js, auth.js, router.js, link-utils.js, image-utils.js
- [x] Design tokens: variables.css, base.css
- [x] Nav CSS consolidated into base.css
- [x] Edge Function deployed: delete-account

## Pre-Launch Checklist

### 🔴 Critical (must do before launch)
- [ ] **Security review** — RLS policies on all tables, API key exposure, auth flow hardening, CORS config, input sanitization, XSS prevention
- [x] **Data export** — JSON, Excel, CSV with tooltips
- [x] **Privacy Policy page** — linked from signup
- [x] **Terms of Service page** — linked from signup
- [x] **Password reset flow** — forgot password + new password form, working end-to-end
- [ ] **Deploy to production** — Netlify/Vercel for Vite build, point academiqr.com to v1.0 (after security review)

### 🟡 High Value (launch or shortly after)
- [ ] **Mobile testing** — verify editor, library, public pages on phones/tablets
- [x] **Link click tracking** — social clicks, session_id, unique visitors
- [x] **Custom short URLs** — `academiqr.com/atowbin/rsna-2025` with .htaccess + og.php
- [x] **Open Graph meta tags** — client-side + PHP server fallback
- [x] **Onboarding flow** — username setup banner on dashboard
- [x] **Bulk operations in library** — checkboxes, bulk delete/move/toggle

### 🟢 Nice-to-Have (post-launch)
- [x] **Dark mode** — toggle in nav, system preference, localStorage persist
- [x] **Collection templates** — 6 templates: blank, conference, workshop, course, research, portfolio
- [x] **Link analytics detail** — daily views/clicks chart, per-link breakdown
- [ ] **Collaborative collections** — share editing with co-presenters
- [x] **PWA support** — manifest.json, service worker, home screen install
- [x] **Error pages** — custom 404 page
- [ ] **Skeleton loading states** — better perceived performance
- [x] **Collection slug editor** — with warnings
- [x] **Username permanence** — locked after set

## Brand & Design
- **Brand Color**: `#1A2F5B` (dark navy)
- **Brand Hover**: `#152547` (darker navy)
- **Logo**: Supabase storage: `https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_Dark.png`
- **Theme**: Light theme (white backgrounds, navy headings)
- **Nav height**: 72px, Sidebar width: 320px, Logo height: 60px

## Key Files
- `src/shared/supabase.js` — Supabase client
- `src/shared/auth.js` — Auth helpers (requireAuth, signOut)
- `src/shared/router.js` — Navigation + getPublicUrl
- `src/shared/link-utils.js` — Library default resolution (resolveLibraryDefaults, getDisplay*)
- `src/shared/image-utils.js` — Compression, upload, list, delete for Supabase Storage
- `src/pages/editor.js` — Collection editor (~2100 lines, largest file)
- `src/pages/dashboard.js` — Collection grid with search + SortableJS reorder
- `src/pages/library.js` — Link library with sort/search/edit/add-to-collection
- `src/pages/profile.js` — Profile settings + account deletion
- `src/pages/public.js` — Public-facing themed link page
- `src/components/qr-code/qr-tab.js` — QR code generation tab
- `src/components/analytics/analytics-tab.js` — Analytics tab
- `supabase/functions/delete-account/index.ts` — Edge Function for GDPR account deletion

## Database Tables
| Table | Purpose |
|-------|---------|
| profiles | User profile (name, photo, social links) |
| link_lists | Collections (theme, presentation_data, visibility) |
| link_items | Links (title, url, image, source_link_id, custom_overrides) |
| user_themes | Saved appearance themes |
| link_clicks | Analytics: click tracking |
| page_views | Analytics: page view tracking |

## Supabase Storage
- **Bucket**: `link-images` (public)
- **Path convention**: `{userId}/{category}/{uuid}-{timestamp}.{ext}`
- **Categories**: links, profiles, backgrounds
- **RLS**: Authenticated users can upload; public read

## Important Notes
- v0.6.7 lives in C:\Users\TOWMJ2\webdev — that is the LIVE codebase
- This v1.0 folder is a clean rebuild — do NOT mix files between them
- Same Supabase backend (same database, same auth)
- Same GitHub remote, different branch (v1.0-dev vs main)
