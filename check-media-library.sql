-- Diagnostic: Check media library (user_media table)
-- Run this to see what's in your media library

-- Check total media items for a specific user (replace with your user ID)
-- First, let's see all users with media
SELECT 
    user_id,
    COUNT(*) as total_media_items,
    COUNT(CASE WHEN url ~ '^data:image' THEN 1 END) as data_uri_items,
    COUNT(CASE WHEN url ~ '^https?://' THEN 1 END) as url_items,
    MIN(uploaded_at) as oldest_item,
    MAX(uploaded_at) as newest_item
FROM user_media
GROUP BY user_id
ORDER BY total_media_items DESC;

-- Show sample media items with their URL format
SELECT 
    id,
    user_id,
    name,
    type,
    size,
    CASE 
        WHEN url ~ '^data:image' THEN 'Data URI (base64)'
        WHEN url ~ '^https?://' THEN 'HTTP URL'
        WHEN url ~ '^/' THEN 'Relative path'
        ELSE 'Other format'
    END as url_format,
    LEFT(url, 100) as url_preview,
    uploaded_at
FROM user_media
ORDER BY uploaded_at DESC
LIMIT 20;

-- Check if there are any NULL or empty URLs
SELECT 
    COUNT(*) as total_items,
    COUNT(CASE WHEN url IS NULL OR url = '' THEN 1 END) as null_or_empty_urls,
    COUNT(CASE WHEN url IS NOT NULL AND url != '' THEN 1 END) as valid_urls
FROM user_media;

