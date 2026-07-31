-- 0006_site_settings.sql (site-images bucket + site_settings table) and
-- 0005_brand_logos_bucket.sql both checked auth.jwt() ->> 'role', repeating
-- the exact mistake already fixed for stock-photos in
-- 0005_fix_stock_photos_admin_policy.sql: that JWT claim is always the
-- Postgres/session role ("authenticated"), never the app's own admin flag,
-- which lives under app_metadata.role (see lib/actions/auth.ts
-- requireAdmin()). Both site-images and brand-logos are uploaded directly
-- from an authenticated browser session (components/admin/hero-image-uploader.tsx,
-- components/admin/logo-uploader.tsx use lib/supabase/client.ts, not the
-- service-role client), so both were silently rejecting every admin upload
-- with "new row violates row-level security policy".

drop policy if exists "admin write site_settings" on site_settings;
create policy "admin write site_settings" on site_settings for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin insert site-images" on storage.objects;
drop policy if exists "admin update site-images" on storage.objects;
drop policy if exists "admin delete site-images" on storage.objects;

create policy "admin insert site-images" on storage.objects for insert
  with check (bucket_id = 'site-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin update site-images" on storage.objects for update
  using (bucket_id = 'site-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin delete site-images" on storage.objects for delete
  using (bucket_id = 'site-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "admin insert brand-logos" on storage.objects;
drop policy if exists "admin update brand-logos" on storage.objects;
drop policy if exists "admin delete brand-logos" on storage.objects;

create policy "admin insert brand-logos" on storage.objects for insert
  with check (bucket_id = 'brand-logos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin update brand-logos" on storage.objects for update
  using (bucket_id = 'brand-logos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin delete brand-logos" on storage.objects for delete
  using (bucket_id = 'brand-logos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
