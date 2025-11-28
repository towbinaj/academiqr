-- Fix Duplicate Permissive Policies on link_lists table
-- This addresses multiple duplicate policies for different actions and roles
--
-- The issue: Having multiple permissive policies can lead to unexpected behavior
-- The fix: Consolidate into single policies per role/action combination
--
-- Run this in Supabase SQL Editor to fix the duplicate policies

-- ============================================================================
-- First, let's check what policies exist on link_lists
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'link_lists'
ORDER BY cmd, roles, policyname;

-- ============================================================================
-- Fix duplicate SELECT policies
-- ============================================================================

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Anyone can view public link_lists" ON link_lists;
DROP POLICY IF EXISTS "Link lists are publicly readable" ON link_lists;
DROP POLICY IF EXISTS "Users can view own link_lists" ON link_lists;
DROP POLICY IF EXISTS "Users can view own or public collections" ON link_lists;
DROP POLICY IF EXISTS "Users can view own collections" ON link_lists;
DROP POLICY IF EXISTS "lists_select_public_or_owner" ON link_lists;
DROP POLICY IF EXISTS "lists_select_public" ON link_lists;

-- Create consolidated SELECT policy for anon (public only)
-- This policy ONLY applies to anon role
CREATE POLICY "lists_select_public"
ON link_lists FOR SELECT
TO anon
USING (
    visibility = 'public'
    OR visibility = 'unlisted'
);

-- Create consolidated SELECT policy for authenticated (own OR public OR unlisted)
-- This policy ONLY applies to authenticated role
CREATE POLICY "lists_select_public_or_owner"
ON link_lists FOR SELECT
TO authenticated
USING (
    owner_id = (SELECT auth.uid())
    OR visibility = 'public'
    OR visibility = 'unlisted'
);

-- Create consolidated SELECT policy for dashboard_user (own OR public OR unlisted)
-- This policy ONLY applies to dashboard_user role
-- Note: dashboard_user typically needs same access as authenticated
CREATE POLICY "lists_select_public_or_owner_dashboard"
ON link_lists FOR SELECT
TO dashboard_user
USING (
    owner_id = (SELECT auth.uid())
    OR visibility = 'public'
    OR visibility = 'unlisted'
);

-- ============================================================================
-- Fix duplicate INSERT policies
-- ============================================================================

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Users can insert own link_lists" ON link_lists;
DROP POLICY IF EXISTS "Users can insert own collections" ON link_lists;
DROP POLICY IF EXISTS "lists_insert_owner_only" ON link_lists;

-- Create single consolidated INSERT policy
CREATE POLICY "lists_insert_owner_only"
ON link_lists FOR INSERT
TO authenticated
WITH CHECK (owner_id = (SELECT auth.uid()));

-- ============================================================================
-- Fix duplicate UPDATE policies
-- ============================================================================

-- Drop all existing UPDATE policies
DROP POLICY IF EXISTS "Users can update own link_lists" ON link_lists;
DROP POLICY IF EXISTS "Users can update own collections" ON link_lists;
DROP POLICY IF EXISTS "lists_update_owner_only" ON link_lists;

-- Create single consolidated UPDATE policy
CREATE POLICY "lists_update_owner_only"
ON link_lists FOR UPDATE
TO authenticated
USING (owner_id = (SELECT auth.uid()))
WITH CHECK (owner_id = (SELECT auth.uid()));

-- ============================================================================
-- Fix duplicate DELETE policies
-- ============================================================================

-- Drop all existing DELETE policies
DROP POLICY IF EXISTS "Users can delete own link_lists" ON link_lists;
DROP POLICY IF EXISTS "Users can delete own collections" ON link_lists;
DROP POLICY IF EXISTS "lists_delete_owner_only" ON link_lists;

-- Create single consolidated DELETE policy
CREATE POLICY "lists_delete_owner_only"
ON link_lists FOR DELETE
TO authenticated
USING (owner_id = (SELECT auth.uid()));

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that each role/action combination has only one policy
SELECT 
    cmd as command,
    roles,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policy_names,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ Single policy'
        ELSE '⚠️ Multiple policies'
    END as status
FROM pg_policies
WHERE tablename = 'link_lists'
GROUP BY cmd, roles
ORDER BY cmd, roles;

-- Note: Each command/role combination should show "✅ Single policy" with count = 1

