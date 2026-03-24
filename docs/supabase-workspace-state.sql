create table if not exists public.workspace_state (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.workspace_state enable row level security;

create policy "workspace_state_select_anon"
on public.workspace_state
for select
to anon
using (true);

create policy "workspace_state_insert_anon"
on public.workspace_state
for insert
to anon
with check (true);

create policy "workspace_state_update_anon"
on public.workspace_state
for update
to anon
using (true)
with check (true);
