-- Fix Public Site Access - Restore Public Viewing for Profiles, Themes, and Media
-- This addresses the issue where performance optimization scripts removed public access
--
-- The problem: Performance scripts changed policies to only allow viewing own data
-- The fix: Add public viewing policies while maintaining performance optimizations
--
-- This script fixes:
-- 1. Profiles - Allow public viewing (needed for public profile pages)
-- 2. user_themes - Allow public viewing (needed for theme elements on public profiles)
-- 3. user_media - Allow public viewing (needed for profile photos on public profiles)
--
-- Run this in Supabase SQL Editor to restore public site functionality

-- ============================================================================
-- First, let's check current policies
-- ============================================================================

-- Check profiles policies
SELECT 
    'profiles' as table_name,
    policyname,
    cmd as command,
    roles::text as roles_text,
    qual as using_expression
FROM pg_policies
WHERE tablename = 'profiles'
    AND cmd = 'SELECT'
ORDER BY policyname;

-- Check user_themes policies
SELECT 
    'user_themes' as table_name,
    policyname,
    cmd as command,
    roles::text as roles_text,
    qual as using_expression
FROM pg_policies
WHERE tablename = 'user_themes'
    AND cmd = 'SELECT'
ORDER BY policyname;

-- Check user_media policies
SELECT 
    'user_media' as table_name,
    policyname,
    cmd as command,
    roles::text as roles_text,
    qual as using_expression
FROM pg_policies
WHERE tablename = 'user_media'
    AND cmd = 'SELECT'
ORDER BY policyname;

-- ============================================================================
-- Fix profiles - Add public viewing policy
-- ============================================================================

-- Drop existing restrictive SELECT policy if it only allows own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
-- Drop the policy we're about to create (in case script was run before)
DROP POLICY IF EXISTS "Users can view own or any profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own or any profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create policy that allows viewing own profile OR any profile (for public site)
-- This maintains performance optimization while allowing public access
CREATE POLICY "Users can view own or any profile"
ON profiles FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = id 
    OR true  -- Allow viewing any profile (needed for public site)
);

-- Also allow anonymous users to view profiles (for public site)
CREATE POLICY "Anyone can view profiles"
ON profiles FOR SELECT
TO anon
USING (true);

-- ============================================================================
-- Fix user_themes - Add public viewing policy
-- ============================================================================

-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view own themes" ON user_themes;
DROP POLICY IF EXISTS "Users can view their own themes" ON user_themes;
-- Drop the policies we're about to create (in case script was run before)
DROP POLICY IF EXISTS "Users can view own or any themes" ON user_themes;
DROP POLICY IF EXISTS "Anyone can view themes" ON user_themes;

-- Create policy that allows viewing own themes OR any themes (for public site)
CREATE POLICY "Users can view own or any themes"
ON user_themes FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id 
    OR true  -- Allow viewing any themes (needed for public profiles)
);

-- Also allow anonymous users to view themes (for public site)
CREATE POLICY "Anyone can view themes"
ON user_themes FOR SELECT
TO anon
USING (true);

-- ============================================================================
-- Fix user_media - Add public viewing policy
-- ============================================================================

-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view own media" ON user_media;
DROP POLICY IF EXISTS "Users can view their own media" ON user_media;
-- Drop the policies we're about to create (in case script was run before)
DROP POLICY IF EXISTS "Users can view own or any media" ON user_media;
DROP POLICY IF EXISTS "Anyone can view media" ON user_media;

-- Create policy that allows viewing own media OR any media (for public site)
-- Note: This assumes user_media has a user_id column. If it uses owner_id, adjust accordingly.
CREATE POLICY "Users can view own or any media"
ON user_media FOR SELECT
TO authenticated
USING (
    (SELECT auth.uid()) = user_id 
    OR true  -- Allow viewing any media (needed for profile photos on public profiles)
);

-- Also allow anonymous users to view media (for public site)
CREATE POLICY "Anyone can view media"
ON user_media FOR SELECT
TO anon
USING (true);

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check profiles policies
SELECT 
    'profiles' as table_name,
    policyname,
    cmd as command,
    roles::text as roles_text,
    CASE 
        WHEN qual::text LIKE '%OR true%' OR qual::text = 'true' THEN '✅ Public access enabled'
        WHEN qual::text LIKE '%auth.uid()%' AND qual::text LIKE '%OR true%' THEN '✅ Own + Public access'
        ELSE '⚠️ Check policy'
    END as status
FROM pg_policies
WHERE tablename = 'profiles'
    AND cmd = 'SELECT'
ORDER BY roles, policyname;

