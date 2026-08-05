---
target: arc42.de navigation
total_score: 15
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-05T07-05-02Z
slug: includes-masthead-html
---
Method: dual-agent (A: a01dceccd240a2dfa · B: a6a2bd531697d9bc4)
Scope: the **navigation** of arc42.de — not its content, not its timeline components.
Browser evidence: unavailable this session (Claude-in-Chrome extension not set up; verified twice). All visual-runtime claims below come from built HTML in `_site`, not from a rendered page.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 1 | Zero `aria-current` in the entire build; `breadcrumbs: false`; masthead nav markup byte-identical on `/` and `/overview/` |
| 2 | Match System / Real World | 2 | Native German labels ("Übersicht", "Termine", "Schulungen") — but English skip links, English `/about/`, English 404 on a `lang="de"` site |
| 3 | User Control and Freedom | 2 | Logo→home is right; no breadcrumb, no back, and the overflow drawer auto-closes 1000 ms after the pointer leaves |
| 4 | Consistency and Standards | 1 | Two unrelated nav systems (flat masthead / grouped sidebar rail); the rail marks the current page, the masthead never does |
| 5 | Error Prevention | 1 | "Suche" links to a search that cannot run; "iSAQB Foundation" and "Mastering Software Architectures" share one URL |
| 6 | Recognition Rather Than Recall | 2 | "Mehr..." and "Über..." are pure recall; greedy-nav makes the visible link set viewport-dependent |
| 7 | Flexibility and Efficiency | 1 | No working search, no hotkey, no keyboard route into the mobile rail |
| 8 | Aesthetic and Minimalist Design | 2 | The bar itself is clean; 7 top-level items, 2 stray ellipses, 2 footer links to the same URL |
| 9 | Error Recovery | 1 | 404 is an English dead end with zero navigation recovery; search fails in total silence |
| 10 | Help and Documentation | 2 | `/more/` does reach docs + faq — two clicks behind a label that says nothing |
| **Total** | | **15/40** | **Poor — major navigation overhaul required** |

All ten heuristics apply (this is an Operate/Read surface, not Persuade), so the maximum is the full 40.

## Design Specificity Verdict

**LLM assessment: inherited, not authored.** This is stock Minimal Mistakes 4.24.0 with a German word list in `_data/navigation.yml`. `_includes/masthead.html` is byte-comparable to upstream except line 5, where the theme's logo/title/subtitle block was collapsed into a hardcoded `<img width="100px">` — a deletion, not a design decision. `_sass/minimal-mistakes/_masthead.scss` and `_navigation.scss` are unmodified vendor files, and `assets/css/arc42-de.css` contains zero nav rules across all 103 lines. Site-local navigation styling does not exist. Swap seven strings and this is any Jekyll site on the internet.

Against its own family this is stark. docs and faq ship masthead + left rail + breadcrumb + stepper. arc42.org — the EN twin wearing the same navy — ships an inline priority row, a grouped "More…" drawer with hints, an EN/DE switcher and a flagged Download CTA. arc42.de ships a flat, undifferentiated link row with no active state, no grouping, no wordmark.

**Deterministic scan: 7 findings, exit 2 — and none of them touch the navigation.** All 7 are `design-system-color` (colour outside DESIGN.md): `#50C878` in `_includes/footer.html:26`, and `#ff6600` repeated across five near-duplicate timeline partials. Mechanically 5 hits, substantively one un-tokenized brand orange. `_pages` scanned clean (exit 0). The 12 hex literals in `_sass/minimal-mistakes/_navigation.scss` are `#000`/`#fff` primitives inside `mix()`/`rgba()` in vendored theme source — technically against the family's no-hex rule, but remediating vendor internals is a different decision and I am not counting them as nav findings.

The detector's silence on navigation is itself the finding: it checks colour against DESIGN.md, and this navigation's problems are structural and behavioural. A clean mechanical scan here means nothing.

**Visual overlays: none.** Browser automation is not available in this session — verified by tool search and by the `claude-in-chrome` skill returning "Browser tools are not available in this session". Skipped as a result: fresh-tab navigation, injection preflight, `detect.js` console readback, and 1440px/390px screenshots. Nobody can currently tell you how many links survive before greedy-nav overflows, or what the focus ring looks like when tabbing. Compensated with static DOM evidence from the committed build.

## Overall Impression

The content is in better shape than the navigation that serves it. "Termine" vs "Schulungen" is a genuine, well-observed IA distinction (*when* vs *what*), and the three-group model sitting in `navigation.yml` is honest, intent-based thinking. Then the masthead ignores it entirely and ships seven flat links.

The single biggest opportunity is not a redesign. It is that **the correct navigation is already written down in this repo and simply isn't rendered in the masthead.** arc42.org — the twin, same brand, same navy — already ships the pattern that would render it. This is a port, not an invention.

