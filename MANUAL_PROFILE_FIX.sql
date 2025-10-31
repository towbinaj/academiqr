-- Manual Profile Creation for Google OAuth Users
-- Run this after attempting Google sign-in and getting the error

-- Step 1: Check recent auth users (to find the Google OAuth user that failed)
SELECT 
    u.id,
    u.email,
    u.created_at,
    u.raw_user_meta_data,
    EXISTS(SELECT 1 FROM public.profiles WHERE id = u.id) AS has_profile
FROM auth.users u
ORDER BY u.created_at DESC
LIMIT 10;

-- Step 2: Once you find the user ID that doesn't have a profile, run this:
-- Replace 'USER_ID_HERE' with the actual user ID

/*
INSERT INTO public.profiles (id, display_name, created_at, updated_at)
VALUES (
    'USER_ID_HERE'::uuid,
    COALESCE(
        (SELECT raw_user_meta_data->>'full_name' FROM auth.users WHERE id = 'USER_ID_HERE'::uuid),
        (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = 'USER_ID_HERE'::uuid),
        split_part((SELECT email FROM auth.users WHERE id = 'USER_ID_HERE'::uuid), '@', 1)
    ),
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;
*/

-- Or, create profiles for ALL users without profiles:
INSERT INTO public.profiles (id, display_name, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(
        u.raw_user_meta_data->>'full_name',
        u.raw_user_meta_data->>'name',
        split_part(u.email, '@', 1)
    ),
    u.created_at,
    NOW()
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify profiles were created
SELECT p.id, p.display_name, u.email, u.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY u.created_at DESC;


