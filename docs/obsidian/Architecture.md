---
project: cyntraix
type: architecture
status: active
last_updated: 2026-08-22
---

# Architecture

See [[Project]] for overview and stack.

## Components

There is no client/server split — the entire "system" is static assets
served to a browser:

```
index.html          Home — video hero, stat band, philosophy teaser, services teaser
philosophy.html      Overview, philosophy, three-discipline trinity
competencies.html    Eight-cell core competency bento grid
services.html        Eight services, expandable on click
approach.html        Engagement model — Discover / Design / Deploy / Defend
work.html            Portfolio/work page
contact.html         Contact form (mailto) + direct contact info
404.html             Not-found page
assets/css/style.css        Shared design system (single stylesheet, ~1080 lines)
assets/js/main.js           Core behavior — theme toggle, nav, clock, reveals
assets/js/cursor.js         Custom crosshair cursor (hover-capable devices)
assets/js/network-canvas.js Ambient cursor-reactive node-network background
assets/js/scroll-video.js   Scroll-scrubbed hero video (home page)
assets/video/               Hero background loop (Mixkit, free commercial license)
assets/img/                 Logo, brand marks, images
vercel.json          Clean URLs + asset caching for Vercel deploys
.claude/launch.json  Local dev server config (python http.server, port 8743)
```

Every HTML page independently links the same `assets/css/style.css` and
`assets/js/main.js` — there is no shared layout/include mechanism (no build
step to support one). Shared markup (nav, footer) is duplicated per page.

## Data flow

There is no data flow in the application sense — no API calls, no database,
no server rendering. The only "dynamic" behavior happens entirely in the
browser:

1. **Theme** — an inline script in each page's `<head>` reads
   `localStorage['cyntraix-theme']` and sets `data-theme="light"` on
   `<html>` before first paint (to avoid a flash of the wrong theme). Dark is
   the default/unattributed state; light is opt-in. `main.js` wires the
   toggle button, persists the choice, and fires a `cyntraix:themechange`
   event other scripts can listen for.
2. **Navigation** — a mobile nav toggle shows/hides `.nav-links` and closes on
   link click.
3. **Live clock** — `main.js` renders a UTC clock (`liveClock` element),
   ticking every second via `setInterval`.
4. **Scroll reveals / expandable rows** — presentational interactivity for
   the competencies/services pages (revealed via intersection/scroll and
   click handlers in `main.js`).
5. **Contact** — `contact.html`'s form has no backend; submitting it builds a
   `mailto:hello@cyntraix.io` URL client-side and hands off to the visitor's
   own email client. No data is transmitted to or stored by Cyntraix
   infrastructure.

## Deployment

Static-file deploy — no build/compile step. `vercel.json` sets clean URLs
(`/philosophy` instead of `/philosophy.html`), disables trailing slashes, and
applies a one-year immutable cache to `/assets/*`. Deployable identically to
Netlify or GitHub Pages by copying the same static tree.
