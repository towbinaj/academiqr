-- Fix RLS Policy Performance Issues on rate_limit_attempts table
-- This addresses the performance warning about auth.uid() being called for each row
--
-- The issue: Policies using auth.uid() directly are evaluated for each row
-- The fix: Wrap auth.uid() in a subquery (SELECT auth.uid()) to evaluate once per query
--
-- This script fixes policies on rate_limit_attempts table:
-- - "Users can view their own rate limit attempts" (SELECT policy)
--
-- Run this in Supabase SQL Editor to fix the performance issues

-- ============================================================================
-- First, let's check what policies exist on rate_limit_attempts
-- ============================================================================

SELECT 
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'rate_limit_attempts'
ORDER BY policyname;

-- ============================================================================
-- Fix rate_limit_attempts policies
-- ============================================================================

-- Fix "Users can view their own rate limit attempts" policy (SELECT)
-- This policy checks ownership by matching user email to auth.users
DROP POLICY IF EXISTS "Users can view their own rate limit attempts" ON rate_limit_attempts;
DROP POLICY IF EXISTS "Users can view own rate limit attempts" ON rate_limit_attempts;

-- Recreate with optimized auth.uid() call
CREATE POLICY "Users can view their own rate limit attempts"
ON rate_limit_attempts
FOR SELECT
TO authenticated
USING ((SELECT auth.uid())::text = (SELECT id::text FROM auth.users WHERE email = rate_limit_attempts.email LIMIT 1));

-- ============================================================================
-- Note: Other policies on rate_limit_attempts don't need optimization:
-- - "Service role can insert rate limit attempts" - Uses service_role, no auth.uid()
-- - "Service role can read all rate limit attempts" - Uses service_role, no auth.uid()
-- ============================================================================

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
WHERE c.relname = 'rate_limit_attempts'
ORDER BY p.polname;

-- Note: The policy should now show "✅ Optimized" status

