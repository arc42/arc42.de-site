# arc42.de — Conversion & Craft Improvement Plan

**Goal this plan serves:** more people book a training. The mechanism the site
is supposed to use is *credibility through first-rate free content* — the
template, the 50 publications, the 20-year track record — converting into
bookings. The plan is ordered by how directly each item serves that, not by how
broken it looks.

**Evidence base:** `/impeccable critique` run of 2026-08-09 (dual-agent, live
`arc42.de`), snapshot in `.impeccable/critique/2026-08-09T10-01-34Z__arc42-de.md`,
scored 18/40 on Nielsen's heuristics. An earlier navigation-only critique is in
`.impeccable/critique/2026-08-05T07-05-02Z__includes-masthead-html.md` (15/40).
Numbers quoted below are measured, not estimated — pixel sampling and DOM
measurement via headless Chrome, not computed CSS.

Sizes are rough: **S** ≈ half a day, **M** ≈ 1–2 days, **L** ≈ 3+ days.
Every item states how you know it is done.

---

## Status

| # | Item | Priority | Size | State |
|---|---|---|---|---|
| 1 | Registration flow end to end | P0 | M | **Done** — branch `improve-the-flow` |
| 2 | Free content → course bridges | P0 | M | **Done** — branch `improve-the-flow` |
| 3 | Contrast & focus conformance | P0 | M | Open |
| 4 | `/schulungen/` as a decision document | P1 | M | Open — client logos (4.6) shipped, rest open |
| — | Client-logo band (not in original plan) | — | — | **Done** — branch `improve-the-flow` |
| 5 | `/consulting/` gets an ask | P1 | S | Open |
| 6 | Markup & tap-target cleanup | P2 | M | Open |
| 7 | Image and asset hygiene | P2 | S | Open |
| 8 | Content nits | P3 | S | Open |
| — | Course pricing data | P1 | S | **Blocked** — other repo |

---

## 1. Registration flow end to end — **Done**

Branch `improve-the-flow`. Recorded here so the rest of the plan reads against
a known baseline.

- Timeline CTAs pass the chosen date: `/anmeldung/?kurs=<date-id>`, using the id
  that `/termine/` already uses as its anchor. Submitted value stays `d.code`,
  so Formspark is unaffected.
- Selected-course summary panel (course, date, place, trainers, credits, price),
  driven by the selected `<option>`'s `data-*`, so it also follows dropdown
  changes. Rows appear only when the data exists.
- `select#kurs` no longer sizes itself to its longest option: **683px → 326px**,
  page overflow **325px → 0px** at 390px.
- Commitment block above submit: per person + zzgl. MwSt., 21-day free
  cancellation, substitute-person clause, confirmation-by-e-mail, linked to
  `/terms/#preise` and `/terms/#abmeldung`.
- All 9 fields labelled (5 had none), `autocomplete` throughout, four
  `<fieldset>/<legend>` sections, duplicate `for="email"` fixed, visible focus
  ring restored, `:user-invalid` instead of `:invalid`.
- Form no longer hidden behind `display:none` + inline reveal; botpoison
  `defer`red out of the critical path.
- `/anmeldungEN/` mirrored (the MSA-online CTA points there).
- Masthead: removed a dead `display:none` on `.arc42-nav__cta` and tightened
  band spacing at ≤420px — the last 14px of site-wide horizontal overflow.

**Open decisions from this branch:** the tomato question is **decided**
(2026-08-11: darken to `#c33b21` — apply in item 3); the masthead change
touches every page and remains decision 3 below.

---

## 2. Free content → course bridges — **Done**

Branch `improve-the-flow`, shipped 2026-08-11 (spec `1b61349` … docs fix
`5fb8d35`), subagent-driven, final review clean. What shipped vs the plan:

- `course:` front-matter field on **22** `_resources/*.md` entries — books +
  articles, tight fit only (msa 7, adoc 9, req4arc 4, improve 2); 11
  books/articles deliberately unmapped, talks/videos out of scope. Documented
  in `CLAUDE.md`. Course link targets `/info-<id>/`, not `/termine/`.
- `_includes/resource-item.html` renders *"Zum Kurs: … →"* as a second link
  line on the card.
- `_includes/course-bridge.html` closes `/publikationen/`, `/method/`,
  `/overview/` (variant `card`) and `/canvas/` (variant `hairline`) with the
  next bookable date from `site.data.trainings`. Existing `.btn--arc42` pair,
  no twelfth button colour.
- **Deviation from the sketch above: no price-from.** `pricing` is German
  prose, not a number, and absent from most dates (see the Blocked item) —
  the band leads with course · date · place instead.
- One deliberate divergence, documented in `CLAUDE.md`'s ausgebucht runbook:
  the band **skips** `waitlist`/`full` dates and advances to the next open
  one, while the timeline greys them out and keeps showing them.
