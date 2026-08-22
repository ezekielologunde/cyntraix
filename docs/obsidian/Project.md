---
project: cyntraix
type: overview
status: active
last_updated: 2026-08-22
---

# Cyntraix

Marketing website for **Cyntraix**, a (fictional/positioning-stage) high-tech
cyber solutions provider whose brand line is "Simple Sophistication." The
repository contains only the public marketing site — there is no product
application, backend service, or database in this repo.

## What it is

A static, multi-page brochure site: home, philosophy, competencies, services,
approach (engagement model), and contact, plus a portfolio/work page and a
custom 404. No build step — plain HTML/CSS/JS served as-is.

## Stack

- **HTML** — one file per page, no templating/framework, no bundler
- **CSS** — a single hand-written design system file (`assets/css/style.css`,
  ~1080 lines), dark-minimalist aesthetic in fiery orange
- **Fonts** — Fraunces (serif, display), Geist (sans, body/UI), JetBrains Mono
  (monospace, technical/data accents)
- **JavaScript** — a single vanilla file (`assets/js/main.js`, ~200 lines):
  theme toggle, mobile nav, a live UTC clock, scroll-reveal animations, and
  expandable service rows. No framework, no dependencies, no `package.json`.
- **Hosting** — deployable as static files to Vercel, Netlify, GitHub Pages,
  or any static host. `vercel.json` configures clean URLs and long-cache
  headers for `/assets`.
- **Local dev** — `python -m http.server`, wired up via `.claude/launch.json`.

There is no server-side code, no database, no authentication, and no payment
processing anywhere in this repository.

## Purpose

Present Cyntraix's positioning, service offerings, and engagement model to
prospective clients, and provide a way to get in touch (via a `mailto:` link
— there is no backend to receive form submissions).

## Documentation scope

This is a static marketing site, so several of the standard documentation
notes in this knowledge base do not apply and were intentionally omitted:

- **Database.md** — no database of any kind exists in this project.
- **Backend.md** — no server, API, or backend service exists; all behavior is
  client-side JavaScript in the browser.
- **Security.md** — no auth, no user data collection, no secrets; the only
  security-relevant surface is documented briefly in [[Architecture]].
- **Bugs.md** — no known bugs or TODO/FIXME markers were found in the code at
  time of writing.

See also: [[Architecture]], [[Frontend]], [[Features]], [[Decisions]],
[[Tasks]], [[Changelog]].
