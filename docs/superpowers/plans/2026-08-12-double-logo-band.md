# Double Counter-Scrolling Logo Band Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the client-logo band on `/schulungen/` from one scrolling row of 15 logos to two counter-scrolling rows of 12 mutually exclusive logos each (24 total, 9 newly pulled from Wikimedia Commons), with a small-logo modifier and full print exclusion.

**Architecture:** The existing `_includes/firmen-logos.html` partial gains a second `.firmen-logos__track` with `animation-direction: reverse` and a slightly different duration so the rows never sync. Logo data stays in Liquid data strings inside the include (now two, one per row) with an optional third `|small` field. All CSS is appended to the existing `.firmen-logos*` block at the tail of `assets/css/arc42-resources.css`.

**Tech Stack:** Jekyll 4.3 (Docker via `make`), Liquid, plain CSS. No JS.

## Frozen decisions (from the design dialogue, 2026-08-12)

- Two rows, opposite scroll directions, directly stacked, sharing one container and one edge-fade mask.
- Rows are **mutually exclusive** — no logo appears in both.
- **Hover-pause stays exactly as it is** (`.firmen-logos:hover` pauses both tracks). The human acknowledged the earlier "never stop" idea and reversed it: the band must remain "stoppable".
- **Print: no logo ever visible** — the entire `.firmen-logos` container is `display: none` under `@media print`. This covers both pages that render the include (`/schulungen/` and `/prototypes/firmen-logos/`).
- KNDS gets the `small` modifier (`max-height: 32px` instead of 44px).
- All 9 researched candidates go in (human approved "6–10, cleanest SVGs"): skidata, advantest, conet, randstad, helbling, bsh, aktionmensch, provinzial, vkb.

## Global Constraints

- Branch: `improve-the-flow`. The working tree carries unrelated WIP (`.impeccable/`, `IMPROVEMENT_PLAN.md`, `todo/`) — **stage only the files your task names. Never `git add -A`, `git add .`, or `git commit -a`.**
- **No new stylesheet, no new `@import` in `main.scss`.** New CSS is appended to the tail of `assets/css/arc42-resources.css` (cascade trap: Dart Sass emits plain-CSS `@import`s before the theme layer — see `docs/handover-firmen-logos.md` §5).
- Logo dimming filter is **`grayscale(1)` only — never add `contrast(0)`** (it blanks reversed-badge logos, see `docs/handover-firmen-logos.md` §4). CONET's SVG contains `#ffffff` fills over teal — it is exactly the logo class that trap describes.
- `prefers-reduced-motion: reduce` must stop **both** tracks (the existing `.firmen-logos__track { animation: none; }` rule already matches both — do not scope it to one track).
- Never emit `https://www.arc42.de` anywhere in `_site` (`make test-theme` fails the build on it).
- Builds run in Docker: `make site` (build), `make dev` (serve on port 4043), `make test-theme`, `make check-links`.
- The two row data strings must stay mutually exclusive; a verification step asserts key disjointness.

## File map

| File | Change |
|---|---|
| `assets/img/firmen-logos/*.svg` | +9 new files (Task 1) |
| `docs/firmen-logos-quellen.md` | append provenance of the 9 pulled files (Task 1) |
| `_includes/firmen-logos.html` | one track → two tracks, two data strings, `small` modifier (Task 2) |
| `assets/css/arc42-resources.css` | reverse-track rules, row gap, small modifier, print rule (Task 2) |
| `docs/handover-firmen-logos.md` | inventory 15→24, two-row structure, new verify counts (Task 2) |

---

### Task 1: Add the 9 new logo SVGs

**Files:**
- Create: `assets/img/firmen-logos/{skidata,advantest,conet,randstad,helbling,bsh,aktionmensch,provinzial,vkb}.svg`
- Modify: `docs/firmen-logos-quellen.md` (append one section at the end)

**Interfaces:**
- Produces: the 9 filenames above, consumed verbatim by Task 2's data strings.

The files are **already downloaded and inspected** (valid vector SVGs, no embedded rasters) at:
`/private/tmp/claude-501/-Users-gernotstarke-projects-arc42-arc42-de-site/225861bf-856e-4cb7-b1fd-6714a28e5922/scratchpad/logo-candidates/`

