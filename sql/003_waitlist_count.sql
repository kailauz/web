create or replace function public.get_landing_waitlist_count()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::bigint
  from public.landing_waitlist
  where consent_email_marketing = true;
$$;

revoke all on function public.get_landing_waitlist_count() from public;
grant execute on function public.get_landing_waitlist_count() to anon, authenticated, service_role;
