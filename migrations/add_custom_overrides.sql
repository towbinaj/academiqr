-- Add per-collection custom overrides for any link
-- When set, the collection/public page shows override values
-- The Link Library always shows the canonical title/image_url columns
ALTER TABLE link_items
  ADD COLUMN IF NOT EXISTS custom_overrides JSONB DEFAULT NULL;
