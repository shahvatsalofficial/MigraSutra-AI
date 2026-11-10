-- do not run this migration, test fixture only
DROP TABLE old_customers;
ALTER TABLE customers DROP COLUMN legacy_id;
TRUNCATE TABLE analytics_cache;
DELETE FROM pending_jobs;
