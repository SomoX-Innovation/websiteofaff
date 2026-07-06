-- SEO-friendly fields for public watch URLs and meta tags (run in SQL Editor or via migrations).

alter table public.offers add column if not exists slug text;
alter table public.offers add column if not exists meta_title text;
alter table public.offers add column if not exists meta_description text;
alter table public.offers add column if not exists tags text;
alter table public.offers add column if not exists category text;

create unique index if not exists offers_slug_unique
  on public.offers (lower(trim(slug)))
  where slug is not null and length(trim(slug)) > 0;
