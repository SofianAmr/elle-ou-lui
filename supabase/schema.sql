-- À exécuter dans Supabase : SQL Editor → New query → Run
--
-- Si tu avais l'ancienne table votes (sans game_sessions), exécute d'abord :
-- drop table if exists public.votes cascade;

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  phase text not null default 'lobby'
    check (phase in ('lobby', 'voting', 'results', 'finished')),
  current_question_index integer not null default 0
    check (current_question_index between 0 and 19),
  voting_started_at timestamptz,
  show_qr boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  game_session_id uuid not null references public.game_sessions (id) on delete cascade,
  session_id text not null,
  is_host boolean not null default false,
  last_seen_at timestamptz not null default now(),
  unique (game_session_id, session_id)
);

alter table public.participants
  add column if not exists is_host boolean not null default false;

create index if not exists participants_game_session_id_idx
  on public.participants (game_session_id);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  game_session_id uuid not null references public.game_sessions (id) on delete cascade,
  question_id integer not null check (question_id between 1 and 20),
  choice text not null check (choice in ('elle', 'lui')),
  session_id text not null,
  created_at timestamptz not null default now(),
  unique (game_session_id, question_id, session_id)
);

create index if not exists votes_game_session_question_idx
  on public.votes (game_session_id, question_id);

alter table public.game_sessions enable row level security;
alter table public.participants enable row level security;
alter table public.votes enable row level security;

create policy "Sessions lisibles par tous"
  on public.game_sessions for select
  to anon, authenticated
  using (true);

create policy "Sessions modifiables par tous"
  on public.game_sessions for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Sessions créables par tous"
  on public.game_sessions for insert
  to anon, authenticated
  with check (true);

create policy "Sessions supprimables par tous"
  on public.game_sessions for delete
  to anon, authenticated
  using (true);

create policy "Participants lisibles par tous"
  on public.participants for select
  to anon, authenticated
  using (true);

create policy "Participants upsertables par tous"
  on public.participants for insert
  to anon, authenticated
  with check (true);

create policy "Participants modifiables par tous"
  on public.participants for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Votes lisibles par tous"
  on public.votes for select
  to anon, authenticated
  using (true);

create policy "Votes insérables par tous"
  on public.votes for insert
  to anon, authenticated
  with check (true);

create policy "Votes modifiables par tous"
  on public.votes for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Votes supprimables par tous"
  on public.votes for delete
  to anon, authenticated
  using (true);

alter table public.game_sessions replica identity full;

alter publication supabase_realtime add table public.game_sessions;
