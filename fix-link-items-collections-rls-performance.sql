-- Fix RLS Policy Performance Issues on link_items and collections tables
-- This addresses the performance warning about auth.uid() being called for each row
--
-- The issue: Policies using auth.uid() directly are evaluated for each row
-- The fix: Wrap auth.uid() in a subquery (SELECT auth.uid()) to evaluate once per query
--
-- This script fixes policies on:
-- - link_items table: "Users can view own link_items" and "Users can update own link_items"
-- - collections table: "Users can view own collections"
--
-- Run this in Supabase SQL Editor to fix the performance issues

-- ============================================================================
-- First, let's check what policies exist on link_items and collections
-- ============================================================================

SELECT 
    'link_items' as table_name,
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'link_items'
UNION ALL
SELECT 
    'collections' as table_name,
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'collections'
ORDER BY table_name, policyname;

-- ============================================================================
-- Fix link_items policies
-- ============================================================================

-- Fix "Users can view own link_items" policy (SELECT)
-- Note: This policy may check ownership through link_lists table
DROP POLICY IF EXISTS "Users can view own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can view links in own or public collections" ON link_items;
DROP POLICY IF EXISTS "Users can view links for own collections" ON link_items;

-- Recreate with optimized auth.uid() call
-- This version checks ownership through link_lists
CREATE POLICY "Users can view own link_items"
ON link_items FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND (
            link_lists.owner_id = (SELECT auth.uid())
            OR link_lists.visibility = 'public'
        )
    )
);

-- Also create public access policy if needed (drop first if exists)
DROP POLICY IF EXISTS "Anyone can view links in public collections" ON link_items;
DROP POLICY IF EXISTS "Anyone can view links for public collections" ON link_items;
CREATE POLICY "Anyone can view links in public collections"
ON link_items FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.visibility = 'public'
    )
);

-- Fix "Users can update own link_items" policy (UPDATE)
DROP POLICY IF EXISTS "Users can update own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can update links in own collections" ON link_items;
DROP POLICY IF EXISTS "Users can update links for own collections" ON link_items;

CREATE POLICY "Users can update own link_items"
ON link_items FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
);

-- Also fix INSERT and DELETE policies for consistency
DROP POLICY IF EXISTS "Users can insert own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can insert links in own collections" ON link_items;

CREATE POLICY "Users can insert own link_items"
ON link_items FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "Users can delete own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can delete links in own collections" ON link_items;

CREATE POLICY "Users can delete own link_items"
ON link_items FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
);

-- ============================================================================
-- Fix collections policies
-- ============================================================================

-- Fix "Users can view own collections" policy (SELECT)
DROP POLICY IF EXISTS "Users can view own collections" ON collections;

-- Recreate with optimized auth.uid() call
-- Note: This assumes collections table has user_id column. Adjust if it uses owner_id.
CREATE POLICY "Users can view own collections"
ON collections FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- Also create public access policy if needed (drop first if exists)
DROP POLICY IF EXISTS "Anyone can view public collections" ON collections;
CREATE POLICY "Anyone can view public collections"
ON collections FOR SELECT
TO anon, authenticated
USING (visibility = 'public');

-- Also fix other collections policies for consistency
DROP POLICY IF EXISTS "Users can insert own collections" ON collections;
CREATE POLICY "Users can insert own collections"
ON collections FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own collections" ON collections;
CREATE POLICY "Users can update own collections"
ON collections FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own collections" ON collections;
CREATE POLICY "Users can delete own collections"
ON collections FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = user_id);

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
WHERE c.relname IN ('link_items', 'collections')
ORDER BY c.relname, p.polname;

-- Note: Policies should now show "✅ Optimized" status

