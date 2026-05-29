# Supabase — Sakan Tracker

## Apply schema

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `migrations/001_initial_schema.sql`, or use the Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

## Tables

| Table | Purpose |
|-------|---------|
| `users` | Name + phone (unique login identifier) |
| `sessions` | Expense cycles (`active` / `archived`) |
| `session_members` | Who shares costs in a session (settlement denominator) |
| `expenses` | Line items per session |

## Notes

- Financial rows are never hard-deleted; sessions are **archived** via `settle_and_start_new_session()`.
- Only one `active` session is allowed at a time (MVP single-household model).
- RLS policies are permissive placeholders until phone-based auth is implemented.
- App writes use `SUPABASE_SERVICE_ROLE_KEY` on the server. Run migrations `002` and `003` for Realtime and roles/RLS.
- Set a user to admin: `update public.users set role = 'admin' where phone_number = '05…';`

## Env (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
```

Use the **Secret** key (`sb_secret_…`) from **Settings → API Keys**. The legacy `service_role` JWT (`eyJ…`) works as `SUPABASE_SERVICE_ROLE_KEY` instead.
