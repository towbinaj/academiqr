-- Fix ALL mutable search_path warnings for database functions
-- This addresses security warnings about mutable search_path
--
-- Run this in Supabase SQL Editor to fix all functions at once

-- ============================================================================
-- 1. Fix cleanup_old_rate_limit_attempts function
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_rate_limit_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM rate_limit_attempts
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- ============================================================================
-- 2. Fix is_rate_limited function
-- ============================================================================

CREATE OR REPLACE FUNCTION is_rate_limited(
    p_email TEXT,
    p_ip_address TEXT,
    p_attempt_type TEXT,
    p_max_attempts INTEGER DEFAULT 5,
    p_window_minutes INTEGER DEFAULT 60,
    p_lockout_minutes INTEGER DEFAULT 15
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_recent_attempts INTEGER;
    v_failed_attempts INTEGER;
    v_last_attempt TIMESTAMP WITH TIME ZONE;
    v_lockout_until TIMESTAMP WITH TIME ZONE;
    v_is_locked BOOLEAN;
    v_remaining_time INTEGER;
BEGIN
    -- Check for recent failed attempts within the time window
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE success = false),
        MAX(created_at)
    INTO 
        v_recent_attempts,
        v_failed_attempts,
        v_last_attempt
    FROM rate_limit_attempts
    WHERE 
        (p_email IS NOT NULL AND email = p_email OR p_email IS NULL)
        AND ip_address = p_ip_address
        AND attempt_type = p_attempt_type
        AND created_at > NOW() - (p_window_minutes || ' minutes')::INTERVAL;
    
    -- Check if there's an active lockout
    SELECT 
        MAX(created_at) + (p_lockout_minutes || ' minutes')::INTERVAL
    INTO v_lockout_until
    FROM rate_limit_attempts
    WHERE 
        (p_email IS NOT NULL AND email = p_email OR p_email IS NULL)
        AND ip_address = p_ip_address
        AND attempt_type = p_attempt_type
        AND success = false
        AND created_at > NOW() - (p_window_minutes || ' minutes')::INTERVAL
    GROUP BY email, ip_address, attempt_type
    HAVING COUNT(*) >= p_max_attempts;
    
    -- Check if currently locked out
    v_is_locked := (v_lockout_until IS NOT NULL AND v_lockout_until > NOW());
    
    -- Calculate remaining lockout time in seconds
    IF v_is_locked THEN
        v_remaining_time := EXTRACT(EPOCH FROM (v_lockout_until - NOW()))::INTEGER;
    ELSE
        v_remaining_time := 0;
    END IF;
    
    -- Return result
    RETURN json_build_object(
        'is_locked', v_is_locked,
        'lockout_until', v_lockout_until,
        'remaining_time', v_remaining_time,
        'recent_attempts', COALESCE(v_recent_attempts, 0),
        'failed_attempts', COALESCE(v_failed_attempts, 0),
        'remaining_attempts', GREATEST(0, p_max_attempts - COALESCE(v_failed_attempts, 0))
    );
END;
$$;

-- ============================================================================
-- 3. Fix update_updated_at_column function
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
-- 4. Fix validate_image_file function
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
-- 5. Fix handle_new_user function
-- ============================================================================
-- NOTE: This function creates a profile when a new user signs up.
-- If your profiles table has a 'handle' column, use the version below.
-- If not, uncomment the alternative version in the comments.

-- Version with handle column (most common)
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

-- Alternative version without handle column (uncomment if needed):
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

-- ============================================================================
-- 6. Verify all fixes
-- ============================================================================

-- Check that all functions now have fixed search_path
SELECT 
    p.proname as function_name,
    CASE 
        WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path%' THEN '✅ Fixed'
        ELSE '⚠️ Still has mutable search_path'
    END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
    AND p.proname IN (
        'cleanup_old_rate_limit_attempts',
        'is_rate_limited',
        'update_updated_at_column',
        'validate_image_file',
        'handle_new_user'
    )
ORDER BY p.proname;

-- Note: All functions should now show "✅ Fixed" status

