-- Check if rate_limits table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'rate_limits'
) AS table_exists;

-- If the table exists, show its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'rate_limits'
ORDER BY ordinal_position;

-- Show any indexes on the rate_limits table
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'rate_limits'
AND schemaname = 'public'; 