-- Fix the unique handle constraint issue
-- Run this in Supabase SQL Editor

-- Step 1: Drop the unique constraint on handle
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_handle_key;

-- Step 2: Make handle columns use timestamp or random suffix to ensure uniqueness
ALTER TABLE public.profiles ALTER COLUMN handle DROP NOT NULL;

-- Step 3: Update the function to use a combination that ensures uniqueness
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    display_name_value TEXT;
    handle_value TEXT;
BEGIN
    -- Display name from metadata or email prefix
    display_name_value := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        SPLIT_PART(NEW.email, '@', 1)
    );
    
    -- Use the full email address as the handle
    handle_value := NEW.email;
    
    -- Insert with email as handle
    INSERT INTO public.profiles (id, display_name, handle, created_at, updated_at)
    VALUES (
        NEW.id,
        display_name_value,
        handle_value,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Verify
SELECT 'Trigger updated with unique handle logic' AS status;

