-- Add image_position and image_scale columns to link_items table
-- Run this in your Supabase SQL Editor
-- This migration adds support for positioning and scaling link images
--
-- NOTE: This version ONLY adds the columns. It does NOT update existing records
-- to avoid connection timeouts. The application code already handles missing
-- values gracefully with defaults (x: 50, y: 50, scale: 100).
--
-- If you want to set defaults for existing records, run the optional update
-- queries separately after this migration completes.

-- Add image_position column (JSONB to store {x: number, y: number})
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_position JSONB;

-- Add image_scale column (INTEGER to store scale percentage, e.g., 100 = 100%)
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_scale INTEGER;

-- NOTE: Removed SELECT queries that might cause timeouts on large tables
-- You can verify columns were added by checking the table structure in Supabase dashboard

-- OPTIONAL: If you want to set defaults for existing records, you can run these
-- queries separately (they update in small batches to avoid timeouts):
--
-- UPDATE public.link_items
-- SET image_position = '{"x": 50, "y": 50}'::jsonb
-- WHERE (image_url IS NOT NULL OR image IS NOT NULL) AND image_position IS NULL
-- AND id IN (SELECT id FROM public.link_items WHERE image_position IS NULL LIMIT 100);
--
-- UPDATE public.link_items
-- SET image_scale = 100
-- WHERE (image_url IS NOT NULL OR image IS NOT NULL) AND image_scale IS NULL
-- AND id IN (SELECT id FROM public.link_items WHERE image_scale IS NULL LIMIT 100);
--
-- Run these UPDATE queries multiple times until they affect 0 rows.

