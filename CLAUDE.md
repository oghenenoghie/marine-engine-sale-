# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

**Drydock** — a B2B trading platform for marine diesel engines and spare parts
(Wärtsilä, MAN, MaK, Deutz, Caterpillar), built around interactive,
drawing-driven part discovery. Buyers find parts three ways: by OEM part
number, by engine model, or by tapping a hotspot on an exploded technical
diagram that links straight to the matching in-stock item.

Three product bets to keep in view when making product/UX decisions:
1. **Drawing-driven discovery** — the exploded diagram (`components/drawings/exploded-drawing.tsx`)
   is the primary way to find a part; no competitor does this.
2. **Condition transparency** — multi-angle photography and honest wear notes;
   image quality is the product.
3. **Part-number-first search** — buyers search by OEM number, not prose.

For full design-system, data-model, and product background, see the
`drydock-marine-platform` skill and `README.md` — both are kept current and
this file avoids duplicating them beyond what's needed to orient quickly.

## Stack

- **Next.js 14** (App Router), TypeScript strict, React 18 — Server Components by default
- **Tailwind CSS v3** + shadcn/ui-style Radix primitives (`components/ui/`)
- **Framer Motion** — restrained scroll reveals only (`components/motion/`)
- **Supabase (Postgres)** — system of record, Auth, Row-Level Security, `pg_trgm` fuzzy search
- **Cloudinary** (`next-cloudinary`) — drawing (exploded-diagram) photos only; `f_auto,q_auto` transforms via a custom `next/image` loader
- **Supabase Storage** — stock item (product) photos (public `stock-photos` bucket, admin-authenticated browser uploads) and sell-to-us equipment photos (public `sell-photos` bucket, anon-key browser uploads); both render with `next/image unoptimized` since they bypass the Cloudinary loader
- **Resend** — transactional email notification for enquiries (submissions are persisted to the `enquiries` table first, see `app/api/enquiry/route.ts`)
- **Vitest** + Testing Library (jsdom) — unit/component tests
- **pnpm**, Vercel hosting, GitHub Actions CI

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm build
pnpm lint             # next lint && tsc --noEmit
pnpm test             # vitest run
pnpm test:watch
pnpm seed             # tsx scripts/seed.ts — pushes lib/data/*.seed.ts into Supabase
```

CI (`.github/workflows/ci.yml`) runs `pnpm lint` then `pnpm build` on push/PR
against `main`, using placeholder env vars. Keep both green before merging —
there is no separate test job in CI yet, so run `pnpm test` locally.

## Project structure

```
app/
├── (site)/            public site: home, engines, parts, brands/[brand]/[model],
│                      drawings/[id], stock, sell, about, contact, faq
│                      + layout.tsx, loading.tsx, error.tsx, not-found.tsx
├── admin/
│   ├── login/         Supabase-auth login
│   └── (protected)/   stock, drawings/[id] (hotspot editor), enquiries,
│                       brands, categories, db-test dashboards
├── cloudinary-test/    manual upload diagnostic page
└── api/                enquiry, upload-sign, revalidate route handlers

components/
├── ui/                 shadcn-style primitives (button, input, select, dialog, accordion…)
├── common/              Header, Footer, PartNumberSearch, PageSpinner
├── stock/                StockCard, Gallery, SpecTable, FacetRail, StockListing, StockDetail, StatusBadge
├── drawings/              ExplodedDrawing, HotspotEditor
├── forms/                  EnquiryForm, SellForm, PhotoUploader
├── admin/                   StockDashboard, HotspotEditorPanel, ImageUploader, BrandsDashboard, CategoriesDashboard
└── motion/                   FadeIn, DrawingReveal

lib/
├── actions/            server actions: auth.ts (requireAdmin), stock.ts, taxonomy.ts
├── data/                 query layer: stock.ts, drawings (seed only), enquiries (seed only),
│                          taxonomy.ts, plus *.seed.ts fixtures for local/no-DB dev
├── supabase/              client.ts (browser), server.ts (server/admin/public clients)
├── cloudinary.ts, cloudinary-loader.ts   Cloudinary signing + next/image loader (drawings only)
└── fonts.ts, search.ts, resend.ts, utils.ts (cn helper, formatPrice, slugify, primaryImage)

types/                  index.ts (domain types), supabase.ts (hand-authored DB types)
supabase/               migrations/0001_init.sql, 0002_add_currency.sql, 0003_sell_photos_bucket.sql,
                          0004_stock_photos_bucket.sql, seed.sql
