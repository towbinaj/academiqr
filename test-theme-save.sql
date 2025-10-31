-- Test theme data in link_lists table
-- Run this in your Supabase SQL Editor

-- Check recent collections and their theme data
SELECT 
    id,
    slug,
    visibility,
    theme,
    jsonb_pretty(theme) as theme_formatted,
    created_at
FROM link_lists 
WHERE owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b'  -- Your user ID
ORDER BY created_at DESC 
LIMIT 5;

-- Check if theme column has any data
SELECT 
    COUNT(*) as total_collections,
    COUNT(theme) as collections_with_theme,
    COUNT(CASE WHEN theme != '{}'::jsonb THEN 1 END) as collections_with_non_empty_theme
FROM link_lists 
WHERE owner_id = 'e655b1bd-1c1e-4dbe-862d-82e564820a6b';



