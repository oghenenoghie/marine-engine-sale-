-- Storage bucket for brand (manufacturer) logos, uploaded directly from the
-- admin Brands dashboard. Same public-read/admin-write shape as
-- stock-photos (0004) — public visitors only ever read these via the
-- public URL stored on Brand.logo.
insert into storage.buckets (id, name, public)
values ('brand-logos', 'brand-logos', true)
on conflict (id) do nothing;

create policy "public read brand-logos" on storage.objects for select
  using (bucket_id = 'brand-logos');

create policy "admin insert brand-logos" on storage.objects for insert
  with check (bucket_id = 'brand-logos' and auth.jwt() ->> 'role' = 'admin');

create policy "admin update brand-logos" on storage.objects for update
  using (bucket_id = 'brand-logos' and auth.jwt() ->> 'role' = 'admin');

create policy "admin delete brand-logos" on storage.objects for delete
  using (bucket_id = 'brand-logos' and auth.jwt() ->> 'role' = 'admin');
