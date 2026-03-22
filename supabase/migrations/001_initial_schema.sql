-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users (managed by NextAuth + Supabase) ──
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text unique not null,
  email_verified timestamptz,
  image text,
  password_hash text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Chat sessions ──
create table if not exists public.chat_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null default 'New Session',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Messages ──
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- ── RLS Policies ──
alter table public.users enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.messages enable row level security;

-- Users can only read/update their own profile
create policy "users_own" on public.users
  for all using (auth.uid() = id);

-- Users can only access their own sessions
create policy "sessions_own" on public.chat_sessions
  for all using (auth.uid()::text = user_id::text);

-- Users can only access messages in their sessions
create policy "messages_own" on public.messages
  for all using (auth.uid()::text = user_id::text);

-- ── Indexes ──
create index messages_session_id_idx on public.messages(session_id);
create index messages_created_at_idx on public.messages(created_at);
create index sessions_user_id_idx on public.chat_sessions(user_id);
