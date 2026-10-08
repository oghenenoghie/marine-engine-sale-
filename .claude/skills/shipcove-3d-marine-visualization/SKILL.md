---
name: shipcove-3d-marine-visualization
description: Build Drydock's interactive 3D technical visualization system (Three.js / React Three Fiber / Drei / GSAP) for both the rental fleet (/rentals/[type]) and part/engine discovery (/drawings/[id], components/drawings/exploded-drawing.tsx), replacing the current 2D SVG/Cloudinary-photo exploded drawings. Use whenever creating or modifying a vessel, rental-equipment, engine, or part visualization anywhere in this repo. This supersedes the "2D drawing-driven discovery" framing in CLAUDE.md product bet #1 for any page this skill has been applied to — check current code before assuming either the old or new system is live on a given route.
---

# Drydock 3D technical visualization ("Shipcove" 3D system)

This skill covers two consumption surfaces in this codebase, both built on the
same shared 3D architecture:

1. **Rentals** — `app/(site)/rentals/[type]/page.tsx`, content-backed by
   `lib/data/rentals.ts` (`RENTAL_CATEGORIES`: `ship`, `marine-equipment`,
   `dredger`, `pontoon`, `barge`, `well-intervention-vessel`, `jack-up-rig`,
   `workboat`, `tug`, `crane`, `yacht`). Today these are static content +
   `EnquiryForm`, no 3D. This skill adds an interactive 3D vessel/equipment
   viewer per category.
