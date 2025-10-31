-- Check Current State and Fix OAuth Error
-- Run this in Supabase SQL Editor

-- Step 1: Check if profiles table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
) AS profiles_exists;

-- Step 2: Check if handle_new_user function exists
SELECT EXISTS (
    SELECT FROM pg_proc 
    WHERE proname = 'handle_new_user'
) AS function_exists;

-- Step 3: Check if trigger exists
SELECT EXISTS (
    SELECT FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
) AS trigger_exists;

-- Step 4: Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles';

-- Now create the complete setup
-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    bio TEXT,
    social_email TEXT,
    social_instagram TEXT,
    social_twitter TEXT,
    social_linkedin TEXT,
    social_facebook TEXT,
    social_youtube TEXT,
    social_tiktok TEXT,
    social_snapchat TEXT,
    profile_photo TEXT,
    profile_photo_position TEXT,
    handle TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;

-- Create comprehensive policies
CREATE POLICY "profiles_select_all" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_self" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_self" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Create or replace function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, created_at, updated_at)
    VALUES (
        NEW.id, 
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        NOW(), 
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Verify everything is set up
SELECT 'Profiles table exists' AS status, EXISTS(
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'profiles'
) AS result;

SELECT 'Function exists' AS status, EXISTS(
    SELECT FROM pg_proc WHERE proname = 'handle_new_user'
) AS result;

SELECT 'Trigger exists' AS status, EXISTS(
    SELECT FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
) AS result;

SELECT 'Policies exist' AS status, COUNT(*) > 0 AS result
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';

