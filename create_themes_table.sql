-- Create saved themes table for AcademiQR
-- This stores user saved appearance and QR themes in the database instead of localStorage

-- 1. Create themes table
CREATE TABLE IF NOT EXISTS user_themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    theme_type TEXT NOT NULL CHECK (theme_type IN ('appearance', 'qr')), -- Type of theme: appearance or qr
    theme_data JSONB NOT NULL, -- The complete theme object as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_themes_user_id ON user_themes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_themes_type ON user_themes(theme_type);
CREATE INDEX IF NOT EXISTS idx_user_themes_created_at ON user_themes(created_at);

-- 3. Create unique constraint to prevent duplicate theme names per user and type
-- This ensures each user can only have one theme with the same name for each type
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_themes_user_name_type_unique ON user_themes(user_id, name, theme_type);

-- 4. Enable RLS (Row Level Security)
ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view own themes" ON user_themes;
CREATE POLICY "Users can view own themes" ON user_themes
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own themes" ON user_themes;
CREATE POLICY "Users can insert own themes" ON user_themes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own themes" ON user_themes;
CREATE POLICY "Users can update own themes" ON user_themes
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own themes" ON user_themes;
CREATE POLICY "Users can delete own themes" ON user_themes
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Create function for updated_at timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create trigger for updated_at
-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS update_user_themes_updated_at ON user_themes;
CREATE TRIGGER update_user_themes_updated_at BEFORE UPDATE ON user_themes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Grant permissions
GRANT ALL ON user_themes TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

