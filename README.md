<div align="center">

# ⚓ Drydock

**A B2B trading platform for marine diesel engines and spare parts — built around interactive, drawing-driven part discovery.**

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

</div>

---

## Overview

Drydock is a headless, image-first marketplace for buying and selling **complete marine diesel engines, spare parts and associated items** — across brands like Wärtsilä, MAN, MaK, Deutz and Caterpillar. It is designed for the way marine engineers and procurement teams actually shop: by **OEM part number**, by **engine model**, and — uniquely — by **pointing at an exploded technical diagram**.

The marine-parts trading space is crowded with vendors selling near-identical inventory out of similar warehouses. What separates them online is *findability* and *trust*. Drydock is built on three product bets:

1. **Drawing-driven discovery** — an interactive exploded diagram is the primary way to find a part. Tap a callout on a Wärtsilä 32 cross-section and land on the actual in-stock cylinder head. No competitor does this.
2. **Condition transparency** — used parts sell on trust, so multi-angle, well-lit condition photography and honest wear notes are first-class. Image quality *is* the product.
3. **Part-number-first search** — instant, typo-tolerant OEM-number lookup with model and category facets, because that is how buyers actually search.

---

## Signature feature — interactive exploded diagrams

Each engine model carries one or more **exploded drawings**. A drawing is a base image (SVG or high-quality raster) plus an array of **hotspots** — normalized `(x, y)` coordinates, a callout number, a label, and an optional link to a live `StockItem`.

- Buyers browse the diagram (`components/drawings/ExplodedDrawing`); tapping a hotspot reveals the part, its condition, stock status, and a link to the listing.
- Admins author hotspots through `/admin/drawings/[id]` (`components/drawings/HotspotEditor`): load a drawing, click to drop a marker, pick the stock item from a select, save.

This turns a static parts catalog into a visual, engine-aware discovery experience.

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Server Components, streaming, file-based routing, first-class SEO |
| Language | **TypeScript** (strict) | Type-safe end to end, including generated DB types |
| Styling | **Tailwind CSS v3** + **shadcn/ui** (Radix) | Design tokens + accessible primitives |
| Motion | **Framer Motion** | Restrained scroll reveals + the hero drawing animation |
| Data & Auth | **Supabase (Postgres)** | System of record, Auth, Row-Level Security, full-text + `pg_trgm` search |
| Media | **Cloudinary** | Upload widget, on-the-fly transforms (`f_auto,q_auto`), background removal, CDN delivery |
| Email | **Resend** | Transactional RFQ and sell-to-us notifications |
| Hosting & CI | **Vercel** + **GitHub Actions** | Preview deploys + lint/typecheck/build gates |

**Architectural note:** the site is hosted on Vercel, so Postgres (Supabase) is the system of record; Cloudinary is the dedicated media layer. Its upload widget suits photographing stock in the warehouse, and on-the-fly transforms — including background removal to put used parts on clean white — genuinely favour an image-heavy catalog. It plugs into `next/image` through a custom loader.

**Current data source:** until a Supabase project is provisioned, all public and admin pages read from the in-memory fixtures in `lib/data/*.seed.ts` via the query layer in `lib/data/stock.ts`. That file is deliberately shaped like the Postgres queries it will become (facet filters → indexed `WHERE`, part search → `pg_trgm`) — swapping it to call `lib/supabase/server.ts` is the only change needed once the schema in `supabase/migrations/0001_init.sql` is applied to a real project.

---

## Design system — "Drydock"

The visual identity is grounded in the subject's own world: heavy marine engineering at the Port of Rotterdam — steel plate, oil-blackened iron, brass fittings and blueprint paper. It reads *precise, engineered and honest* rather than luxury or startup-slick, with the technical blueprint as the organizing metaphor.

**Palette**

| Token | Hex | Role |
|---|---|---|
| `hull` | `#0E1621` | Primary dark — headers, footer, drawing backdrops |
| `steel` | `#3B4A5A` | Surfaces, borders, muted text |
| `paper` | `#F4F2EC` | Warm blueprint-paper background |
| `blueprint` | `#2E6E9E` | Technical accent — drawing lines, links, hotspots |
| `signal` | `#C6602B` | CTAs and "in stock" — oxidized-iron orange, used sparingly |
| `patina` | `#6E8B7B` | Success / secondary — oxidized-brass green |

**Typography** — a three-role system, self-hosted via `next/font`:

- **Archivo** (display) — hull-signage headlines and section titles.
- **IBM Plex Sans** (body/UI) — an engineering-brand workhorse for prose and controls.
- **IBM Plex Mono** (data) — part numbers, SKUs, dimensions and spec tables, with tabular figures.

---

## Data model

The taxonomy is the backbone of the application.

