create table if not exists public.landing_waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  locale text not null default 'en',
  source text not null default 'landing',
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.landing_waitlist enable row level security;

create policy "allow public waitlist insert"
on public.landing_waitlist
for insert
to anon, authenticated
with check (true);

create policy "allow public waitlist update by email"
on public.landing_waitlist
for update
to anon, authenticated
using (true)
with check (true);
