-- Fix Duplicate Permissive Policies on analytics_events table
-- This addresses the issue: "Table public.analytics_events has multiple permissive policies for role anon for action INSERT"
--
-- The issue: Having multiple permissive policies can lead to unexpected behavior
-- The fix: Consolidate into a single policy
--
-- Run this in Supabase SQL Editor to fix the duplicate policies

-- ============================================================================
-- First, let's check what INSERT policies exist on analytics_events
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'analytics_events'
    AND cmd = 'INSERT'
ORDER BY policyname;

-- ============================================================================
-- Fix duplicate INSERT policies
-- ============================================================================

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Anyone can insert analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "analytics_insert_any" ON analytics_events;
DROP POLICY IF EXISTS "Users can insert own analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Users can insert analytics_events" ON analytics_events;

-- Create a single consolidated INSERT policy
-- This allows both anon and authenticated users to insert (for analytics tracking)
CREATE POLICY "analytics_insert_any"
ON analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that only one INSERT policy exists now
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
    AND cmd = 'INSERT'
ORDER BY policyname;

-- Note: Should show only 1 INSERT policy with "✅ Single policy" status

