-- Create manager_contractors table
create table if not exists manager_contractors (
  manager_id uuid not null,
  contractor_id uuid not null,
  primary key (manager_id, contractor_id)
);

-- Enable RLS
alter table manager_contractors enable row level security;

-- Policy: Managers can SELECT rows where manager_id = auth.uid()
create policy "Managers can select their contractors" on manager_contractors
  for select using (manager_id = auth.uid());

-- Policy: Only service role can insert
create policy "Service role can insert manager_contractors" on manager_contractors
  for insert to authenticated using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Update change_notifications policy for manager visibility
drop policy if exists "Managers can select" on change_notifications;
create policy "Managers can select" on change_notifications
  for select using (
    exists (
      select 1 from manager_contractors mc
      where mc.manager_id = auth.uid() and mc.contractor_id = change_notifications.contractor_id
    )
  );

-- Update pay_periods policy for manager visibility
-- (Assumes pay_periods has contractor_id column)
drop policy if exists "Managers can select" on pay_periods;
create policy "Managers can select" on pay_periods
  for select using (
    exists (
      select 1 from manager_contractors mc
      where mc.manager_id = auth.uid() and mc.contractor_id = pay_periods.contractor_id
    )
  ); 