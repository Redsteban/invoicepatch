-- Drop manager_contractors table and policies

drop policy if exists "Managers can select their contractors" on manager_contractors;
drop policy if exists "Service role can insert manager_contractors" on manager_contractors;
drop table if exists manager_contractors;

-- Optionally revert change_notifications and pay_periods policies to previous state (manual)
-- (No-op here, as previous policy definitions are unknown) 