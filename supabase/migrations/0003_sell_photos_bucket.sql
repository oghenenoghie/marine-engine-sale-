-- Storage bucket for sell-to-us equipment photos, uploaded directly from the
-- browser (anon key) the same way stock_items/enquiries already allow public
-- inserts — see "public insert enquiries" in 0001_init.sql.
insert into storage.buckets (id, name, public)
values ('sell-photos', 'sell-photos', true)
on conflict (id) do nothing;

create policy "public read sell-photos" on storage.objects for select
  using (bucket_id = 'sell-photos');

create policy "public upload sell-photos" on storage.objects for insert
  with check (bucket_id = 'sell-photos');
