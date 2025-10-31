-- Simple test to see if the trigger is working
-- Run this in Supabase SQL Editor

-- 1. First, let's see what's in auth.users right now
SELECT id, email, created_at, raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 2. Check if trigger exists
SELECT *
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 3. Check if function exists
SELECT *
FROM pg_proc
WHERE proname = 'handle_new_user';

-- 4. Check RLS on profiles
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 5. Let's manually test inserting into profiles to see what error we get
-- Replace 'test-user-id' with an actual user ID from step 1
SELECT 'Run this to test manual insert:' AS instruction;

-- Test insert (uncomment and replace with real user ID):
-- INSERT INTO public.profiles (id, display_name, created_at, updated_at)
-- VALUES ('test-user-id'::uuid, 'Test User', NOW(), NOW())
-- ON CONFLICT (id) DO NOTHING;


