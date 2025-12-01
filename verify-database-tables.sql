-- Verify database tables for themes, gradients, and media library
-- Run this to check if all required tables exist and have correct structure

-- ============================================================================
-- 1. Check user_media table (for media library)
-- ============================================================================
SELECT 
    'user_media' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_media'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- Check columns
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_media'
ORDER BY ordinal_position;

-- Check RLS
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'user_media';

-- ============================================================================
-- 2. Check user_themes table (for appearance and QR themes)
-- ============================================================================
SELECT 
    'user_themes' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_themes'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- Check columns
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_themes'
ORDER BY ordinal_position;

-- Check RLS
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'user_themes';

-- ============================================================================
-- 3. Check user_gradients table (for custom gradients)
-- ============================================================================
SELECT 
    'user_gradients' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_gradients'
    ) THEN '✅ EXISTS' ELSE '❌ MISSING' END as status;

-- Check columns
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'user_gradients'
ORDER BY ordinal_position;

-- Check RLS
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'user_gradients';

-- ============================================================================
-- 4. Check for required indexes
-- ============================================================================
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('user_media', 'user_themes', 'user_gradients')
ORDER BY tablename, indexname;

-- ============================================================================
-- 5. Check RLS policies
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command
FROM pg_policies
WHERE tablename IN ('user_media', 'user_themes', 'user_gradients')
ORDER BY tablename, policyname;

-- ============================================================================
-- 6. Summary: Count records per user (to verify data isolation)
-- ============================================================================
SELECT 
    'user_media' as table_name,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_records
FROM user_media
UNION ALL
SELECT 
    'user_themes' as table_name,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_records
FROM user_themes
UNION ALL
SELECT 
    'user_gradients' as table_name,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_records
FROM user_gradients;

