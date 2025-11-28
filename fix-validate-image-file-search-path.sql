-- Fix mutable search_path warning for validate_image_file function
-- This addresses the security warning: "Function public.validate_image_file has a role mutable search_path"
--
-- Run this in Supabase SQL Editor to fix the existing function

-- ============================================================================
-- Fix validate_image_file function
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_image_file(
    file_name text,
    file_size bigint,
    file_metadata jsonb
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    file_ext text;
    mime_type text;
BEGIN
    -- Extract file extension
    file_ext := lower(substring(file_name from '\.([^.]+)$'));
    
    -- Extract MIME type from metadata
    mime_type := coalesce(
        file_metadata->>'mimetype',
        file_metadata->>'contentType',
        ''
    );
    
    -- Validate file extension matches allowed types
    IF file_ext NOT IN ('jpg', 'jpeg', 'png', 'gif', 'webp') THEN
        RETURN false;
    END IF;
    
    -- Validate MIME type
    IF mime_type !~* '^image/(jpeg|jpg|png|gif|webp)$' THEN
        RETURN false;
    END IF;
    
    -- Validate file size (5MB for images, 10MB for assets)
    IF file_size > 10485760 THEN  -- 10MB max
        RETURN false;
    END IF;
    
    -- Note: Actual magic number validation would require reading file bytes
    -- This is best done in an Edge Function that processes the file after upload
    -- The RLS policies above provide the first layer of defense
    
    RETURN true;
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
    AND p.proname = 'validate_image_file';

-- Note: The function should now show "✅ Fixed" status

