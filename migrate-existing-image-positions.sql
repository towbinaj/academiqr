-- Migration script to set default image positions and scales for existing links
-- This is OPTIONAL - the app handles missing values gracefully with defaults
-- Run this if you want to explicitly set defaults for existing links in the database
--
-- This script updates in batches to avoid timeouts on large tables

-- Step 1: Set default image_position for existing links with images
-- Run this query multiple times until it affects 0 rows
DO $$
DECLARE
    batch_size INTEGER := 100;
    affected_rows INTEGER;
BEGIN
    LOOP
        -- Update a batch of links
        WITH batch AS (
            SELECT id 
            FROM public.link_items 
            WHERE (image_url IS NOT NULL OR image IS NOT NULL) 
              AND image_position IS NULL
            LIMIT batch_size
        )
        UPDATE public.link_items
        SET image_position = '{"x": 50, "y": 50}'::jsonb
        WHERE id IN (SELECT id FROM batch);
        
        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        
        -- Exit loop if no more rows to update
        EXIT WHEN affected_rows = 0;
        
        -- Log progress
        RAISE NOTICE 'Updated % rows with default image_position', affected_rows;
        
        -- Small delay to prevent overwhelming the database
        PERFORM pg_sleep(0.1);
    END LOOP;
    
    RAISE NOTICE 'Finished setting default image_position values';
END $$;

-- Step 2: Set default image_scale for existing links with images
-- Run this query multiple times until it affects 0 rows
DO $$
DECLARE
    batch_size INTEGER := 100;
    affected_rows INTEGER;
BEGIN
    LOOP
        -- Update a batch of links
        WITH batch AS (
            SELECT id 
            FROM public.link_items 
            WHERE (image_url IS NOT NULL OR image IS NOT NULL) 
              AND image_scale IS NULL
            LIMIT batch_size
        )
        UPDATE public.link_items
        SET image_scale = 100
        WHERE id IN (SELECT id FROM batch);
        
        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        
        -- Exit loop if no more rows to update
        EXIT WHEN affected_rows = 0;
        
        -- Log progress
        RAISE NOTICE 'Updated % rows with default image_scale', affected_rows;
        
        -- Small delay to prevent overwhelming the database
        PERFORM pg_sleep(0.1);
    END LOOP;
    
    RAISE NOTICE 'Finished setting default image_scale values';
END $$;

-- Verify the migration
SELECT 
    COUNT(*) as total_links_with_images,
    COUNT(image_position) as links_with_position,
    COUNT(image_scale) as links_with_scale,
    COUNT(*) - COUNT(image_position) as missing_position,
    COUNT(*) - COUNT(image_scale) as missing_scale
FROM public.link_items
WHERE image_url IS NOT NULL OR image IS NOT NULL;

