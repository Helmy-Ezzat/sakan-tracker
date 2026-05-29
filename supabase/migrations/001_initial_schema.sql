-- Sakan Tracker — initial schema
-- Run in Supabase SQL Editor or via `supabase db push`

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.session_status as enum ('active', 'archived');

-- ---------------------------------------------------------------------------
-- users — frictionless identity (name + phone, no passwords)
-- ---------------------------------------------------------------------------
create table public.users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(trim(name)) >= 1),
  phone_number  text not null check (char_length(trim(phone_number)) >= 8),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint users_phone_number_unique unique (phone_number)
);

create index users_phone_number_idx on public.users (phone_number);

-- ---------------------------------------------------------------------------
-- sessions — expense cycles (never hard-delete financial data)
-- ---------------------------------------------------------------------------
create table public.sessions (
  id          uuid primary key default gen_random_uuid(),
  status      public.session_status not null default 'active',
  created_at  timestamptz not null default now(),
  ended_at    timestamptz,

  constraint sessions_ended_when_archived check (
    (status = 'archived' and ended_at is not null)
    or (status = 'active' and ended_at is null)
  )
);

-- Only one active session at a time (single shared household for MVP)
create unique index sessions_one_active_idx
  on public.sessions (status)
  where status = 'active';

create index sessions_status_created_at_idx
  on public.sessions (status, created_at desc);

-- ---------------------------------------------------------------------------
-- session_members — who participates in settlement for a session
-- (Required for "expenses / number of users"; not optional for correct math.)
-- ---------------------------------------------------------------------------
create table public.session_members (
  session_id  uuid not null references public.sessions (id) on delete restrict,
  user_id     uuid not null references public.users (id) on delete restrict,
  joined_at   timestamptz not null default now(),

  primary key (session_id, user_id)
);

create index session_members_user_id_idx on public.session_members (user_id);

-- ---------------------------------------------------------------------------
-- expenses
-- ---------------------------------------------------------------------------
create table public.expenses (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.sessions (id) on delete restrict,
  user_id      uuid not null references public.users (id) on delete restrict,
  amount       numeric(12, 2) not null check (amount > 0),
  description  text not null check (char_length(trim(description)) >= 1),
  created_at   timestamptz not null default now()
);

create index expenses_session_id_created_at_idx
  on public.expenses (session_id, created_at desc);

create index expenses_user_id_idx on public.expenses (user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger (users only for now)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Helpers — archive active session & start a new cycle
-- ---------------------------------------------------------------------------
create or replace function public.settle_and_start_new_session()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_session_id uuid;
begin
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

-- ---------------------------------------------------------------------------
-- Row Level Security (policies refined when custom phone-auth is wired)
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.session_members enable row level security;
alter table public.expenses enable row level security;

-- MVP: allow read/write for authenticated role (tighten per session in phase 2)
create policy "users_select" on public.users for select to authenticated using (true);
create policy "users_insert" on public.users for insert to authenticated with check (true);
create policy "users_update" on public.users for update to authenticated using (true);

create policy "sessions_select" on public.sessions for select to authenticated using (true);
create policy "sessions_insert" on public.sessions for insert to authenticated with check (true);
create policy "sessions_update" on public.sessions for update to authenticated using (true);

create policy "session_members_select" on public.session_members for select to authenticated using (true);
create policy "session_members_insert" on public.session_members for insert to authenticated with check (true);

create policy "expenses_select" on public.expenses for select to authenticated using (true);
create policy "expenses_insert" on public.expenses for insert to authenticated with check (true);

-- ---------------------------------------------------------------------------
-- Realtime — broadcast new expenses to connected clients
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.expenses;
