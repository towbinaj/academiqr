-- Verify Row Level Security (RLS) Policies
-- Run this script in Supabase SQL Editor to verify RLS is properly configured
-- This addresses the critical security requirement to verify server-side authorization

-- ============================================================================
-- 1. Check if RLS is enabled on critical tables
-- ============================================================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('link_lists', 'link_items', 'profiles', 'link_clicks', 'analytics_events')
ORDER BY tablename;

-- Expected: All tables should show "RLS Enabled" = true

-- ============================================================================
-- 2. List all RLS policies for critical tables
-- ============================================================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as "Command",
    qual as "Using Expression",
    with_check as "With Check Expression"
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename IN ('link_lists', 'link_items', 'profiles', 'link_clicks', 'analytics_events')
ORDER BY tablename, policyname;

-- Expected: Each table should have policies for SELECT, INSERT, UPDATE, DELETE
-- All policies should check auth.uid() = owner_id (or equivalent)

-- ============================================================================
-- 3. Verify link_lists policies (Collections)
-- ============================================================================

-- Check SELECT policy
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_lists'
    AND cmd = 'SELECT';

-- Expected: Policy should check auth.uid() = owner_id
-- Example: "auth.uid() = owner_id"

-- Check INSERT policy
SELECT 
    policyname,
    cmd,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_lists'
    AND cmd = 'INSERT';

-- Expected: Policy should check auth.uid() = owner_id
-- Example: "auth.uid() = owner_id"

-- Check UPDATE policy
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_lists'
    AND cmd = 'UPDATE';

-- Expected: Policy should check auth.uid() = owner_id
-- Example: "auth.uid() = owner_id"

-- Check DELETE policy
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_lists'
    AND cmd = 'DELETE';

-- Expected: Policy should check auth.uid() = owner_id
-- Example: "auth.uid() = owner_id"

-- ============================================================================
-- 4. Verify link_items policies (Links)
-- ============================================================================

-- Check SELECT policy
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_items'
    AND cmd = 'SELECT';

-- Expected: Policy should check ownership through link_lists
-- Example: "EXISTS (SELECT 1 FROM link_lists WHERE link_lists.id = link_items.list_id AND link_lists.owner_id = auth.uid())"

-- Check INSERT policy
SELECT 
    policyname,
    cmd,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_items'
    AND cmd = 'INSERT';

-- Expected: Policy should check ownership through link_lists

-- Check UPDATE policy
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_items'
    AND cmd = 'UPDATE';

-- Expected: Policy should check ownership through link_lists

-- Check DELETE policy
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_items'
    AND cmd = 'DELETE';

-- Expected: Policy should check ownership through link_lists

-- ============================================================================
-- 5. Verify profiles policies
-- ============================================================================

SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'profiles'
ORDER BY cmd;

-- Expected: Policies should check auth.uid() = id
-- Users can only access their own profile

-- ============================================================================
-- 6. Check for missing policies (tables with RLS enabled but no policies)
-- ============================================================================

SELECT 
    t.tablename,
    COUNT(p.policyname) as "Policy Count"
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public'
    AND t.tablename IN ('link_lists', 'link_items', 'profiles', 'link_clicks', 'analytics_events')
    AND (SELECT rowsecurity FROM pg_tables WHERE schemaname = t.schemaname AND tablename = t.tablename) = true
GROUP BY t.tablename
HAVING COUNT(p.policyname) = 0;

-- Expected: No rows returned (all tables with RLS should have policies)

-- ============================================================================
-- 7. Verify public access to link_lists (for public/passkey collections)
-- ============================================================================

-- Check if there's a policy allowing public SELECT for public collections
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
    AND tablename = 'link_lists'
    AND cmd = 'SELECT'
    AND (qual LIKE '%visibility%' OR qual LIKE '%public%');

-- Expected: Should have a policy allowing SELECT for public collections
-- Example: "visibility = 'public' OR (visibility = 'public' AND passkey IS NOT NULL)"

