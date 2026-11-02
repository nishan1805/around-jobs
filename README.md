# around jobs

A map-first local job board for Raipur, built from the **around** Figma design system.

- **Stack:** Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, shadcn/ui (Base UI), Leaflet + react-leaflet.
- **Mobile first** with three breakpoints: `sm` 412px, `md` 768px and `lg` 1440px.
- **Map** is Leaflet, loaded only in the browser via `next/dynamic({ ssr: false })`.
- **Job pages** at `/jobs/[city]/[jobSlug]` are server-rendered and include `JobPosting` JSON-LD, canonical URLs and Open Graph tags. `sitemap.xml` and `robots.txt` list every job.

## Run it locally

```bash
npm install
npm run dev            # http://localhost:4612
```

Other scripts:

| Script              | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `npm run build`     | Production build (prerenders every job page)                   |
| `npm start`         | Serve the production build on port 4612                        |
| `npm run lint`      | ESLint                                                         |
| `npm run typecheck` | TypeScript                                                     |
| `npm run tokens`    | Regenerate the Tailwind theme from `design-tokens/figma-tokens.json` |

### Environment variables (all optional)

| Variable                            | Default                       | Purpose                                      |
| ----------------------------------- | ----------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`              | `http://localhost:4612`       | Absolute URLs in the sitemap, canonical tags and JSON-LD |
| `NEXT_PUBLIC_MAP_TILE_URL`          | Esri World Light Gray Canvas  | Leaflet tile URL template                    |
| `NEXT_PUBLIC_MAP_TILE_ATTRIBUTION`  | Esri                          | Attribution shown on the map                 |
| `NEXT_PUBLIC_STADIA_API_KEY`        | none                          | Optional. Uses Stadia Alidade Smooth when set and no tile URL is set |

The default basemap is Esri World Light Gray Canvas (base plus a transparent label layer). It needs
no API key and works on any domain, including a Vercel deploy. It is a muted grey map in the same
family as the Figma frame. CARTO Positron (`light_all`) is closer by name, but the keyless CARTO CDN
now stamps "API KEY REQUIRED" across every tile. Set `NEXT_PUBLIC_MAP_TILE_URL` to another
template (`{z}`, `{x}`, `{y}`, optional `{s}` and `{r}`) when you have a keyed source.
The older names `NEXT_PUBLIC_MAP_TILES_URL` and `NEXT_PUBLIC_MAP_TILES_ATTRIBUTION` still work.
If `NEXT_PUBLIC_STADIA_API_KEY` is set and no URL override is, the map uses Stadia Alidade Smooth.
If tiles fail to load, the map shows a notice and the job pins still work.

## Design tokens

Every colour, text style, radius, shadow and the spacing base come from the Figma file
([around, J00 Jobs Home](https://www.figma.com/design/CqYtGTafIxJo5rfRSa6AbJ?node-id=1913-16110)).
None are hard-coded in components.

```
design-tokens/figma-tokens.json   raw export from Figma (variables, text styles, effect styles)
scripts/generate-tokens.mjs       converts it to Tailwind v4 theme variables
src/styles/tokens.generated.css   generated @theme (do not edit)
src/lib/text-styles.generated.ts  text-style names so `cn()` merges them correctly
```

Tailwind's default palette, type scale, radii and shadows are reset (`--color-*: initial`, etc.), so only design-system values can be used.

| Figma                                     | Tailwind                                              |
| ----------------------------------------- | ----------------------------------------------------- |
| `Tokens` colour variables (Light mode)    | `bg-brand-primary`, `text-text-secondary`, `border-border-default`, `bg-primary-50`, `bg-grey-100`, … |
| `Tokens` Dark mode                        | Same classes, applied under a `.dark` ancestor        |
| `Colors` primitives                       | `--palette-*` CSS variables only (no utilities)      |
| Text styles, e.g. `Body sm/Semibold`      | `text-body-sm-semibold` (size, line height, weight, tracking in one class) |
| Fonts: Inter, Plus Jakarta Sans           | `font-sans`, `font-display`                           |
| `Radius-xs` … `Radius-4xl`                | `rounded-xs` … `rounded-4xl`                          |
| `Spacing (8px)` scale (all multiples of 4)| `--spacing: 0.25rem`, so `p-4` = 16px = `Spacing-16`  |
| `Shadow-sm` … `Shadow-3xl`                | `shadow-sm` … `shadow-3xl`                            |

`Display 80` and `Display 64` styles use Plus Jakarta Sans, so pair them with `font-display`.
`text-wordmark` holds the literal values from the sidebar logo layer, which isn't a published text style.

To re-sync after the design changes, update `design-tokens/figma-tokens.json` and run `npm run tokens`.

## Project layout

```
src/app/page.tsx                         map and list of jobs (home)
src/app/jobs/[city]/[jobSlug]/page.tsx   server-rendered job page with JobPosting JSON-LD
src/app/sitemap.ts, robots.ts            SEO
src/components/map/                      Leaflet (browser only): clustering, markers, controls
src/components/jobs/                     top bar, filters, list, cards
src/lib/jobs.ts                          sample data and data access (swap for a real source)
src/lib/structured-data.ts               JobPosting schema.org builder
```

## Data

`src/lib/jobs.ts` holds 37 sample jobs at 12 sample businesses in Raipur, marked "(Sample)" like the design.
`getJob` and `getAllJobs` are async, so you can replace them with a database or API call without changing the pages.