Their Wikimedia Commons source files (for the provenance note, and for re-download via the Commons `imageinfo` API if the scratchpad is gone):

| key | Commons file |
|---|---|
| skidata | `File:SKIDATA GmbH.svg` |
| advantest | `File:ADVANTEST company logos.svg` |
| conet | `File:Conet (IT-Dienstleister) logo.svg` |
| randstad | `File:Randstad Logo.svg` |
| helbling | `File:Helbling Logo.svg` |
| bsh | `File:BSH Bosch und Siemens Hausgeräte logo.svg` |
| aktionmensch | `File:Aktion Mensch Logo.svg` |
| provinzial | `File:Provinzial Logo.svg` |
| vkb | `File:Versicherungskammer Bayern logo.svg` |

- [ ] **Step 1: Copy the 9 files into the repo**

```bash
cp /private/tmp/claude-501/-Users-gernotstarke-projects-arc42-arc42-de-site/225861bf-856e-4cb7-b1fd-6714a28e5922/scratchpad/logo-candidates/{skidata,advantest,conet,randstad,helbling,bsh,aktionmensch,provinzial,vkb}.svg assets/img/firmen-logos/
ls assets/img/firmen-logos/ | wc -l   # expect 24
```

- [ ] **Step 2: Patch the two SVGs that lack a `viewBox`**

`randstad.svg` and `provinzial.svg` declare only `width`/`height`. Without a `viewBox`, an SVG rendered via `<img>` does not scale — content clips instead of shrinking. Add a `viewBox` matching the declared size, without touching anything else. In `assets/img/firmen-logos/randstad.svg`, the opening tag contains:

```
width="990.35431"   height="207.28346"
```

Add the attribute `viewBox="0 0 990.35431 207.28346"` inside the `<svg …>` opening tag (immediately after the `height` attribute is fine). In `assets/img/firmen-logos/provinzial.svg`, the opening tag declares `width="782.53552"` and `height="104.27206"`; add `viewBox="0 0 782.53552 104.27206"` the same way.

- [ ] **Step 3: Verify all 24 files parse and every one has a viewBox**

```bash
for f in assets/img/firmen-logos/*.svg; do
  python3 -c "
import sys, xml.etree.ElementTree as ET
r = ET.parse('$f').getroot()
assert r.get('viewBox'), '$f: no viewBox'
" || echo "FAIL $f"
done
```

Expected: no output (the 15 pre-existing files all have a viewBox; if one of them fails, report it — do not patch pre-existing files in this task).

- [ ] **Step 4: Append the provenance section to `docs/firmen-logos-quellen.md`**

Append verbatim at the end of the file:

```markdown

## Im Logo-Band verwendet (Stand 2026-08-12)

24 der oben gelisteten Firmen sind als SVG unter `assets/img/firmen-logos/` eingebunden.
Die 9 zuletzt ergänzten stammen von Wikimedia Commons:

| Datei | Commons-Quelle |
|---|---|
| `skidata.svg` | File:SKIDATA GmbH.svg |
| `advantest.svg` | File:ADVANTEST company logos.svg |
| `conet.svg` | File:Conet (IT-Dienstleister) logo.svg |
| `randstad.svg` | File:Randstad Logo.svg |
| `helbling.svg` | File:Helbling Logo.svg |
| `bsh.svg` | File:BSH Bosch und Siemens Hausgeräte logo.svg |
| `aktionmensch.svg` | File:Aktion Mensch Logo.svg |
| `provinzial.svg` | File:Provinzial Logo.svg |
| `vkb.svg` | File:Versicherungskammer Bayern logo.svg |

Bei `randstad.svg` und `provinzial.svg` wurde eine fehlende `viewBox` ergänzt
(Werte = deklarierte `width`/`height`), sonst keine Änderungen an den Dateien.
Der Trademark-Hinweis oben gilt unverändert auch für diese 9.
```

- [ ] **Step 5: Commit**

