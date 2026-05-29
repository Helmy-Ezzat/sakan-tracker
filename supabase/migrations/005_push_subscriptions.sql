-- Web Push subscriptions (background notifications when screen locked / other apps)

create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users (id) on delete cascade,
  endpoint   text not null,
  p256dh     text not null,
  auth_key   text not null,
  created_at timestamptz not null default now(),

  constraint push_subscriptions_endpoint_unique unique (endpoint)
);

create index push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

-- Managed only via service role on the server
create policy "push_subscriptions_deny_all"
  on public.push_subscriptions
  for all
  to authenticated, anon
  using (false)
  with check (false);
