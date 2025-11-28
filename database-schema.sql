-- AcademiQR Database Schema Setup
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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
    profile_photo_url TEXT,
    background_type TEXT DEFAULT 'solid',
    background_color TEXT DEFAULT '#ffffff',
    gradient_color1 TEXT DEFAULT '#667eea',
    gradient_color2 TEXT DEFAULT '#764ba2',
    text_color TEXT DEFAULT '#1f2937',
    link_color TEXT DEFAULT '#3b82f6',
    button_style TEXT DEFAULT 'solid',
    button_color TEXT DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click')),
    link_id UUID REFERENCES links(id) ON DELETE CASCADE,
    user_agent TEXT,
    ip_address TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add missing columns to collections table
ALTER TABLE collections 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'unlisted', 'private')),
ADD COLUMN IF NOT EXISTS passkey TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. Add missing columns to links table
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_collection_id ON analytics(collection_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_links_collection_id ON links(collection_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON links(position);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_visibility ON collections(visibility);

-- 6. Create RLS (Row Level Security) policies
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Analytics policies
CREATE POLICY "Users can view analytics for own collections" ON analytics
    FOR SELECT USING (
        collection_id IN (
            SELECT id FROM collections WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert analytics" ON analytics
    FOR INSERT WITH CHECK (true);

-- Collections policies (update existing)
DROP POLICY IF EXISTS "Users can view own collections" ON collections;
DROP POLICY IF EXISTS "Users can insert own collections" ON collections;
DROP POLICY IF EXISTS "Users can update own collections" ON collections;
DROP POLICY IF EXISTS "Users can delete own collections" ON collections;

CREATE POLICY "Users can view own collections" ON collections
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own collections" ON collections
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own collections" ON collections
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own collections" ON collections
    FOR DELETE USING (user_id = auth.uid());

-- Public collections policy
CREATE POLICY "Anyone can view public collections" ON collections
    FOR SELECT USING (visibility = 'public');

-- Links policies (update existing)
DROP POLICY IF EXISTS "Users can view links for own collections" ON links;
DROP POLICY IF EXISTS "Users can insert links for own collections" ON links;
DROP POLICY IF EXISTS "Users can update links for own collections" ON links;
DROP POLICY IF EXISTS "Users can delete links for own collections" ON links;

CREATE POLICY "Users can view links for own collections" ON links
    FOR SELECT USING (
        collection_id IN (
            SELECT id FROM collections WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert links for own collections" ON links
    FOR INSERT WITH CHECK (
        collection_id IN (
            SELECT id FROM collections WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update links for own collections" ON links
    FOR UPDATE USING (
        collection_id IN (
            SELECT id FROM collections WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete links for own collections" ON links
    FOR DELETE USING (
        collection_id IN (
            SELECT id FROM collections WHERE user_id = auth.uid()
        )
    );

-- Public links policy
CREATE POLICY "Anyone can view links for public collections" ON links
    FOR SELECT USING (
        collection_id IN (
            SELECT id FROM collections WHERE visibility = 'public'
        )
    );

-- 7. Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, created_at, updated_at)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NOW(), NOW());
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;



