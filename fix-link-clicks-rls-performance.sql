-- Fix RLS Policy Performance Issues on link_clicks and page_views tables
-- This addresses the performance warning about auth.uid() being called for each row
--
-- The issue: Policies using auth.uid() directly are evaluated for each row
-- The fix: Wrap auth.uid() in a subquery (SELECT auth.uid()) to evaluate once per query
--
-- This script fixes BOTH:
-- - "Users can view their own link clicks" policy on link_clicks table
-- - "Users can view their own page views" policy on page_views table
--
-- Run this in Supabase SQL Editor to fix the performance issues

-- ============================================================================
-- Fix "Users can view their own link clicks" policy
-- ============================================================================

-- Drop the existing policy (try different policy name variations)
DROP POLICY IF EXISTS "Users can view their own link clicks" ON link_clicks;
DROP POLICY IF EXISTS "Users can view own link_clicks" ON link_clicks;
DROP POLICY IF EXISTS "Users can view own link clicks" ON link_clicks;

-- Recreate with optimized auth.uid() call
CREATE POLICY "Users can view own link_clicks"
ON link_clicks FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = owner_id);

-- ============================================================================
-- Also fix page_views policies if they have the same issue
-- ============================================================================

-- Drop all page_views policy variations
DROP POLICY IF EXISTS "Users can view their own page views" ON page_views;
DROP POLICY IF EXISTS "Users can view own page_views" ON page_views;
DROP POLICY IF EXISTS "Users can view own page views" ON page_views;

-- Recreate with optimized auth.uid() call
-- This policy uses list_id IN (SELECT ...) pattern, so we optimize auth.uid() within the subquery
CREATE POLICY "Users can view own page_views"
ON page_views FOR SELECT
TO authenticated
USING (
    list_id IN (
        SELECT link_lists.id
        FROM link_lists
        WHERE link_lists.owner_id = (SELECT auth.uid())
    )
);

-- Also create the owner_id version if page_views has that column
CREATE POLICY "Users can view their own page views"
ON page_views FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = owner_id);

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that policies exist and are correctly named
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    CASE 
        WHEN qual::text LIKE '%(SELECT auth.uid())%' THEN '✅ Optimized'
        WHEN qual::text LIKE '%auth.uid()%' THEN '⚠️ Needs optimization'
        ELSE 'N/A'
    END as status
FROM pg_policies
WHERE tablename IN ('link_clicks', 'page_views')
    AND (policyname LIKE '%view their own%' OR policyname LIKE '%view own%')
ORDER BY tablename, policyname;

-- Alternative: Check using pg_get_expr to see the full policy definition
SELECT 
    n.nspname as schema_name,
    c.relname as table_name,
    p.polname as policy_name,
    pg_get_expr(p.polqual, p.polrelid) as using_expression,
    CASE 
        -- Check if it uses SELECT auth.uid() (optimized) - PostgreSQL may format it as "SELECT auth.uid() AS uid"
        WHEN pg_get_expr(p.polqual, p.polrelid) ~* 'SELECT\s+auth\.uid\(\)' THEN '✅ Optimized'
        -- Check if it uses auth.uid() directly without SELECT (not optimized)
        WHEN pg_get_expr(p.polqual, p.polrelid) ~* '\bauth\.uid\(\)\s*=' THEN '⚠️ Needs optimization'
        WHEN pg_get_expr(p.polqual, p.polrelid) ~* '=\s*auth\.uid\(\)' THEN '⚠️ Needs optimization'
        ELSE 'N/A'
    END as status
FROM pg_policy p
JOIN pg_class c ON p.polrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname IN ('link_clicks', 'page_views')
    AND (p.polname LIKE '%view their own%' OR p.polname LIKE '%view own%')
ORDER BY c.relname, p.polname;

-- Note: Policies should now show "✅ Optimized" status
-- The expression "(( SELECT auth.uid() AS uid) = owner_id)" IS optimized
-- because it uses SELECT auth.uid() instead of auth.uid() directly

