-- Blog posts for the new /blog section. Same public-read/admin-write shape
-- as taxonomy tables (0001_init.sql), but public read is restricted to
-- published rows so drafts stay admin-only. Uses the corrected admin-role
-- check from the start (see 0005_fix_stock_photos_admin_policy.sql /
-- 0007_fix_site_images_and_brand_logos_admin_policy.sql for why
-- auth.jwt() ->> 'role' is wrong and (auth.jwt() -> 'app_metadata' ->> 'role')
-- is the correct check).
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  body text not null,
  cover_image text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

create policy "public read published blog_posts" on blog_posts for select
  using (published = true);

create policy "admin write blog_posts" on blog_posts for all
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Storage bucket for blog cover photos, uploaded directly from the admin
-- Blog dashboard — same public-read/admin-write shape as brand-logos/
-- site-images.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "public read blog-images" on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "admin insert blog-images" on storage.objects for insert
  with check (bucket_id = 'blog-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin update blog-images" on storage.objects for update
  using (bucket_id = 'blog-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admin delete blog-images" on storage.objects for delete
  using (bucket_id = 'blog-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
