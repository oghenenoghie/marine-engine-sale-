-- Drydock schema: taxonomy, stock, drawings, enquiries.
create extension if not exists pg_trgm;
create extension if not exists pgcrypto;

-- array_to_string is only STABLE in core Postgres (its output can depend on
-- locale-sensitive typoutput functions for arbitrary types); text[] elements
-- have no such dependency, so this wrapper is safe to mark IMMUTABLE and use
-- in the oem_numbers trigram index below.
create or replace function immutable_array_to_string(text[]) returns text as $$
  select array_to_string($1, ' ');
$$ language sql immutable strict;

create table brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  logo text,
  blurb text
);

create table engine_models (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  brand_id uuid not null references brands (id) on delete cascade,
  name text not null,
  bore text,
  stroke text,
  config text,
  power_range text
);
create index engine_models_brand_id_idx on engine_models (brand_id);

create table part_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_id uuid references part_categories (id) on delete set null
);

create table drawings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  model_id uuid not null references engine_models (id) on delete cascade,
  asset_key text not null,
  hotspots jsonb not null default '[]'::jsonb
);
create index drawings_model_id_idx on drawings (model_id);

create table stock_items (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  slug text unique not null,
  title text not null,
  type text not null check (type in ('engine', 'part')),
  brand_id uuid not null references brands (id) on delete restrict,
  model_id uuid references engine_models (id) on delete set null,
  category_id uuid not null references part_categories (id) on delete restrict,
  condition text not null check (condition in ('New', 'Used', 'Reconditioned')),
  poa boolean not null default false,
  price numeric(12, 2),
  qty integer not null default 0,
  status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'expected')),
  oem_numbers text[] not null default '{}',
  specs jsonb not null default '{}'::jsonb,
  images jsonb not null default '[]'::jsonb,
  drawing_id uuid references drawings (id) on delete set null,
  description text,
  created_at timestamptz not null default now()
);

create index stock_items_brand_id_idx on stock_items (brand_id);
create index stock_items_model_id_idx on stock_items (model_id);
create index stock_items_category_id_idx on stock_items (category_id);
create index stock_items_status_idx on stock_items (status);
create index stock_items_condition_idx on stock_items (condition);
create index stock_items_oem_numbers_trgm_idx on stock_items using gin (immutable_array_to_string(oem_numbers) gin_trgm_ops);
create index stock_items_title_trgm_idx on stock_items using gin (title gin_trgm_ops);
create index stock_items_sku_trgm_idx on stock_items using gin (sku gin_trgm_ops);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('rfq', 'sell')),
  stock_item_id uuid references stock_items (id) on delete set null,
  name text not null,
  company text,
  email text not null,
  phone text,
  message text not null,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index enquiries_stock_item_id_idx on enquiries (stock_item_id);

-- Row-Level Security ---------------------------------------------------

alter table brands enable row level security;
alter table engine_models enable row level security;
alter table part_categories enable row level security;
alter table drawings enable row level security;
alter table stock_items enable row level security;
alter table enquiries enable row level security;

create policy "public read brands" on brands for select using (true);
create policy "public read engine_models" on engine_models for select using (true);
create policy "public read part_categories" on part_categories for select using (true);
create policy "public read drawings" on drawings for select using (true);
create policy "public read stock_items" on stock_items for select using (true);

-- Writes restricted to the admin role (service_role bypasses RLS entirely;
-- these policies additionally allow an authenticated user tagged as admin
-- via app_metadata.role = 'admin').
create policy "admin write brands" on brands for all
  using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
create policy "admin write engine_models" on engine_models for all
  using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
create policy "admin write part_categories" on part_categories for all
  using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
create policy "admin write drawings" on drawings for all
  using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
create policy "admin write stock_items" on stock_items for all
  using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');

-- Enquiries: anyone can submit (insert), only admins can read/manage.
create policy "public insert enquiries" on enquiries for insert with check (true);
create policy "admin read enquiries" on enquiries for select
  using (auth.jwt() ->> 'role' = 'admin');
create policy "admin manage enquiries" on enquiries for update
  using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
create policy "admin delete enquiries" on enquiries for delete
  using (auth.jwt() ->> 'role' = 'admin');
