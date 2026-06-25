-- À exécuter dans Supabase : SQL Editor → New query → Run

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  question_id integer not null check (question_id between 1 and 20),
  choice text not null check (choice in ('elle', 'lui')),
  session_id text not null,
  created_at timestamptz not null default now(),
  unique (question_id, session_id)
);

create index if not exists votes_question_id_idx on public.votes (question_id);

alter table public.votes enable row level security;

create policy "Votes lisibles par tous"
  on public.votes for select
  to anon, authenticated
  using (true);

create policy "Votes insérables par tous"
  on public.votes for insert
  to anon, authenticated
  with check (true);
