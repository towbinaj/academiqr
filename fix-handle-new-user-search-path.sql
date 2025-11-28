-- Fix mutable search_path warning for handle_new_user function
-- This addresses the security warning: "Function public.handle_new_user has a role mutable search_path"
--
-- Run this in Supabase SQL Editor to fix the existing function
--
-- This function automatically creates a profile when a new user signs up

-- ============================================================================
-- Fix handle_new_user function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, handle, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'handle',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
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
    END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
    AND p.proname = 'handle_new_user';

-- Note: The function should now show "✅ Fixed" status

-- ============================================================================
-- Note: If your profiles table doesn't have a 'handle' column, use this version instead:
-- ============================================================================

/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;
*/

