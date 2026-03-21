-- Clean up stale backgroundImage URLs from collections that aren't using image backgrounds
-- This data leaked through auto-save when backgroundImage was always persisted regardless of backgroundType
UPDATE link_lists
SET theme = theme - 'backgroundImage'
WHERE theme->>'backgroundType' != 'image'
  AND theme->>'backgroundImage' IS NOT NULL
  AND theme->>'backgroundImage' != '';
