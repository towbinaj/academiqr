-- Fix RLS Policy Performance Issues on analytics table
-- This addresses the performance warning about auth.uid() being called for each row
--
-- The issue: Policies using auth.uid() directly are evaluated for each row
-- The fix: Wrap auth.uid() in a subquery (SELECT auth.uid()) to evaluate once per query
--
-- This script fixes policies on analytics table:
-- - "Users can view own analytics" (SELECT policy)
-- - Also fixes "Users can view analytics for own collections" if it exists
--
-- Note: analytics table checks ownership through collections table using collection_id
--
-- Run this in Supabase SQL Editor to fix the performance issues

-- ============================================================================
-- First, let's check what policies exist on analytics
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'analytics'
ORDER BY policyname;

-- ============================================================================
-- Fix analytics policies
-- ============================================================================

-- Fix "Users can view own analytics" policy (SELECT)
-- This policy may check ownership through collections table
DROP POLICY IF EXISTS "Users can view own analytics" ON analytics;
DROP POLICY IF EXISTS "Users can view analytics for own collections" ON analytics;
DROP POLICY IF EXISTS "analytics_select_owner_lists" ON analytics;

-- Recreate with optimized auth.uid() call
-- Version 1: Check through collections table using collection_id (most common)
CREATE POLICY "Users can view own analytics"
ON analytics FOR SELECT
TO authenticated
USING (
    collection_id IN (
        SELECT id FROM collections WHERE user_id = (SELECT auth.uid())
    )
);

-- Also fix INSERT policy for consistency (doesn't need optimization but good to have)
DROP POLICY IF EXISTS "Anyone can insert analytics" ON analytics;
DROP POLICY IF EXISTS "analytics_insert_any" ON analytics;

CREATE POLICY "Anyone can insert analytics"
ON analytics FOR INSERT
TO anon, authenticated
WITH CHECK (true);

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
WHERE c.relname = 'analytics'
ORDER BY p.polname;

-- Note: Policies should now show "✅ Optimized" status

