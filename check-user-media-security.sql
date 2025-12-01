-- Verify user_media table security and isolation
-- This ensures each user can only see their own media

-- ============================================================================
-- 1. Check RLS (Row Level Security) is enabled
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'user_media';

-- ============================================================================
-- 2. Check RLS policies on user_media table
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'user_media'
ORDER BY policyname;

-- ============================================================================
-- 3. Verify user isolation - check if any media items have NULL user_id
-- ============================================================================
SELECT 
    COUNT(*) as total_items,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as items_with_null_user_id,
    COUNT(DISTINCT user_id) as unique_users
FROM user_media;

-- ============================================================================
-- 4. Show media items per user (to verify isolation)
-- ============================================================================
SELECT 
    user_id,
    COUNT(*) as media_count,
    SUM(size) as total_size_bytes,
    ROUND(SUM(size) / 1024.0 / 1024.0, 2) as total_size_mb,
    MIN(uploaded_at) as first_upload,
    MAX(uploaded_at) as last_upload
FROM user_media
GROUP BY user_id
ORDER BY media_count DESC;

-- ============================================================================
-- 5. Check for any potential cross-user access issues
-- ============================================================================
-- This query should only return items if there's a problem
SELECT 
    id,
    user_id,
    name,
    uploaded_at
FROM user_media
WHERE user_id IS NULL
LIMIT 10;

