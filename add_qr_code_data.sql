-- Add qr_code_data column to link_lists table
-- This stores QR code style settings (size, color, background color)

ALTER TABLE link_lists 
ADD COLUMN IF NOT EXISTS qr_code_data JSONB;

-- Add a comment to document the column
COMMENT ON COLUMN link_lists.qr_code_data IS 'Stores QR code style settings including size, color, and background color';





