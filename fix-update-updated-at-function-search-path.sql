-- Fix mutable search_path warning for update_updated_at_column function
-- This addresses the security warning: "Function public.update_updated_at_column has a role mutable search_path"
--
-- Run this in Supabase SQL Editor to fix the existing function

-- ============================================================================
-- Fix update_updated_at_column function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- Verify the fix
-- ============================================================================

-- Check that the function now has fixed search_path
SELECT 
    p.proname as function_name,
    CASE 
        WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path%' THEN '✅ Fixed'
        ELSE '⚠️ Still has mutable search_path'
    END as status,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
    AND p.proname = 'update_updated_at_column';

-- Note: The function should now show "✅ Fixed" status and SET search_path in its definition

