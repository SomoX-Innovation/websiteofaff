-- Run this in Supabase → SQL Editor (or save as a migration).
-- Creates tables, RLS, and seed rows for the video site.

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
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.offers enable row level security;
alter table public.contact_messages enable row level security;

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

-- Optional: block public from reading contact submissions (default: no select policy for anon).

insert into public.site_settings (key, value) values
  ('site_name', 'Velvet'),
  ('hero_title', 'Trending videos'),
  ('hero_lead', 'Fresh clips — scroll down to watch.'),
  ('primary_cta', 'https://example.com/'),
  ('secondary_cta', 'https://example.com/'),
  ('primary_cta_label', 'More'),
  ('secondary_cta_label', 'Live')
on conflict (key) do nothing;

-- Add offers in the admin UI (no bundled demo videos).
