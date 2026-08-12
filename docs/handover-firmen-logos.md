# Handover — client-logo band ("firmen-logos")

**Branch:** `improve-the-flow` (single branch — the earlier `prototype-firmen-logos`
branch was a dead end, never had unique work, and has been deleted)
**Date:** 2026-08-12
**State:** live on `/schulungen/`, build-verified, **partially uncommitted** (see §1)
**Related:** `docs/firmen-logos-quellen.md` (logo sources), `todo/HANDOVER.md`
(unrelated booking-flow handover, same repo)

---

## 1. What's committed vs what's still loose

**Already committed** (`improve-the-flow`, commit `72b86d4`, already pushed to
`origin/improve-the-flow`):
- `assets/img/firmen-logos/*.svg` — all 15 logo files (§3)
- `_pages/firmen-logos-prototype.md` — the *original* standalone prototype:
  noindex page at `/prototypes/firmen-logos/` with the logo band's markup and
  CSS **inlined in a `<style>` block**.

**Still uncommitted, working tree only:**
- `_includes/firmen-logos.html` — **new**, untracked. The band's markup extracted
  out of the prototype page into a reusable partial (`{% include firmen-logos.html %}`).
- `assets/css/arc42-resources.css` — modified. The `.firmen-logos*` rules
  appended at the file's tail (same rules that are still inline in the
  *committed* prototype page — see the duplication note below).
- `_pages/schulungen.md` — modified. Wired in via `{% include firmen-logos.html %}`
  right after the four course buttons, under a new heading "Diese Unternehmen
  haben mit uns geschult", before the "Bewegte Eindrücke" video section.
- `_pages/firmen-logos-prototype.md` — modified on top of the committed version:
  slimmed to `{% include firmen-logos.html %}` instead of its own inline
  markup/CSS, so there's one source of truth.

**Known duplication right now:** the committed prototype page still carries its
own inline `<style>` block with the same rules that now also live in
`arc42-resources.css`. This resolves itself the moment the four files above get
committed together — the inline block is gone from the working-tree version of
the prototype page. Don't commit the CSS/include change without also committing
the prototype-page edit, or the duplication becomes permanent.

**Suggested single commit** covering all four files:
```bash
git add _includes/firmen-logos.html assets/css/arc42-resources.css \
        _pages/schulungen.md _pages/firmen-logos-prototype.md
```

## 2. What the feature does

A dimmed/monochrome band of client logos, scrolling right-to-left in a seamless
loop (list rendered twice, `translateX(0) → translateX(-50%)`, 35s linear
infinite), pausing on hover so individual logos can be hovered to full color.
Respects `prefers-reduced-motion: reduce`. Edges fade via `mask-image` instead
of hard-cutting logos off mid-frame. Lives on `/schulungen/` (the persuasion/
overview page — deliberately not `/termine/`, which is logistics, low
persuasion value) and standalone at `/prototypes/firmen-logos/` (noindex).

## 3. Logo inventory (15)

`bosch, zeiss, enbw, trumpf, db, fraunhofer, buehler, gea, swm, soprasteria,
knds, barmenia, abus, pepperlfuchs, bose` — filenames under
`assets/img/firmen-logos/`, all SVG, all from Wikimedia Commons (see
`docs/firmen-logos-quellen.md` for the full company list this was drawn from,
website/Brandfetch/Commons links per company, and the trademark caveat).

**`MaibornWolff` was skipped** — no usable SVG found on Commons. The source doc
lists ~25 more companies not yet pulled in (SKIDATA, Advantest, CONET, Randstad,
EnBW's siblings, etc.) if the band should grow.

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
grep -o "firmen-logos__item" _site/schulungen/index.html | wc -l   # expect 30 (15 × 2, loop duplication)
grep -c "firmen-logos-scroll" _site/assets/css/arc42-resources.css # expect 1
ls _site/assets/img/firmen-logos/ | wc -l                          # expect 15
make dev   # http://localhost:4043/schulungen/ and /prototypes/firmen-logos/ — visual check
```

Last full run: clean `make site` build, all four checks passed.
**Not verified visually in a real browser** — `mcp__claude-in-chrome`
(`tabs_context_mcp`) timed out every attempt (see `todo/HANDOVER.md` §4 "Browser
automation gotcha" for the known Puppeteer/CDP workaround if this recurs).
Someone should eyeball the actual scroll/hover/pause behavior before calling
this done — CSS logic was verified by reading, not by seeing it move.

## 7. Open decisions

1. **Commit this work?** Nothing from §1's uncommitted list has landed yet.
2. **Secondary placement on `/anmeldung/`** — discussed as a "nice to have" (last-
   second reassurance before submitting the registration form) but not built.
3. **Grow the logo set** — 15 of ~40 companies in `docs/firmen-logos-quellen.md`
   are in. More can be pulled the same way (Wikimedia Commons API search →
   resolve `imageinfo` URL → download; watch for the reversed-badge trap in §4
   on each new one).
