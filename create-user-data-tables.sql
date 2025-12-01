-- Create tables for user data (themes, gradients, media library)
-- These tables store user-created content that was previously in localStorage
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. Create user_media table (for media library)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    size BIGINT,
    type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE user_media ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_media
-- Users can only see their own media
CREATE POLICY "Users can view their own media"
    ON user_media FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own media
CREATE POLICY "Users can insert their own media"
    ON user_media FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own media
CREATE POLICY "Users can update their own media"
    ON user_media FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own media
CREATE POLICY "Users can delete their own media"
    ON user_media FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for user_media
CREATE INDEX IF NOT EXISTS idx_user_media_user_id ON user_media(user_id);
CREATE INDEX IF NOT EXISTS idx_user_media_uploaded_at ON user_media(uploaded_at DESC);

-- ============================================================================
-- 2. Create user_themes table (for appearance and QR themes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    theme_type TEXT NOT NULL CHECK (theme_type IN ('appearance', 'qr')),
    theme_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name, theme_type)
);

-- Enable RLS
ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_themes
-- Users can only see their own themes
CREATE POLICY "Users can view their own themes"
    ON user_themes FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own themes
CREATE POLICY "Users can insert their own themes"
    ON user_themes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own themes
CREATE POLICY "Users can update their own themes"
    ON user_themes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own themes
CREATE POLICY "Users can delete their own themes"
    ON user_themes FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for user_themes
CREATE INDEX IF NOT EXISTS idx_user_themes_user_id ON user_themes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_themes_theme_type ON user_themes(theme_type);
CREATE INDEX IF NOT EXISTS idx_user_themes_created_at ON user_themes(created_at DESC);

-- ============================================================================
-- 3. Create user_gradients table (for custom gradients)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_gradients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    gradient TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE user_gradients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_gradients
-- Users can only see their own gradients
CREATE POLICY "Users can view their own gradients"
    ON user_gradients FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own gradients
CREATE POLICY "Users can insert their own gradients"
    ON user_gradients FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own gradients
CREATE POLICY "Users can update their own gradients"
    ON user_gradients FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own gradients
CREATE POLICY "Users can delete their own gradients"
    ON user_gradients FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for user_gradients
CREATE INDEX IF NOT EXISTS idx_user_gradients_user_id ON user_gradients(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gradients_created_at ON user_gradients(created_at DESC);

-- ============================================================================
-- 4. Create function to update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_user_media_updated_at
    BEFORE UPDATE ON user_media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_themes_updated_at
    BEFORE UPDATE ON user_themes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_gradients_updated_at
    BEFORE UPDATE ON user_gradients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Verification: Check if tables were created successfully
-- ============================================================================
SELECT 
    'user_media' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_media'
    ) THEN '✅ Created' ELSE '❌ Failed' END as status
UNION ALL
SELECT 
    'user_themes' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_themes'
    ) THEN '✅ Created' ELSE '❌ Failed' END as status
UNION ALL
SELECT 
    'user_gradients' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_gradients'
    ) THEN '✅ Created' ELSE '❌ Failed' END as status;

