-- Create rate_limit_attempts table for server-side rate limiting
-- This table tracks authentication attempts to prevent brute-force attacks

CREATE TABLE IF NOT EXISTS rate_limit_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT,
    ip_address TEXT NOT NULL,
    attempt_type TEXT NOT NULL, -- 'login', 'signup', etc.
    success BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for efficient queries
    CONSTRAINT rate_limit_attempts_email_ip_type_idx UNIQUE (email, ip_address, attempt_type, created_at)
);

-- Create indexes for efficient rate limit checks
CREATE INDEX IF NOT EXISTS idx_rate_limit_email_created ON rate_limit_attempts(email, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_created ON rate_limit_attempts(ip_address, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_email_type_created ON rate_limit_attempts(email, attempt_type, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_type_created ON rate_limit_attempts(ip_address, attempt_type, created_at);

-- Create a function to clean up old rate limit records (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limit_attempts()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limit_attempts
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if an IP/email is rate limited
CREATE OR REPLACE FUNCTION is_rate_limited(
    p_email TEXT,
    p_ip_address TEXT,
    p_attempt_type TEXT,
    p_max_attempts INTEGER DEFAULT 5,
    p_window_minutes INTEGER DEFAULT 60,
    p_lockout_minutes INTEGER DEFAULT 15
)
RETURNS JSON AS $$
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
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT ON rate_limit_attempts TO authenticated;
GRANT EXECUTE ON FUNCTION is_rate_limited TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_rate_limit_attempts TO authenticated;

-- Enable RLS (Row Level Security)
ALTER TABLE rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own attempts
CREATE POLICY "Users can view their own rate limit attempts"
    ON rate_limit_attempts
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = (SELECT id::text FROM auth.users WHERE email = rate_limit_attempts.email LIMIT 1));

-- Create policy to allow service role to insert attempts (for edge function)
-- Note: Edge functions use service role, so this allows the function to insert records
CREATE POLICY "Service role can insert rate limit attempts"
    ON rate_limit_attempts
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create policy to allow service role to read all attempts (for rate limit checks)
CREATE POLICY "Service role can read all rate limit attempts"
    ON rate_limit_attempts
    FOR SELECT
    TO service_role
    USING (true);

