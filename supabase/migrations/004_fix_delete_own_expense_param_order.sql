-- PostgREST resolves RPC args alphabetically; recreate delete_own_expense with matching order.

drop function if exists public.delete_own_expense(uuid, uuid);

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

grant execute on function public.delete_own_expense(uuid, uuid) to service_role;