```
Brand ──< EngineModel ──< Drawing ──< Hotspot ─── StockItem
                              │                       │
PartCategory ─────────────────┴──────────────────────┘
                                                  Enquiry (RFQ | sell)
```

| Entity | Purpose |
|---|---|
| **Brand** | Manufacturer (Wärtsilä, MAN, MaK, Deutz, CAT) |
| **EngineModel** | Specific model with bore, stroke, configuration, power range |
| **PartCategory** | Nestable category (cylinder head, crankshaft, turbo, liner…) |
| **StockItem** | A physical engine or part for sale — condition, price/POA, status, OEM numbers, specs (JSONB), images, optional drawing link |
| **Drawing** | An exploded diagram with an array of hotspots (JSONB) |
| **Enquiry** | An RFQ against a listing, or a sell-to-us submission with attachments |

The defining relationship is `Drawing.hotspots[] → StockItem`. Per-category attributes live in a `jsonb` `specs` column; OEM numbers are stored as `text[]` with a `pg_trgm` GIN index for fuzzy search. Row-Level Security exposes public read of listings while restricting all writes to the admin role. See `supabase/migrations/0001_init.sql`.

---

## Project structure

```
app/
├── (site)/                 # public site
│   ├── page.tsx            # home — hero exploded drawing
│   ├── engines/            # engine list + [slug] detail
│   ├── parts/               # part list + [slug] detail (+ part-number search)
│   ├── brands/[brand]/     # brand hub → [model] hub (drawings + parts)
│   ├── drawings/[id]/      # interactive exploded diagram
│   ├── stock/              # new arrivals + expected stock
│   ├── sell/                # "sell your equipment to us"
│   └── about, contact, faq/
├── admin/                  # auth-gated: stock CRUD, drawings/hotspots, enquiries, brands
└── api/                     # enquiry, upload-sign, revalidate

components/
├── ui/                     # shadcn-style primitives (button, input, select, dialog, accordion…)
├── common/                 # Header, Footer, PartNumberSearch
├── stock/                  # StockCard, Gallery, SpecTable, FacetRail, StockListing, StockDetail
├── drawings/                # ExplodedDrawing, HotspotEditor
├── forms/                   # EnquiryForm, SellForm
├── admin/                   # StockDashboard, HotspotEditorPanel
└── motion/                  # FadeIn, DrawingReveal

lib/
├── data/                    # taxonomy + stock + drawings + enquiries fixtures & query layer
├── supabase/                 # browser/server/admin Supabase clients
├── cloudinary.ts, cloudinary-loader.ts
├── fonts.ts, search.ts, resend.ts, utils.ts

types/                       # shared interfaces + hand-authored Supabase types
supabase/                    # migrations/0001_init.sql, seed.sql
```

---

## Getting started

### Prerequisites

- Node.js 18.17+ and pnpm (or npm)
- A Supabase project (optional for local dev — the site runs on fixture data without one)
- A Cloudinary account (cloud name + API key/secret, and an unsigned upload preset for the widget)
- A Resend API key (optional — enquiries are logged if unset)

### Installation

```bash
git clone https://github.com/<your-username>/drydock.git
cd drydock
pnpm install
cp .env.example .env.local   # then fill in the values below
```

### Environment variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # server-only

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET= # unsigned preset for the upload widget
CLOUDINARY_API_KEY=                   # server-only (signed uploads / admin)
CLOUDINARY_API_SECRET=                # server-only

# Resend
RESEND_API_KEY=
ENQUIRY_NOTIFY_EMAIL=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database

```bash
supabase db push                     # apply migrations/0001_init.sql
supabase gen types typescript --local > types/supabase.ts
pnpm seed                            # push lib/data/*.seed.ts fixtures into Supabase
```

Without a Supabase project configured, `/admin` runs unauthenticated for local development and every page reads from `lib/data/*.seed.ts` directly — no database required to explore the app.

### Run

```bash
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm lint       # eslint + typecheck
```

---

## Roadmap

- [x] Design system, tokens, typography
- [x] Data model & taxonomy
- [x] Supabase schema, RLS, migration (`supabase/migrations/0001_init.sql`)
- [x] Cloudinary media pipeline (upload widget signing + `next/image` loader)
- [x] Stock list, detail & faceted part-number search (fixture-backed, Postgres-shaped)
- [x] Interactive exploded-drawing viewer + hotspot editor
- [x] Enquiry (RFQ) & sell-to-us flows
- [x] Admin stock CRUD
- [x] SEO, sitemap, robots
- [ ] Wire `lib/data/stock.ts` to live Supabase queries
- [ ] Cloudinary upload widget in the admin stock form
- [ ] Meilisearch/Typesense migration (scale)

---

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org/). CI (lint, typecheck, build) must pass before merge. Open an issue to discuss substantial changes before a PR.

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

<div align="center">
<sub>Built with Next.js, Supabase and Cloudinary.</sub>
</div>
