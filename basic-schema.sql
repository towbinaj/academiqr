-- Basic Database Schema for AcademiQR
-- Run these SQL commands in your Supabase SQL Editor

-- 1. Create collections table first
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'unlisted', 'private')),
    passkey TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create links table
CREATE TABLE IF NOT EXISTS links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    visible BOOLEAN DEFAULT true,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create profiles table
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

-- 4. Create analytics table
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

-- 5. Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for collections
CREATE POLICY "Users can view own collections" ON collections
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own collections" ON collections
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own collections" ON collections
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own collections" ON collections
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Anyone can view public collections" ON collections
    FOR SELECT USING (visibility = 'public');

-- 7. Create RLS policies for links
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

CREATE POLICY "Anyone can view links for public collections" ON links
    FOR SELECT USING (
        collection_id IN (
            SELECT id FROM collections WHERE visibility = 'public'
        )
    );

-- 8. Create RLS policies for profiles
CREATE POLICY "Users can manage own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- 9. Create RLS policies for analytics
CREATE POLICY "Users can view own analytics" ON analytics
    FOR SELECT USING (
        collection_id IN (
            SELECT id FROM collections WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert analytics" ON analytics
    FOR INSERT WITH CHECK (true);

-- 10. Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, created_at, updated_at)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_visibility ON collections(visibility);
CREATE INDEX IF NOT EXISTS idx_links_collection_id ON links(collection_id);
CREATE INDEX IF NOT EXISTS idx_links_position ON links(position);
CREATE INDEX IF NOT EXISTS idx_analytics_collection_id ON analytics(collection_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);



