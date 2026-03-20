-- Add per-collection link override support
-- source_link_id: points to the original link this was copied from
-- use_library_defaults: when true, title/image resolve from the source link

ALTER TABLE link_items
  ADD COLUMN IF NOT EXISTS source_link_id UUID REFERENCES link_items(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS use_library_defaults BOOLEAN NOT NULL DEFAULT false;

-- Index for efficient source lookups
CREATE INDEX IF NOT EXISTS idx_link_items_source
  ON link_items(source_link_id)
  WHERE source_link_id IS NOT NULL;
