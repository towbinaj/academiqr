-- Fix RLS Policy Performance Issues on user_media table
-- This addresses the performance warning about auth.uid() being called for each row
--
-- The issue: Policies using auth.uid() directly are evaluated for each row
-- The fix: Wrap auth.uid() in a subquery (SELECT auth.uid()) to evaluate once per query
--
-- This script fixes ALL policies on user_media table:
-- - "Users can view own media" (SELECT policy)
-- - "Users can insert own media" (INSERT policy)
-- - "Users can update own media" (UPDATE policy)
-- - "Users can delete own media" (DELETE policy)
--
-- Run this in Supabase SQL Editor to fix the performance issues

-- ============================================================================
-- First, let's check what policies exist on user_media
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'user_media'
ORDER BY policyname;

-- ============================================================================
-- Check table structure to determine which column to use
-- ============================================================================

-- Check what columns user_media has (to determine if it uses user_id or owner_id)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_media' 
    AND table_schema = 'public'
    AND column_name IN ('user_id', 'owner_id', 'id')
ORDER BY ordinal_position;

-- ============================================================================
-- Fix user_media policies
-- ============================================================================

-- Fix "Users can view own media" policy (SELECT)
-- Try user_id first (most common), then owner_id
DROP POLICY IF EXISTS "Users can view own media" ON user_media;
DROP POLICY IF EXISTS "Users can view their own media" ON user_media;

-- Version 1: If user_media uses user_id column
CREATE POLICY "Users can view own media"
ON user_media FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- If the above fails, try this version for owner_id:
-- DROP POLICY IF EXISTS "Users can view own media" ON user_media;
-- CREATE POLICY "Users can view own media"
-- ON user_media FOR SELECT
-- TO authenticated
-- USING ((SELECT auth.uid()) = owner_id);

-- Fix "Users can insert own media" policy (INSERT)
DROP POLICY IF EXISTS "Users can insert own media" ON user_media;
DROP POLICY IF EXISTS "Users can insert their own media" ON user_media;

-- Version 1: If user_media uses user_id column
CREATE POLICY "Users can insert own media"
ON user_media FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

-- If the above fails, try this version for owner_id:
-- DROP POLICY IF EXISTS "Users can insert own media" ON user_media;
-- CREATE POLICY "Users can insert own media"
-- ON user_media FOR INSERT
-- TO authenticated
-- WITH CHECK ((SELECT auth.uid()) = owner_id);

-- Fix "Users can update own media" policy (UPDATE)
DROP POLICY IF EXISTS "Users can update own media" ON user_media;
DROP POLICY IF EXISTS "Users can update their own media" ON user_media;

-- Version 1: If user_media uses user_id column
CREATE POLICY "Users can update own media"
ON user_media FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- If the above fails, try this version for owner_id:
-- DROP POLICY IF EXISTS "Users can update own media" ON user_media;
-- CREATE POLICY "Users can update own media"
-- ON user_media FOR UPDATE
-- TO authenticated
-- USING ((SELECT auth.uid()) = owner_id)
-- WITH CHECK ((SELECT auth.uid()) = owner_id);

-- Fix "Users can delete own media" policy (DELETE)
DROP POLICY IF EXISTS "Users can delete own media" ON user_media;
DROP POLICY IF EXISTS "Users can delete their own media" ON user_media;

-- Version 1: If user_media uses user_id column
CREATE POLICY "Users can delete own media"
ON user_media FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- If the above fails, try this version for owner_id:
-- DROP POLICY IF EXISTS "Users can delete own media" ON user_media;
-- CREATE POLICY "Users can delete own media"
-- ON user_media FOR DELETE
-- TO authenticated
-- USING ((SELECT auth.uid()) = owner_id);

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that policies now use the optimized form
SELECT 
    n.nspname as schema_name,
    c.relname as table_name,
    p.polname as policy_name,
    CASE p.polcmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        ELSE p.polcmd::text
    END as command,
    pg_get_expr(p.polqual, p.polrelid) as using_expression,
    pg_get_expr(p.polwithcheck, p.polrelid) as with_check_expression,
    CASE 
        -- Check if it uses SELECT auth.uid() (optimized)
        WHEN pg_get_expr(p.polqual, p.polrelid) ~* 'SELECT\s+auth\.uid\(\)' 
             OR pg_get_expr(p.polwithcheck, p.polrelid) ~* 'SELECT\s+auth\.uid\(\)' 
        THEN '✅ Optimized'
        -- Check if it uses auth.uid() directly without SELECT (not optimized)
        WHEN pg_get_expr(p.polqual, p.polrelid) ~* '\bauth\.uid\(\)\s*=' 
             OR pg_get_expr(p.polqual, p.polrelid) ~* '=\s*auth\.uid\(\)'
             OR pg_get_expr(p.polwithcheck, p.polrelid) ~* '\bauth\.uid\(\)\s*='
             OR pg_get_expr(p.polwithcheck, p.polrelid) ~* '=\s*auth\.uid\(\)'
        THEN '⚠️ Needs optimization'
        ELSE 'N/A'
    END as status
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname = 'user_media'
ORDER BY p.polname;

-- Note: Policies should now show "✅ Optimized" status

