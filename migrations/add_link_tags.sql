-- Add tags column to link_items for per-link tagging
-- Tags are shared in the same pool as collection tags (stored in presentation_data.tags)
ALTER TABLE link_items ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Index for efficient tag-based queries
CREATE INDEX IF NOT EXISTS idx_link_items_tags ON link_items USING GIN (tags);
