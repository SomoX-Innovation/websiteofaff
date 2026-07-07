-- PDF story / comic series pages (e.g. episodic adult comic series).
-- Run after 002_admin_rls.sql. Creates the stories table + RLS.
-- PDFs and covers are hosted externally — paste full URLs into pdf_url / cover_url.
--
-- ⚠ Only link PDFs you own or are licensed to distribute.

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  description text,
  series text,               -- e.g. "My Series"; groups episodes together
  episode int,               -- episode / part number within the series
  cover_url text,            -- full URL to the cover image
  pdf_url text not null,     -- full URL to the PDF
  pages int,                 -- optional page count shown on the card
  tags text,                 -- comma-separated
  category text,
  meta_title text,
  meta_description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.stories enable row level security;

drop policy if exists "Public read active stories" on public.stories;
create policy "Public read active stories"
  on public.stories for select
  using (is_active = true);

drop policy if exists "Admin manage stories" on public.stories;
create policy "Admin manage stories"
  on public.stories for all
  using (public.is_admin ())
  with check (public.is_admin ());
