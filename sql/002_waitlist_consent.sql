alter table public.landing_waitlist
  add column if not exists consent_email_marketing boolean not null default false,
  add column if not exists consent_at timestamptz;

update public.landing_waitlist
set
  consent_email_marketing = true,
  consent_at = coalesce(consent_at, created_at)
where consent_email_marketing = false;
