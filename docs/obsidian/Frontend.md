---
project: cyntraix
type: frontend
status: active
last_updated: 2026-08-22
---

# Frontend

See [[Architecture]] for the full page/asset inventory and data flow.

## Structure

Plain multi-page HTML, no framework, no component system, no bundler.
Each `.html` file is self-contained markup that includes the shared
`assets/css/style.css` and `assets/js/main.js`.

| Page | Line count | Content |
|---|---|---|
| `index.html` | 346 | Home — video hero, stat band, philosophy teaser, services teaser |
| `philosophy.html` | 346 | Overview, philosophy, three-discipline trinity |
| `competencies.html` | 267 | Eight-cell core competency bento grid |
| `services.html` | 296 | Eight services, expandable on click |
| `approach.html` | 273 | Engagement model — Discover / Design / Deploy / Defend |
| `work.html` | 267 | Portfolio/work page |
| `contact.html` | 240 | Contact form (mailto) + direct contact info |
| `404.html` | 90 | Not-found page |

## Design system

Defined entirely in `assets/css/style.css` (~1080 lines):

- **Palette** — dark-minimalist base with a fiery-orange accent; a
  `data-theme="light"` attribute on `<html>` swaps to a light palette.
- **Typography** — Fraunces (serif) for display/headings, Geist (sans) for
  body and UI, JetBrains Mono for technical/data accents (e.g. the live
  clock, stat figures).
- **Layout patterns** — bento grid (competencies), expandable rows
  (services), stat bands, scroll-reveal sections.

## Behavior (`assets/js/main.js`)

Four independent IIFEs, each guarding itself on the presence of its target
element so the shared script is safe to include on every page even though
not every page has every widget:

1. Theme toggle button — syncs ARIA state, persists to `localStorage`,
   dispatches `cyntraix:themechange`.
2. Mobile nav toggle — opens/closes `.nav-links`, closes on link click.
3. Live UTC clock (`#liveClock`) — ticks every second.
4. Scroll reveals and expandable service rows (competencies/services pages).

The actual theme *attribute* is set by an inline script in each page's
`<head>` (not in `main.js`) so the correct theme applies before first paint
and there's no flash of unstyled/wrong-theme content.

## Additional ambient-interaction scripts

Three more standalone scripts in `assets/js/` add visual flourish, each
self-guarding and each skipped under `prefers-reduced-motion: reduce`:

- **`cursor.js`** — custom crosshair cursor (a tight dot plus a lagging,
  orange-tinting ring) on fine-pointer/hover-capable devices only.
- **`network-canvas.js`** — an ambient, cursor-reactive node-network canvas
  background (drifting nodes connect to nearby neighbors and brighten near
  the cursor); pauses when the tab is hidden.
- **`scroll-video.js`** — scroll-scrubbed hero video on the home page: the
  hero video plays its normal loop on load, then hands off to a canvas whose
  frame is driven by scroll position once an offscreen frame cache finishes
  extracting. Skipped in the light theme (the particles clip assumes a dark
  backdrop).

## No client-side framework, state management, or routing

Navigation is plain `<a href>` links between static files; `vercel.json`'s
`cleanUrls` strips the `.html` extension at the hosting layer.
