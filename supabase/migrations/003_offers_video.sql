-- Adds video fields for the public site (videos only). Safe to run once on existing DBs.

alter table public.offers add column if not exists video_url text;
alter table public.offers add column if not exists poster_url text;

alter table public.offers alter column href drop not null;
