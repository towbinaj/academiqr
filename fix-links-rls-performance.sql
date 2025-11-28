-- Fix RLS Policy Performance Issues on links table
-- This addresses the performance warning about auth.uid() being called for each row
--
-- The issue: Policies using auth.uid() directly are evaluated for each row
-- The fix: Wrap auth.uid() in a subquery (SELECT auth.uid()) to evaluate once per query
--
-- This script fixes policies on links table:
-- - "Users can delete links for own collections" (DELETE policy)
-- - Also fixes other links policies for consistency (SELECT, INSERT, UPDATE)
--
-- Note: links table checks ownership through collections table using collection_id
--
-- Run this in Supabase SQL Editor to fix the performance issues

-- ============================================================================
-- First, let's check what policies exist on links
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'links'
ORDER BY policyname;

-- ============================================================================
-- Fix links policies
-- ============================================================================

-- Fix "Users can view links for own collections" policy (SELECT)
DROP POLICY IF EXISTS "Users can view links for own collections" ON links;
DROP POLICY IF EXISTS "Users can view links in own or public collections" ON links;

CREATE POLICY "Users can view links for own collections"
ON links FOR SELECT
TO authenticated
USING (
    collection_id IN (
        SELECT id FROM collections WHERE user_id = (SELECT auth.uid())
    )
);

-- Fix "Users can insert links for own collections" policy (INSERT)
DROP POLICY IF EXISTS "Users can insert links for own collections" ON links;
DROP POLICY IF EXISTS "Users can insert links in own collections" ON links;

CREATE POLICY "Users can insert links for own collections"
ON links FOR INSERT
TO authenticated
WITH CHECK (
    collection_id IN (
        SELECT id FROM collections WHERE user_id = (SELECT auth.uid())
    )
);

-- Fix "Users can update links for own collections" policy (UPDATE)
DROP POLICY IF EXISTS "Users can update links for own collections" ON links;
DROP POLICY IF EXISTS "Users can update links in own collections" ON links;

CREATE POLICY "Users can update links for own collections"
ON links FOR UPDATE
TO authenticated
USING (
    collection_id IN (
        SELECT id FROM collections WHERE user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    collection_id IN (
        SELECT id FROM collections WHERE user_id = (SELECT auth.uid())
    )
);

-- Fix "Users can delete links for own collections" policy (DELETE)
DROP POLICY IF EXISTS "Users can delete links for own collections" ON links;
DROP POLICY IF EXISTS "Users can delete links in own collections" ON links;

CREATE POLICY "Users can delete links for own collections"
ON links FOR DELETE
TO authenticated
USING (
    collection_id IN (
        SELECT id FROM collections WHERE user_id = (SELECT auth.uid())
    )
);

-- Also fix public access policy if it exists (doesn't need optimization but good to have)
DROP POLICY IF EXISTS "Anyone can view links for public collections" ON links;
DROP POLICY IF EXISTS "Anyone can view links in public collections" ON links;

CREATE POLICY "Anyone can view links for public collections"
ON links FOR SELECT
TO anon, authenticated
USING (
    collection_id IN (
        SELECT id FROM collections WHERE visibility = 'public'
    )
);

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
WHERE c.relname = 'links'
ORDER BY p.polname;

-- Note: Policies should now show "✅ Optimized" status

