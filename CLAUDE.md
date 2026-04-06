# AcademiQR v1.1

## Commands
npm run dev       # Vite dev server (port 3000)
npm run build     # Production build to dist/
npm run preview   # Preview production build

## Architecture
- Vanilla ES6+ modules, no framework — multi-page app (MPA) via Vite
- Supabase backend: Auth (email + Google OAuth), PostgreSQL, Storage, RLS
- Deployed to GoDaddy cPanel via git push → .cpanel.yml copies dist/ to public_html/
- dist/ is committed to git (required for cPanel deploy)

## Key Directories
- `src/pages/` — Each page has its own .html/.js/.css (dashboard, editor, library, profile, login, public)
- `src/shared/` — 13 utility modules (auth, state, supabase client, router, etc.)
- `src/components/` — Reusable components (analytics-tab, qr-tab)
- `src/styles/` — CSS custom properties in variables.css, global styles in base.css
- `migrations/` — SQL schema migration files
- `docs/` — architecture.md and state.md (read these for deep context)

## Conventions
- All pages import shared modules from `../../shared/`
- State flows through `state.js` — no global variables
- Auto-save uses debounced saves via `auto-save.js`
- Links use a 3-tier resolution: library default → collection override → display
- Tags are normalized (lowercase, trimmed) via `tag-utils.js`
- Toast notifications via `toast.js` — never use alert()
- Input sanitization via `security.js` — always sanitize user input before DOM insertion
- Client-side rate limiting via `rate-limit.js` for auth attempts

## URL Patterns
- Public collections: `/u/{username}/{slug}` (Apache rewrite → public.html)
- All authenticated pages: `/src/pages/{page}.html`
- Login: `/` (index.html)

## Database Tables
- `profiles` — user settings, theme, social links
- `link_lists` — collections with title, slug, theme JSONB, passkey
- `link_items` — links with library defaults + per-collection overrides
- `analytics` — page views and link clicks

## Watch Out For
- dist/ must be rebuilt and committed before deploy — `npm run build && git add dist/`
- .htaccess in dist/ has security headers and URL rewrite rules — don't overwrite it
- Passkeys are plain-text access codes for presentations, NOT security credentials
- Auto-save has a known bug: captures stale form values (dirty tracking planned for v1.2)
- CDN dependencies (Font Awesome, qrcode.min.js, Google Fonts) are loaded in HTML, not bundled
- Vite config uses 8 MPA entry points — update rollupOptions.input if adding pages
