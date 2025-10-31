-- Add Theme/Appearance Columns to Profiles Table
-- Run this in your Supabase SQL Editor

-- Add missing theme and appearance columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS background_type TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS gradient_color1 TEXT DEFAULT '#667eea',
ADD COLUMN IF NOT EXISTS gradient_color2 TEXT DEFAULT '#764ba2',
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#1f2937',
ADD COLUMN IF NOT EXISTS link_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS button_style TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS button_color TEXT DEFAULT '#3b82f6';

-- Update existing profiles with default values for new columns
UPDATE profiles 
SET 
    background_type = COALESCE(background_type, 'solid'),
    background_color = COALESCE(background_color, '#ffffff'),
    gradient_color1 = COALESCE(gradient_color1, '#667eea'),
    gradient_color2 = COALESCE(gradient_color2, '#764ba2'),
    text_color = COALESCE(text_color, '#1f2937'),
    link_color = COALESCE(link_color, '#3b82f6'),
    button_style = COALESCE(button_style, 'solid'),
    button_color = COALESCE(button_color, '#3b82f6')
WHERE background_type IS NULL OR background_color IS NULL;

-- Note: profile_photo_url will be used instead of profile_photo
-- You can migrate existing data if needed:
-- UPDATE profiles SET profile_photo_url = profile_photo WHERE profile_photo IS NOT NULL;
