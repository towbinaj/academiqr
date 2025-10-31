-- Test if we can manually create a profile
-- This will help diagnose the OAuth issue

-- Check if user already exists
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if profiles exist for those users
SELECT p.id, p.display_name, u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 5;

-- Try to manually insert a test profile (replace with actual user ID)
-- This will show us what error occurs
-- SELECT 'Replace with actual test' AS instruction;


