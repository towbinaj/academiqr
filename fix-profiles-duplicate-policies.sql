-- Fix Duplicate Permissive Policies on profiles table
-- This addresses multiple duplicate policies for different actions and roles
--
-- The issue: Having multiple permissive policies can lead to unexpected behavior
-- The fix: Consolidate into single policies per role/action combination
--
-- Run this in Supabase SQL Editor to fix the duplicate policies

-- ============================================================================
-- First, let's check what policies exist on profiles
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, roles, policyname;

-- ============================================================================
-- Fix duplicate SELECT policies
-- ============================================================================

-- Drop all existing SELECT policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;

-- Create single consolidated SELECT policy
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

-- ============================================================================
-- Fix duplicate INSERT policies
-- ============================================================================

-- Drop all existing INSERT policies
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_all" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON profiles;

-- Create single consolidated INSERT policy
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================================================
-- Fix duplicate UPDATE policies
-- ============================================================================

-- Drop all existing UPDATE policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_update_any" ON profiles;
DROP POLICY IF EXISTS "profiles_update_self" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

-- Create single consolidated UPDATE policy
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================================================
-- Note: DELETE policy should remain as is (if it exists)
-- ============================================================================

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that each role/action combination has only one policy
SELECT 
    cmd as command,
    roles::text as roles_text,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policy_names,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ Single policy'
        ELSE '⚠️ Multiple policies'
    END as status
FROM pg_policies
WHERE tablename = 'profiles'
GROUP BY cmd, roles
ORDER BY cmd, roles;

-- Note: Each command/role combination should show "✅ Single policy" with count = 1