```bash
git add assets/img/firmen-logos/skidata.svg assets/img/firmen-logos/advantest.svg assets/img/firmen-logos/conet.svg assets/img/firmen-logos/randstad.svg assets/img/firmen-logos/helbling.svg assets/img/firmen-logos/bsh.svg assets/img/firmen-logos/aktionmensch.svg assets/img/firmen-logos/provinzial.svg assets/img/firmen-logos/vkb.svg docs/firmen-logos-quellen.md
git commit -m "feat(logos): pull 9 more client logos from Wikimedia Commons"
```

---

### Task 2: Two counter-scrolling rows, small modifier, print exclusion

**Files:**
- Modify: `_includes/firmen-logos.html` (whole file — full replacement below)
- Modify: `assets/css/arc42-resources.css` (the `.firmen-logos*` block at the tail, currently lines ~627–667)
- Modify: `docs/handover-firmen-logos.md` (§2, §3, §6)

**Interfaces:**
- Consumes: the 9 filenames from Task 1.
- Produces: CSS classes `.firmen-logos__track--reverse` and `.firmen-logos__item--small`; the two data strings below are the single source of row membership.

- [ ] **Step 1: Replace `_includes/firmen-logos.html` with the two-row version**

Full new file content (replaces the existing file):

```liquid
{%- comment -%}
  Renders the "diese Firmen schulen mit arc42" logo band: two stacked,
  counter-scrolling rows of dimmed/monochrome client logos (full color on
  hover, both rows paused while the band is hovered). CSS lives in
  assets/css/arc42-resources.css (.firmen-logos* rules at the end of the
  file — see the cascade note in main.scss for why new CSS is appended
  there rather than a new stylesheet).

  Usage: {% include firmen-logos.html %}

  Row membership: the two data strings below are the single source of
  truth. Rows must stay MUTUALLY EXCLUSIVE — never list a logo in both.
  A new logo is added by appending "key|Company Name" to exactly one
  string (its SVG goes to assets/img/firmen-logos/<key>.svg). An optional
  third field "small" renders the logo at reduced height
  (firmen-logos__item--small), e.g. for visually heavy marks like KNDS.

  The band is hidden entirely in print (@media print in the CSS) — client
  logos must never appear on paper.

  Logo files: assets/img/firmen-logos/<key>.svg. Sources and trademark
  notes: docs/firmen-logos-quellen.md — check each company's brand
  guidelines before any additional use beyond this reference-style band.
{%- endcomment -%}
{%- assign firmen_logos_row1 = "bosch|Robert Bosch GmbH,zeiss|Carl Zeiss AG,enbw|EnBW Energie Baden-Württemberg AG,trumpf|TRUMPF,db|Deutsche Bahn AG,fraunhofer|Fraunhofer-Gesellschaft,buehler|Bühler AG,gea|GEA Group,swm|Stadtwerke München,soprasteria|Sopra Steria,barmenia|Barmenia Krankenversicherung AG,abus|ABUS Security Center" | split: "," -%}
{%- assign firmen_logos_row2 = "knds|KNDS Deutschland|small,skidata|SKIDATA GmbH,pepperlfuchs|Pepperl+Fuchs SE,advantest|Advantest Europe GmbH,bose|Bose Corporation,conet|CONET,randstad|Randstad Digital,helbling|Helbling Technik,bsh|BSH Hausgeräte GmbH,aktionmensch|Aktion Mensch e.V.,provinzial|Provinzial Versicherung,vkb|Versicherungskammer Bayern" | split: "," -%}
<div class="firmen-logos">
  <div class="firmen-logos__track">
    {%- for pair in firmen_logos_row1 -%}
      {%- assign parts = pair | split: "|" -%}
      <div class="firmen-logos__item{% if parts[2] == 'small' %} firmen-logos__item--small{% endif %}"><img src="/assets/img/firmen-logos/{{ parts[0] }}.svg" alt="{{ parts[1] }}" loading="lazy"></div>
    {%- endfor -%}
    {%- for pair in firmen_logos_row1 -%}
      {%- assign parts = pair | split: "|" -%}
      <div class="firmen-logos__item{% if parts[2] == 'small' %} firmen-logos__item--small{% endif %}" aria-hidden="true"><img src="/assets/img/firmen-logos/{{ parts[0] }}.svg" alt="" loading="lazy"></div>
    {%- endfor -%}
  </div>
  <div class="firmen-logos__track firmen-logos__track--reverse">
    {%- for pair in firmen_logos_row2 -%}
      {%- assign parts = pair | split: "|" -%}
      <div class="firmen-logos__item{% if parts[2] == 'small' %} firmen-logos__item--small{% endif %}"><img src="/assets/img/firmen-logos/{{ parts[0] }}.svg" alt="{{ parts[1] }}" loading="lazy"></div>
    {%- endfor -%}
    {%- for pair in firmen_logos_row2 -%}
      {%- assign parts = pair | split: "|" -%}
      <div class="firmen-logos__item{% if parts[2] == 'small' %} firmen-logos__item--small{% endif %}" aria-hidden="true"><img src="/assets/img/firmen-logos/{{ parts[0] }}.svg" alt="" loading="lazy"></div>
    {%- endfor -%}
  </div>
</div>
```

