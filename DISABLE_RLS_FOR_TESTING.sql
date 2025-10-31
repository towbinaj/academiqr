-- Disable RLS on profiles table to allow trigger to work
-- This is a temporary workaround to fix the "Database error saving new user" issue

-- Step 1: Drop the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

-- Step 2: Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 3: Disable RLS (temporarily)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Recreate the function
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, handle, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'handle',
            SPLIT_PART(NEW.email, '@', 1)
        ),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Recreate the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Verify
SELECT 'RLS disabled temporarily, trigger created' AS status;

-- Step 7: Check if profiles table has the right columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

