-- 1. Add room_code column to tables
alter table public.users add column room_code text not null default 'default_room';
alter table public.sessions add column room_code text not null default 'default_room';
alter table public.expenses add column room_code text not null default 'default_room';
alter table public.push_subscriptions add column room_code text not null default 'default_room';

alter table public.users alter column room_code drop default;
alter table public.sessions alter column room_code drop default;
alter table public.expenses alter column room_code drop default;
alter table public.push_subscriptions alter column room_code drop default;

-- 2. Drop the existing unique constraint on phone_number and add composite one
alter table public.users drop constraint users_phone_number_unique;
alter table public.users add constraint users_phone_room_unique unique (phone_number, room_code);

-- 3. Sessions: only one active session per room_code
drop index if exists sessions_one_active_idx;
create unique index sessions_one_active_idx on public.sessions (room_code, status) where status = 'active';

-- 4. Recreate the settle_and_start_new_session function
drop function if exists public.settle_and_start_new_session(uuid);

create or replace function public.settle_and_start_new_session(caller_user_id uuid, p_room_code text)
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
    where id = caller_user_id and role = 'admin' and room_code = p_room_code
  ) then
    raise exception 'admin_required';
  end if;

  update public.sessions
  set
    status   = 'archived',
    ended_at = now()
  where status = 'active' and room_code = p_room_code;

  insert into public.sessions (status, room_code)
  values ('active', p_room_code)
  returning id into new_session_id;

  return new_session_id;
end;
$$;

grant execute on function public.settle_and_start_new_session(uuid, text) to service_role;
