-- MINIMAL VERSION - Only adds columns, no queries
-- Run this in your Supabase SQL Editor
-- If this times out, there may be a database issue

-- Add image_position column
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_position JSONB;

-- Add image_scale column
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_scale INTEGER;


