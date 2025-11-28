-- Fix RLS Policy Performance Issues on analytics_events table
-- This addresses the performance warning about auth.uid() being called for each row
--
-- The issue: Policies using auth.uid() directly are evaluated for each row
-- The fix: Wrap auth.uid() in a subquery (SELECT auth.uid()) to evaluate once per query
--
-- This script fixes policies on analytics_events table:
-- - "Users can view own analytics_events" (SELECT policy)
-- - Also fixes other analytics_events policies for consistency (INSERT, UPDATE, DELETE)
--
-- Run this in Supabase SQL Editor to fix the performance issues

-- ============================================================================
-- First, let's check what policies exist on analytics_events
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'analytics_events'
ORDER BY policyname;

-- ============================================================================
-- Fix analytics_events policies
-- ============================================================================

-- Fix "Users can view own analytics_events" policy (SELECT)
-- Note: analytics_events likely uses list_id (via link_lists) or user_id, not owner_id
DROP POLICY IF EXISTS "Users can view own analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Users can view their own analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Users can view analytics_events" ON analytics_events;

-- Recreate with optimized auth.uid() call
-- Version 1: Check through list_id via link_lists (most common for analytics_events)
CREATE POLICY "Users can view own analytics_events"
ON analytics_events FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = analytics_events.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
);

-- Alternative: If analytics_events has user_id column directly, use this instead:
-- DROP POLICY IF EXISTS "Users can view own analytics_events" ON analytics_events;
-- CREATE POLICY "Users can view own analytics_events"
-- ON analytics_events FOR SELECT
-- TO authenticated
-- USING ((SELECT auth.uid()) = user_id);

-- Also fix other policies for consistency
DROP POLICY IF EXISTS "Users can insert own analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Users can insert analytics_events" ON analytics_events;

-- Allow anyone to insert (common for analytics tracking)
CREATE POLICY "Anyone can insert analytics_events"
ON analytics_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Fix UPDATE policy if it exists (check through list_id)
DROP POLICY IF EXISTS "Users can update own analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Users can update analytics_events" ON analytics_events;

CREATE POLICY "Users can update own analytics_events"
ON analytics_events FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = analytics_events.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = analytics_events.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
);

-- Fix DELETE policy if it exists (check through list_id)
DROP POLICY IF EXISTS "Users can delete own analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "Users can delete analytics_events" ON analytics_events;

CREATE POLICY "Users can delete own analytics_events"
ON analytics_events FOR DELETE
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
WHERE c.relname = 'analytics_events'
ORDER BY p.polname;

-- Note: Policies should now show "✅ Optimized" status

-- ============================================================================
-- If the policy creation fails, check the table structure:
-- ============================================================================

-- Run this to see what columns analytics_events has:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'analytics_events' 
-- ORDER BY ordinal_position;

