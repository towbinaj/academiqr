-- Add username field for custom short URLs
-- URL format: academiqr.com/u/username/collection-slug

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Index for fast lookups by username
CREATE INDEX IF NOT EXISTS idx_profiles_username
  ON profiles(username)
  WHERE username IS NOT NULL;
