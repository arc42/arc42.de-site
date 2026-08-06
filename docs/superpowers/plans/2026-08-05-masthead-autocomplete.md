# arc42.de Masthead Search Autocomplete (quality.arc42.org port) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Typing in the masthead search field pops up grouped live results (like quality.arc42.org), and Cmd/Ctrl-K focuses the search from anywhere.

**Architecture:** Direct port of quality.arc42.org-site's `src/scripts/site/autocomplete.js` (deterministic prefix/substring scorer over a light lookup JSON — deliberately NOT lunr, for predictable autocomplete ranking) as a vanilla IIFE, plus its panel markup and CSS adapted to arc42.de's masthead and design tokens. The existing lunr `/search/` page stays the full-text all-results fallback (plain-Enter form submit, Cmd-Enter, and a "Show all" row all land there).

**Tech Stack:** Vanilla JS (no build step on arc42.de — the ES module must become an IIFE), Liquid-generated lookup JSON, Jekyll 4.3 via Docker (`make site`, 600000 ms timeouts).

## Global Constraints

- `/Users/gernotstarke/projects/arc42/quality.arc42.org-site` and `/Users/gernotstarke/projects/arc42/arc42.org-site` are **read-only reference material. Never modify them.**
- Work in `/Users/gernotstarke/projects/arc42/arc42.de-site`, branch `new-publication-approach`.
- German UI strings throughout.
- Diacritic folding: reuse the exact fold one-liner from `assets/js/resources-filter.js:18` (`.toLocaleLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")`) in the scorer — both item fields and query terms — so `uber` matches `Über` (site-wide convention; this becomes the THIRD copy, document that).
- The masthead form's no-JS fallback (plain form submit to `/search/?q=…`) must keep working; the "/" hotkey stays in `assets/js/arc42-nav.js` (do not duplicate it).
- The lunr `/search/` page and the Publikationen filter are NOT touched.
- `make site` clean + commit at the end of each task.

---

### Task 1: The autocomplete feature (lookup JSON, JS port, masthead markup, CSS)

**Files:**
- Create: `search-lookup.json` (repo root, Liquid-templated like the existing `search.json`)
- Create: `assets/js/arc42-autocomplete.js`
- Modify: `_includes/masthead.html` (search form block only), `assets/css/arc42-de.css` (append panel styles), `_config.yml` (`after_footer_scripts`: add the new JS after `arc42-nav.js`)

**Interfaces:**
- Lookup JSON shape (array): `{ "title": …, "type": "page"|"book"|"article"|"talk"|"video", "url": …, "tags": … }`. Pages: every `site.pages` entry with a non-empty title, excluding the 404/utility titles the existing `search.json` excludes and excluding `layout: redirect` stubs; `type: "page"`, `tags: ""`. Resources: all `site.resources`; `type` = the entry's `type`; `tags` = the entry's `search` field; `url` = detail page when `detail`, else `/publikationen/?type=<type>#<filename-slug>` (same anchor derivation as `search.json` — filename slug, NOT `resource.id`).
- Panel markup contract (ids/classes consumed by JS and CSS): `#masthead-search` input gains `role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="arc42-search-panel" aria-haspopup="listbox"`; sibling `<div id="arc42-search-panel" class="arc42-search__panel" role="listbox" aria-label="Suchvorschläge" hidden></div>`; sr-only live region `<div class="arc42-sr-only" aria-live="polite" data-arc42-search-status></div>`; the existing `<kbd class="arc42-search__hint">` gets `data-arc42-search-hint` (JS rewrites its text to `⌘K` on Mac / keeps `/` elsewhere, mirroring quality).

- [ ] **Step 1: Read the reference implementation**

Read `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/src/scripts/site/autocomplete.js` (488 lines — the complete behavior spec: scorer weights, group capping, panel rendering, keyboard map, focus/blur/mousedown handling) and `/Users/gernotstarke/projects/arc42/quality.arc42.org-site/_sass/components/_search-autocomplete.scss` (panel styling) and the search form block in its `_includes/site-header.html` (lines ~25–53, ARIA pattern).

- [ ] **Step 2: Create `search-lookup.json`**

Root-level Jekyll page (front matter `layout: none`), emitting the array per the interface above. Mirror `search.json`'s existing exclusion filters and its resource-anchor comment/logic. Validate after build: `python3 -c "import json;d=json.load(open('_site/search-lookup.json'));print(len(d))"` — expect ≈ 50 resources + ~40 pages.

- [ ] **Step 3: Port the JS to `assets/js/arc42-autocomplete.js`**

