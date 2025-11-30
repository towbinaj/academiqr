# Data URI Migration Guide

## Problem
Your `link_items` table contains base64-encoded data URIs (like `data:image/png;base64,...`) instead of URLs. These are **extremely large** (average 615KB, max 2.8MB per image), causing:
- Slow page loads (659KB payload for just 8 links)
- Database bloat
- Network inefficiency

## Solution: Migrate to Supabase Storage

### Step 1: Run Diagnostic Query
Run `migrate-data-uris-to-storage.sql` in Supabase SQL Editor to see:
- How many data URIs you have
- Their sizes
- MIME types

### Step 2: Set Up Migration Script

1. **Install dependencies** (if not already installed):
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Update `migrate-data-uris-to-storage.js`**:
   - Set `SUPABASE_URL` to your Supabase project URL
   - Set `SUPABASE_SERVICE_KEY` to your service role key (not anon key)
   - Set `STORAGE_BUCKET` to your desired bucket name (e.g., `link-images`)

3. **Create the storage bucket** (if it doesn't exist):
   - Go to Supabase Dashboard → Storage
   - Create a new bucket named `link-images` (or your chosen name)
   - Make it **public** so images can be accessed

4. **Run the migration**:
   ```bash
   node migrate-data-uris-to-storage.js
   ```

### Step 3: Verify Migration

After migration, run this query to verify:
```sql
SELECT 
    COUNT(*) as total_links,
    COUNT(CASE WHEN image ~ '^data:image' THEN 1 END) as still_data_uris,
    COUNT(CASE WHEN image ~ '^https?://' THEN 1 END) as now_urls
FROM link_items
WHERE image IS NOT NULL AND image != '';
```

You should see `still_data_uris = 0` and `now_urls` equal to the number of migrated images.

## Immediate Workaround (Optional)

If you can't migrate immediately, you can temporarily exclude images from the initial query:

**In `public.html`, line 1031**, change:
```javascript
.select('id, url, title, image, image_url, image_position, image_scale, order_index')
```

To:
```javascript
.select('id, url, title, image_position, image_scale, order_index')
// Note: image and image_url excluded to reduce payload
```

**Then fetch images separately** when links are rendered (requires additional code changes).

## Benefits After Migration

- **Payload reduction**: From 659KB to ~50KB for 8 links (images load separately)
- **Faster page loads**: Initial HTML/JSON loads much faster
- **Better caching**: Images cached by browser/CDN
- **Database efficiency**: Smaller database, faster queries

## Rollback

If something goes wrong, you can restore from a database backup. The migration script creates new storage files without deleting the original data URIs until after successful upload.

