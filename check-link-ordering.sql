-- Diagnostic: Check link ordering issues
-- Run this to see if order_index values are correct

-- Check for NULL order_index values
SELECT 
    list_id,
    COUNT(*) as total_links,
    COUNT(order_index) as links_with_order_index,
    COUNT(*) - COUNT(order_index) as links_with_null_order_index
FROM link_items
GROUP BY list_id
HAVING COUNT(*) - COUNT(order_index) > 0
ORDER BY list_id;

-- Check for duplicate order_index values within the same list
SELECT 
    list_id,
    order_index,
    COUNT(*) as duplicate_count,
    array_agg(id ORDER BY id) as link_ids,
    array_agg(title ORDER BY id) as link_titles
FROM link_items
WHERE order_index IS NOT NULL
GROUP BY list_id, order_index
HAVING COUNT(*) > 1
ORDER BY list_id, order_index;

-- Show order_index values for a specific collection (replace with your collection ID)
-- SELECT 
--     id,
--     title,
--     order_index,
--     CASE 
--         WHEN order_index IS NULL THEN 'NULL'
--         ELSE order_index::text
--     END as order_status
-- FROM link_items
-- WHERE list_id = 'dcff3caf-09f1-43ee-a938-f228d84642e1'  -- Replace with actual list_id
-- ORDER BY 
--     CASE WHEN order_index IS NULL THEN 1 ELSE 0 END,
--     order_index ASC,
--     id ASC;

-- Show all collections with their link ordering status
SELECT 
    ll.id as list_id,
    ll.slug,
    COUNT(li.id) as total_links,
    COUNT(li.order_index) as links_with_order_index,
    COUNT(*) - COUNT(li.order_index) as links_with_null_order_index,
    MIN(li.order_index) as min_order_index,
    MAX(li.order_index) as max_order_index,
    COUNT(DISTINCT li.order_index) as unique_order_values,
    CASE 
        WHEN COUNT(li.order_index) < COUNT(li.id) THEN 'Has NULL values'
        WHEN COUNT(DISTINCT li.order_index) < COUNT(li.id) THEN 'Has duplicates'
        ELSE 'OK'
    END as ordering_status
FROM link_lists ll
LEFT JOIN link_items li ON ll.id = li.list_id
GROUP BY ll.id, ll.slug
ORDER BY ll.slug;

