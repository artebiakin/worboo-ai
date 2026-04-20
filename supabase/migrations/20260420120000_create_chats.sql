create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chats_user_id_updated_at_idx
  on public.chats (user_id, updated_at desc);

alter table public.chats enable row level security;

create policy "chats_select_own" on public.chats
  for select to authenticated
  using (user_id = auth.uid());

create policy "chats_insert_own" on public.chats
  for insert to authenticated
  with check (user_id = auth.uid());
