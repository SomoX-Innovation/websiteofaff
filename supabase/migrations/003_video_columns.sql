-- Adds video fields for public grid. Run after 001 (and 002 if used).
-- Public site only lists rows with a non-empty video_url.

alter table public.offers alter column href drop not null;

alter table public.offers add column if not exists video_url text;
alter table public.offers add column if not exists poster_url text;