IIFE (match `arc42-nav.js`/`resources-filter.js` style), functionally equivalent to the quality module with these adaptations:
- Element hooks per the interface above (quality's `[data-site-search]` → de's `.arc42-search` form; `#site-search-input` → `#masthead-search`; CSS class prefix `site-search__…` → `arc42-search__…`).
- `GROUPS` = `[{type:"page",label:"Seiten"},{type:"book",label:"Bücher"},{type:"article",label:"Artikel"},{type:"talk",label:"Vorträge"},{type:"video",label:"Videos"}]`, `TYPE_RANK` in that order, `PER_GROUP = 4`, `TOTAL_VISIBLE = 12`. Lookup URL: `/search-lookup.json` (root-relative; no `window.baseurl` on this site — site is root-served).
- Scorer: same weights/fields, with the site's fold one-liner applied when lowercasing item fields and query terms (aliases fields don't exist in the de lookup — score `tags` where quality scores tags, skip alias tiers or treat them as never-matching; keep the structure so the port stays diffable).
- Keyboard: Cmd/Ctrl-K global focus handler (this is the new hotkey the user asked for); do NOT add a "/" handler (arc42-nav.js already has it — verify no double-handling); ArrowUp/Down/Home/End, Esc (close → clear → blur), Enter opens active row, Cmd/Ctrl/Shift-Enter → `/search/?q=…` (≥2 chars), plain Enter with no active row falls through to form submit. Min query length 2, debounce 100 ms.
- German strings: empty state `Keine Treffer für <strong>…</strong>. <span…>Enter: Volltextsuche.</span>`; "Show all" row `Alle <strong>N</strong> Treffer für <strong>…</strong> anzeigen`; footer hints `↵ öffnen · ⌘⏎ alle Treffer · ↑↓ navigieren · esc schließen` (chord label `Strg ⏎` on non-Mac); status region `N Treffer für „…“.` / `Keine Treffer für „…“.`; hint-desc text German.
- Hint: on Mac set kbd text to `⌘K` (title `⌘K fokussiert die Suche`); non-Mac keep `/` (Ctrl-K still works).

- [ ] **Step 4: Masthead markup + script registration**

Apply the interface markup inside the existing `<form class="arc42-search">` block in `_includes/masthead.html` (keep the form action/method/label/svg exactly as they are). Add `- /assets/js/arc42-autocomplete.js` to `after_footer_scripts` in `_config.yml` directly after `arc42-nav.js`.

- [ ] **Step 5: Panel CSS**

Append an `arc42-autocomplete` block to `assets/css/arc42-de.css`, porting `_search-autocomplete.scss`'s structure (absolute-positioned panel under the input, white card, border/shadow/radius, scroll region with max-height, group labels, option rows with `.is-active` highlight, `<mark>` styling, empty state, sticky footer with `<kbd>` chips) onto de's tokens (`--arc42-border`, `--arc42-primary`, `--arc42-ink`, `--arc42-text-muted`, fonts already global). The masthead is dark navy — ensure the panel itself is a light card so contrast is AA, and it must not be clipped by the masthead (check `overflow` on the nav containers; fix with `position: relative` on the form + suitable z-index). Mobile: below the `@media` width where the masthead search field is hidden (check `arc42-de.css` for how `.arc42-search` behaves on phones), the panel is irrelevant — no extra work, but verify the panel's absolute positioning doesn't overflow the viewport at ~768–1024 px widths.

- [ ] **Step 6: Verify**

```bash
node --check assets/js/arc42-autocomplete.js
make site
python3 -c "import json;d=json.load(open('_site/search-lookup.json'));import collections;print(collections.Counter(e['type'] for e in d))"
grep -c 'arc42-search-panel' _site/index.html        # expected ≥2 (aria-controls + panel div)
grep -c 'arc42-autocomplete' _site/index.html         # expected ≥1 (script tag)
```

Then a node harness (scratch file, not committed): stub DOM enough to require the scorer OR extract-and-eval the rank function; assert: `effektive` → Effektive Softwarearchitekturen first; `uber` produces the same top hit as `über`; `schulung` surfaces a page-type hit; every-term-must-match (`arc42 zzz` → 0). Document harness output in the report.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "Masthead search autocomplete with Cmd-K, ported from quality.arc42.org"
```

---

### Task 2: Verification + docs

- [ ] **Step 1:** `make site && make check-links && make test-theme` — all exit 0 (fix minimal causes if not; `search-lookup.json` must not break html-proofer or the sitemap — verify it's excluded from the sitemap like `search.json` is, add `sitemap: false` front matter if needed).
- [ ] **Step 2:** `make dev` in background; curl-verify `/search-lookup.json` (200, valid JSON), `/assets/js/arc42-autocomplete.js` (200), `/` HTML contains the panel div and script tag. Stop the server. Real keyboard/mouse interaction is left to the human.
- [ ] **Step 3:** CLAUDE.md: extend the search notes — masthead autocomplete (`arc42-autocomplete.js` + `search-lookup.json`, port of quality.arc42.org's autocomplete, NOT lunr, and why), Cmd/Ctrl-K + "/" hotkeys, and the fold() helper now existing in THREE files (`resources-filter.js`, `arc42-search.js`, `arc42-autocomplete.js`) that must change together.
- [ ] **Step 4:** Commit: `git add -A && git commit -m "Docs: masthead autocomplete architecture and hotkeys"`
