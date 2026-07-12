-- =============================================================================
-- adultaffiliate — full database setup (Supabase → SQL Editor)
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS where needed.
-- After run: add your user to admins (see bottom).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  href text,
  video_url text,
  poster_url text,
  slug text,
  meta_title text,
  meta_description text,
  tags text,
  category text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Legacy databases: ensure embed + SEO columns exist
alter table public.offers add column if not exists video_url text;
alter table public.offers add column if not exists poster_url text;
alter table public.offers add column if not exists slug text;
alter table public.offers add column if not exists meta_title text;
alter table public.offers add column if not exists meta_description text;
alter table public.offers add column if not exists tags text;
alter table public.offers add column if not exists category text;
alter table public.offers add column if not exists series text;
alter table public.offers add column if not exists episode int;
alter table public.offers alter column href drop not null;

create unique index if not exists offers_slug_unique
  on public.offers (lower(trim(slug)))
  where slug is not null and length(trim(slug)) > 0;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Row level security
-- -----------------------------------------------------------------------------

alter table public.site_settings enable row level security;
alter table public.offers enable row level security;
alter table public.contact_messages enable row level security;

-- Public site + contact form
drop policy if exists "Public read settings" on public.site_settings;
create policy "Public read settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Public read active offers" on public.offers;
create policy "Public read active offers"
  on public.offers for select
  using (is_active = true);

drop policy if exists "Public insert contact" on public.contact_messages;
create policy "Public insert contact"
  on public.contact_messages for insert
  with check (length(trim(message)) > 0);

-- -----------------------------------------------------------------------------
-- Admin role (Auth user UUID in site_admins)
-- -----------------------------------------------------------------------------

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.site_admins enable row level security;

-- No RLS policies on site_admins = only service role / table owner by default.
-- Grant authenticated users to read own row if you add a policy later; admin UI uses offers/settings policies.

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

-- -----------------------------------------------------------------------------
-- Seed defaults (does not overwrite existing keys)
-- -----------------------------------------------------------------------------

insert into public.site_settings (key, value) values
  ('site_name', 'Velvet'),
  ('hero_title', 'Trending videos'),
  ('hero_lead', 'Fresh clips updated daily.'),
  ('primary_cta', 'https://example.com/'),
  ('secondary_cta', 'https://example.com/'),
  ('primary_cta_label', 'More'),
  ('secondary_cta_label', 'Live')
on conflict (key) do nothing;

-- -----------------------------------------------------------------------------
-- Optional: remove old Google TV sample bucket demo rows (from migration 004)
-- -----------------------------------------------------------------------------

delete from public.offers
where video_url is not null
  and video_url like '%gtv-videos-bucket/sample/%';

-- =============================================================================
-- NEXT STEP — grant yourself admin (replace with your Auth user id):
--
--   insert into public.site_admins (user_id)
--   values ('00000000-0000-0000-0000-000000000000')
--   on conflict (user_id) do nothing;
--
-- Find UUID: Dashboard → Authentication → Users → copy user id.
-- =============================================================================
