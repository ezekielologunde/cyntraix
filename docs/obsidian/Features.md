---
project: cyntraix
type: features
status: active
last_updated: 2026-08-22
---

# Features

See [[Frontend]] and [[Architecture]] for implementation detail.

## Implemented

- **Home page** — video hero background, stat band, philosophy teaser,
  services teaser (`index.html`).
- **Philosophy page** — brand philosophy and "three-discipline trinity"
  narrative (`philosophy.html`).
- **Competencies page** — eight-cell bento grid of core competencies
  (`competencies.html`).
- **Services page** — eight services presented as click-to-expand rows
  (`services.html`).
- **Approach page** — engagement model framed as Discover / Design / Deploy /
  Defend (`approach.html`).
- **Work/portfolio page** — `work.html`.
- **Contact** — contact form that opens a pre-filled `mailto:` link (no
  backend submission), plus direct contact info (`contact.html`).
- **404 page** — custom not-found page.
- **Dark/light theme toggle** — dark by default, light opt-in, persisted in
  `localStorage`, applied pre-paint to avoid flash of wrong theme.
- **Mobile navigation** — responsive hamburger-style nav toggle.
- **Live UTC clock** — decorative real-time clock element.
- **Scroll-reveal animations** — content sections animate in on scroll.
- **Clean URLs & asset caching** — via `vercel.json` at the hosting layer.

## Not implemented / out of scope

- No backend, API, or database — this repo is presentation-only.
- No real contact-form submission/storage (relies entirely on the visitor's
  own email client via `mailto:`).
- No authentication, no user accounts.
- No CMS — all content is hardcoded in HTML.
- No analytics/tracking code observed in the audited files.
- No automated tests or CI configuration observed.