Two things, though, should not wait for that port: a search box that silently does nothing, and a mobile menu no keyboard can open.

## What's Working

**1. The label vocabulary is native, not translated.** "Übersicht", "Termine", "Schulungen" are the words a German-speaking architect actually reaches for — not "Überblick", not "Veranstaltungen", not "Kurse". And "Termine" separated from "Schulungen" is a real IA distinction: *when* vs *what*. Most sites collapse those into one "Trainings" and make you scroll.

**2. The logo is the home link, and there is no "Home" item.** `masthead.html:5` wraps the logo in `<a href="/">`, and `navigation.yml` has no home entry. That matches what docs, faq and arc42.org all do, and it saves a slot in an already over-full row. Probably inherited rather than decided — but it is right, and it is the one place arc42.de is already family-conformant.

**3. The three-group IA in `navigation.yml:18–64` is good thinking.** Publikationen (Bücher/Artikel/Videos/Vorträge), Schulungsangebot (five named courses + AGB + Galerie), Über uns (Kontakt/Mitwirkende/Lizenz/Status) — grouped by intent, sensible depth, no marketing. It is live on 17 pages via the sidebar rail. It is the raw material for a correct masthead; the only failure is that the masthead never touches it.

## Priority Issues

### [P0] "Suche" promises a search that cannot run

`_data/navigation.yml:15` ships a top-level "Suche" item. The built page at `_site/search/index.html:206` loads `<script src="search-script.js">` — **relative**, from a page served at `/search/`, so the browser requests `https://arc42.de/search/search-script.js`. `_site/search/` contains `index.html` and nothing else; the script lives at the site root. It 404s, `SimpleJekyllSearch` is undefined, and the inline config immediately below throws a `ReferenceError`.

The box renders. It accepts typing. It produces nothing — not even the configured `noResultsText: "Keine Ergebnisse!"`.

Note the two assessments disagreed here, and the disagreement is instructive: the evidence agent confirmed `search-script.js` and `search.json` both return 200 at the root and concluded search worked. It never resolved the relative path from `/search/`. Checking the built HTML settles it.

**Why it matters.** Search is the deep-link arriver's primary orientation tool and the returning practitioner's primary shortcut. This is worse than a missing feature: it is a visible promise answered by silence, which converts a confident visitor into a distrustful one. Compounding it, `_config.yml:11–16` has the whole `search:` block commented out under the maintainer's own note that LunR "doesn't find anything… a failed experiment" — so the masthead's search toggle is compiled out too, while its CSS and JS handler still ship. Two search implementations, one disabled, one broken.

**Fix.** One character: `src="/search-script.js"` in `_pages/search.html:13`. Then load the page once and confirm results appear, and check `search.json` parses (it emits an empty object with a trailing comma for pages lacking a title). If it can't be fixed this week, delete "Suche" from `navigation.yml` — a missing feature is honest, a silent one is not.

**Suggested command:** `/impeccable harden`

### [P0] The mobile sidebar rail cannot be opened by keyboard, and hides focusable links

`_includes/nav_list:5–6` uses the CSS-checkbox accordion. `_sass/minimal-mistakes/_navigation.scss:344–347` sets `input[type="checkbox"], label { display: none }` at every width, and the `max-width: $large - 1px` block re-shows **only the `label`**. The `<input>` stays `display: none` — not focusable, not tabbable — and a `<label>` is not focusable either. Below 1024px there is no keyboard path to open the rail at all.

Worse, the collapsed panel uses `max-height: 0; opacity: 0%; overflow: hidden` — which does **not** remove children from the tab order. A keyboard user tabbing past the toggle sends focus into 5–8 links they cannot see.

**Why it matters.** On the 17 pages that carry a rail, the rail *is* the site's structure. For a keyboard or screen-reader user on a phone it is simultaneously unopenable and a focus trap. That is WCAG 2.2 AA 2.1.1 (Keyboard) and 2.4.7 (Focus Visible), on a site whose family charter says an accessibility failure "is a credibility issue, not just a defect" (QR-1, ADR-0002). Separately, `_navigation.scss:214` sets `outline: none` on the masthead's `.greedy-nav__toggle` with no replacement ring.

**Fix.** Replace the checkbox hack with a real `<button aria-expanded aria-controls>`, and collapse with `display: none`/`hidden` so children leave the tab order. The masthead's overflow toggle needs the same button — build it once, use it twice. Roughly twenty lines, and it depends on none of the migration work.

**Suggested command:** `/impeccable audit`

### [P1] The masthead ignores the site's own information architecture

`masthead.html:7` loops over `site.data.navigation.main` only. The `publications`, `schulungen` and `about` groups reach the page solely through `_includes/sidebar.html`, on the 17 pages whose front matter opts in. So the masthead is seven flat links with no structure, while a good three-group IA sits unrendered one file away — and the rail implements the current-page marker (`nav_list:19`) that the masthead lacks.

