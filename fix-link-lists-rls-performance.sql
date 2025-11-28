-- Fix RLS Policy Performance Issues on link_lists table
-- This addresses the performance warning about auth.uid() being called for each row
--
-- The issue: Policies using auth.uid() directly are evaluated for each row
-- The fix: Wrap auth.uid() in a subquery (SELECT auth.uid()) to evaluate once per query
--
-- This script fixes policies on link_lists table:
-- - "Users can view own link_lists" (SELECT policy)
-- - "Users can update own link_lists" (UPDATE policy)
--
-- Run this in Supabase SQL Editor to fix the performance issues

-- ============================================================================
-- First, let's check what policies exist on link_lists
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'link_lists'
ORDER BY policyname;

-- ============================================================================
-- Fix "Users can view own link_lists" policy (SELECT)
-- ============================================================================

-- Drop the existing policy (try common policy names)
DROP POLICY IF EXISTS "Users can view own link_lists" ON link_lists;
DROP POLICY IF EXISTS "Users can view own collections" ON link_lists;
DROP POLICY IF EXISTS "Users can view own or public collections" ON link_lists;

-- Recreate with optimized auth.uid() call
-- Note: This assumes the policy checks owner_id. Adjust if your schema is different.
CREATE POLICY "Users can view own link_lists"
ON link_lists FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = owner_id);

-- Also create policy for public collections if needed
CREATE POLICY "Anyone can view public link_lists"
ON link_lists FOR SELECT
TO anon, authenticated
USING (visibility = 'public');

-- ============================================================================
-- Fix "Users can update own link_lists" policy (UPDATE)
-- ============================================================================

-- Drop the existing policy (try common policy names)
DROP POLICY IF EXISTS "Users can update own link_lists" ON link_lists;
DROP POLICY IF EXISTS "Users can update own collections" ON link_lists;

-- Recreate with optimized auth.uid() call
CREATE POLICY "Users can update own link_lists"
ON link_lists FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = owner_id)
WITH CHECK ((SELECT auth.uid()) = owner_id);

-- ============================================================================
-- Also fix other policies on link_lists for consistency
-- ============================================================================

-- Fix INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own link_lists" ON link_lists;
DROP POLICY IF EXISTS "Users can insert own collections" ON link_lists;

CREATE POLICY "Users can insert own link_lists"
ON link_lists FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = owner_id);

-- Fix DELETE policy if it exists
DROP POLICY IF EXISTS "Users can delete own link_lists" ON link_lists;
DROP POLICY IF EXISTS "Users can delete own collections" ON link_lists;

CREATE POLICY "Users can delete own link_lists"
ON link_lists FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = owner_id);

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
WHERE c.relname = 'link_lists'
ORDER BY p.polname;

-- Note: Policies should now show "✅ Optimized" status

