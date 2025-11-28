-- Fix Duplicate Permissive Policies on collections table
-- This addresses the issue: "Table public.collections has multiple permissive policies for role authenticated for action SELECT"
--
-- The issue: Having multiple permissive policies can lead to unexpected behavior
-- The fix: Consolidate into a single policy with OR logic
--
-- Run this in Supabase SQL Editor to fix the duplicate policies

-- ============================================================================
-- First, let's check what SELECT policies exist on collections
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'collections'
    AND cmd = 'SELECT'
ORDER BY policyname;

-- ============================================================================
-- Fix duplicate SELECT policies
-- ============================================================================

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Anyone can view public collections" ON collections;
DROP POLICY IF EXISTS "Users can view own collections" ON collections;
DROP POLICY IF EXISTS "Users can view own or public collections" ON collections;

-- Create a single consolidated SELECT policy for authenticated
-- This allows users to view their own collections OR public collections
CREATE POLICY "Users can view own or public collections"
ON collections FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id
    OR visibility = 'public'
    OR visibility = 'unlisted'
);

-- Create separate policy for anonymous users (public only)
CREATE POLICY "Anyone can view public collections"
ON collections FOR SELECT
TO anon
USING (visibility = 'public' OR visibility = 'unlisted');

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that policies are now properly separated
SELECT 
    policyname,
    cmd as command,
    roles,
    CASE 
        WHEN COUNT(*) OVER (PARTITION BY tablename, cmd, roles) = 1 THEN '✅ Single policy per role'
        ELSE '⚠️ Multiple policies for same role'
    END as status
FROM pg_policies
WHERE tablename = 'collections'
    AND cmd = 'SELECT'
ORDER BY roles, policyname;

-- Note: Should show:
-- - 1 policy for 'authenticated' role: "Users can view own or public collections"
-- - 1 policy for 'anon' role: "Anyone can view public collections"