Consequences worth naming: `/consulting/` has zero inbound links anywhere in the repo — fully orphaned. `/method/` and `/canvas/` are reachable only from the home page body, which the primary visitor never sees.

**Why it matters.** The deep-link arriver's third question is "what else is here", and the masthead answers "Mehr...". The real answer is already written down. Under the federation decision — orientation is solved inside the site — a hub that hides its own contents behind an ellipsis has no fallback.

**Fix.** Port the twin's pattern: a priority row of three or four (Übersicht, Termine, Schulungen) plus a "Mehr…" drawer rendering `publications`/`schulungen`/`about` as grouped, hinted lists. The data is already in the right shape. While in there, fix `navigation.yml:34–37`, where "iSAQB Foundation" and "Mastering Software Architectures" both point at `/info-msa/`.

**Suggested command:** `/impeccable shape`

### [P1] arc42.de omits the one cross-site link it is allowed, and ships one it isn't

arc42.org carries an EN/DE switcher pointing here. arc42.de does not reciprocate: zero `hreflang` anywhere in `_includes`, `_layouts`, `_config.yml` or the built HTML. The only route to the English twin is a hero action button on the home page pointing at the arc42.org **root** — not at the equivalent page — which the deep-link arriver never sees.

Meanwhile the one cross-site link that *is* in the chrome — `navigation.yml:11–12`, "Download" → `https://arc42.org/download` — renders bare: `<a href="https://arc42.org/download" >Download</a>`, no `rel`, no `target`, no external marker, no warning. One click and the visitor is on a different domain, in a different language, under a different masthead.

**Why it matters.** The federation decision names the EN/DE pair as *the* sanctioned chrome exception, precisely because it routes to the same content in another language. arc42.de has this exactly backwards: it omits the permitted link and ships a non-permitted one. The omission bites hardest on the primary persona — a German speaker who deep-links onto one of this site's English pages (`/about/`, `/info-msa-engl/`) has no chrome-level way to ask for their language.

**Fix.** Move "Download" out of `main` — either a flagged CTA in the arc42.org manner, or content on `/overview/`. Add a chrome-level `DE | EN` switcher, per-page where a translation exists (`page.translation_url`, as trainings.arc42.org already does) and falling back to the arc42.org root where it does not.

**Suggested command:** `/impeccable shape`

### [P2] Nothing tells the visitor where they are

Zero `aria-current` in the entire build, verified. The masthead nav block is byte-identical on `/` and `/overview/` — 1424 characters, no `.active`, no `aria-expanded`, no `aria-label`, no `role`. The greedy-nav JS writes only a non-standard `count` attribute and touches no ARIA. `_config.yml:30` sets `breadcrumbs: false`, so `_includes/breadcrumbs.html` is dead code on every page. The sidebar's `.active` is `font-weight: bold` and nothing else — not exposed to assistive tech, and applied to children only, never the parent group. Four `<nav>` landmarks per page, none labelled: a screen-reader rotor reads "navigation, navigation, navigation, navigation".

**Fix.** Add `{% if link.url == page.url %}aria-current="page"{% endif %}` plus a visible non-colour treatment in `masthead.html:14` and `nav_list:11,19`. Add `aria-label` to each `<nav>`. Add `aria-expanded`/`aria-controls` to both toggles. Enabling `breadcrumbs: true` is *not* a quick win — `breadcrumbs.html:32` builds labels by capitalizing URL segments, so it would emit "Info-improve" and "Anmeldung-erfolg". Fix the label source first or leave it off.

**Suggested command:** `/impeccable audit`

### [P2] Seven top-level items, ordered so the most valuable ones vanish first

Seven exceeds the ≤5 guideline, but the composition is the real problem: two of the seven are not wayfinding at all. "Suche" should be a control, not a link. "Download" should be a flagged CTA, not a peer. Remove both and you are at five, one of which ("Mehr...") means nothing.

The ordering is actively inverted against need. greedy-nav overflows from the **end** of the list. The declared order is Übersicht, Termine, Schulungen, Mehr..., Download, Über..., **Suche** — so on the first viewport that cannot fit all seven, the first item into the unlabelled hamburger is Suche, then "Über..." (what is this site?), then Download (the conversion). The three highest-value items for the primary visitor are the three first sacrificed. On a 1366px laptop this is not hypothetical.

**Fix.** Reorder so overflow sacrifices the least valuable items, and promote Suche and Download out of the link list into their proper roles.

**Suggested command:** `/impeccable distill`

## Persona Red Flags

