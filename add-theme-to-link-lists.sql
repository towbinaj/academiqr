-- Add Theme Column to link_lists Table
-- Run this in your Supabase SQL Editor

-- Add theme column as JSONB to store complex theme data
ALTER TABLE link_lists 
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{}';

-- Add other missing columns that might be needed
ALTER TABLE link_lists 
ADD COLUMN IF NOT EXISTS presentation_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS qr_code_data JSONB DEFAULT '{}';

-- Create index on theme column for better performance
CREATE INDEX IF NOT EXISTS idx_link_lists_theme ON link_lists USING GIN (theme);

-- Update existing records to have empty theme object if null
UPDATE link_lists 
SET theme = '{}' 
WHERE theme IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'link_lists' 
AND column_name IN ('theme', 'presentation_data', 'qr_code_data');



