-- Add image_position and image_scale columns to link_items table (SIMPLE VERSION)
-- Run this in your Supabase SQL Editor
-- This version ONLY adds the columns - no data migration to avoid timeouts
-- The application code already handles missing values gracefully with defaults

-- Step 1: Add image_position column (JSONB to store {x: number, y: number})
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_position JSONB;

-- Step 2: Add image_scale column (INTEGER to store scale percentage, e.g., 100 = 100%)
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_scale INTEGER;

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

-- Show current state (no updates needed - app handles defaults)
SELECT 
    COUNT(*) as total_links,
    COUNT(CASE WHEN image_position IS NOT NULL THEN 1 END) as links_with_position,
    COUNT(CASE WHEN image_scale IS NOT NULL THEN 1 END) as links_with_scale
FROM public.link_items;


