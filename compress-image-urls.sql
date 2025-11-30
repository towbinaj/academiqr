-- Compress Image URLs in Database
-- This script implements automatic URL compression for Supabase storage URLs
-- to reduce network payload size and improve performance
--
-- What this does:
-- 1. Creates a function to compress Supabase storage URLs
-- 2. Creates triggers to automatically compress URLs on insert/update
-- 3. Compresses existing URLs in the database
--
-- Run this in Supabase SQL Editor

-- ============================================================================
-- Diagnostic: Check what URLs exist before compression
-- ============================================================================
-- Run this first to see what URLs you have:
SELECT 
    COUNT(*) as total_links_with_images,
    COUNT(CASE WHEN image ~ 'supabase\.co' THEN 1 END) as images_with_supabase,
    COUNT(CASE WHEN image ~ '\.supabase\.co/storage/v1/object/' THEN 1 END) as images_matching_storage_pattern,
    AVG(LENGTH(image)) as avg_image_url_length
FROM link_items
WHERE image IS NOT NULL AND image != '';

-- ============================================================================
-- Step 1: Create function to compress Supabase storage URLs
-- ============================================================================

CREATE OR REPLACE FUNCTION compress_supabase_url(url_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    compressed_url TEXT;
    project_ref TEXT;
    bucket_name TEXT;
    object_path TEXT;
    url_parts TEXT[];
    token_param TEXT;
    expires_param TEXT;
    path_only TEXT;
    query_string TEXT;
BEGIN
    -- Return NULL if input is NULL or empty
    IF url_text IS NULL OR url_text = '' THEN
        RETURN url_text;
    END IF;
    
    -- Check if it's a Supabase storage URL (public or signed)
    -- Pattern: https://[project].supabase.co/storage/v1/object/[public|sign]/[bucket]/[path]
    IF url_text ~ '^https?://[^/]+\.supabase\.co/storage/v1/object/(public|sign)/' THEN
        -- Extract project reference (everything before .supabase.co)
        project_ref := (regexp_match(url_text, '^https?://([^.]+)\.supabase\.co'))[1];
        
        -- For public URLs: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
        IF url_text ~ '/storage/v1/object/public/' THEN
            -- Extract bucket and path
            url_parts := regexp_split_to_array(
                regexp_replace(url_text, '^https?://[^/]+\.supabase\.co/storage/v1/object/public/', ''),
                '/'
            );
            
            IF array_length(url_parts, 1) >= 2 THEN
                bucket_name := url_parts[1];
                -- Reconstruct path (everything after bucket)
                object_path := array_to_string(url_parts[2:array_length(url_parts, 1)], '/');
                -- Remove query parameters if any
                object_path := split_part(object_path, '?', 1);
                
                -- Reconstruct compressed URL (no query params)
                compressed_url := format('https://%s.supabase.co/storage/v1/object/public/%s/%s',
                    project_ref, bucket_name, object_path);
            ELSE
                -- Can't parse, return original
                compressed_url := url_text;
            END IF;
        -- For signed URLs: https://[project].supabase.co/storage/v1/object/sign/[bucket]/[path]?token=...&expires=...
        ELSIF url_text ~ '/storage/v1/object/sign/' THEN
            -- Extract bucket and path
            url_parts := regexp_split_to_array(
                regexp_replace(url_text, '^https?://[^/]+\.supabase\.co/storage/v1/object/sign/', ''),
                '/'
            );
            
            IF array_length(url_parts, 1) >= 2 THEN
                bucket_name := url_parts[1];
                -- Get path with query params
                object_path := array_to_string(url_parts[2:array_length(url_parts, 1)], '/');
                
                -- Split path and query
                path_only := split_part(object_path, '?', 1);
                query_string := split_part(object_path, '?', 2);
                
                -- Extract token and expires from query string
                BEGIN
                    token_param := (regexp_match(query_string, 'token=([^&]+)'))[1];
                    expires_param := (regexp_match(query_string, 'expires=([^&]+)'))[1];
                    
                    -- Reconstruct with only essential params
                    IF token_param IS NOT NULL AND expires_param IS NOT NULL THEN
                        compressed_url := format('https://%s.supabase.co/storage/v1/object/sign/%s/%s?token=%s&expires=%s',
                            project_ref, bucket_name, path_only, token_param, expires_param);
                    ELSE
                        -- Can't extract essential params, return original
                        compressed_url := url_text;
                    END IF;
                EXCEPTION
                    WHEN OTHERS THEN
                        -- If parsing fails, return original
                        compressed_url := url_text;
                END;
            ELSE
                -- Can't parse, return original
                compressed_url := url_text;
            END IF;
        ELSE
            -- Not a recognized Supabase URL format, return original
            compressed_url := url_text;
        END IF;
    ELSE
        -- Not a Supabase storage URL, return as-is
        compressed_url := url_text;
    END IF;
    
    RETURN compressed_url;
END;
$$;

-- ============================================================================
-- Step 2: Create trigger function to compress URLs on insert/update
-- ============================================================================

CREATE OR REPLACE FUNCTION compress_link_item_urls()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Compress image URL if present
    IF NEW.image IS NOT NULL AND NEW.image != '' THEN
        NEW.image := compress_supabase_url(NEW.image);
    END IF;
    
    -- Compress image_url if present
    IF NEW.image_url IS NOT NULL AND NEW.image_url != '' THEN
        NEW.image_url := compress_supabase_url(NEW.image_url);
    END IF;
    
    RETURN NEW;
END;
$$;

-- ============================================================================
-- Step 3: Create trigger on link_items table
-- ============================================================================

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS compress_link_item_urls_trigger ON link_items;

-- Create trigger
CREATE TRIGGER compress_link_item_urls_trigger
    BEFORE INSERT OR UPDATE ON link_items
    FOR EACH ROW
    EXECUTE FUNCTION compress_link_item_urls();

-- ============================================================================
-- Step 4: Compress existing URLs in link_items table
-- ============================================================================

-- Update existing image URLs
-- Using a more flexible pattern - check for any supabase.co URL
-- The function will handle whether it's actually compressible
UPDATE link_items
SET image = compress_supabase_url(image)
WHERE image IS NOT NULL 
    AND image != ''
    AND image ~ 'supabase\.co';

-- Update existing image_url fields
UPDATE link_items
SET image_url = compress_supabase_url(image_url)
WHERE image_url IS NOT NULL 
    AND image_url != ''
    AND image_url ~ 'supabase\.co';

-- ============================================================================
-- Step 5: Also compress profile photos (optional but recommended)
-- ============================================================================

-- Create trigger function for profiles
CREATE OR REPLACE FUNCTION compress_profile_photo_url()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Compress profile_photo URL if present
    IF NEW.profile_photo IS NOT NULL AND NEW.profile_photo != '' THEN
        NEW.profile_photo := compress_supabase_url(NEW.profile_photo);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS compress_profile_photo_trigger ON profiles;

-- Create trigger
CREATE TRIGGER compress_profile_photo_trigger
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION compress_profile_photo_url();

-- Update existing profile photos
UPDATE profiles
SET profile_photo = compress_supabase_url(profile_photo)
WHERE profile_photo IS NOT NULL 
    AND profile_photo != ''
    AND profile_photo ~ 'supabase\.co';

-- ============================================================================
-- Verification: Check compression results
-- ============================================================================

-- Show before/after comparison for link_items
-- Check all URLs that contain supabase.co (more flexible)
SELECT 
    id,
    title,
    LEFT(image, 100) as image_preview,
    LENGTH(image) as original_image_length,
    LENGTH(compress_supabase_url(image)) as compressed_image_length,
    LENGTH(image) - LENGTH(compress_supabase_url(image)) as bytes_saved,
    CASE 
        WHEN image = compress_supabase_url(image) THEN 'No change'
        ELSE 'Compressed'
    END as compression_status
FROM link_items
WHERE image IS NOT NULL 
    AND image != ''
    AND image ~ 'supabase\.co'
LIMIT 10;

-- Show total savings estimate
-- This will include all supabase.co URLs, even if they don't match the exact pattern
SELECT 
    COUNT(*) as total_links_with_images,
    SUM(LENGTH(image)) as total_original_size,
    SUM(LENGTH(compress_supabase_url(image))) as total_compressed_size,
    SUM(LENGTH(image)) - SUM(LENGTH(compress_supabase_url(image))) as total_bytes_saved,
    COUNT(CASE WHEN image != compress_supabase_url(image) THEN 1 END) as links_actually_compressed
FROM link_items
WHERE image IS NOT NULL 
    AND image != ''
    AND image ~ 'supabase\.co';
