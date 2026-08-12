# Cyntraix

Marketing site for Cyntraix — a high-tech cyber solutions provider built on the
principle of "Simple Sophistication."

Static, multi-page, no build step. Dark minimalist aesthetic in fiery orange,
set in Fraunces (serif), Geist (sans), and JetBrains Mono.

## Structure

```
index.html          Home — video hero, stat band, philosophy teaser, services teaser
philosophy.html      Overview, philosophy, three-discipline trinity
competencies.html    Eight-cell core competency bento grid
services.html        Eight services, expandable on click
approach.html         Engagement model — Discover / Design / Deploy / Defend
contact.html          Contact form (mailto) + direct contact info
404.html               Not-found page
assets/css/style.css   Shared design system
assets/js/main.js      Mobile nav, live clock, scroll reveals, expandable rows
assets/video/          Hero background loop (Mixkit, free commercial license)
assets/img/            Logo
```

## Local preview

```
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Static site, deployable as-is to Vercel, Netlify, GitHub Pages, or any static
host. `vercel.json` enables clean URLs (`/philosophy` instead of
`/philosophy.html`) and long-cache headers for `/assets`.

## Notes

- The contact form has no backend — submitting it opens the visitor's own email
  client via a `mailto:` link. Update the address in `contact.html` (search for
  `hello@cyntraix.io`) to your real inbox.
- Hero background video: "White particles moving on black background," Mixkit
  Stock Video Free License (free for commercial use, no attribution required).
