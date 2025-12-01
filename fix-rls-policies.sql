-- Fix RLS policies to ensure users can only access their own data
-- This fixes security issues where users could see other users' media and themes

-- ============================================================================
-- 1. Fix user_media RLS policies
-- ============================================================================

-- Drop existing policies that allow cross-user access
DROP POLICY IF EXISTS "Anyone can view media" ON user_media;
DROP POLICY IF EXISTS "Users can view own or any media" ON user_media;

-- Create secure policy: Users can only view their own media
CREATE POLICY "Users can view their own media"
    ON user_media FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- 2. Fix user_themes RLS policies
-- ============================================================================

-- Drop existing policies that allow cross-user access
DROP POLICY IF EXISTS "Anyone can view themes" ON user_themes;
DROP POLICY IF EXISTS "Users can view own or any themes" ON user_themes;

-- Create secure policy: Users can only view their own themes
CREATE POLICY "Users can view their own themes"
    ON user_themes FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- 3. Verify user_gradients policies (should already be correct)
-- ============================================================================

-- user_gradients should already have correct policies, but verify
-- If "Users can view own gradients" doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_gradients' 
        AND policyname = 'Users can view own gradients'
    ) THEN
        CREATE POLICY "Users can view their own gradients"
            ON user_gradients FOR SELECT
            USING (auth.uid() = user_id);
    END IF;
END $$;

-- ============================================================================
-- Verification: Check updated policies
-- ============================================================================
SELECT 
    tablename,
    policyname,
    cmd as command,
    roles,
    CASE 
        WHEN cmd = 'SELECT' AND tablename = 'user_media' THEN 
            CASE WHEN policyname LIKE '%own%' THEN '✅ Secure' ELSE '❌ Insecure' END
        WHEN cmd = 'SELECT' AND tablename = 'user_themes' THEN 
            CASE WHEN policyname LIKE '%own%' THEN '✅ Secure' ELSE '❌ Insecure' END
        WHEN cmd = 'SELECT' AND tablename = 'user_gradients' THEN 
            CASE WHEN policyname LIKE '%own%' THEN '✅ Secure' ELSE '❌ Insecure' END
        ELSE 'N/A'
    END as security_status
FROM pg_policies
WHERE tablename IN ('user_media', 'user_themes', 'user_gradients')
    AND cmd = 'SELECT'
ORDER BY tablename, policyname;

