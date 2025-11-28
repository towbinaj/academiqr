-- Add columns one at a time to isolate any issues
-- Run each ALTER TABLE statement separately

-- Step 1: Add image_position column
-- Run this first and wait for it to complete
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_position JSONB;

-- Step 2: Add image_scale column  
-- Run this only after Step 1 completes successfully
ALTER TABLE public.link_items 
ADD COLUMN IF NOT EXISTS image_scale INTEGER;