-- ============================================================================
-- 8. Summary Report
-- ============================================================================

SELECT 
    'link_lists' as table_name,
    COUNT(*) FILTER (WHERE cmd = 'SELECT') as select_policies,
    COUNT(*) FILTER (WHERE cmd = 'INSERT') as insert_policies,
    COUNT(*) FILTER (WHERE cmd = 'UPDATE') as update_policies,
    COUNT(*) FILTER (WHERE cmd = 'DELETE') as delete_policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'link_lists'

UNION ALL

SELECT 
    'link_items' as table_name,
    COUNT(*) FILTER (WHERE cmd = 'SELECT') as select_policies,
    COUNT(*) FILTER (WHERE cmd = 'INSERT') as insert_policies,
    COUNT(*) FILTER (WHERE cmd = 'UPDATE') as update_policies,
    COUNT(*) FILTER (WHERE cmd = 'DELETE') as delete_policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'link_items'

UNION ALL

SELECT 
    'profiles' as table_name,
    COUNT(*) FILTER (WHERE cmd = 'SELECT') as select_policies,
    COUNT(*) FILTER (WHERE cmd = 'INSERT') as insert_policies,
    COUNT(*) FILTER (WHERE cmd = 'UPDATE') as update_policies,
    COUNT(*) FILTER (WHERE cmd = 'DELETE') as delete_policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Expected: Each table should have at least 1 policy for each command (SELECT, INSERT, UPDATE, DELETE)

-- ============================================================================
-- RECOMMENDED POLICIES (if missing)
-- ============================================================================

-- If policies are missing, here are recommended policies to create:

/*
-- Enable RLS on link_lists
ALTER TABLE public.link_lists ENABLE ROW LEVEL SECURITY;

-- Policy: Users can SELECT their own collections OR public collections
CREATE POLICY "Users can view own or public collections"
ON public.link_lists FOR SELECT
USING (
    auth.uid() = owner_id 
    OR visibility = 'public'
);

-- Policy: Users can INSERT their own collections
CREATE POLICY "Users can insert own collections"
ON public.link_lists FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can UPDATE their own collections
CREATE POLICY "Users can update own collections"
ON public.link_lists FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Policy: Users can DELETE their own collections
CREATE POLICY "Users can delete own collections"
ON public.link_lists FOR DELETE
USING (auth.uid() = owner_id);

-- Enable RLS on link_items
ALTER TABLE public.link_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can SELECT links in their own collections OR public collections
CREATE POLICY "Users can view links in own or public collections"
ON public.link_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND (
            link_lists.owner_id = auth.uid() 
            OR link_lists.visibility = 'public'
        )
    )
);

-- Policy: Users can INSERT links in their own collections
CREATE POLICY "Users can insert links in own collections"
ON public.link_items FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = auth.uid()
    )
);

-- Policy: Users can UPDATE links in their own collections
CREATE POLICY "Users can update links in own collections"
ON public.link_items FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = auth.uid()
    )
);

-- Policy: Users can DELETE links in their own collections
CREATE POLICY "Users can delete links in own collections"
ON public.link_items FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.link_lists 
        WHERE link_lists.id = link_items.list_id 
        AND link_lists.owner_id = auth.uid()
    )
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can SELECT their own profile OR public profiles
CREATE POLICY "Users can view own or public profiles"
ON public.profiles FOR SELECT
USING (
    auth.uid() = id 
    OR true  -- Allow public profiles (adjust based on your requirements)
);

-- Policy: Users can INSERT their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Users can UPDATE their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Users can DELETE their own profile
CREATE POLICY "Users can delete own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = id);
*/

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. Run each section separately to verify RLS configuration
-- 2. If policies are missing, uncomment and run the recommended policies section
-- 3. Adjust policies based on your specific requirements (e.g., public profile access)
-- 4. Test policies by trying to access other users' data (should fail)
-- 5. Verify public collections are accessible without authentication

