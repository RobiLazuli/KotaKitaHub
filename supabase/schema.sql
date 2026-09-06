-- ============================================================
-- Kota Cimahi Smart City Portal — Database Schema & RLS Policies
-- Run this in the Supabase SQL Editor (or `supabase db push`).
-- ============================================================

-- 1. TABLES ------------------------------------------------------------

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  nik         text,
  district    text,
  phone       text,
  created_at  timestamptz not null default now()
);

create table if not exists public.categories (
  id          int generated always as identity primary key,
  slug        text not null unique,
  name        text not null,
  description text not null default '',
  icon        text not null default 'file-text'
);

create table if not exists public.tickets (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,            -- e.g. CMH-2026-AB12
  user_id     uuid references public.profiles(id) on delete set null,
  category_id int not null references public.categories(id),
  title       text not null,
  description text not null,
  latitude    double precision not null,
  longitude   double precision not null,
  address     text,
  photo_url   text,
  status      text not null default 'submitted'
              check (status in ('submitted','under_review','in_progress','resolved')),
  is_public   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.ticket_updates (
  id          bigint generated always as identity primary key,
  ticket_id   uuid not null references public.tickets(id) on delete cascade,
  status      text not null
              check (status in ('submitted','under_review','in_progress','resolved')),
  message     text not null default '',
  author_name text not null default 'Dinas Terkait',
  created_at  timestamptz not null default now()
);

create table if not exists public.amenities (
  id          int generated always as identity primary key,
  name        text not null,
  type        text not null
              check (type in ('government','health','emergency','park','transport','education')),
  address     text,
  latitude    double precision not null,
  longitude   double precision not null,
  phone       text,
  hours       text,
  description text
);

create index if not exists tickets_status_idx   on public.tickets(status);
create index if not exists tickets_user_idx     on public.tickets(user_id);
create index if not exists ticket_updates_idx   on public.ticket_updates(ticket_id);

-- 2. ROW LEVEL SECURITY ------------------------------------------------

alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.tickets        enable row level security;
alter table public.ticket_updates enable row level security;
alter table public.amenities      enable row level security;

-- profiles: users manage only their own row
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- categories & amenities: readable by everyone
create policy "categories_read_all" on public.categories
  for select using (true);
create policy "amenities_read_all" on public.amenities
  for select using (true);

-- tickets: anyone can read public reports; owners see their own;
-- authenticated users create their own; only the owner may edit.
create policy "tickets_read_public" on public.tickets
  for select using (is_public or auth.uid() = user_id);
create policy "tickets_insert_auth" on public.tickets
  for insert with check (auth.uid() = user_id);
create policy "tickets_update_own" on public.tickets
  for update using (auth.uid() = user_id);

-- ticket updates are visible wherever the parent ticket is visible
create policy "updates_read_public" on public.ticket_updates
  for select using (
    exists (
      select 1 from public.tickets t
      where t.id = ticket_updates.ticket_id
        and (t.is_public or t.user_id = auth.uid())
    )
  );

-- 3. HELPERS / TRIGGERS -------------------------------------------------

-- Auto-create a profile row when a new user registers.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generate CS-style ticket codes, e.g. CMH-2026-A4F2.
create or replace function public.generate_ticket_code()
returns text
language sql volatile
as $$
  select 'CMH-2026-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 4));
$$;

-- Auto-stamp updated_at on ticket changes.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tickets_touch on public.tickets;
create trigger tickets_touch
  before update on public.tickets
  for each row execute function public.touch_updated_at();

-- Keep a timeline entry whenever the ticket status changes.
create or replace function public.log_status_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.ticket_updates (ticket_id, status, message)
    values (new.id, new.status, 'Status laporan diperbarui.');
  end if;
  return new;
end;
$$;

drop trigger if exists tickets_status_log on public.tickets;
create trigger tickets_status_log
  after update on public.tickets
  for each row execute function public.log_status_change();

-- 4. SEED DATA ---------------------------------------------------------

insert into public.categories (slug, name, description, icon) values
  ('jalan-rusak',   'Jalan Rusak',          'Kerusakan jalan, lubang, drainase tersumbat', 'cone'),
  ('penerangan',    'Penerangan Jalan',     'Lampu jalan mati atau rusak (PJU)',           'lamp'),
  ('sampah',        'Sampah & Lingkungan',  'Tumpukan sampah, TPS liar, kebersihan',       'trash-2'),
  ('fasilitas',     'Fasilitas Umum',       'Taman, halte, fasilitas publik lainnya',      'building')
on conflict (slug) do nothing;

insert into public.amenities (name, type, address, latitude, longitude, phone, hours) values
  ('Balai Kota Cimahi',            'government', 'Jl. Rd. Demang Hardjakusumah, Cimahi Tengah', -6.8722, 107.5424, '(022) 6632834', 'Senin–Jumat 08.00–15.00'),
  ('DPMPTSP Kota Cimahi',          'government', 'Jl. Rd. Demang Hardjakusumah',              -6.8729, 107.5437, '(022) 6653550', 'Senin–Jumat 08.00–15.00'),
  ('Dinas Kependudukan & Catatan Sipil', 'government', 'Jl. Rd. Demang Hardjakusumah',        -6.8736, 107.5420, '(022) 6614726', 'Senin–Jumat 08.00–15.30'),
  ('RSUD Cibabat',                 'health',     'Jl. Raya Cibabat No. 391',                  -6.8533, 107.5660, '(022) 6650335', '24 Jam'),
  ('Puskesmas Cimahi Tengah',      'health',     'Jl. Encep Kartawiria',                      -6.8836, 107.5422, '(022) 6652064', 'Senin–Sabtu 07.30–14.00'),
  ('Pemadam Kebakaran Kota Cimahi','emergency',  'Jl. Baros, Baros, Cimahi Tengah',           -6.8916, 107.5320, '113', '24 Jam'),
  ('Polres Cimahi',                'emergency',  'Jl. Jend. H. Amir Machmud No. 911',         -6.8973, 107.5656, '(022) 6657110', '24 Jam'),
  ('Taman Alun-Alun Cimahi',       'park',       'Jl. Rd. Demang Hardjakusumah',              -6.8760, 107.5370, null, '06.00–21.00'),
  ('Taman Kehat Kejutan',          'park',       'Jl. Sriwijaya, Cibeber',                    -6.9165, 107.5407, null, '06.00–18.00'),
  ('Stasiun Cimahi',               'transport',  'Jl. Stasiun, Cimahi Utara',                 -6.8858, 107.5361, null, '04.00–22.00'),
  ('Terminal Cibeureum',           'transport',  'Jl. Raya Cibeureum',                        -6.9189, 107.5496, null, '05.00–20.00'),
  ('SDN 1 Cimahi',                 'education',  'Jl. Rd. Demang Hardjakusumah',              -6.8740, 107.5398, null, 'Senin–Jumat 07.00–14.00')
on conflict do nothing;

-- Sample public reports so the map/directory are not empty after seeding.
do $$
declare
  cat_jalan int; cat_pju int; cat_sampah int;
begin
  select id into cat_jalan  from public.categories where slug = 'jalan-rusak';
  select id into cat_pju    from public.categories where slug = 'penerangan';
  select id into cat_sampah from public.categories where slug = 'sampah';

  insert into public.tickets (code, user_id, category_id, title, description, latitude, longitude, address, status)
  values
    ('CMH-2026-7K21', null, cat_jalan,  'Jalan berlubang di depan Balai Kota',   'Lubang besar cukup dalam, membahayakan pengendara motor di malam hari.',            -6.8712, 107.5455, 'Jl. Rd. Demang Hardjakusumah', 'in_progress'),
    ('CMH-2026-9P04', null, cat_pju,    'Lampu PJU mati 3 hari',                 'Lampu penerangan jalan mati total sejak 3 hari lalu, area gelap gulita.',           -6.8903, 107.5538, 'Jl. Jend. H. Amir Machmud',   'under_review'),
    ('CMH-2026-BX18', null, cat_sampah, 'TPS liar di Jl. Sriwijaya',             'Sampah menumpuk dan mengeluarkan bau, belum diangkut seminggu.',                    -6.9152, 107.5391, 'Jl. Sriwijaya, Cibeber',      'submitted'),
    ('CMH-2026-DM77', null, cat_jalan,  'Retakan bahu jalan The Hive',           'Aspal retak dan amblas sebagian di dekat kawasan sekitar.',                        -6.8930, 107.5562, 'Jl. Amir Machmud',            'resolved'),
    ('CMH-2026-FQ33', null, cat_pju,    'Lampu taman alun-alun rusak',           'Dua lampu di area taman alun-alun padam sejak minggu lalu.',                        -6.8763, 107.5380, 'Taman Alun-Alun Cimahi',      'resolved')
  on conflict (code) do nothing;
end $$;

-- 5. STORAGE ------------------------------------------------------------

-- Bucket for report photo attachments (run once; skip if exists).
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

create policy "report_photos_read_all" on storage.objects
  for select using (bucket_id = 'report-photos');
create policy "report_photos_insert_auth" on storage.objects
  for insert with check (bucket_id = 'report-photos' and auth.role() = 'authenticated');
