create table if not exists public.landing_waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  locale text not null default 'en',
  source text not null default 'landing',
  consent_email_marketing boolean not null default false,
  consent_at timestamptz,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.landing_waitlist enable row level security;

drop policy if exists "allow public waitlist insert" on public.landing_waitlist;
create policy "allow public waitlist insert"
on public.landing_waitlist
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow public waitlist update by email" on public.landing_waitlist;
create policy "allow public waitlist update by email"
on public.landing_waitlist
for update
to anon, authenticated
using (true)
with check (true);
