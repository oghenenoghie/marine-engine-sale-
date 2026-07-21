-- Storage bucket for stock item (product) photos, uploaded directly from the
-- admin Stock dashboard. Unlike sell-photos (public insert), only an
-- authenticated admin may write here — public visitors only ever read these
-- via the Cloudinary-free next/image `unoptimized` public URL stored on
-- StockItem.images.
insert into storage.buckets (id, name, public)
values ('stock-photos', 'stock-photos', true)
on conflict (id) do nothing;

create policy "public read stock-photos" on storage.objects for select
  using (bucket_id = 'stock-photos');

create policy "admin insert stock-photos" on storage.objects for insert
  with check (bucket_id = 'stock-photos' and auth.jwt() ->> 'role' = 'admin');

create policy "admin update stock-photos" on storage.objects for update
  using (bucket_id = 'stock-photos' and auth.jwt() ->> 'role' = 'admin');

create policy "admin delete stock-photos" on storage.objects for delete
  using (bucket_id = 'stock-photos' and auth.jwt() ->> 'role' = 'admin');
