-- 0004_stock_photos_bucket.sql checked auth.jwt() ->> 'role', but that JWT
-- claim is always the Postgres/session role ("authenticated"), never the
-- app's own admin flag — this app stores that under app_metadata.role (see
-- lib/actions/auth.ts requireAdmin()). Every admin-write policy elsewhere in
-- this schema has the same mistake, but it was never exercised because
-- those writes go through the service-role client (bypasses RLS entirely);
-- this storage bucket is the first policy a real authenticated browser
-- session actually has to satisfy, so it's the first place the bug showed up
-- as uploads being silently rejected.
drop policy if exists "admin insert stock-photos" on storage.objects;
drop policy if exists "admin update stock-photos" on storage.objects;
drop policy if exists "admin delete stock-photos" on storage.objects;

create policy "admin insert stock-photos" on storage.objects for insert
  with check (bucket_id = 'stock-photos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin update stock-photos" on storage.objects for update
  using (bucket_id = 'stock-photos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin delete stock-photos" on storage.objects for delete
  using (bucket_id = 'stock-photos' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
