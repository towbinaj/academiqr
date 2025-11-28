-- Fix Duplicate SELECT Policies on analytics_events table
-- This addresses the issue: "Table public.analytics_events has multiple permissive policies for role authenticated for action SELECT"
--
-- The issue: Having multiple permissive policies can lead to unexpected behavior
-- The fix: Consolidate into a single SELECT policy
--
-- Run this in Supabase SQL Editor to fix the duplicate policies

-- ============================================================================
-- First, let's check what SELECT policies exist on analytics_events
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'analytics_events'
    AND cmd = 'SELECT'
ORDER BY policyname;

-- ============================================================================
-- Fix duplicate SELECT policies
-- ============================================================================

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Users can view own analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Users can view their own analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Users can view analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "analytics_select_owner_lists" ON analytics_events;

-- Create single consolidated SELECT policy
-- This policy checks ownership through link_lists table using list_id
CREATE POLICY "analytics_select_owner_lists"
ON analytics_events FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = analytics_events.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
);

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that only one SELECT policy exists for authenticated role
-- Note: roles is an array, so we need to check if 'authenticated' is in the array
SELECT 
    policyname,
    cmd as command,
    roles,
    CASE 
        WHEN COUNT(*) OVER (PARTITION BY tablename, cmd) = 1 THEN '✅ Single policy'
        ELSE '⚠️ Multiple policies'
    END as status
FROM pg_policies
WHERE tablename = 'analytics_events'
    AND cmd = 'SELECT'
    AND 'authenticated' = ANY(roles)
ORDER BY policyname;

-- Note: Should show only 1 SELECT policy for authenticated role with "✅ Single policy" status

