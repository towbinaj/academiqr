-- Diagnostic queries to check database performance
-- Run these separately to identify potential issues

-- 1. Check table size and row count (this might be slow if table is huge)
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    n_live_tup as row_count
FROM pg_stat_user_tables 
WHERE tablename = 'link_items';

-- 2. Check for locks on the link_items table
SELECT 
    locktype,
    relation::regclass,
    mode,
    granted,
    pid
FROM pg_locks
WHERE relation = 'link_items'::regclass;

-- 3. Check for active queries on link_items
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity
WHERE query LIKE '%link_items%'
    AND state != 'idle'
ORDER BY duration DESC;

-- 4. Check table statistics
SELECT 
    schemaname,
    tablename,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE tablename = 'link_items';

-- 5. Simple count (if this times out, the table is very large)
SELECT COUNT(*) FROM public.link_items;


