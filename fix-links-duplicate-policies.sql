-- Fix Duplicate SELECT Policies on links table
-- This addresses the issue: "Table public.links has multiple permissive policies for role authenticated for action SELECT"
--
-- The issue: Having multiple permissive policies can lead to unexpected behavior
-- The fix: Consolidate into a single SELECT policy with OR logic
--
-- Run this in Supabase SQL Editor to fix the duplicate policies

-- ============================================================================
-- First, let's check what SELECT policies exist on links
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'links'
    AND cmd = 'SELECT'
ORDER BY policyname;

-- ============================================================================
-- Fix duplicate SELECT policies
-- ============================================================================

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Anyone can view links for public collections" ON links;
DROP POLICY IF EXISTS "Anyone can view links in public collections" ON links;
DROP POLICY IF EXISTS "Users can view links for own collections" ON links;
DROP POLICY IF EXISTS "Users can view links in own or public collections" ON links;

-- Create a single consolidated SELECT policy for authenticated
-- This allows users to view links in their own collections OR public collections
CREATE POLICY "Users can view links for own or public collections"
ON links FOR SELECT
TO authenticated
USING (
    collection_id IN (
        SELECT id FROM collections 
        WHERE user_id = (SELECT auth.uid())
        OR visibility = 'public'
        OR visibility = 'unlisted'
    )
);

-- Create separate policy for anonymous users (public only)
CREATE POLICY "Anyone can view links for public collections"
ON links FOR SELECT
TO anon
USING (
    collection_id IN (
        SELECT id FROM collections 
        WHERE visibility = 'public'
        OR visibility = 'unlisted'
    )
);

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that policies are now properly separated
SELECT 
    policyname,
    cmd as command,
    roles::text as roles_text,
    CASE 
        WHEN COUNT(*) OVER (PARTITION BY tablename, cmd, roles) = 1 THEN '✅ Single policy per role'
        ELSE '⚠️ Multiple policies for same role'
    END as status
FROM pg_policies
WHERE tablename = 'links'
    AND cmd = 'SELECT'
ORDER BY roles, policyname;

-- Note: Should show:
-- - 1 policy for 'authenticated' role: "Users can view links for own or public collections"
-- - 1 policy for 'anon' role: "Anyone can view links for public collections"

