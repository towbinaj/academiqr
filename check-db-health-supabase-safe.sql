-- Database Health Check Queries (Supabase-Safe)
-- These queries work within Supabase's permission model
-- Run these one at a time

-- 1. Check if database is accessible (basic connectivity test)
SELECT version();

-- 2. Check if link_items table exists and is accessible
SELECT COUNT(*) as total_rows FROM public.link_items;

-- 3. Check for table issues (check if table can be read)
SELECT 
    COUNT(*) as total_rows,
    COUNT(DISTINCT id) as unique_ids,
    COUNT(*) - COUNT(DISTINCT id) as duplicate_ids
FROM public.link_items;

-- 4. Check table statistics (Supabase-safe, no superuser needed)
SELECT 
    schemaname,
    tablename,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    CASE 
        WHEN n_live_tup > 0 THEN ROUND((n_dead_tup::numeric / n_live_tup::numeric) * 100, 2)
        ELSE 0
    END as dead_row_percentage,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
WHERE tablename = 'link_items';

-- 5. Check for locks (if this times out, there might be a deadlock)
SELECT 
    locktype,
    relation::regclass,
    mode,
    granted,
    pid
FROM pg_locks
WHERE relation = 'link_items'::regclass;

-- 6. Check for long-running queries
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    state,
    wait_event_type,
    wait_event,
    LEFT(query, 100) as query_preview
FROM pg_stat_activity
WHERE query LIKE '%link_items%'
    AND state != 'idle'
    AND pid != pg_backend_pid()  -- Exclude current query
ORDER BY duration DESC
LIMIT 10;

-- 7. Check database connection count (limited view)
SELECT 
    count(*) as total_connections,
    count(*) FILTER (WHERE state = 'active') as active_connections,
    count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity
WHERE datname = current_database()
    AND pid != pg_backend_pid();  -- Exclude current connection

-- 8. Check if columns already exist (fast check)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'link_items' 
    AND column_name IN ('image_position', 'image_scale');

-- 9. Test simple write operation (check if table is writable)
-- Uncomment to test:
-- UPDATE public.link_items SET updated_at = updated_at WHERE id IN (SELECT id FROM public.link_items LIMIT 1);


