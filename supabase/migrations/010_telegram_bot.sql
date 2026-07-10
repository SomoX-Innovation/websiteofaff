-- Telegram bot: subscriber leads + auto-post tracking.
-- Run after 009_stories.sql.

create table if not exists public.telegram_subscribers (
  id uuid primary key default gen_random_uuid(),
  chat_id text unique not null,
  username text,
  first_name text,
  subscribed_at timestamptz not null default now(),
  is_active boolean not null default true
);

alter table public.telegram_subscribers enable row level security;

-- No public policies: this table is only touched by the bot's server-side
-- code using the service role key, never the browser anon key.

create table if not exists public.telegram_posted (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,   -- 'offer' | 'story'
  content_id uuid not null,
  posted_at timestamptz not null default now(),
  unique (content_type, content_id)
);

alter table public.telegram_posted enable row level security;
