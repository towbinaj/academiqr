-- Check link_lists table schema
-- Run this in your Supabase SQL Editor to see current structure

-- Check if link_lists table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'link_lists'
) AS table_exists;

-- Check all columns in link_lists table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'link_lists'
ORDER BY ordinal_position;

-- Check if theme column exists specifically
SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'link_lists' 
    AND column_name = 'theme'
) AS theme_column_exists;

-- Check sample data from link_lists (first 3 rows)
SELECT 
    id,
    slug,
    visibility,
    theme,
    created_at
FROM link_lists 
LIMIT 3;



