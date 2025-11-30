-- Migration: Convert base64 data URIs to Supabase Storage files
-- This script helps identify data URIs that need to be migrated
--
-- IMPORTANT: This is a READ-ONLY diagnostic script.
-- The actual migration requires:
-- 1. Reading the base64 data
-- 2. Uploading to Supabase Storage via API/Storage
-- 3. Updating the database with new URLs
--
-- This script only identifies what needs to be migrated.

-- ============================================================================
-- Step 1: Identify data URIs that need migration
-- ============================================================================
SELECT 
    id,
    title,
    CASE 
        WHEN image ~ '^data:image' THEN 'Data URI'
        WHEN image ~ '^https?://' THEN 'HTTP URL'
        ELSE 'Other'
    END as image_format,
    LENGTH(image) as image_size_bytes,
    -- Extract MIME type from data URI
    CASE 
        WHEN image ~ '^data:image/([^;]+)' THEN (regexp_match(image, '^data:image/([^;]+)'))[1]
        ELSE NULL
    END as image_mime_type,
    -- Estimate file size (base64 is ~33% larger than binary)
    CASE 
        WHEN image ~ '^data:image' THEN ROUND((LENGTH(image) - LENGTH(SPLIT_PART(image, ',', 1)) - 1) * 0.75)
        ELSE NULL
    END as estimated_binary_size_bytes
FROM link_items
WHERE image IS NOT NULL 
    AND image != ''
    AND image ~ '^data:image'
ORDER BY LENGTH(image) DESC
LIMIT 20;

-- ============================================================================
-- Step 2: Summary statistics
-- ============================================================================
SELECT 
    COUNT(*) as total_data_uris,
    COUNT(DISTINCT CASE WHEN image ~ '^data:image' THEN id END) as links_with_data_uri_image,
    COUNT(DISTINCT CASE WHEN image_url ~ '^data:image' THEN id END) as links_with_data_uri_image_url,
    SUM(LENGTH(image)) FILTER (WHERE image ~ '^data:image') as total_image_bytes,
    SUM(LENGTH(image_url)) FILTER (WHERE image_url ~ '^data:image') as total_image_url_bytes,
    ROUND(AVG(LENGTH(image)) FILTER (WHERE image ~ '^data:image')) as avg_image_size_bytes,
    ROUND(MAX(LENGTH(image))) as max_image_size_bytes
FROM link_items
WHERE (image IS NOT NULL AND image != '' AND image ~ '^data:image')
    OR (image_url IS NOT NULL AND image_url != '' AND image_url ~ '^data:image');