2. **Part discovery** — `components/drawings/exploded-drawing.tsx` and the
   admin hotspot editor (`app/admin/(protected)/drawings/[id]`,
   `components/admin/hotspot-editor-panel.tsx`). Today a 2D Cloudinary photo
   with normalized `(x, y)` `Hotspot` buttons overlaid. This skill replaces
   the flat photo with a 3D engine/machinery model, with hotspots addressable
   3D objects (or 2D overlays projected from 3D space — see "Hotspot
   migration" below) that still resolve to a `StockItem` exactly as today.

Do not assume either surface has been migrated — verify current code before
building on top of it, since this is a large, phased effort (see the
implementation plan delivered alongside this skill).

## Primary objective

Interactive 3D technical representations — marine engineering CAD /
offshore vessel visualization / shipyard technical diagram language. Must
**not** look like a video game, cartoon 3D, generic 3D website decoration,
photorealistic game asset, or floating abstract shapes. The vessel or
machine is the hero; the UI stays Drydock's existing machined-metal,
near-monochrome aesthetic (`hull` / `graphite` / `steel` / `ash` / `paper`,
`rounded-sm`, hairline borders — see CLAUDE.md "Design system" and the
`drydock-marine-platform` skill). 3D materials and lighting should read as
an extension of that palette, not a departure from it — no hue-based accent
colors, no neon/cyberpunk treatment.

## Technology

- **Three.js**, **@react-three/fiber**, **@react-three/drei**, **GSAP** —
  not yet in `package.json`; added in Phase 1 of the implementation plan.
- **Framer Motion** (already a dependency) stays for non-3D scroll reveals
  (`components/motion/`); GSAP is additive, scoped to 3D camera/timeline
  work only — don't replace existing Framer Motion usage elsewhere.
- **TypeScript strict**, Server Components by default — every 3D canvas
  component is `"use client"` and should be `next/dynamic`-imported with
  `ssr: false` from a thin Server Component wrapper, matching the existing
  "push `use client` as low as possible" convention.
- SVG/HTML overlays only for labels, dimensions, callouts, specs, markers,
  and UI chrome — Three.js is the only renderer for the model itself.

## Typography direction (fonts only — scope note)

A much larger "Shipcove Marine 3D UI Architect" redesign brief was proposed
externally (full vessel-marketplace IA, a new dark `#080A0C`/cyan-accent
color system, GSAP scroll-storytelling hero, nav restructuring into
Vessels/Charter/Equipment, etc.), referencing a Westfield Subsea-style
hero as visual inspiration. **Only its font recommendation has been
adopted here — explicitly not the rest.** Do not build the vessel
marketplace, color system, or navigation changes from that brief unless
separately requested; CLAUDE.md's existing monochrome palette
(`hull`/`graphite`/`steel`/`ash`/`paper`) and current site architecture
remain the source of truth until/unless that changes.

New font stack for future work under this skill (not yet applied to
`lib/fonts.ts` or CLAUDE.md's "Type roles" section — that swap is an
implementation step, not done as part of this doc update):

- **Space Grotesk** 600/700 — display/headlines, replacing Archivo.
- **Inter** 400/500 — body/UI text, replacing IBM Plex Sans.
- **IBM Plex Mono** 400/500 — technical/data (part numbers, specs,
  dimensions, callouts) — **unchanged**, keeps its current role.

When the actual font swap is implemented, it touches `lib/fonts.ts` (the
`--font-display`/`--font-body`/`--font-mono` CSS vars), the Google Fonts
imports, and CLAUDE.md's "Type roles" line — `tailwind.config.ts`'s color
tokens are untouched by this, since colors are out of scope here.

## Reconciled from the external brief (second pass)

The same external brief later arrived as a full standalone skill proposal
("Shipcove Marine 3D UI Architect" — 55 sections covering a vessel
sales/charter marketplace, a new dark/cyan color system, nav restructuring
into Vessels/Charter/Equipment, scroll-storytelling hero copy, and more).
Rather than save it as a second, competing skill, its **engineering and
process guidance has been folded into this skill** below (file
architecture, camera restraint, hover staging, loading sequencing, data-
accuracy principles, pre-build audit habit). The following were deliberately
**not** adopted, because they conflict with current, deliberate decisions
elsewhere in this repo rather than merely extending them:

- **Color system** (`#080A0C` + cyan accent) — contradicts CLAUDE.md's
  explicit "no hue-based accent color" monochrome design system, which was
  itself a deliberate pass, not an oversight. Stays `hull`/`graphite`/
  `steel`/`ash`/`paper`, no hue accent.
- **Vessel sales/charter marketplace** (`/vessels/*` routes, a `Vessel`
  entity with LOA/DWT/DP-class/IMO/classification, sale-vs-charter status,
  vessel detail pages) — this is a new business line with no backing data,
  schema, or admin CRUD anywhere in the repo today. `lib/data/rentals.ts` is
  explicitly documented as content-only, no inventory/availability system.
  Building this is a product decision for the user to make explicitly, not
  something to infer from a UI brief — not in scope here.
- **Navigation restructure** (Vessels / Charter / Equipment / Company) —
  downstream of the marketplace decision above; not adopted until that is.
- **New hero headlines/copy** ("MARINE ASSETS. ENGINEERED FOR THE SEA.") —
  tied to the marketplace reframing; the existing admin-editable
  `getHeroCopy()`/`getHeroDrawings()` system (see `lib/data/settings.ts`)
  already covers hero content and stays as the real content, not this.

## 3D model architecture

Every vessel/machine is built from reusable, named components so parts of
the scene are addressable (`object.getObjectByName("main-crane")`), e.g.:

```
Vessel
├── Hull
├── Deck
├── Superstructure
├── Bridge / Wheelhouse
├── Mast
├── Crane
├── Winches
├── Pipes
├── Machinery
├── Accommodation
├── Exhaust
├── Propulsion
├── AnchorEquipment
└── TechnicalMarkers
```

For engines/machinery (part-discovery surface), the equivalent decomposition
mirrors the existing `Hotspot[]` groupings already defined per `Drawing` —
don't invent a parallel taxonomy; reuse what `lib/data/drawings.seed.ts`
already encodes per engine model.

Don't build one monolithic mesh when a vessel/machine needs interactive,
independently-highlightable components.

## File & component architecture

Keep 3D logic out of page components and out of one giant file. Names are
generic (not `Vessel*`-prefixed) since this architecture serves both the
rentals and part-discovery surfaces:

```
components/three/
  SceneRoot.tsx          — Canvas + Suspense + WebGL-support check
  ModelViewer.tsx         — loads the GLB/GLTF, applies materials/edges
  TechnicalWireframe.tsx  — EdgesGeometry/LineSegments layer
  BlueprintGrid.tsx       — environment grid/blueprint backdrop
  DimensionLines.tsx      — projected HTML/SVG dimension overlays
  ModelHotspots.tsx       — hotspot markers + callouts
  ExplodedView.tsx        — exploded-state transform logic
  CameraRig.tsx           — camera mode presets + damped transitions
  SceneLighting.tsx
  SceneEnvironment.tsx

lib/three/
  animations.ts   — shared GSAP timelines (load sequence, state
                    transitions) — don't scatter ad-hoc timelines across
                    components
  camera.ts        — camera preset positions/easing
  materials.ts      — shared materials mapped to hull/graphite/steel/ash
  performance.ts     — device-capability detection, LOD tier selection
```

## Camera & interaction discipline

- Damped, limited-range orbit — never unrestricted free rotation outside an
  explicit "inspection mode."
- Preset positions only (the camera-mode buttons already listed under
  Rendering approach), with eased transitions between them — no free-form
  fly-camera.
- **Hover staging**, for cards/listing previews specifically: default state
  shows the flat technical drawing; on hover, the drawing's lines animate;
  shortly after (~300ms), the 3D model crossfades in; spec metadata appears
  last. Reverse the same sequence on exit — no instant hard swaps.
- **Load sequencing**: show the technical drawing immediately (it's cheap
  and already the current UI), then transition into the 3D model once it's
  ready. Never block the page waiting on the 3D asset to show something.

## Data accuracy

Never fabricate a spec, dimension, or capability that isn't in
`StockItem.specs`, `RENTAL_CATEGORIES`, or a real source — this extends the
existing "Vessel/machine category notes" rule to every surface this skill
touches, not just rentals. Where a number is genuinely unknown, render
"Available on request," not a plausible-looking placeholder. If a technical
drawing or 3D model is a stylized/representative illustration rather than an
accurate engineering drawing of the specific item (true of the current
`TechnicalDrawing` category icons, for instance), don't present it as
certified documentation — that distinction matters for a trading platform
where buyers may rely on it.

## Before starting implementation

Before touching code under this skill: re-read the current state of
whichever surface you're changing (`rentals/[type]/page.tsx` or
`exploded-drawing.tsx` + the hotspot editor) rather than assuming the plan
above is still accurate — other work may have landed since. Note what's
reusable (existing `Hotspot`/`StockItem`/`RENTAL_CATEGORIES` data, existing
motion/reduced-motion conventions) versus genuinely new, and build the
3D system progressively (shared infra → one pilot category/drawing on
placeholder geometry → roll out) rather than attempting it all in one pass
— see the implementation plan delivered alongside this skill for the actual
phase breakdown.

