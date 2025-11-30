-- Fix duplicate order_index values by assigning sequential values
-- This ensures each link in a collection has a unique order_index

-- For each collection, assign sequential order_index values starting from 0
-- based on the current order_index (if unique) or creation order

WITH ordered_links AS (
    SELECT 
        id,
        list_id,
        order_index,
        ROW_NUMBER() OVER (
            PARTITION BY list_id 
            ORDER BY 
                COALESCE(order_index, 999999),  -- NULLs go last
                id ASC                           -- Then by ID for consistency (UUIDs are sortable)
        ) - 1 AS new_order_index
    FROM link_items
)
UPDATE link_items li
SET order_index = ol.new_order_index
FROM ordered_links ol
WHERE li.id = ol.id
    AND (li.order_index IS NULL OR li.order_index != ol.new_order_index);

-- Verification: Check if duplicates are fixed
SELECT 
    list_id,
    COUNT(*) as total_links,
    COUNT(DISTINCT order_index) as unique_order_values,
    CASE 
        WHEN COUNT(*) = COUNT(DISTINCT order_index) THEN 'Fixed ✅'
        ELSE 'Still has duplicates ❌'
    END as status
FROM link_items
GROUP BY list_id
ORDER BY list_id;

