-- Group videos (offers) into related collections, same pattern as stories.
-- Run after 009_stories.sql.

alter table public.offers add column if not exists series text;
alter table public.offers add column if not exists episode int;
