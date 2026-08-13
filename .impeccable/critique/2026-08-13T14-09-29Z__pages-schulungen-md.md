---
target: schulungen page + site embedding
total_score: 12
max_score: 28
na_heuristics: 7,9,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-13T14-09-29Z
slug: pages-schulungen-md
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent)

# Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Sidebar active state works, but nav shows 5 course labels for only 4 destinations |
| 2 | Match System / Real World | 2 | Codename-first button labels (REQ4ARC, ADOC); buyer vocabulary — price, dates, duration — absent |
| 3 | User Control and Freedom | 3 | No traps, but the sole hero action detours the buyer to /gallery/ |
| 4 | Consistency and Standards | 1 | Candy palette vs. brand slate blue; `<a><button>` ×7; page ignores the site's own newer course-bridge / btn--arc42 pattern |
| 5 | Error Prevention | 2 | Close orders Anmeldung before Termine (register before picking a date); duplicate sidebar links |
| 6 | Recognition Rather Than Recall | 1 | Zero dates/prices/durations on the deciding page; course choice carried in working memory to /termine/ |
| 7 | Flexibility and Efficiency | n/a | Single linear marketing page; no repeat-use efficiency need |
| 8 | Aesthetic and Minimalist Design | 1 | Seven button hues on one page; ~800-word unbroken prose block; unscrimmed hero |
| 9 | Error Recovery | n/a | Static content page, no error states |
| 10 | Help and Documentation | n/a | Course PDFs correctly live on /info-* pages |
| **Total** | | **12/28** | **Poor (43% — significant overhaul needed on the applicable set)** |

# Design Specificity Verdict

**Split verdict: the content is authored; the presentation is category-interchangeable — and the page is internally inconsistent precisely because one band on it IS authored.**

- Interchangeable: generic Unsplash bridge hero with the theme's default outline action; the four course buttons are literally w3schools-tutorial buttons (`assets/css/button.css` line 2: "Credits to w3schools") in CSS named colors — LightSkyBlue, PaleGreen, Pink, #F5B700. Swap the copy and this is a yoga-retreat page.
- Authored: the German prose is genuinely specific (iSAQB founding, Foundation-WG lead since 2016, 3000+ certified, dual-trainer model), and the firmen-logos band is real design (counter-scrolling rows, grayscale-at-rest, reduced-motion support, print exclusion).
- The clash between the renovated band and the 2015-era shell is exactly why the page reads "inconsistent."

**Deterministic scan**: `detect.mjs` exited clean — **0 findings** on both `_site/schulungen/index.html` and `_pages/schulungen.md`. The page's problems are judgment-level (identity, hierarchy, flow), not the mechanical antipatterns the detector hunts. Assessment B's manual mechanical pass independently corroborated Assessment A's structural findings: 7× `<a><button>` nesting (built HTML lines 290–349), invalid `<p/>` spacer, YouTube iframe without `title`, 49 of ~51 images without width/height (CLS risk; logo sizing may be handled by CSS — unverified), and canonical/og URLs leaking `http://0.0.0.0:4043` (likely a local-build artifact; verify against the CI build).

**Visual overlays**: browser injection failed in both assessments — the Chrome extension was connected but unresponsive (likely a pending permission prompt in the extension side panel, which sub-agents cannot approve). No user-visible overlay is available; fallback signal is CLI + source/HTML/CSS reading, plus pixel-measured numbers recorded in the repo's IMPROVEMENT_PLAN.md from a prior instrumented run (marked "measured (plan)").

# Overall Impression

This is the commercial heart of the site wearing its oldest clothes. The raw material is excellent — unfakeable iSAQB credibility, a 24-logo trust band, a clean masthead funnel (Schulungen → Termine → Anmeldung) — but the page itself undermines it at every decision point: an unreadable hero whose only action leads to vacation photos, four candy-colored tutorial buttons with no price/date/duration, an 800-word wall of prose, and a close that says "und nun..." next to a Home button. The single biggest opportunity: the site already owns the fix — `course-bridge.html` closes four other pages with next-date + on-brand CTAs, yet the sales page is the only funnel page denied it.

# What's Working

1. **The firmen-logos band** — the best-crafted surface on the page: counter-scrolling rows, grayscale rest state, hover pause, `prefers-reduced-motion` honored, print-excluded. This *is* "Trusted Guide" design.
2. **Unfakeable credibility content** — iSAQB founding membership, Foundation curriculum stewardship since 2016, 3000+ certified, dual-trainer pioneers. Competitors can't copy this; it only needs staging instead of paragraphing.
3. **Clean funnel scent in the chrome** — masthead Schulungen → Termine → Anmeldung(CTA) mirrors the buying stages exactly.

# Priority Issues

