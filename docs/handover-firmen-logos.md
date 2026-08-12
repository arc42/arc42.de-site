# Handover — client-logo band ("firmen-logos")

**Branch:** `improve-the-flow` (single branch — the earlier `prototype-firmen-logos`
branch was a dead end, never had unique work, and has been deleted)
**Date:** 2026-08-12
**State:** live on `/schulungen/`, build- and browser-verified, **committed**
through `1333f6a` (two-row counter-scrolling band with 24 logos, print-safe).
Push position: check `git rev-list --count origin/improve-the-flow..HEAD` —
this doc no longer states it, because any stated count rots with the next commit.
**Related:** `docs/firmen-logos-quellen.md` (logo sources),
`docs/handover-improve-the-flow.md` (branch-level map, all three bodies of work)

---

## 1. Commit history

Feature commits on `improve-the-flow`:
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
- `e5a22d3` — review fixes: `viewBox` added to `abus.svg`/`pepperlfuchs.svg` (standards hardening; Chrome rendered them fine without), handover-doc refresh, print exclusion extended to the heading above the band.
- `1333f6a` — kramdown IAL corrected to the block form (the glued `{: .no-print}` had rendered as literal text).

Nothing is loose in the working tree for this feature.

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

Last full run: clean `make site` build, all checks passed, plus
`make test-theme` and `make check-links` clean.
**Browser-verified 2026-08-12** (headless Chrome for Testing via CDP —
the Claude-in-Chrome extension times out in this setup; workaround:
`chrome-headless-shell` from `~/.cache/puppeteer/` + `python3 -m http.server`
on `_site`): rows move in opposite directions (≈ −82 px vs +69 px per 1.5 s,
matching 35 s/42 s), hover freezes both tracks to 0.00 px (scroll the band
into view before dispatching mouse events — off-viewport coordinates
silently miss), print emulation removes band and heading, all 24 logos
render unclipped, KNDS measures 112×32 with `small` (154×44 without).

## 7. Open decisions

1. **Secondary placement on `/anmeldung/`** — discussed as a "nice to have" (last-
   second reassurance before submitting the registration form) but not built.
2. **Grow the logo set** — 24 of ~40 companies in `docs/firmen-logos-quellen.md`
   are in. More can be pulled the same way (Wikimedia Commons API search →
   resolve `imageinfo` URL → download; examples still missing: mimacom, Schenck
   RoTec, ITK Engineering, MaibornWolff; watch for the reversed-badge trap in
   §4 on each new one).