-- Check user_themes policies
SELECT 
    'user_themes' as table_name,
    policyname,
    cmd as command,
    roles::text as roles_text,
    CASE 
        WHEN qual::text LIKE '%OR true%' OR qual::text = 'true' THEN '✅ Public access enabled'
        WHEN qual::text LIKE '%auth.uid()%' AND qual::text LIKE '%OR true%' THEN '✅ Own + Public access'
        ELSE '⚠️ Check policy'
    END as status
FROM pg_policies
WHERE tablename = 'user_themes'
    AND cmd = 'SELECT'
ORDER BY roles, policyname;

-- Check user_media policies
SELECT 
    'user_media' as table_name,
    policyname,
    cmd as command,
    roles::text as roles_text,
    CASE 
        WHEN qual::text LIKE '%OR true%' OR qual::text = 'true' THEN '✅ Public access enabled'
        WHEN qual::text LIKE '%auth.uid()%' AND qual::text LIKE '%OR true%' THEN '✅ Own + Public access'
        ELSE '⚠️ Check policy'
    END as status
FROM pg_policies
WHERE tablename = 'user_media'
    AND cmd = 'SELECT'
ORDER BY roles, policyname;

-- ============================================================================
-- Fix link_items - Ensure public access works for links in public/unlisted collections
-- ============================================================================

-- Check current link_items policies
SELECT 
    'link_items' as table_name,
    policyname,
    cmd as command,
    roles::text as roles_text,
    qual as using_expression
FROM pg_policies
WHERE tablename = 'link_items'
    AND cmd = 'SELECT'
ORDER BY policyname;

-- Drop existing restrictive policies
-- Drop all possible policy names to avoid conflicts
DROP POLICY IF EXISTS "Users can view own link_items" ON link_items;
DROP POLICY IF EXISTS "Users can view own or public link_items" ON link_items;
DROP POLICY IF EXISTS "Anyone can view links in public collections" ON link_items;
DROP POLICY IF EXISTS "Anyone can view links for public collections" ON link_items;

-- Create policy for authenticated users - can view own OR public/unlisted
CREATE POLICY "Users can view own or public link_items"
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

-- Create policy for anonymous users - can view public/unlisted only
CREATE POLICY "Anyone can view links in public collections"
ON link_items FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1 FROM link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND (
            link_lists.visibility = 'public'
            OR link_lists.visibility = 'unlisted'
        )
    )
);

-- ============================================================================
-- Fix link_lists (presentation information) - Ensure public access works
-- ============================================================================

-- Check if link_lists has proper public access
-- The performance script should have created a public policy, but let's ensure it exists
-- and works for both authenticated and anonymous users

-- Ensure public link_lists can be viewed by anyone
-- Drop all possible policy names to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view public link_lists" ON link_lists;
DROP POLICY IF EXISTS "Anyone can view public collections" ON link_lists;
DROP POLICY IF EXISTS "lists_select_public" ON link_lists;
DROP POLICY IF EXISTS "lists_select_public_or_owner" ON link_lists;
DROP POLICY IF EXISTS "Users can view own link_lists" ON link_lists;

-- Create policy for anonymous users (public/unlisted only)
CREATE POLICY "lists_select_public"
ON link_lists FOR SELECT
TO anon
USING (visibility = 'public' OR visibility = 'unlisted');

-- Create policy for authenticated users (own OR public/unlisted)
CREATE POLICY "lists_select_public_or_owner"
ON link_lists FOR SELECT
TO authenticated
USING (
    owner_id = (SELECT auth.uid())
    OR visibility = 'public' 
    OR visibility = 'unlisted'
);

-- ============================================================================
-- Verify link_lists policies
-- ============================================================================

SELECT 
    'link_lists' as table_name,
    policyname,
    cmd as command,
    roles::text as roles_text,
    CASE 
        WHEN qual::text LIKE '%visibility%public%' OR qual::text LIKE '%visibility%unlisted%' THEN '✅ Public access enabled'
        WHEN qual::text LIKE '%auth.uid()%' AND qual::text LIKE '%visibility%' THEN '✅ Own + Public access'
        ELSE '⚠️ Check policy'
    END as status
FROM pg_policies
WHERE tablename = 'link_lists'
    AND cmd = 'SELECT'
ORDER BY roles, policyname;

-- ============================================================================
-- Notes
-- ============================================================================
-- 
-- After running this script:
-- 1. Profiles should be viewable by anyone (authenticated and anonymous)
-- 2. Themes should be viewable by anyone (for public profile pages)
-- 3. Media (profile photos) should be viewable by anyone (for public profile pages)
-- 4. link_lists (presentation info) should be viewable if public/unlisted
-- 
-- The performance optimization (SELECT auth.uid()) is maintained where applicable
-- while adding public access with OR true conditions or visibility checks.
--
-- If user_media uses owner_id instead of user_id, update the policy accordingly.

