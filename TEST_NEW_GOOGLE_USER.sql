-- Check if recent auth.users have profiles
-- This will tell us if the trigger is working
SELECT 
    u.id,
    u.email,
    u.created_at,
    CASE 
        WHEN EXISTS(SELECT 1 FROM public.profiles WHERE id = u.id) 
        THEN '✅ Has Profile' 
        ELSE '❌ No Profile' 
    END AS status
FROM auth.users u
ORDER BY u.created_at DESC
LIMIT 10;