## Model states

Every model should support, at minimum: **Default, Technical, Hover,
Selected, Exploded, Inspection, Blueprint, Presentation.** Keep the model
readable in every state — technical overlays (grid, edges, dimensions,
waterline/centerline, callouts) layer on top of a legible solid model, not
instead of one.

## Rendering approach

- Solid technical surfaces + controlled edge lines (`EdgesGeometry`,
  `LineSegments`, Drei `Outlines`) — never a crude full wireframe.
- Materials: dark industrial hull, slightly lighter superstructure, subtle
  transparent glass, contrasting equipment material, light technical edge
  lines. Map these onto the existing Tailwind tokens (`hull`, `graphite`,
  `steel`, `ash`, `paper`) rather than introducing new color values.
- Lighting: directional key + soft fill + subtle rim + ambient — reveal
  geometry, never hide technical detail behind dramatic lighting.
- Environment: subtle dark/neutral background, technical grid, faint
  blueprint markings, restrained waterline where relevant (low-amplitude,
  no full ocean simulation). Background must never outcompete the model.
- Cameras: both `PerspectiveCamera` (cinematic/presentation) and
  `OrthographicCamera` (technical inspection), with controlled transitions
  between them. Provide minimal camera-mode buttons: Presentation, Front,
  Side, Top, Rear, Technical Orthographic, Exploded.

## Interaction & motion

- On load: camera eases into the presentation position; grid → wireframe →
  structure → solid → equipment → labels → final camera settle, as a GSAP
  timeline.
- Pointer movement: damped subtle rotation/parallax only — never a direct
  large-angle mapping.
- Optional auto-rotation: very slow, pauses on interaction, resumes after,
  and is **disabled** under `prefers-reduced-motion` (reuse the existing
  `useReducedMotion()` convention from `components/motion/`, don't add a
  second reduced-motion mechanism).
- Component selection (e.g. "crane"): highlight it, dim the rest, draw a
  technical callout with a leader line from the real 3D anchor point, ease
  the camera slightly toward it, show an info panel.
- Exploded view: components separate along technically meaningful axes
  (e.g. mast ↑ superstructure ↑ deck ↑ hull for a vessel) — never randomly
  scattered.

## Dimensions & callouts

