-- Top-level catalog sections (Engines, Spare Parts, Gensets, Power Plants,
-- Gas Turbines) — distinct from `part_categories`, which is the finer-grained
-- taxonomy (Cylinder head, Turbocharger, …) that already hangs off
-- stock_items.category_id. This is a broader grouping used to filter the
-- catalog by product line.
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

insert into categories (id, slug, name) values
  ('55555555-5555-5555-5555-555555555501', 'engines', 'Engines'),
  ('55555555-5555-5555-5555-555555555502', 'spare-parts', 'Spare Parts'),
  ('55555555-5555-5555-5555-555555555503', 'gensets', 'Gensets'),
  ('55555555-5555-5555-5555-555555555504', 'power-plants', 'Power Plants'),
  ('55555555-5555-5555-5555-555555555505', 'gas-turbines', 'Gas Turbines')
on conflict (id) do nothing;

alter table stock_items
  add column product_category_id uuid references categories (id) on delete set null;
create index stock_items_product_category_id_idx on stock_items (product_category_id);

-- Backfill existing rows from the existing engine/part split.
update stock_items set product_category_id = '55555555-5555-5555-5555-555555555501' where type = 'engine';
update stock_items set product_category_id = '55555555-5555-5555-5555-555555555502' where type = 'part';

alter table categories enable row level security;

create policy "public read categories" on categories for select using (true);

create policy "admin write categories" on categories for all
  using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');
