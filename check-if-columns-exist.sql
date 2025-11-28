-- Check if columns already exist (this should be fast)
SELECT 
    column_name, 
    data_type
FROM information_schema.columns 
WHERE table_name = 'link_items' 
    AND column_name IN ('image_position', 'image_scale');