- [ ] **Step 2: Extend the CSS block at the tail of `assets/css/arc42-resources.css`**

The file currently ends with the `.firmen-logos*` block (comment header at ~line 627, ending with the `@media (prefers-reduced-motion: reduce)` rule). Make exactly these changes **inside that block**:

(a) After the existing rule

```css
.firmen-logos:hover .firmen-logos__track { animation-play-state: paused; }
```

insert:

```css
.firmen-logos__track + .firmen-logos__track { margin-top: 1.4em; }
.firmen-logos__track--reverse {
  animation-duration: 42s;
  animation-direction: reverse;
}
```

(35s vs 42s: co-prime-ish durations so the rows never visibly synchronize. `animation-direction: reverse` plays the same `firmen-logos-scroll` keyframes backwards — at t=0 the reverse track sits at `translateX(-50%)`, which is seamless because the row's content is duplicated.)

(b) After the existing rule

```css
.firmen-logos__item img:hover,
.firmen-logos__item img:focus { filter: none; opacity: 1; }
```

insert:

```css
.firmen-logos__item--small img { max-height: 32px; }
```

(c) At the very end of the file, after the `@media (prefers-reduced-motion: reduce)` block, append:

```css
@media print {
  .firmen-logos { display: none; }
}
```

Do **not** touch the existing `filter: grayscale(1)`, the hover-pause rule, or the reduced-motion rule — all three are frozen behavior. The reduced-motion rule (`.firmen-logos__track { animation: none; }`) already matches the reverse track via its base class; leave it unscoped.

- [ ] **Step 3: Build and assert**

```bash
make site
```

Expected: clean build, no Liquid/Sass errors. Then:

```bash
# 48 items total: (12 row1 + 12 row2) × 2 loop copies. The pattern is anchored
# with `class="` and a closing [ "] because a bare "firmen-logos__item" also
# matches inside "firmen-logos__item--small" and would over-count.
grep -o 'class="firmen-logos__item[ "]' _site/schulungen/index.html | wc -l  # expect 48
grep -o "firmen-logos__track--reverse" _site/schulungen/index.html | wc -l   # expect 1
grep -o "firmen-logos__item--small" _site/schulungen/index.html | wc -l      # expect 2 (KNDS, twice via loop duplication)
grep -o 'class="firmen-logos__item[ "]' _site/prototypes/firmen-logos/index.html | wc -l  # expect 48
ls _site/assets/img/firmen-logos/ | wc -l                                    # expect 24
grep -o "firmen-logos { display: none; }" _site/assets/css/arc42-resources.css | wc -l  # expect 1
```

- [ ] **Step 4: Assert row disjointness (mutual exclusivity)**

```bash
python3 - <<'PY'
import re
src = open('_includes/firmen-logos.html', encoding='utf-8').read()
rows = re.findall(r'firmen_logos_row\d = "([^"]+)"', src)
assert len(rows) == 2, f"expected 2 data strings, got {len(rows)}"
keys = [set(p.split('|')[0] for p in r.split(',')) for r in rows]
dup = keys[0] & keys[1]
assert not dup, f"logos in BOTH rows: {dup}"
assert len(keys[0]) == 12 and len(keys[1]) == 12, (len(keys[0]), len(keys[1]))
print("rows disjoint, 12 + 12 OK")
PY
```

Expected: `rows disjoint, 12 + 12 OK`

- [ ] **Step 5: Update `docs/handover-firmen-logos.md`**

Three edits:

(a) In §2 ("What the feature does"), replace the first sentence

```
A dimmed/monochrome band of client logos, scrolling right-to-left in a seamless
loop (list rendered twice, `translateX(0) → translateX(-50%)`, 35s linear
infinite), pausing on hover so individual logos can be hovered to full color.
```

with

```
A dimmed/monochrome band of client logos in two stacked, counter-scrolling
rows (each list rendered twice, `translateX(0) → translateX(-50%)`; upper
row 35s, lower row 42s reversed via `animation-direction`, both linear
infinite), pausing on hover so individual logos can be hovered to full
color. The two rows show mutually exclusive logo sets (12 + 12), defined
in the include's two data strings. The whole band is `display: none` in
print — client logos never appear on paper.
```

(b) In §3, replace the heading `## 3. Logo inventory (15)` and its first paragraph with:

