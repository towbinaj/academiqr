-- Add social media platform tracking to link_clicks table
-- This allows tracking which social media platform was clicked

-- First, drop the foreign key constraint on link_id
ALTER TABLE link_clicks 
DROP CONSTRAINT IF EXISTS link_clicks_link_id_fkey;

-- Make link_id nullable to support social media clicks (which don't have a link_id)
ALTER TABLE link_clicks 
ALTER COLUMN link_id DROP NOT NULL;

-- Re-add the foreign key constraint but allow NULL values
ALTER TABLE link_clicks 
ADD CONSTRAINT link_clicks_link_id_fkey 
FOREIGN KEY (link_id) REFERENCES link_items(id) ON DELETE CASCADE;

-- Add social_platform column to link_clicks table
ALTER TABLE link_clicks 
ADD COLUMN IF NOT EXISTS social_platform TEXT;

-- Add comment for documentation
COMMENT ON COLUMN link_clicks.social_platform IS 'Social media platform name (instagram, facebook, twitter, linkedin, youtube, tiktok, snapchat, email) or NULL for regular links';

-- Create index for better query performance when filtering by social platform
CREATE INDEX IF NOT EXISTS idx_link_clicks_social_platform ON link_clicks(social_platform) WHERE social_platform IS NOT NULL;