1. **[P0] Hero: unreadable title + off-funnel action.** No `overlay_filter` scrim (87.5% of pixels behind the h1 fail 3:1 at 390px, measured (plan)) — unlike /, /termine/, /anmeldung/, /info-msa/, which all carry one. The sole hero action "Bildergalerie" sends the buyer to /gallery/. **Why**: the first impression is strain, and the most prominent CTA slot points off-funnel. **Fix**: add the site-standard `overlay_filter: rgba(15, 80, 180, 0.5)` and point the action at /termine/ (or delete it). Suggested: /impeccable polish.
2. **[P1] The course buttons are not a decision surface.** Codename-first labels, four off-brand candy hues, width-only hierarchy, ragged 750–1200px layout (`.button25` only exists ≥1200px), 0px tap gaps at 390px (measured (plan)), and no price, date, duration, or audience on a page titled "Unser Schulungsangebot." **Fix**: four uniform cards in the arc42 blues — course name, one-line audience, duration, next date from `site.data.trainings` — linking to /info-*. Suggested: /impeccable shape.
3. **[P1] The anti-close.** `### und nun...` + Anmeldung/Termine/Home as visual siblings, in inverted funnel order, with a Home exit door painted beside the conversion button. No reassurance at the commit moment. **Fix**: replace the row with `{% include course-bridge.html %}` (card variant) or a purpose-built close (next open date, Termine primary, Anmeldung secondary); delete the Home button. Suggested: /impeccable layout.
4. **[P2] Sidebar phantom course.** "iSAQB Foundation" and "Mastering Software Architectures" both link to /info-msa/ (`_data/navigation.yml:81–88`): visitors count 5 courses, find 4. **Fix**: merge into one label ("Mastering Software Architectures — iSAQB Foundation") or give Foundation its own anchor. Suggested: /impeccable clarify.
5. **[P2] Invalid `<a><button>` ×7.** Two tab stops per CTA (~14 to cross the page), double screen-reader announcements, invalid content model. **Fix**: `<a class="button buttonX">`, minding the documented `a:visited` cascade trap (plan item 6). Suggested: /impeccable harden.

# Persona Red Flags

**Jordan (HR person, first-timer)**: cannot raise a purchase order from this page — no price, duration, or dates anywhere on it; "REQ4ARC" and "ADOC" are opaque codenames; the sidebar promises an "iSAQB Foundation" course that never materializes as its own page. She must open four info pages plus /termine/ and assemble the comparison herself.

**Casey (distracted mobile user)**: illegible hero title at 390px; IMPROVE/ADOC buttons stack with 0px gap → mis-taps; the YouTube embed swallows a full viewport mid-scroll; the final row is three adjacent double-focusable targets.

**Riley (stress tester)**: tabbing costs two stops per CTA; button hover state #EEE8AA on #4b7ba3 is 3.60:1 (measured (plan)) — hover *reduces* legibility; clicks both MSA-ish sidebar links, lands twice on the same page, files it as a bug.

**Alex (experienced architect comparing providers)**: respects the iSAQB credentials but notices the site selling architecture quality runs on w3schools tutorial buttons and hides its trainers' faces (portraits exist in /images/photos/portraits/, used nowhere) — the artifact contradicts the pitch.

# Minor Observations

- Layout shell inconsistent across the funnel: /schulungen/ = single + sidebar → /termine/ = splash, no sidebar → /anmeldung/ = single, no sidebar. The sidebar vanishes mid-funnel.
- Tomato restraint rule is respected here (one buttonAnmeldung), but the planned darkening to #c33b21 (contrast fix decided 2026-08-11) is not yet applied.
- Brand-phrase drift: home "Bewährt, praktisch und pragmatisch" vs. schulungen "Praxisorientiert, effektiv und pragmatisch" — near-identical triads, neither canonical.
- Copy defects (`_pages/schulungen.md:63–65`): sentence fragment ("…Softwarearchitekturen. Kommunikation und Analyse/Evaluierung von Software-Architekturen."), inconsistent hyphenation, "Architektur-Know-How" capitalization, two ellipsis headings, invalid `<p/>` at :29.
- Heading semantics loose: H3 "Diese Unternehmen…" nests under "Unser Angebot," which it isn't part of.
- `arc42-learn-cpsaf.png` ships 1938px for a ~936px render.
- YouTube iframe lacks `title`; deprecated `frameborder` and nonstandard fullscreen attributes.
- Canonical/og:url/og:image leak `http://0.0.0.0:4043` in this local build — verify the CI build before treating as real.
- The gallery fixation repeats on home ("Impressionen" on the Trainings card) — a pattern, not a one-off.

# Questions to Consider

1. Why does the commercial heart of the site hand its two most prominent CTA slots to a photo gallery (hero action here, "Impressionen" on the homepage Trainings card)? Has the gallery ever produced a booking?
2. If course-bridge.html is good enough to close /method/ and /canvas/, why is the sales page the only funnel page denied the site's best conversion pattern — and does /schulungen/ even deserve to exist separately from /termine/, versus one merged decision page (offer + dates + prices)?
3. The two trainers are the product — dual-trainer pioneers with portraits sitting unused on disk. What is this page selling if it won't show them?
