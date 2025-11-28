-- Fix Duplicate Permissive Policies on link_items table
-- This addresses multiple duplicate policies for different actions and roles
--
-- The issue: Having multiple permissive policies can lead to unexpected behavior
-- The fix: Consolidate into single policies per role/action combination
--
-- Run this in Supabase SQL Editor to fix the duplicate policies

-- ============================================================================
-- First, let's check what policies exist on link_items
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'link_items'
ORDER BY cmd, roles, policyname;

-- ============================================================================
-- Fix duplicate SELECT policies
-- ============================================================================

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Anyone can view links in public collections" ON link_items;
DROP POLICY IF EXISTS "Anyone can view links for public collections" ON link_items;
DROP POLICY IF EXISTS "Users can view own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can view links in own or public collections" ON link_items;
DROP POLICY IF EXISTS "Users can view links for own collections" ON link_items;
DROP POLICY IF EXISTS "items_select_public_or_owner" ON link_items;

-- Create consolidated SELECT policy for anon (public only)
-- This policy ONLY applies to anon role
CREATE POLICY "items_select_public"
ON link_items FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.visibility = 'public'
    )
);

-- Create consolidated SELECT policy for authenticated (own OR public OR unlisted)
-- This policy ONLY applies to authenticated role
CREATE POLICY "items_select_public_or_owner"
ON link_items FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND (
            link_lists.owner_id = (SELECT auth.uid())
            OR link_lists.visibility = 'public'
            OR link_lists.visibility = 'unlisted'
        )
    )
);

-- ============================================================================
-- Fix duplicate INSERT policies
-- ============================================================================

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Users can insert own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can insert links in own collections" ON link_items;
DROP POLICY IF EXISTS "Users can insert links for own collections" ON link_items;
DROP POLICY IF EXISTS "items_insert_owner_only" ON link_items;

-- Create single consolidated INSERT policy
CREATE POLICY "items_insert_owner_only"
ON link_items FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = (SELECT auth.uid())
    )
);

-- ============================================================================
-- Fix duplicate UPDATE policies
-- ============================================================================

-- Drop all existing UPDATE policies
DROP POLICY IF EXISTS "Users can update own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can update links in own collections" ON link_items;
DROP POLICY IF EXISTS "Users can update links for own collections" ON link_items;
DROP POLICY IF EXISTS "items_update_owner_only" ON link_items;

-- Create single consolidated UPDATE policy
CREATE POLICY "items_update_owner_only"
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

-- ============================================================================
-- Fix duplicate DELETE policies
-- ============================================================================

-- Drop all existing DELETE policies
DROP POLICY IF EXISTS "Users can delete own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can delete links in own collections" ON link_items;
DROP POLICY IF EXISTS "Users can delete links for own collections" ON link_items;
DROP POLICY IF EXISTS "items_delete_owner_only" ON link_items;

-- Create single consolidated DELETE policy
CREATE POLICY "items_delete_owner_only"
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
WHERE tablename = 'link_items'
GROUP BY cmd, roles
ORDER BY cmd, roles;

-- Note: Each command/role combination should show "✅ Single policy" with count = 1

