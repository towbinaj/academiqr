-- Database Health Check Queries
-- Run these one at a time to diagnose issues

-- 1. Check if database is accessible (basic connectivity test)
SELECT version();

-- 2. Check if link_items table exists and is accessible
SELECT COUNT(*) FROM public.link_items;

-- 3. Check for table corruption (check if table can be read)
SELECT 
    COUNT(*) as total_rows,
    COUNT(DISTINCT id) as unique_ids,
    COUNT(*) - COUNT(DISTINCT id) as duplicate_ids
FROM public.link_items;

-- 4. Check table size and bloat (Supabase-safe version)
-- Note: Some size functions may not be available without superuser
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
    pid,
    pg_blocking_pids(pid) as blocking_pids
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
ORDER BY duration DESC
LIMIT 10;

-- 7. Check database connection count
SELECT 
    count(*) as total_connections,
    count(*) FILTER (WHERE state = 'active') as active_connections,
    count(*) FILTER (WHERE state = 'idle') as idle_connections,
    count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction
FROM pg_stat_activity
WHERE datname = current_database();

-- 8. Check if columns already exist (fast check)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'link_items' 
    AND column_name IN ('image_position', 'image_scale');