scripts/seed.ts         pushes lib/data/*.seed.ts fixtures into Supabase
```

## Data model

`Brand ──< EngineModel ──< Drawing ──< Hotspot ─── StockItem`, with
`PartCategory` also hanging off `StockItem`, and `Enquiry` (type `rfq` | `sell`)
referencing an optional `StockItem`.

- The defining relationship is **`Drawing.hotspots[] → StockItem`** — hotspots
  are stored as normalized `(x, y)` coordinates in a `jsonb` column.
- `StockItem.specs` is `jsonb` (per-category attributes vary: turbo vs. crankshaft
  vs. cylinder head). `oem_numbers` is `text[]` with a `pg_trgm` GIN index for
  fuzzy part-number search (see `immutable_array_to_string` wrapper in the
  migration, needed to index a `text[]` with trigrams).
- `StockItem.images` is `jsonb`: `{ url, alt, isPrimary?, type: "photo" | "drawing" }`,
  `url` a full Supabase Storage public URL (bucket `stock-photos`, migration `0004`) —
  admins upload directly from the browser via `components/admin/image-uploader.tsx`.
  Drawing photos (`Drawing.assetKey`) still reference Cloudinary, not this bucket.
- `StockItem.currency` (migration `0002`) — one of `EUR USD GBP NOK SEK DKK JPY SGD CNY`,
  see `types/index.ts` `CURRENCIES`.
- `Enquiry.attachments` is a `jsonb` array of full Supabase Storage public URLs
  (bucket `sell-photos`, migration `0003`) — sellers upload directly from the
  browser via `components/forms/photo-uploader.tsx`.
- RLS: public read of `brands`/`engine_models`/`part_categories`/`drawings`/`stock_items`;
  writes restricted to the admin role (`app_metadata.role === "admin"`). `enquiries` allows
  public insert (anyone can submit an RFQ/sell enquiry), admin-only read/update/delete.
  Storage bucket `sell-photos` mirrors this: public insert + public read, no update/delete.
  Storage bucket `stock-photos` is public read but admin-only insert/update/delete
  (`auth.jwt() ->> 'role' = 'admin'`), since only admins add stock photos.
- Full schema: `supabase/migrations/0001_init.sql`, `0002_add_currency.sql`,
  `0003_sell_photos_bucket.sql`, `0004_stock_photos_bucket.sql`. TS domain types:
  `types/index.ts`. Generated/hand-authored Supabase row types: `types/supabase.ts`.

## Key conventions

- **Server Components by default.** `"use client"` only where state, effects,
  event handlers, or Framer Motion require it — push it as low in the tree as possible.
- **`cn()`** (`lib/utils.ts`, clsx + tailwind-merge) for all conditional className merging.
- **Data access split:**
  - `lib/data/stock.ts` and `lib/data/taxonomy.ts` both query Supabase live
    (`createPublicClient()` — stateless anon-key client, safe outside request
    scope for `sitemap.ts`/`generateStaticParams`), and `lib/data/enquiries.ts`
    reads via `createAdminClient()` (admin-only RLS, no seed fallback — there's
    nothing meaningful to fall back to for admin-only data).
  - `lib/data/stock.ts`/`taxonomy.ts` **do** fall back to `lib/data/*.seed.ts`
    fixtures (`stock.seed.ts`, `taxonomy.seed.ts`, `drawings.seed.ts`) when a
    live Supabase call throws — missing env vars, unreachable project, etc.
    Every exported `getAll*`/`get*BySlug` function wraps its query in
    try/catch and logs `console.warn("[lib/data/…] <fn> falling back to seed
    fixtures", err)` before returning fixture data, so pages degrade instead
    of 500ing. The fixtures' `brandId`/`modelId`/`categoryId`/`drawingId`
    fields intentionally reuse the same UUIDs as `taxonomy.seed.ts` (and
    `drawings.seed.ts`'s `id`) so cross-referencing/denormalization still
    resolves correctly in fallback mode — keep them in sync if you add stock
    or taxonomy fixtures. `scripts/seed.ts` separately pushes these same
    fixtures *into* a real Supabase project; that's a different use of the
    same files, not related to the runtime fallback.
- **Admin writes go through server actions** (`lib/actions/stock.ts`,
  `lib/actions/taxonomy.ts`), which call `requireAdmin()` (`lib/actions/auth.ts`)
  to check `user.app_metadata.role === "admin"` before writing via the
  service-role client (`createAdminClient()` in `lib/supabase/server.ts`).
  Never import `createAdminClient` from client code.
- Pages reading live stock/drawing data set `export const dynamic = "force-dynamic"`
  so admin edits are visible immediately instead of baked into a static build.
- Every route/route-group gets `loading.tsx` and `error.tsx` where data is fetched.
- `generateMetadata()` on public pages; sitemap (`app/sitemap.ts`) and
  `app/robots.ts` are wired for SEO.
- Accessibility floor: visible keyboard focus, `useReducedMotion()` respected
  in all Framer Motion usage, Radix a11y defaults preserved.
- Images always go through `next/image`. Cloudinary assets (drawing photos
  only) use the custom loader (`lib/cloudinary-loader.ts`, wired in
  `next.config.mjs`) — never a raw `<img>` for those. Supabase Storage assets
  (stock item photos and sell-to-us photos) are already-resolved public URLs,
  so they pass `unoptimized` to `next/image` to bypass that same global
  Cloudinary loader rather than being run through it. Tests stub `next/image`
  to a plain `<img>`.
- Commits follow **Conventional Commits**. Keep `pnpm lint` and `pnpm build`
  green before merging.
- `.env.example` is committed and kept current; never commit real secrets.

## Design system — "Drydock"

Blueprint-drafting-table aesthetic: precise/engineered/honest, not luxury or
startup-slick. Full rationale in the `drydock-marine-platform` skill.

- **Colors** (`tailwind.config.ts`): `hull #0E1621` (primary dark), `steel #3B4A5A`,
  `paper #F4F2EC` (page background), `blueprint #2E6E9E` (technical accent/links),
  `signal #C6602B` (CTA/in-stock, used sparingly), `patina #6E8B7B` (success/secondary).
- **Type roles** (`lib/fonts.ts`, CSS vars `--font-display` / `--font-body` / `--font-mono`):
  Archivo 700/800 for display, IBM Plex Sans 400/500/600 for body/UI,
  IBM Plex Mono 400/500 for part numbers/SKUs/specs (`tabular-nums`).
- Callout numbers (01/02…) are reserved for exploded diagrams and the sell-to-us
  process — never purely decorative.
- Motion stays restrained: fade-up on scroll, one hero moment (drawing lines via
  `stroke-dashoffset`). No parallax/bounce.

## Environment variables (`.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET   # drawing photos only
NEXT_PUBLIC_CLOUDINARY_API_KEY   # public copy; CldUploadWidget needs it even unsigned
CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET   # server-only
RESEND_API_KEY / ENQUIRY_NOTIFY_EMAIL
NEXT_PUBLIC_SITE_URL
```

Without Supabase configured, `/admin` runs unauthenticated locally (see
`app/admin/(protected)/layout.tsx`), and public stock/taxonomy/drawing pages
degrade to `lib/data/*.seed.ts` fixtures (see the data-access note above)
instead of 500ing. `/admin/enquiries` still needs a real project — enquiries
have no seed fixture. `NEXT_PUBLIC_SUPABASE_URL`/`_ANON_KEY` also back the
sell-to-us photo upload (Supabase Storage), which shows its own "not
configured" fallback message rather than crashing.

## Testing

Vitest + jsdom + Testing Library (`vitest.config.ts`, `vitest.setup.ts`).
Tests live next to source as `*.test.ts`/`*.test.tsx` (see
`lib/cloudinary-loader.test.ts`, `components/admin/image-uploader.test.tsx`,
`components/forms/photo-uploader.test.tsx`). When testing components that use
`next/image`, `next-cloudinary`, or `@/lib/supabase/client`, mock them (real
network/DOM work isn't relevant to component logic) — `image-uploader.test.tsx`
mocks `next-cloudinary`'s `CldUploadWidget`; `photo-uploader.test.tsx` mocks
`createClient().storage.from(bucket).upload/getPublicUrl` since that component
uploads to Supabase Storage directly instead.

## Current gaps (see README Roadmap for the live list)

- Enquiry (RFQ) and sell-to-us submissions **are** persisted to the
  `enquiries` table (`app/api/enquiry/route.ts` via `createAdminClient()`)
  and `/admin/enquiries` reads them live (`lib/data/enquiries.ts`) — the
  README Roadmap still lists this as unwired; that line is stale.
- `lib/data/enquiries.ts` has no seed-fixture fallback (admin-only data,
  nothing meaningful to fall back to) — `/admin/enquiries` still needs a
  real Supabase project even though public pages now degrade gracefully.
- Search is Postgres FTS/`pg_trgm` only; a Meilisearch/Typesense migration is
  planned for catalog scale, not yet started.

Don't assume any of these is wired up (or broken) without checking current
code first — this section will drift; verify against the actual source.
