-- Fix mutable search_path warnings for rate limit functions
-- This addresses security warnings about mutable search_path
--
-- Run this in Supabase SQL Editor to fix the existing functions

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
-- 3. Verify the fixes
-- ============================================================================

-- Check that both functions now have fixed search_path
SELECT 
    p.proname as function_name,
    CASE 
        WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path%' THEN '✅ Fixed'
        ELSE '⚠️ Still has mutable search_path'
    END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
    AND p.proname IN ('cleanup_old_rate_limit_attempts', 'is_rate_limited')
ORDER BY p.proname;

-- Note: Both functions should now show "✅ Fixed" status

