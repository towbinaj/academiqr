-- Diagnostic: Check actual image URL formats in the database
-- Run queries individually to avoid crashes
-- Start with Query 1, then Query 2, etc.

-- ============================================================================
-- Query 1: Quick summary statistics (safe, no large data)
-- ============================================================================
SELECT
    COUNT(*) as total_links,
    COUNT(CASE WHEN image IS NOT NULL AND image != '' THEN 1 END) as links_with_image,
    COUNT(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 END) as links_with_image_url,
    COUNT(CASE WHEN image ~ 'supabase' THEN 1 END) as images_with_supabase,
    COUNT(CASE WHEN image_url ~ 'supabase' THEN 1 END) as image_urls_with_supabase,
    COUNT(CASE WHEN image ~ '\.supabase\.co/storage/v1/object/' THEN 1 END) as images_matching_storage_pattern,
    COUNT(CASE WHEN image_url ~ '\.supabase\.co/storage/v1/object/' THEN 1 END) as image_urls_matching_storage_pattern,
    AVG(LENGTH(image)) FILTER (WHERE image IS NOT NULL) as avg_image_length,
    AVG(LENGTH(image_url)) FILTER (WHERE image_url IS NOT NULL) as avg_image_url_length,
    MAX(LENGTH(image)) as max_image_length,
    MAX(LENGTH(image_url)) as max_image_url_length
FROM link_items
WHERE (image IS NOT NULL AND image != '')
    OR (image_url IS NOT NULL AND image_url != '');

-- ============================================================================
-- Query 2: Sample URLs with previews only (first 200 chars max)
-- ============================================================================
SELECT
    id,
    title,
    CASE
        WHEN image IS NOT NULL AND image != '' THEN LEFT(image, 200)
        ELSE NULL
    END as image_preview,
    CASE
        WHEN image_url IS NOT NULL AND image_url != '' THEN LEFT(image_url, 200)
        ELSE NULL
    END as image_url_preview,
    LENGTH(image) as image_length,
    LENGTH(image_url) as image_url_length,
    CASE 
        WHEN image ~ 'supabase\.co' THEN 'Yes'
        ELSE 'No'
    END as image_is_supabase,
    CASE 
        WHEN image_url ~ 'supabase\.co' THEN 'Yes'
        ELSE 'No'
    END as image_url_is_supabase
FROM link_items
WHERE (image IS NOT NULL AND image != '')
    OR (image_url IS NOT NULL AND image_url != '')
ORDER BY LENGTH(image) DESC NULLS LAST, LENGTH(image_url) DESC NULLS LAST
LIMIT 10;

-- ============================================================================
-- Query 3: Detect data URI format (base64 images)
-- ============================================================================
SELECT
    COUNT(CASE WHEN image ~ '^data:image' THEN 1 END) as images_with_data_uri,
    COUNT(CASE WHEN image_url ~ '^data:image' THEN 1 END) as image_urls_with_data_uri,
    COUNT(CASE WHEN image ~ '^data:' THEN 1 END) as images_with_any_data_uri,
    COUNT(CASE WHEN image_url ~ '^data:' THEN 1 END) as image_urls_with_any_data_uri
FROM link_items
WHERE (image IS NOT NULL AND image != '')
    OR (image_url IS NOT NULL AND image_url != '');

-- ============================================================================
-- Query 4: Check URL structure patterns (safe, no large data)
-- ============================================================================
SELECT
    CASE 
        WHEN image ~ '^data:image' THEN 'Data URI (base64 image)'
        WHEN image ~ '^https?://' THEN 'Starts with http'
        WHEN image ~ '^//' THEN 'Protocol relative'
        WHEN image ~ '^/' THEN 'Relative path'
        ELSE 'Other format'
    END as image_url_format,
    COUNT(*) as count,
    AVG(LENGTH(image)) as avg_length
FROM link_items
WHERE image IS NOT NULL AND image != ''
GROUP BY 
    CASE 
        WHEN image ~ '^data:image' THEN 'Data URI (base64 image)'
        WHEN image ~ '^https?://' THEN 'Starts with http'
        WHEN image ~ '^//' THEN 'Protocol relative'
        WHEN image ~ '^/' THEN 'Relative path'
        ELSE 'Other format'
    END
ORDER BY count DESC;
