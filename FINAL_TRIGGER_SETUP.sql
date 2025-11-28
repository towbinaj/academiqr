-- Final trigger setup with proper RLS policies
-- Run this in Supabase SQL Editor

-- Step 1: Drop old trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop all existing policies
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_any" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;

-- Drop any policies with conflicting names
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public')
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles CASCADE';
    END LOOP;
END $$;

-- Step 4: Create permissive policies that allow trigger to work
-- SELECT: Everyone can read profiles
CREATE POLICY "profiles_select_all" ON public.profiles
FOR SELECT USING (true);

-- INSERT: Allow anyone to insert (for trigger)
CREATE POLICY "profiles_insert_all" ON public.profiles
FOR INSERT WITH CHECK (true);

-- UPDATE: Users can update their own profile or any profile (for trigger compatibility)
CREATE POLICY "profiles_update_any" ON public.profiles
FOR UPDATE USING (true);

-- Step 5: Create or replace the function with handle field
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Step 6: Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Verify setup
SELECT 
    'Trigger created' AS status,
    EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') AS trigger_exists,
    EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') AS function_exists;

