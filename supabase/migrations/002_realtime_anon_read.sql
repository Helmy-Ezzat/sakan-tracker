-- Allow anon clients to read expenses for Realtime subscriptions (MVP).
-- Writes still go through server actions using the service role.

create policy "expenses_select_anon"
  on public.expenses
  for select
  to anon
  using (true);
