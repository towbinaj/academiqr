-- Fix Duplicate SELECT Policies on page_views table
-- This addresses the issue: "Table public.page_views has multiple permissive policies for role authenticated for action SELECT"
--
-- The issue: Having multiple permissive policies can lead to unexpected behavior
-- The fix: Consolidate into a single SELECT policy
--
-- Run this in Supabase SQL Editor to fix the duplicate policies

-- ============================================================================
-- First, let's check what SELECT policies exist on page_views
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'page_views'
    AND cmd = 'SELECT'
ORDER BY policyname;

-- ============================================================================
-- Fix duplicate SELECT policies
-- ============================================================================

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Users can view own page_views" ON page_views;
DROP POLICY IF EXISTS "Users can view their own page views" ON page_views;

-- Create a single consolidated SELECT policy for authenticated
-- This allows users to view their own page views
CREATE POLICY "Users can view their own page views"
ON page_views FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = owner_id);

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that policies are now properly consolidated
SELECT 
    policyname,
    cmd as command,
    roles::text as roles_text,
    CASE 
        WHEN COUNT(*) OVER (PARTITION BY tablename, cmd, roles) = 1 THEN '✅ Single policy per role'
        ELSE '⚠️ Multiple policies for same role'
    END as status
FROM pg_policies
WHERE tablename = 'page_views'
    AND cmd = 'SELECT'
ORDER BY roles, policyname;

-- Note: Should show:
-- - 1 policy for 'authenticated' role: "Users can view their own page views"

