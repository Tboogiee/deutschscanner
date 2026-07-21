-- DeutschScanner account data model.
-- Run this once in Supabase → SQL Editor after creating the project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, destination_slug)
);

create table if not exists public.visits (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  visited_at date not null default current_date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  primary key (user_id, destination_slug)
);

create index if not exists favorites_user_created_idx
  on public.favorites (user_id, created_at desc);

create index if not exists visits_user_date_idx
  on public.visits (user_id, visited_at desc);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.visits enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users manage their favorites" on public.favorites;
create policy "Users manage their favorites"
  on public.favorites for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users manage their visits" on public.visits;
create policy "Users manage their visits"
  on public.visits for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
