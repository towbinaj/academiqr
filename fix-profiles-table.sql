-- Fix Profiles Table - Add Missing Columns
-- Run this in your Supabase SQL Editor

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS social_email TEXT,
ADD COLUMN IF NOT EXISTS social_instagram TEXT,
ADD COLUMN IF NOT EXISTS social_twitter TEXT,
ADD COLUMN IF NOT EXISTS social_linkedin TEXT,
ADD COLUMN IF NOT EXISTS social_facebook TEXT,
ADD COLUMN IF NOT EXISTS social_youtube TEXT,
ADD COLUMN IF NOT EXISTS social_tiktok TEXT,
ADD COLUMN IF NOT EXISTS social_snapchat TEXT,
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS background_type TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS gradient_color1 TEXT DEFAULT '#667eea',
ADD COLUMN IF NOT EXISTS gradient_color2 TEXT DEFAULT '#764ba2',
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#1f2937',
ADD COLUMN IF NOT EXISTS link_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS button_style TEXT DEFAULT 'solid',
ADD COLUMN IF NOT EXISTS button_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing profiles with default values for new columns
UPDATE profiles 
SET 
    background_type = COALESCE(background_type, 'solid'),
    background_color = COALESCE(background_color, '#ffffff'),
    gradient_color1 = COALESCE(gradient_color1, '#667eea'),
    gradient_color2 = COALESCE(gradient_color2, '#764ba2'),
    text_color = COALESCE(text_color, '#1f2937'),
    link_color = COALESCE(link_color, '#3b82f6'),
    button_style = COALESCE(button_style, 'solid'),
    button_color = COALESCE(button_color, '#3b82f6'),
    updated_at = COALESCE(updated_at, NOW())
WHERE background_type IS NULL OR background_color IS NULL;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create comprehensive profile policy
CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Create or replace auto-profile function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, created_at, updated_at)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        display_name = COALESCE(profiles.display_name, EXCLUDED.display_name),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();



