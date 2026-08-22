---
project: cyntraix
type: tasks
status: active
last_updated: 2026-08-22
---

# Tasks

Outstanding work inferred from the current state of the codebase (no issue
tracker or TODO/FIXME comments were found to draw from directly).

- Update the placeholder contact address (`hello@cyntraix.io` in
  `contact.html`) to the real inbox before/at launch — the README flags this
  explicitly.
- Decide whether the contact form should eventually post to a real backend
  (form service, serverless function, etc.) instead of relying on `mailto:`.
- Consider extracting shared markup (nav/footer) into a build-time include or
  lightweight static-site generator if page count grows further, to avoid
  continued duplication across HTML files.
- No automated tests or CI/CD pipeline exist for this repo — consider basic
  HTML validation / link-checking in CI if the site is actively maintained.
- Confirm licensing/attribution requirements are still met for
  `assets/video/` (Mixkit) and any stock imagery as the site evolves.

See [[Project]] for a note on why no `Bugs.md` exists (no known bugs at time
of writing).