```
## 3. Logo inventory (24)

Row 1: `bosch, zeiss, enbw, trumpf, db, fraunhofer, buehler, gea, swm,
soprasteria, barmenia, abus` — Row 2: `knds (small), skidata, pepperlfuchs,
advantest, bose, conet, randstad, helbling, bsh, aktionmensch, provinzial,
vkb` — filenames under `assets/img/firmen-logos/`, all SVG, all from
Wikimedia Commons (see `docs/firmen-logos-quellen.md` for sources per
company, the 2026-08-12 provenance table for the 9 newest, and the
trademark caveat).
```

(c) In §6 ("How to verify"), replace the two grep lines

```
grep -o "firmen-logos__item" _site/schulungen/index.html | wc -l   # expect 30 (15 × 2, loop duplication)
grep -c "firmen-logos-scroll" _site/assets/css/arc42-resources.css # expect 1
```

with

```
grep -o 'class="firmen-logos__item[ "]' _site/schulungen/index.html | wc -l  # expect 48 (24 × 2, loop duplication)
grep -o "firmen-logos__track--reverse" _site/schulungen/index.html | wc -l   # expect 1
grep -o "firmen-logos { display: none; }" _site/assets/css/arc42-resources.css | wc -l # expect 1 (print exclusion)
```

and change `ls _site/assets/img/firmen-logos/ | wc -l` → `# expect 15` to `# expect 24` in the same block.

- [ ] **Step 6: Commit**

```bash
git add _includes/firmen-logos.html assets/css/arc42-resources.css docs/handover-firmen-logos.md
git commit -m "feat(logos): second counter-scrolling row, small modifier, no logos in print"
```

---

### Task 3: Verification sweep (no commits)

**Files:** none (read-only build checks).

**Interfaces:**
- Consumes: everything from Tasks 1–2.

- [ ] **Step 1: Full build + theme assertions + link check**

```bash
make site
make test-theme
make check-links
```

Expected: `>> test-theme OK`; html-proofer clean. (test-theme also proves no `https://www.arc42.de` leaked into `_site`.)

- [ ] **Step 2: Re-run the Task 2 Step 3 greps against the fresh build**

Same commands, same expected values (48 / 1 / 2 / 48 / 24 / 1).

- [ ] **Step 3: Confirm frozen behaviors survived, straight from the built CSS**

```bash
grep -c "firmen-logos:hover .firmen-logos__track { animation-play-state: paused; }" _site/assets/css/arc42-resources.css  # expect 1 (hover-pause kept)
grep -c "contrast(0)" _site/assets/css/arc42-resources.css   # expect 0 (reversed-badge trap absent)
# reduced-motion still kills BOTH tracks (rule must be on the base class, unscoped):
awk '/prefers-reduced-motion/,/^}/' _site/assets/css/arc42-resources.css | grep -c ".firmen-logos__track { animation: none; }"  # expect >= 1
```

- [ ] **Step 4: Report**

Report PASS/FAIL per step. No commits in this task.