- Verified: `make check-links` + `make test-theme` clean, `:visited` cascade
  proven by pixel sampling, the waitlist skip proven by a controlled
  (reverted) data flip, 44px tap targets measured at 390px.

**Leftover found on the way, not fixed here:** `/overview/` overflows to
421px at a 390px viewport — pre-existing (`grid.css`, 12 `.part` elements,
no mobile breakpoint), belongs to items 6/7.

---

## Client-logo band — **Done** (not in the original plan)

Branch `improve-the-flow`, shipped 2026-08-12 (`72b86d4` … `1333f6a`). Directly
serves item 4's missing-social-proof problem: the site went from *zero* client
logos to a **24-logo band on `/schulungen/`** (and `/prototypes/firmen-logos/`,
noindex) — two stacked counter-scrolling rows (35s / 42s reversed, mutually
exclusive 12 + 12), dimmed `grayscale(1)`, full colour + pause on hover,
`prefers-reduced-motion` honoured, **band and its heading excluded from print**.
All logos are Wikimedia Commons SVGs; sources and the trademark caveat live in
`docs/firmen-logos-quellen.md`, the system in `docs/handover-firmen-logos.md`.
Browser-verified (headless Chrome): counter-motion, hover-pause, print, and all
24 marks rendering unclipped.

~16 companies from the source list remain unpulled (mimacom, Schenck RoTec,
ITK Engineering, MaibornWolff, …) if the band should grow.

---

## 3. Contrast & focus conformance — P0, M

**Problem.** Measured, not inferred:

| Element | Colours | Ratio | Needs |
|---|---|---|---|
| `.buttonAnmeldung` / `.buttonRed` | `#fff` on `#ff6347` | **2.95:1** | 4.5:1 |
| `.buttonBlue` / `.buttonDownload` | `#fff` on `#008cba` | **3.85:1** | 4.5:1 |
| `.button:hover` — *every button* | `#EEE8AA` on `#4b7ba3` | **3.60:1** | 4.5:1 |
| sold-out card (`style="color:darkgrey"`) | `#A9A9A9` on `#DCDCDC` | **1.71:1** | 4.5:1 |
| "(Ausgebucht…)" (`style="color:red"`) | `#F00` on `#DCDCDC` | **2.92:1** | 4.5:1 |
| nav CTA focus ring | `#ff5c7c` on `#ffc95c` | **1.95:1** | 3:1 |
| brand focus ring | `#2f7d95` on `#2b3a57` | **2.43:1** | 3:1 |

Plus: the `/schulungen/` hero sets its background image with **no gradient
scrim** — unlike `/` (0.6 blue) and `/consulting/` (0.5 blue). **87.5%** of the
pixels behind its `<h1>` fail 3:1 at 390px, 62.8% at 1280px.

16px bold is *not* WCAG large text (that needs 18.66px bold), so 4.5:1 applies
throughout. Note the irony: the candy course buttons all pass (LightSkyBlue
12.2:1, Pink 13.7:1, PaleGreen 16.6:1); only the brand-critical ones fail.

**Approach.**

1. `/schulungen/` front matter: add the same `overlay_filter` the other two
   heroes carry. One line, biggest single win here.
2. `assets/css/button.css`: `.buttonAnmeldung` → `#c33b21` (white ≈5.4:1) or
   keep `#ff6347` with `#2b1400` text; `#008CBA` → `#00658a`. **Delete the
   `#EEE8AA` hover text swap** — it is the sole cause of the site-wide hover
   failure and buys nothing; keep `#fff` and let the existing shadow lift carry
   the hover.
3. `_includes/timeline_*.html`: replace the inline `color:darkgrey` and
   `color:red` with `.timeline-card--past { color:#5a5a5a }` (≈4.7:1 on
   gainsboro) and `.timeline-card__soldout { color:#a8071a; font-weight:700 }`
   (≈5.6:1).
4. Fix the two failing focus rings in `arc42-de.css`.
5. Sync the final tomato value into `DESIGN.md` §2 so the token and the code
   agree.

