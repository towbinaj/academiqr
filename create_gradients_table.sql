-- Create custom gradients table for AcademiQR
-- This stores user custom gradients in the database instead of localStorage

-- 1. Create gradients table
CREATE TABLE IF NOT EXISTS user_gradients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    gradient TEXT NOT NULL, -- The gradient CSS value (e.g., 'linear-gradient(...)')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_gradients_user_id ON user_gradients(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gradients_created_at ON user_gradients(created_at);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE user_gradients ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view own gradients" ON user_gradients;
CREATE POLICY "Users can view own gradients" ON user_gradients
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own gradients" ON user_gradients;
CREATE POLICY "Users can insert own gradients" ON user_gradients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own gradients" ON user_gradients;
CREATE POLICY "Users can update own gradients" ON user_gradients
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own gradients" ON user_gradients;
CREATE POLICY "Users can delete own gradients" ON user_gradients
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Create function for updated_at timestamps (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create trigger for updated_at
-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS update_user_gradients_updated_at ON user_gradients;
CREATE TRIGGER update_user_gradients_updated_at BEFORE UPDATE ON user_gradients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Grant permissions
GRANT ALL ON user_gradients TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

