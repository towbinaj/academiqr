-- View current state of trigger and profiles
-- Run this in Supabase SQL Editor

-- 1. Check if trigger exists
SELECT 
    'Trigger exists' AS item,
    COUNT(*) > 0 AS status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 2. Check if function exists
SELECT 
    'Function exists' AS item,
    COUNT(*) > 0 AS status
FROM pg_proc
WHERE proname = 'handle_new_user';

-- 3. See what users exist
SELECT 
    id,
    email,
    created_at,
    CASE 
        WHEN EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.users.id) 
        THEN 'Has Profile' 
        ELSE 'No Profile' 
    END AS profile_status
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;


