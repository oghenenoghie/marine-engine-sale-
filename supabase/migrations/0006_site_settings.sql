-- Key/value store for small pieces of admin-editable site content that
-- don't warrant their own table — starting with the homepage hero
-- background image. Same public-read/admin-write shape as the taxonomy
-- tables in 0001_init.sql.
create table site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

create policy "public read site_settings" on site_settings for select using (true);
create policy "admin write site_settings" on site_settings for all
  using (auth.jwt() ->> 'role' = 'admin') with check (auth.jwt() ->> 'role' = 'admin');

-- Storage bucket for site-level imagery (currently: the homepage hero
-- background), uploaded directly from the admin Dashboard. Same
-- public-read/admin-write shape as brand-logos (0005).
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "public read site-images" on storage.objects for select
  using (bucket_id = 'site-images');

create policy "admin insert site-images" on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.jwt() ->> 'role' = 'admin');

create policy "admin update site-images" on storage.objects for update
  using (bucket_id = 'site-images' and auth.jwt() ->> 'role' = 'admin');

create policy "admin delete site-images" on storage.objects for delete
  using (bucket_id = 'site-images' and auth.jwt() ->> 'role' = 'admin');