Render as HTML/SVG overlays projected from 3D world coordinates (`camera`
+ `Vector3.project()`), not baked into geometry — so they stay crisp at any
resolution and track the model as the camera moves. Each callout: component
name, leader line to its real anchor point, label, optional spec — mirrors
the existing `Hotspot` → `StockItem` info-panel pattern in
`exploded-drawing.tsx` (callout id, label, price/status, "View listing" /
"Ask us about this part" link) rather than inventing new copy/interaction
patterns.

## Hotspot migration (part-discovery surface only)

`types/index.ts`'s `Hotspot` currently stores `(x, y)` normalized 2D
coordinates in `jsonb`. Two viable approaches, to be decided in the
implementation plan before touching the schema:

1. **Keep `Hotspot.x/y` as-is**, treat them as a 2D projection target that
   the 3D scene computes a matching 3D anchor for internally (no migration,
   no admin hotspot-editor rework, lowest risk).
2. **Add 3D anchor fields** (`x3d`, `y3d`, `z3d`, or a named-object
   reference) alongside the existing `x/y`, requiring a `supabase/migrations`
   addition and a rework of `components/admin/hotspot-editor-panel.tsx` to
   place hotspots in 3D space instead of on a flat photo.

Don't pick one unilaterally — it changes the DB schema and the admin tool;
confirm with the user first.

## Vessel/machine category notes

Model each of the existing `RENTAL_CATEGORIES` slugs
(`well-intervention-vessel`, `jack-up-rig`, `dredger`, `barge`, `pontoon`,
`workboat`, `tug`, `crane`, `yacht`, `ship`, `marine-equipment`) with the
real components implied by `lib/data/rentals.ts`'s `highlights` copy for
that slug (e.g. jack-up-rig: legs, jack-up system, deck equipment, crane,
accommodation, with a legs-extend → platform-rises animation; dredger:
cutter/drag system, hopper, pumps, deck machinery, with a
dredging-system-deploys animation). Don't invent specs beyond what
`RENTAL_CATEGORIES` and `StockItem.specs` already say — if real vessel
dimensions/capacities are needed for an overlay and aren't in the data,
ask rather than fabricate them. `yacht` gets a cleaner, less industrial
treatment per the original brief; everything else stays fully
industrial/technical.

## Asset pipeline

Prefer sourced/generated GLB/GLTF models over fully procedural geometry —
procedural-from-scratch vessel geometry reads as low-quality. Pipeline:
`GLB/GLTF asset → R3F load → technical materials → edge rendering →
overlay/callout layer → GSAP transform timeline → page`. Where no asset
exists yet, use clearly-placeholder primitive geometry (boxes/cylinders in
the right proportions) so the surrounding system (states, cameras,
overlays, animation) can be built and tested, and swap in real assets
later without touching that system. Use Draco/Meshopt/KTX2 compression,
instancing, and LOD once real assets exist — optimize before loading, never
ship an unoptimized high-res asset and rely on the viewer to cope.

## Performance, mobile, accessibility

- Lazy-load per-route; never load the whole fleet's models on one page.
  Share Three.js infra/materials/geometries across rental cards rather than
  independent WebGL contexts per card; render only visible models.
- LOD tiers: full detail (individual page) → preview (listing card) →
  thumbnail → mobile-simplified, selected via `lib/three/performance.ts`
  device-capability detection (not just a viewport-width guess).
- Mobile: lower-poly, fewer technical lines, reduced lighting/animation,
  touch rotation; 3D is an enhancement — core content (specs, description,
  enquiry form) must remain accessible without WebGL, matching the existing
  accessibility floor in CLAUDE.md (visible keyboard focus, Radix a11y
  defaults, `useReducedMotion()`). On WebGL-unsupported or low-capability
  devices, fall back to the current static technical-drawing image rather
  than attempting a degraded 3D render.
- `prefers-reduced-motion`: disable auto-rotation, camera animation,
  continuous motion; keep a static model, user-controlled interaction, and
  instant transitions.

## Testing

Mirror the existing convention (`image-uploader.test.tsx` mocks
`next-cloudinary`; `photo-uploader.test.tsx` mocks Supabase Storage): mock
`@react-three/fiber`/`three` canvas rendering in Vitest/jsdom (no real WebGL
in CI) and test the surrounding logic (state transitions, callout data
binding, hotspot → StockItem resolution) rather than pixels.
