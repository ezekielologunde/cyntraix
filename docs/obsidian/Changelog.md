---
project: cyntraix
type: changelog
status: active
last_updated: 2026-08-22
---

# Changelog

Reconstructed from `git log`. The repository currently has a single commit —
the initial import of the finished marketing site.

## 2026 — Initial import

**`ac423a2` — Add LinkedIn personal profile banner for Ezekiel Ologunde
(3168x792)**

Despite the commit message (which refers to the last file added), this
commit is the full initial commit of the site: all pages (`index`,
`philosophy`, `competencies`, `services`, `approach`, `work`, `contact`,
`404`), the shared design system (`assets/css/style.css`), the core and
ambient-interaction scripts (`main.js`, `cursor.js`, `network-canvas.js`,
`scroll-video.js`), brand assets (logo, marks, LinkedIn banners), the hero
background video, `vercel.json`, `README.md`, and `.claude/launch.json` —
26 files, ~3,845 lines added.

See [[Decisions]] for the architectural choices baked into this initial
version (no build step, `mailto:` contact, dark-first theming, hosting-layer
clean URLs).

## Added by this change (docs)

- Added `docs/obsidian/` Obsidian-compatible knowledge base (this document
  and its siblings) — no application code changed.
