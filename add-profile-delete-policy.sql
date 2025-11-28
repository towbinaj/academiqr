-- Add DELETE policy for profiles table
-- This enables users to delete their own profiles (for account deletion feature)
-- Run this in Supabase SQL Editor

-- Enable RLS on profiles (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to delete their own profile
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- Verify the policy was created
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND cmd = 'DELETE';

-- Expected result: Should show 1 DELETE policy

