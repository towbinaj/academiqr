# AcademiQR v1.1 — Architecture

## Overview

AcademiQR is a link-in-bio platform for academics and conference presenters. Users create themed link collections, generate QR codes, and share them via short URLs. Built as a vanilla JS multi-page app with Supabase backend, deployed to GoDaddy cPanel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla ES6+ modules, HTML5, CSS3 (custom properties) |
| Build | Vite (code-splitting, asset hashing, MPA mode) |
| Backend | Supabase (Auth, PostgreSQL, Storage, RLS) |
| Auth | Email/password + Google OAuth via Supabase Auth |
| Hosting | GoDaddy cPanel (Apache) |
| Icons | Font Awesome 6.4.2 (CDN) |
| Fonts | Inter (Google Fonts) |
| QR | qrcode.min.js (CDN) |
| Export | SheetJS (XLSX) bundled via Vite |
| Drag & Drop | SortableJS (dashboard collection reordering) |

## Project Structure

```
academiqr-v1/
├── src/
│   ├── pages/
│   │   ├── dashboard.html/js/css  # Collection grid, search, tag filter, drag reorder
│   │   ├── editor.html/js/css     # 3-column collection editor (mobile: bottom tab bar)
│   │   ├── library.html/js/css    # Link library table, bulk ops, pagination
│   │   ├── profile.html/js/css    # User settings, export, delete account
│   │   ├── login.css              # Login page styles (HTML is index.html)
│   │   ├── login.js               # Login/register logic
│   │   ├── public.css             # Public collection view styles
│   │   └── public.js              # Public collection view + analytics
│   ├── shared/
│   │   ├── auth.js                # Auth guard, session check
│   │   ├── auto-save.js           # Debounced auto-save for editor/profile
│   │   ├── image-utils.js         # Upload, compress, crop
│   │   ├── link-utils.js          # Link resolution, overrides
│   │   ├── rate-limit.js          # Client-side rate limiting
│   │   ├── router.js              # Client-side page navigation
│   │   ├── security.js            # CSP, input sanitization
│   │   ├── state.js               # Shared state management
│   │   ├── supabase.js            # Supabase client init
│   │   ├── tag-utils.js           # Tag normalization, autocomplete, CRUD
│   │   ├── theme-toggle.js        # Dark/light mode
│   │   ├── toast.js               # Toast notification system
│   │   └── utils.js               # General utilities
│   ├── components/
│   │   ├── analytics/analytics-tab.js  # Analytics tab in editor
│   │   └── qr-code/qr-tab.js          # QR code tab in editor
│   └── styles/
│       ├── base.css               # Global styles, nav, shared components
│       └── variables.css          # CSS custom properties, dark mode overrides
├── dist/                          # Built output (committed for cPanel deploy)
│   ├── index.html                 # Login entry point
│   ├── public.html                # Public collection view
│   ├── privacy.html               # Privacy policy
│   ├── terms.html                 # Terms of service
│   ├── 404.html                   # Error page
│   ├── manifest.json              # PWA manifest
│   ├── sw.js                      # Service worker
│   ├── og.php                     # Open Graph metadata
│   ├── .htaccess                  # Apache routing & security
│   ├── src/pages/*.html           # Authenticated page templates
│   └── assets/                    # Vite-hashed JS/CSS bundles
├── migrations/                    # SQL schema changes
├── docs/                          # Project documentation
├── CLAUDE.md                      # AI dev instructions
├── DEPLOYMENT_GUIDE.md            # cPanel deploy procedure
└── .env.local                     # Supabase keys (gitignored)
```

## Database Schema (Supabase PostgreSQL)

### profiles
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | Matches Supabase auth.users.id |
| email | TEXT | |
| display_name | TEXT | |
| username | TEXT (UNIQUE) | Permanent after first set. Used in short URLs |
| profile_photo_url | TEXT | Supabase Storage URL |
| social_links | JSONB | Keys: email, instagram, facebook, x, linkedin, youtube, tiktok, snapchat |
| theme_settings | JSONB | User-level theme preferences |