**Jordan (confused first-timer).** "Mehr..." occupies the fourth slot and signals nothing — Docs? FAQ? Bücher? AGB? All of them. Clicks "Über...", lands on `/about/`, and the page is in English, so now doubts they are on the German site. Clicks "Download" and is on a different domain in a different language with no warning and no way back. Lands on `/more/` and faces 8 hero buttons above 6 feature cards largely duplicating them — 14 things to compare for one choice. Mistypes a URL and gets an English apology with a joke image and zero links back into the site.

**Sam (keyboard + screen reader).** Below 1024px cannot open the sidebar rail at all, then tabs into 5–8 invisible-but-focusable links inside it. The overflow toggle never announces state — no `aria-expanded`, no `aria-controls` — and its contents change with viewport width, silently. `outline: none` on that toggle with no replacement ring. Zero `aria-current` sitewide, so there is no programmatic way to know which page this is; the rail's only cue is a bold weight that assistive tech does not expose. Four unlabelled `<nav>` landmarks. A German screen-reader voice is handed English skip links on `lang="de"` markup, because `_data/ui-text.yml:485–488` leaves the `skip_*` strings empty under `de:` and the build falls through to the English defaults.

**Katrin (German architect, arrived from Google on `/info-improve/`) — the primary persona.** *What is this?* A 100px image whose only text is `alt="arc42"`. No wordmark, no tagline, no language marker. She knows the word arc42 — that is why she clicked — but not what this site is versus arc42.org, docs.arc42.org, or the book she read. *Where am I?* No breadcrumb, no active state. The page carries the `schulungen` rail, but the parent "Schulungsangebot" is never marked active, so she cannot tell IMPROVE is a course rather than a method chapter. On her phone that rail is a collapsed chip she cannot open by keyboard. *What else is here?* She reaches for search — item 7 of 7, first into the overflow drawer on her laptop, and non-functional if she finds it. Her fallback is "Mehr...", which tells her nothing. What she actually wants — `/method/`, `/canvas/` — is linked only from the home page she will never see.

## Minor Observations

- `_site/search/index.html:90` ships `<script src=""></script>` — an empty `src` makes the browser re-request the page itself as a script.
- `masthead.html:14` renders `title="{{ link.description }}"`, but no `navigation.yml` entry defines `description`. Dead code — and a `title` tooltip is the wrong affordance anyway: neither keyboard- nor touch-accessible.
- Nav link tap targets fail the 44px guideline: `_navigation.scss:182–184` gives links `display: block; margin: 0 1rem` with no padding and no min-height. The only `min-height` is `$nav-height: 2em` = 32px on the container. Hit areas are line-height tall, ~19px, and the horizontal separation is margin, so it is not clickable area either.
- `.site-logo img { max-height: 2rem }` never applies — the anchor uses `class="site-title"`. The logo is sized purely by its inline `width="100px"`, and the greedy-nav JS measures through `$title` instead. It works by accident.
- `.masthead__menu-item--lg` is defined and never used: the modifier that would have created hierarchy in the bar.
- `footer.html:23–24` — two adjacent links to `/imprint/`, the second ("No-Cookies") a claim wearing a navigation costume. The footer has no link to `/contact/` at all; Kontakt lives only in the `about` rail, on four pages.
- `_includes/footer.html:3–5` — a bare `<a>` and a `<br>` sit as direct children of `<ul class="social-icons">`, outside any `<li>`. Invalid HTML; the announced list count will be wrong.
- `/anmeldung/` — paid training registration — is in `navigation.yml` zero times, has no sidebar, no breadcrumb (disabled globally), no step indicator, and no in-page link to the AGB. The terms exist only in the `schulungen` rail, which this page does not carry. The journey ends on `/anmeldung-erfolg/` or `/anmeldung-fail/`, neither of which the IA acknowledges.
- `_pages/about.md` carries `canonical_url: https://www.arc42.org/about/` — telling search engines the German site's About page is not canonical.
- `_data/navigation.yml:56,64` have trailing whitespace. Cosmetic, but this file is the site's IA and it reads as unmaintained.

## Questions to Consider

**1. If you deleted the masthead links entirely and shipped logo + wordmark + working search + the left rail — the docs/faq pattern the family already ships twice — would any visitor be worse off?** The seven links reach six internal pages. The rail data is already better structured. The one thing a masthead can do that a rail cannot, orient a deep-link arriver, it currently does not do at all. So what are the seven links for?

**2. "Termine" and "Schulungen" take two of seven top-level slots and route to overlapping content. "Anmeldung" — the only page where money changes hands — appears in the navigation zero times. Is that an accident, or has this nav been built to describe the site rather than to serve the visit?**

**3. The family charter says WCAG 2.2 AA is a credibility requirement, and arc42.de is third in the migration order behind arc42.org and faq. The mobile rail cannot be opened by keyboard today. Does a measured keyboard failure wait its turn in the queue, or jump it?** The fix is about twenty lines and depends on none of the type-pair, navy-band or reading-measure work.
