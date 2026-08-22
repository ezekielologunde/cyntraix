---
project: cyntraix
type: decisions
status: active
last_updated: 2026-08-22
---

# Decisions

See [[Architecture]] for the resulting structure.

## No build step / no framework

The site is plain static HTML/CSS/JS with no bundler, no framework, and no
`package.json`. Trade-off: markup (nav, footer) is duplicated across every
page instead of shared via a templating layer, but the site can be deployed
by copying files as-is to any static host, and local preview needs nothing
beyond `python -m http.server`.

## `mailto:` contact instead of a backend

`contact.html`'s form builds a `mailto:hello@cyntraix.io` link client-side
rather than posting to a server. This avoids needing any backend
infrastructure for a marketing site, at the cost of relying on the visitor
having a configured email client, and of not capturing/storing leads
directly.

## Dark-first theming with pre-paint inline script

Dark is the unattributed default theme; light is opt-in and persisted to
`localStorage`. The theme attribute is set by an inline script in each
page's `<head>` (rather than by `main.js`, which loads later) specifically
to avoid a flash of the wrong theme on page load for returning visitors.

## Clean URLs via hosting config, not routing code

`vercel.json` strips `.html` extensions and disables trailing slashes at the
CDN/hosting layer (`cleanUrls`, `trailingSlash: false`) instead of
implementing any client-side router, keeping the site fully static.
