-- Fix for "Function has a mutable search_path" warning
-- This is a security warning, not a blocking error
-- You can run this AFTER the migration if you want to fix the warning

-- Check current function definition
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
    AND p.proname = 'is_rate_limited';

-- Fix: Recreate function with SECURITY DEFINER and fixed search_path
-- Note: You'll need to see the current function definition first, then recreate it
-- with: SET search_path = public, pg_temp

-- Example (adjust based on actual function):
/*
CREATE OR REPLACE FUNCTION public.is_rate_limited(
    -- function parameters here
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- function body here
END;
$$;
*/


