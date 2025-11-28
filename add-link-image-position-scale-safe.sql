-- Add image_position and image_scale columns to link_items table (SAFE VERSION)
-- Run this in your Supabase SQL Editor
-- This migration adds support for positioning and scaling link images
-- This version is safer for large tables and won't timeout

-- Step 1: Add image_position column (JSONB to store {x: number, y: number})
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_position JSONB;

-- Step 2: Add image_scale column (INTEGER to store scale percentage, e.g., 100 = 100%)
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_scale INTEGER;

-- Step 3: Set default values for existing records (run this multiple times if needed)
-- Default position is center (50, 50) and default scale is 100%
-- Run this UPDATE statement multiple times until it affects 0 rows

-- Update records missing image_position (run until 0 rows affected)
DO $$
DECLARE
    affected_rows INTEGER;
BEGIN
    LOOP
        UPDATE public.link_items
        SET image_position = '{"x": 50, "y": 50}'::jsonb
        WHERE 
            (image_url IS NOT NULL OR image IS NOT NULL)
            AND image_position IS NULL
        LIMIT 500;
        
        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        EXIT WHEN affected_rows = 0;
        
        -- Small delay to prevent overwhelming the database
        PERFORM pg_sleep(0.1);
    END LOOP;
END $$;

-- Update records missing image_scale (run until 0 rows affected)
DO $$
DECLARE
    affected_rows INTEGER;
BEGIN
    LOOP
        UPDATE public.link_items
        SET image_scale = 100
        WHERE 
            (image_url IS NOT NULL OR image IS NOT NULL)
            AND image_scale IS NULL
        LIMIT 500;
        
        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        EXIT WHEN affected_rows = 0;
        
        -- Small delay to prevent overwhelming the database
        PERFORM pg_sleep(0.1);
    END LOOP;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN public.link_items.image_position IS 'JSON object with x and y properties (0-100) for image positioning within the link image container';
COMMENT ON COLUMN public.link_items.image_scale IS 'Integer representing image scale percentage (default: 100, meaning 100% scale)';

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'link_items' 
    AND column_name IN ('image_position', 'image_scale')
ORDER BY ordinal_position;

-- Show count of records
SELECT 
    COUNT(*) as total_links,
    COUNT(CASE WHEN image_position IS NOT NULL THEN 1 END) as links_with_position,
    COUNT(CASE WHEN image_scale IS NOT NULL THEN 1 END) as links_with_scale,
    COUNT(CASE WHEN (image_url IS NOT NULL OR image IS NOT NULL) AND (image_position IS NULL OR image_scale IS NULL) THEN 1 END) as links_needing_defaults
FROM public.link_items;


