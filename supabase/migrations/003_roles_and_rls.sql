-- Roles, tightened RLS, and security-definer helpers for cookie-based app user id.

-- ---------------------------------------------------------------------------
-- User roles
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('user', 'admin');

alter table public.users
  add column if not exists role public.user_role not null default 'user';

create index if not exists users_role_idx on public.users (role);

-- ---------------------------------------------------------------------------
-- Session-scoped expense access (active session reads for clients)
-- ---------------------------------------------------------------------------
drop policy if exists "expenses_select" on public.expenses;
drop policy if exists "expenses_insert" on public.expenses;
drop policy if exists "expenses_select_anon" on public.expenses;
drop policy if exists "expenses_select_active_session" on public.expenses;
drop policy if exists "expenses_select_active_session_anon" on public.expenses;

create policy "expenses_select_active_session"
  on public.expenses
  for select
  to authenticated, anon
  using (
    exists (
      select 1
      from public.sessions s
      where s.id = expenses.session_id
        and s.status = 'active'
    )
  );

-- Inserts still go through server actions (service role). Keep insert for authenticated MVP.
create policy "expenses_insert_authenticated"
  on public.expenses
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.sessions s
      where s.id = session_id
        and s.status = 'active'
    )
  );

-- Deletes only via delete_own_expense() (security definer) from trusted server layer.
-- Direct client DELETE is denied by default (no delete policy).

-- ---------------------------------------------------------------------------
-- Delete own expense (caller must match expense.user_id)
-- ---------------------------------------------------------------------------
-- Parameter order matches PostgREST alphabetical lookup (caller_user_id, expense_id).
create or replace function public.delete_own_expense(
  caller_user_id uuid,
  expense_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  exp public.expenses;
begin
  select * into exp from public.expenses where id = expense_id;
  if not found then
    raise exception 'expense_not_found';
  end if;

  if exp.user_id is distinct from caller_user_id then
    raise exception 'forbidden';
  end if;

  if not exists (
    select 1 from public.sessions
    where id = exp.session_id and status = 'active'
  ) then
    raise exception 'session_not_active';
  end if;

  delete from public.expenses where id = expense_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- Settle cycle — admin only (replaces parameterless version)
-- ---------------------------------------------------------------------------
drop function if exists public.settle_and_start_new_session();

create or replace function public.settle_and_start_new_session(caller_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_session_id uuid;
begin
  if not exists (
    select 1 from public.users
    where id = caller_user_id and role = 'admin'
  ) then
    raise exception 'admin_required';
  end if;

  update public.sessions
  set
    status   = 'archived',
    ended_at = now()
  where status = 'active';

  insert into public.sessions (status)
  values ('active')
  returning id into new_session_id;

  return new_session_id;
end;
$$;

grant execute on function public.delete_own_expense(uuid, uuid) to service_role;
grant execute on function public.settle_and_start_new_session(uuid) to service_role;
