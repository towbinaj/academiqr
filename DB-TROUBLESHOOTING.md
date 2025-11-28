# Database Troubleshooting Guide

## Is Your Database Corrupt?

**Probably not.** The "Unhealthy" services suggest a service issue rather than corruption. However, here's how to check:

## Signs of Corruption vs Service Issues

### Service Issues (More Likely):
- ✅ Multiple services showing "Unhealthy"
- ✅ Connection timeouts
- ✅ "Recently restored" message
- ✅ Services recover after waiting

### Database Corruption (Less Likely):
- ❌ Specific table errors (not timeouts)
- ❌ Data inconsistencies
- ❌ Checksum errors
- ❌ Specific queries fail with corruption errors

## Diagnostic Steps

### Step 1: Wait for Services to Recover
1. Wait 5-10 minutes
2. Refresh Project Status
3. Check if services turn green

### Step 2: Run Health Checks
Run queries from `check-db-health.sql` one at a time:
- Start with simple queries (version, count)
- If those work, try more complex ones
- Stop if any query times out

### Step 3: Check What Works
- Can you read from the table? (`SELECT COUNT(*) FROM link_items`)
- Can you write to the table? (Try a simple UPDATE)
- Are other tables accessible?

## Common Issues and Fixes

### Issue: Services Unhealthy
**Fix:** Wait for services to recover (5-10 minutes)

### Issue: Table Locks
**Fix:** 
1. Check for long-running queries
2. Kill blocking queries (carefully)
3. See `fix-db-issues.sql`

### Issue: Too Many Dead Rows
**Fix:** Run `VACUUM ANALYZE` (see `fix-db-issues.sql`)

### Issue: Index Corruption
**Fix:** Run `REINDEX TABLE` (see `fix-db-issues.sql`)

## If Database is Actually Corrupt

Supabase has built-in backups and recovery:
1. Check Supabase Dashboard → Backups
2. Contact Supabase Support
3. They can restore from a backup if needed

## What to Do Right Now

1. **Wait** - Services might recover on their own
2. **Check Status** - Refresh Project Status page
3. **Run Diagnostics** - Use `check-db-health.sql` (if services are healthy)
4. **Contact Support** - If issues persist after 15-20 minutes

## Prevention

- Regular VACUUM (Supabase does this automatically)
- Monitor table size
- Don't run long transactions
- Use connection pooling