### link_lists (collections)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| user_id | UUID (FK → profiles) | |
| title | TEXT | |
| slug | TEXT | URL-safe, unique per user |
| description | TEXT | |
| theme | JSONB | backgroundType, backgroundImage, accentColor, buttonStyle, etc. |
| presentation_data | JSONB | tags[], conference, location, date, show_title, show_conference |
| passkey | TEXT | Optional plain-text access code for presentation sharing |
| order_index | INT | Dashboard card position (drag-and-drop) |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### link_items
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| link_list_id | UUID (FK → link_lists) | |
| user_id | UUID (FK → profiles) | |
| title | TEXT | Canonical title (library default) |
| url | TEXT | |
| image_url | TEXT | Canonical image |
| image_position_x | FLOAT | |
| image_position_y | FLOAT | |
| image_scale | FLOAT | |
| sort_order | INT | Position within collection |
| is_active | BOOLEAN | |
| tags | TEXT[] | Array of lowercase tag strings |
| source_link_id | UUID (FK → link_items, ON DELETE SET NULL) | Points to library original |
| use_library_defaults | BOOLEAN | If true, inherit title/image from source |
| custom_overrides | JSONB | Per-collection title/image overrides |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### analytics
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| link_list_id | UUID (FK → link_lists) | |
| event_type | TEXT | 'page_view' or 'link_click' |
| link_item_id | UUID | Null for page views |
| session_id | UUID | Client-generated per visit |
| created_at | TIMESTAMPTZ | |

## Page Architecture

Each page is a standalone Vite entry point that lazy-loads its own JS/CSS bundle:

```
Login (index.html) ─── login.js ─── supabase, router, theme-toggle
Dashboard ─────────── dashboard.js ─── supabase, router, theme-toggle, tag-utils, toast, state
Editor ────────────── editor.js ──── supabase, router, image-utils, link-utils, theme-toggle, tag-utils, toast, auto-save, state
Library ───────────── library.js ─── supabase, router, image-utils, link-utils, theme-toggle, tag-utils, toast
Profile ───────────── profile.js ─── supabase, router, image-utils, theme-toggle, toast, auto-save
Public ────────────── public.js ──── supabase (analytics only)
```

## URL Routing

| URL Pattern | Resolves To |
|------------|-------------|
| `/` | `index.html` (login) |
| `/src/pages/dashboard.html` | Dashboard |
| `/src/pages/editor.html?id=UUID` | Collection editor |
| `/src/pages/library.html` | Link library |
| `/src/pages/profile.html` | Profile settings |
| `/u/{username}/{slug}` | `.htaccess` rewrites to `public.html?username=X&slug=Y` |

## Authentication Flow

1. User submits email/password or clicks Google OAuth
2. Supabase returns session token
3. Token stored in localStorage via Supabase JS client
4. Each authenticated page checks session on load → redirects to login if expired
5. Rate limiting: 5 attempts/hour with 15-minute lockout (client + server)

## Link Resolution Logic

Links support a 3-tier override system:

1. **Custom overrides** (`custom_overrides` JSONB) — per-collection title/image
2. **Library defaults** (`use_library_defaults` = true) — inherit from `source_link_id`
3. **Canonical values** — the link's own `title` and `image_url` columns

Resolution order: custom_overrides → source link (if use_library_defaults) → own columns.

## Tag System

Tags are stored in two places:
- **Collections**: `presentation_data.tags[]` in `link_lists` (JSONB array)
- **Links**: `tags` column in `link_items` (TEXT[] Postgres array)

Tags are normalized to lowercase. The autocomplete pool is built dynamically from all existing tags across the user's collections and links. Dashboard supports filtering by tag (disables drag-and-drop while filtered).

## Deployment Pipeline

```
Local dev (src/) → npx vite build → dist/ → git push → cPanel pull → .cpanel.yml copies dist/* → public_html/
```

## Caching Strategy

- **Hashed assets** (JS/CSS): Cache-Control max-age 1 year
- **HTML pages**: No cache (immediate updates on deploy)
- **Service Worker**: Cache-first for static assets, network-first for HTML

## Security

- **CSP**: Restricts scripts to self + cdnjs, connections to self + Supabase
- **RLS**: All Supabase tables use Row Level Security scoped to `auth.uid()`
- **Auth tokens**: Managed by Supabase JS client in localStorage, mitigated by CSP
- **Input sanitization**: Via `security.js` shared module
- **Rate limiting**: Client-side via `rate-limit.js`
