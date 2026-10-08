-- RevealMe planned data model (NOT yet applied — the MVP runs in demo mode).
-- Use as a starting point when enabling a real backend.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  birth_date date not null check (birth_date <= current_date - interval '18 years'),
  gender text,
  seeking text,
  bio text check (char_length(bio) <= 160),
  photo_path text,            -- private storage; serve server-blurred variants only
  blur_by_default boolean not null default true,
  show_age boolean not null default true,
  discoverable boolean not null default true,
  created_at timestamptz not null default now()
);

create table connections (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references profiles(id) on delete cascade,
  to_user uuid not null references profiles(id) on delete cascade,
  status text not null check (status in ('pending','passed','connected')),
  created_at timestamptz not null default now(),
  unique (from_user, to_user)
);

create table reveal_sessions (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references profiles(id) on delete cascade,
  user_b uuid not null references profiles(id) on delete cascade,
  level smallint not null default 0 check (level in (0,25,50,75,100)),
  is_mutual boolean not null default false,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table interactions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references reveal_sessions(id) on delete cascade,
  author uuid not null references profiles(id) on delete cascade,
  prompt_id text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references reveal_sessions(id) on delete cascade,
  sender uuid not null references profiles(id) on delete cascade,
  body text not null check (char_length(body) <= 2000),
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter uuid not null references profiles(id) on delete cascade,
  reported uuid not null references profiles(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

create table blocks (
  blocker uuid not null references profiles(id) on delete cascade,
  blocked uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked)
);
-- Remember: GRANTs + RLS policies for every table before going live.