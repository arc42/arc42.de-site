# Handover — client-logo band ("firmen-logos")

**Branch:** `improve-the-flow` (single branch — the earlier `prototype-firmen-logos`
branch was a dead end, never had unique work, and has been deleted)
**Date:** 2026-08-12
**State:** live on `/schulungen/`, build-verified, **committed** through `db5f5c6` (two-row
counter-scrolling band with 24 logos, 3 commits ahead of `origin/improve-the-flow`)
**Related:** `docs/firmen-logos-quellen.md` (logo sources), `todo/HANDOVER.md`
(unrelated booking-flow handover, same repo)

---

## 1. Commit history

Five commits on `improve-the-flow`, 3 ahead of `origin/improve-the-flow`:
- `72b86d4` — first pass: `assets/img/firmen-logos/*.svg` (all 15 logo files,
  §3) and the original standalone prototype page (`_pages/firmen-logos-prototype.md`
  at `/prototypes/firmen-logos/`, noindex), with the band's markup/CSS inlined
  in a `<style>` block.
- `ba4d44d` — real integration: `_includes/firmen-logos.html` (the band's
  markup extracted into a reusable partial), `.firmen-logos*` CSS moved to
  the tail of `assets/css/arc42-resources.css`, `_pages/schulungen.md` wired
  in via `{% include firmen-logos.html %}` right after the four course
  buttons under a new "Diese Unternehmen haben mit uns geschult" heading, and
  the prototype page slimmed down to call the same include instead of
  duplicating markup/CSS — so there's one source of truth now, not two.
- `9c8d9aa` — plan doc for the double-band extension (`docs/superpowers/plans/2026-08-12-double-logo-band.md`).
- `ceb33fa` — 9 more logo SVGs from Wikimedia Commons + provenance table in `docs/firmen-logos-quellen.md`.
- `db5f5c6` — two counter-scrolling rows (12+12, mutually exclusive), `small` modifier (KNDS), band hidden in print.

Nothing is loose in the working tree for this feature; `git status` is clean
apart from unrelated pre-existing WIP (`.impeccable/`, `IMPROVEMENT_PLAN.md`,
`todo/` — a different, unfinished booking-flow effort, see `todo/HANDOVER.md`).

**Next:** `git push origin improve-the-flow` (3 commits ahead of remote).

## 2. What the feature does

A dimmed/monochrome band of client logos in two stacked, counter-scrolling
rows (each list rendered twice, `translateX(0) → translateX(-50%)`; upper
row 35s, lower row 42s reversed via `animation-direction`, both linear
infinite), pausing on hover so individual logos can be hovered to full
color. The two rows show mutually exclusive logo sets (12 + 12), defined
in the include's two data strings. The whole band is `display: none` in
print — client logos never appear on paper.
Respects `prefers-reduced-motion: reduce`. Edges fade via `mask-image` instead
of hard-cutting logos off mid-frame. Lives on `/schulungen/` (the persuasion/
overview page — deliberately not `/termine/`, which is logistics, low
persuasion value) and standalone at `/prototypes/firmen-logos/` (noindex).

## 3. Logo inventory (24)

Row 1: `bosch, zeiss, enbw, trumpf, db, fraunhofer, buehler, gea, swm,
soprasteria, barmenia, abus` — Row 2: `knds (small), skidata, pepperlfuchs,
advantest, bose, conet, randstad, helbling, bsh, aktionmensch, provinzial,
vkb` — filenames under `assets/img/firmen-logos/`, all SVG, all from
Wikimedia Commons (see `docs/firmen-logos-quellen.md` for sources per
company, the 2026-08-12 provenance table for the 9 newest, and the
trademark caveat).

**Before any production use beyond this reference-style band:** check each
company's brand guidelines. `docs/firmen-logos-quellen.md` flags this explicitly
for trademarked marks (Bosch, Zeiss, Bose named specifically).

## 4. The bug that ate the first pass — read before touching the filter

Original CSS used `filter: grayscale(1) contrast(0)`. `contrast(0)` collapses
*all* colors to one flat mid-gray — fine for plain logos, but DB and Zeiss are
"reversed" designs (solid colored badge, mark cut out in white). Flattening
contrast erased the white cutout entirely, leaving a blank gray box/blob — the
company's silhouette, no logo detail. Same risk applies to Barmenia, ABUS and
Pepperl+Fuchs (all have a `fill:#ffffff` accent over a colored fill) — they
looked fine in testing, but if a *new* logo added later goes blank, this is why.

**Fix:** filter is `grayscale(1)` only (no `contrast(0)`), opacity `0.45`.
Grayscale alone preserves luminance differences, so a white cutout on a colored
badge still reads as lighter than its background.

## 5. Cascade trap (same one `todo/HANDOVER.md` §3a documents)

`main.scss` uses `@import 'arc42-resources.css'` — Dart Sass emits plain-CSS
imports as `@import url(...)`, not inlined, so the file sits in its own
`@import` layer *before* the minimal-mistakes theme rules, not after. This is
why the plan (see `docs/superpowers/plans/2026-08-05-new-publication-approach.md`
and the content-course-bridges plan) is explicit: **no new stylesheet, no new
`@import` in `main.scss`** — new CSS goes at the tail of the existing
`arc42-resources.css`, which is what this work did. Don't create a
`firmen-logos.css` and `@import` it; append to `arc42-resources.css` instead.

## 6. How to verify

```bash
make site   # docker build, no --watch; check for Liquid/Sass errors in output
grep -o 'class="firmen-logos__item[ "]' _site/schulungen/index.html | wc -l  # expect 48 (24 × 2, loop duplication)
grep -o "firmen-logos__track--reverse" _site/schulungen/index.html | wc -l   # expect 1
grep -o "firmen-logos { display: none; }" _site/assets/css/arc42-resources.css | wc -l # expect 1 (print exclusion)
ls _site/assets/img/firmen-logos/ | wc -l                          # expect 24
make dev   # http://localhost:4043/schulungen/ and /prototypes/firmen-logos/ — visual check
```

Last full run: clean `make site` build, all four checks passed.
**Not verified visually in a real browser** — `mcp__claude-in-chrome`
(`tabs_context_mcp`) timed out every attempt (see `todo/HANDOVER.md` §4 "Browser
automation gotcha" for the known Puppeteer/CDP workaround if this recurs).
Someone should eyeball the actual scroll/hover/pause behavior before calling
this done — CSS logic was verified by reading, not by seeing it move.

## 7. Open decisions

1. **Push to origin?** Three commits are local only — see §1.
2. **Secondary placement on `/anmeldung/`** — discussed as a "nice to have" (last-
   second reassurance before submitting the registration form) but not built.
3. **Grow the logo set** — 24 of ~40 companies in `docs/firmen-logos-quellen.md`
   are in. More can be pulled the same way (Wikimedia Commons API search →
   resolve `imageinfo` URL → download; examples still missing: mimacom, Schenck
   RoTec, ITK Engineering, MaibornWolff; watch for the reversed-badge trap in
   §4 on each new one).
