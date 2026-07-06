-- Run after 001_initial.sql. Adds admin role + RLS for client-side admin UI.
--
-- Admin UI (/admin.html) signs in with Supabase Auth (password, magic link, or OAuth). Row-level security
-- still requires auth.uid() to appear in site_admins. Dashboard: Authentication → URL Configuration
-- (Site URL + Redirect URLs must include .../admin.html for local and production).
--
-- After you create a user (Authentication → Users or Sign up on /admin.html), grant admin:
--
--   insert into public.site_admins (user_id) values ('PASTE-USER-UUID-HERE');
--
-- Find UUID: Supabase Dashboard → Authentication → Users → copy id.

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.site_admins enable row level security;

create or replace function public.is_admin ()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.site_admins s
    where s.user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin () to authenticated;
grant execute on function public.is_admin () to anon;

drop policy if exists "Admin manage offers" on public.offers;
create policy "Admin manage offers"
  on public.offers for all
  using (public.is_admin ())
  with check (public.is_admin ());

drop policy if exists "Admin manage settings" on public.site_settings;
create policy "Admin manage settings"
  on public.site_settings for all
  using (public.is_admin ())
  with check (public.is_admin ());

drop policy if exists "Admin read contacts" on public.contact_messages;
create policy "Admin read contacts"
  on public.contact_messages for select
  using (public.is_admin ());
