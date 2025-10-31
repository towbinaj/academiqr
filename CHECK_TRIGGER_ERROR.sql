-- Check what's actually happening with the trigger
-- Run this in Supabase SQL Editor

-- 1. Check if trigger exists and is enabled
SELECT 
    'Trigger Status' AS info,
    tgname AS trigger_name,
    tgenabled AS enabled,
    pg_get_triggerdef(oid) AS definition
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 2. Check function definition
SELECT 
    'Function Definition' AS info,
    pg_get_functiondef(oid) AS function_definition
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 3. Check if there are any recent auth.users without profiles
SELECT 
    'Users without profiles' AS info,
    u.id,
    u.email,
    u.created_at
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = u.id
)
ORDER BY u.created_at DESC
LIMIT 5;


