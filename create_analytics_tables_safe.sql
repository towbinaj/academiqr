-- Analytics Tables for AcademiQR - SAFE VERSION
-- This version drops existing tables and recreates them fresh
-- WARNING: This will delete any existing analytics data!

-- Drop existing tables if they exist (cascade to remove dependencies)
DROP TABLE IF EXISTS link_clicks CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;

-- 1. Link Clicks Table
CREATE TABLE link_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    link_id UUID NOT NULL REFERENCES link_items(id) ON DELETE CASCADE,
    list_id UUID NOT NULL REFERENCES link_lists(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Click timestamp
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Visitor information
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT, -- 'mobile', 'tablet', 'desktop'
    browser TEXT,
    os TEXT,
    
    -- Location data (optional, requires geolocation service)
    country TEXT,
    city TEXT,
    
    -- Referrer information
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Performance
    response_time INTEGER -- milliseconds
);

-- 2. Page Views Table (for tracking views of the landing page itself)
CREATE TABLE page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    list_id UUID NOT NULL REFERENCES link_lists(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- View timestamp
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Visitor information
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    
    -- Location data
    country TEXT,
    city TEXT,
    
    -- Referrer information
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Session tracking
    session_id TEXT
);

-- 3. Create indexes for better query performance
CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX idx_link_clicks_list_id ON link_clicks(list_id);
CREATE INDEX idx_link_clicks_owner_id ON link_clicks(owner_id);
CREATE INDEX idx_link_clicks_clicked_at ON link_clicks(clicked_at DESC);

CREATE INDEX idx_page_views_list_id ON page_views(list_id);
CREATE INDEX idx_page_views_owner_id ON page_views(owner_id);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies

-- Allow anyone to insert link clicks (for tracking)
CREATE POLICY "Anyone can insert link clicks"
ON link_clicks FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to insert page views (for tracking)
CREATE POLICY "Anyone can insert page views"
ON page_views FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow users to view their own analytics
CREATE POLICY "Users can view their own link clicks"
ON link_clicks FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Users can view their own page views"
ON page_views FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

-- 6. Add comments for documentation
COMMENT ON TABLE link_clicks IS 'Tracks individual link clicks with visitor information';
COMMENT ON TABLE page_views IS 'Tracks page views of link collection landing pages';

COMMENT ON COLUMN link_clicks.device_type IS 'Type of device: mobile, tablet, or desktop';
COMMENT ON COLUMN link_clicks.response_time IS 'Time taken to redirect in milliseconds';
COMMENT ON COLUMN page_views.session_id IS 'Unique session identifier for tracking user journeys';





