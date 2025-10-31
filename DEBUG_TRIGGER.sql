-- Debug the trigger to see what's happening
-- This will show us EXACTLY what error is occurring

-- First, let's check if there are any recent auth.users
SELECT 
    'Recent users' AS info,
    COUNT(*) AS count,
    MAX(created_at) AS latest_created
FROM auth.users;

-- Check which users don't have profiles
SELECT 
    'Users without profiles' AS info,
    u.id,
    u.email,
    u.created_at,
    u.raw_user_meta_data
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = u.id
)
ORDER BY u.created_at DESC
LIMIT 5;

-- Now let's manually try to insert a profile for a recent user
-- Replace 'YOUR_USER_ID_HERE' with one of the IDs from above
-- (We'll comment this out for now since we don't have the ID)

-- Let's also check the profiles table structure
SELECT 
    'Profiles table columns' AS info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;


