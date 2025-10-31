-- Create profiles for users that don't have them
-- Run this in Supabase SQL Editor

INSERT INTO public.profiles (id, display_name, handle, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(
        u.raw_user_meta_data->>'full_name',
        u.raw_user_meta_data->>'name',
        split_part(u.email, '@', 1)
    ),
    COALESCE(
        u.raw_user_meta_data->>'handle',
        split_part(u.email, '@', 1)
    ),
    u.created_at,
    NOW()
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify it worked
SELECT 
    'Created profiles' AS status,
    COUNT(*) AS count
FROM public.profiles;

