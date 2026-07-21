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

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 12 and 800),
  author_name text not null default 'Traveller' check (char_length(author_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, destination_slug)
);

create table if not exists public.shared_itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_slug text not null,
  title text not null check (char_length(title) between 4 and 90),
  summary text not null default '' check (char_length(summary) <= 180),
  stops jsonb not null default '[]'::jsonb check (jsonb_typeof(stops) = 'array'),
  author_name text not null default 'Traveller' check (char_length(author_name) between 1 and 80),
  created_at timestamptz not null default now()
);

create index if not exists favorites_user_created_idx
  on public.favorites (user_id, created_at desc);

create index if not exists visits_user_date_idx
  on public.visits (user_id, visited_at desc);

create index if not exists reviews_destination_created_idx
  on public.reviews (destination_slug, created_at desc);

create index if not exists shared_itineraries_destination_created_idx
  on public.shared_itineraries (destination_slug, created_at desc);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.visits enable row level security;
alter table public.reviews enable row level security;
alter table public.shared_itineraries enable row level security;

grant select, insert, update on table public.profiles to authenticated;
grant select, insert, delete on table public.favorites to authenticated;
grant select, insert, update, delete on table public.visits to authenticated;
grant select on table public.reviews to anon;
grant select, insert, update, delete on table public.reviews to authenticated;
grant select on table public.shared_itineraries to anon;
grant select, insert, update, delete on table public.shared_itineraries to authenticated;

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

drop policy if exists "Users can create their profile" on public.profiles;
create policy "Users can create their profile"
  on public.profiles for insert
  to authenticated
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

drop policy if exists "Reviews are publicly readable" on public.reviews;
create policy "Reviews are publicly readable"
  on public.reviews for select
  to anon, authenticated
  using (true);

drop policy if exists "Users create their reviews" on public.reviews;
create policy "Users create their reviews"
  on public.reviews for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update their reviews" on public.reviews;
create policy "Users update their reviews"
  on public.reviews for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete their reviews" on public.reviews;
create policy "Users delete their reviews"
  on public.reviews for delete
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Itineraries are publicly readable" on public.shared_itineraries;
create policy "Itineraries are publicly readable"
  on public.shared_itineraries for select
  to anon, authenticated
  using (true);

drop policy if exists "Users create itineraries" on public.shared_itineraries;
create policy "Users create itineraries"
  on public.shared_itineraries for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update itineraries" on public.shared_itineraries;
create policy "Users update itineraries"
  on public.shared_itineraries for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete itineraries" on public.shared_itineraries;
create policy "Users delete itineraries"
  on public.shared_itineraries for delete
  to authenticated
  using ((select auth.uid()) = user_id);

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