**Risk.** Medium — visible brand change on 13 timeline cards, the homepage, and
`/schulungen/`. Decide the tomato question once (item 1's open decision) and
apply it everywhere in the same commit.

**Done when.** No text/background pair under 4.5:1 (3:1 for ≥24px), no focus
ring under 3:1, hero pixel sampling on `/schulungen/` under 5% failing, and
`DESIGN.md` matches the shipped values.

---

## 4. `/schulungen/` as a decision document — P1, M

**Problem.** The page whose title is "Unser Schulungsangebot" states **no price,
no date, no duration**, and closes on an `<h3>` reading "und nun…". Every
credibility asset you own — iSAQB founding member, Foundation WG chair since
2016, 3000+ certified, four decades, the dual-trainer model — is flat body text
in an ~800-word block. Peter's and Gernot's portraits exist at
`/images/photos/portraits/` and appear on **zero** course pages. There are no
testimonials and no named references anywhere on the site; client logos are now
covered (24-logo band on `/schulungen/`, see the Done record above), leaving the
INNOQ footer logo no longer the only third-party signal — but still no human
voice vouching for the training.

The four course buttons lead with internal codenames (REQ4ARC, IMPROVE, ADOC) in
pale blue, yellow, mint and pink, with hierarchy expressed purely by width — and
`.button25` only applies above 1200px, so 750–1200px renders a ragged row.
`.buttonImprove` and `.buttonAdoc` sit at a **0px** gap at 390px.

**Approach.**

1. Stat tiles at the top: *3.000+ zertifiziert · seit 2005 · Leitung des
   Foundation-Lehrplans seit 2016*.
2. Trainer portraits on this page and on `/info-msa/`. Two humans are the
   product; hiding them is the biggest unforced error on the page.
3. Convert the four buttons to cards carrying price-from, duration, next date
   (from `site.data.trainings`) and one line of who it is for.
4. Retire the candy palette for the courses — one family in the arc42 blues,
   differentiated by label rather than hue.
5. Replace "und nun…" with a real close: next date, price, Anmeldung.
6. Testimonial slots — logos are done (see the client-logo-band record above);
   what remains is the human half: **you supply 3–5 quotes with name + role +
   company**, I design the slots.
7. Fix the sidebar duplicate: "Mastering Software Architectures" and "iSAQB
   Foundation" both resolve to `/info-msa/`, so people believe there are 5
   courses and find 4.

**Risk.** Medium — most visible restructure in the plan, and item 6 blocks on
material only you have.

**Done when.** A buyer can answer *what, when, where, how much, who teaches it,
what do I walk away with* without leaving the page, and the page ends with a
concrete next step.

---

## 5. `/consulting/` gets an ask — P1, S

**Problem.** Four `feature_row`s; only `talks_feature` has a `url:`, pointing at
`/publikationen/?type=talk` — into the cul-de-sac from item 2. The rendered body
contains **exactly one link**. No contact form, no `mailto:`, no `/contact/`
link. Three of four cards look clickable (the theme's `.feature__item a.btn::before`
makes cards clickable — but only those with `url:`) and are not. The page is not
reachable from the homepage at all; only via Mehr → Methode → Consulting.

**Approach.** Add `url: /contact/` + `btn_label:` ("Review anfragen",
"Einführung besprechen", "Gespräch vereinbaren") to the three dead rows in
`_pages/consulting.md` — that alone makes them clickable. Close the page with one
explicit ask. Re-export the four 300px photos at ≥900px (currently rendered at
503px, 1.68× upscale) or drop them for a 2×2 text grid.

**Risk.** Very low. Front-matter only, plus assets.

**Done when.** Every offer on the page has a route to a conversation, and the
page has one closing ask.

---

## 6. Markup & tap-target cleanup — P2, M

**Problem.**

- `<button>` nested inside `<a>`: **44 instances** — 28 on `/termine/`, 7 on
  `/schulungen/`, 6 on `/info-msa/`, 3 on `/`. Invalid HTML; both elements are
  focusable, so every CTA costs two tab stops (~56 on `/termine/` alone) and
  assistive tech announces each twice.
- `/termine/` has **exactly one heading** (`<h1>`) for 14 courses; course names
  are `<strong class="blue-head">`. No heading navigation, no list semantics, no
  filtering across 14 dates and 4 course types.
- At 390px, 33/33 interactive elements on the homepage are under 44px tall;
  footer links are 16–18px. Crowded pairs under 8px: 10 on `/`, 11 on `/schulungen/`.
- Four homepage links share the accessible name "mehr dazu ...".
- `.buttonCanvas { width: 90vw }` overflows its max-width parent on wide screens.

**Approach.** Mechanical: `<a href="X" class="button buttonY">Label</a>` —
`.button` already carries `display:inline-block; text-decoration:none`, so it
works unchanged on an anchor. **Watch the cascade:** minimal-mistakes sets
`a:visited { color: #4e91a5 }` at (0,1,1), which outranks `.button` at (0,1,0),
so every colour-setting button variant needs explicit `:link`/`:visited` rules
or a specificity bump. This is exactly why it was left out of `improve-the-flow`
— it is a bigger change than it looks. Give `/termine/` real headings per course
while you are in there.

**Risk.** Medium, and entirely in that `:visited` trap. Verify every button
variant in both visited and unvisited states before merging.

**Done when.** Zero `a > button`, one heading per course on `/termine/`, no
interactive element under 44px, no adjacent pair under 8px.

---

## 7. Image and asset hygiene — P2, S

**Problem.** Measured on cold loads (2026-08-09, before the logo band — its 48
`<img>`s are lazy, everything else unchanged): **0 content images use
`loading="lazy"`, 0 use `srcset`, 10 of 18 lack `width`/`height`** (CLS risk). Three body scripts are
synchronous with no `defer`. `consulting-unsplash.jpg` is **244 KB — 47% of that
page's 520 KB**, the only asset over 200 KB. `arc42-learn-cpsaf.png` ships
1938px to render at 936px (104 KB); `canvas-overview-850.webp` ships 850px to
render at 385px; all four `/consulting/` photos ship at 300px and render at 503px.

Everything else is healthy: 0 JS errors, 0 4xx/5xx, DCL 272–700 ms.

**Approach.** Add `loading="lazy"` + intrinsic `width`/`height` to non-hero
images, `defer` the three body scripts, re-export the oversized and undersized
assets to their actual display size.

**Risk.** Low. Do not lazy-load hero images.

**Done when.** No asset over 200 KB, no image rendered at more than ~1.3× or
less than ~0.7× its natural width, every non-hero image lazy with intrinsic
dimensions.

---

## 8. Content nits — P3, S

- `_includes/page__hero.html:43` opens a `<p>` inside
  `{% if page.header.actions %}` and never closes it — unclosed paragraph in
  every hero on the site.
- The Ukraine strip is **English-only**, directly under the masthead on the
  German homepage — the first body text a DE visitor reads.
- Homepage News: no dates on any item; "2025 feiert arc42 das 20-jährige
  Jubiläum" is stale in Aug 2026; `_pages/home.md:40` lists Czech twice
  (*"…Tschechisch, Tschechisch, Portugiesisch…"*).
- Five unstyled prose sentences close the homepage below the fold, no heading,
  no CTA. Last thing a visitor sees.
- `p.date-small { font-size-adjust: 0.4 }` is dead code — the property does
  nothing useful in that context, and it styles the most procurement-critical
  fact on the site (the price) as a footnote.
- `/anmeldung/` loads `https://unpkg.com/@botpoison/browser@0.3.1/…` — an
  unversioned third-party CDN in the checkout path. Now `defer`red, but pinning
  or self-hosting would be better.

---

## Blocked: course pricing data

**9 of 14 open dates carry no `pricing`** — every IMPROVE, Req4Arc and ADOC date,
plus the English MSA. The registration summary and any price-from on
`/schulungen/` degrade gracefully, but the buyer simply never sees a number.

Two more data issues in the same place: four dates read **"Mannheim oder
Frankfurt (t.b.d.)"** 10–14 months out (nobody raises a PO against a t.b.d.), and
**"für unsere Alumni € 2050"** appears on 6 cards with no definition of "Alumni"
and no link explaining how to claim it.

**This repo cannot fix any of it.** `_data/trainings.json` is sync-generated by
`.github/workflows/refresh-trainings.yml` and must never be hand-edited. The
change is a PR against `trainings.arc42.org-site/_data/trainings.yml`.

---

## Sequencing

```
   1 (done) ──► 3 ──► 4 ──┐
                          ├──► 6 ──► 7 ──► 8
   2 (done) ──────────────┘
```

- **3 before 4**, because item 4 restyles the same course buttons whose colours
  item 3 fixes. Doing them in the other order means touching them twice.
- **6 after 4**, because item 4 replaces several of the buttons item 6 would
  otherwise convert by hand.
- **7 and 8 last** — neither blocks anything and both are safe to batch.

If you only do one more thing: **item 3.** It is next on the critical path, the
tomato decision it was waiting on is made (`#c33b21`), and the biggest single
win — the missing hero scrim on `/schulungen/` — is one front-matter line on
the page the logo band just made more persuasive.

---

## Decisions needed from you

1. ~~Tomato or navy for registration CTAs?~~ **Decided 2026-08-11: darken the
   tomato to `#c33b21`** (white ≈5.4:1). Not yet applied — lands with item 3,
   everywhere in the same commit.
2. **Testimonials** — logos are shipped (24-logo band, Wikimedia Commons
   sourcing; check brand guidelines before any use beyond the reference band).
   Still needed from you: 3–5 quotes with name + role + company. Blocks
   item 4.6.
3. **Keep the masthead Anmeldung CTA on phones?** `improve-the-flow` keeps it
   (and removes the dead rule that was supposed to hide it). The alternative is
   restoring the original intent — CTA hidden, `Termine` in the band.
4. **Does `/consulting/` get a form or a `mailto:`?** Item 5 assumes a link to
   the existing `/contact/`.
