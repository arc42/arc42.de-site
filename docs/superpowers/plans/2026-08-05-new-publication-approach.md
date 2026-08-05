# arc42.de "Publikationen" Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace arc42.de's scattered Bücher/Artikel/Videos/Vorträge pages with a copy of arc42.org's filterable resource collection (German UI at `/publikationen/`), and align arc42.de's Docker/build/deploy stack with arc42.org (same image, Jekyll 4.3, GitHub-Actions-built Pages).

**Architecture:** arc42.org's mechanism is a Jekyll collection (`_resources/*.md`, one file per entry), one listing page with vanilla-JS client-side filtering (type/language/search, `?type=` URL sync), a card include, a detail-page layout, and token-based CSS. We copy that wholesale into arc42.de-site, translate only the UI chrome to German, copy 47 of the 48 org entries (excluding the dead anniversary edition), author 3 new entries for de-only content, and turn the five old pages into meta-refresh redirect stubs.

**Tech Stack:** Jekyll 4.3 (from `github-pages`/3.9), Docker (ruby:3.4-slim, image `arc42-site:latest`), GitHub Actions Pages deploy, vanilla JS, Liquid, kramdown.

## Global Constraints

- `/Users/gernotstarke/projects/arc42/arc42.org-site` is **read-only source material. Never modify it.**
- All work happens in `/Users/gernotstarke/projects/arc42/arc42.de-site` on branch `new-publication-approach` (Task 1 creates it from the current `unify-training-dates` state, **including** its uncommitted WIP).
- New listing page permalink: `/publikationen/`; collection entry permalink: `/publikationen/:name/`.
- UI chrome is German; entry front matter (titles, summaries, `search` keywords) is copied **verbatim** from arc42.org — do not translate entries.
- Excluded entry: `arc42-by-example-anniversary.md` (product dropped from Leanpub) — do NOT copy it.
- Filter URL values stay English (`?type=book|article|talk|video`) for parity with arc42.org.
- Internal links in generated HTML must use trailing-slash directory URLs (`/publikationen/`, not `/publikationen`), matching the site's existing conventions.
- Old public URLs must keep working: `/books/`, `/articles/`, `/videos/`, `/talks/`, `/recommendations/`, `/more/` become redirect stubs. `/articles/2022-11-requirements-overview/` stays a real page.
- Commit after every task with a descriptive message.

---

### Task 1: Branch + baseline commit

**Files:** none created; git only.

- [ ] **Step 1: Create the branch from the current state**

```bash
cd /Users/gernotstarke/projects/arc42/arc42.de-site
git checkout -b new-publication-approach
```

- [ ] **Step 2: Commit the pre-existing WIP as a baseline**

The working tree already carries uncommitted changes from `unify-training-dates` (`_config.yml`, `_data/navigation.yml`, `_includes/nav_list`, `_layouts/default.html`, `_pages/search.html`, untracked `assets/js/arc42-nav.js`, `images/arc42-logo-white.svg`, `.impeccable/`). Commit them so later commits stay clean:

```bash
git add -A
git commit -m "WIP baseline carried over from unify-training-dates"
```

- [ ] **Step 3: Verify clean tree**

Run: `git status --short` → empty output expected.

---

### Task 2: Docker/build alignment (same image as arc42.org)

**Files:**
- Overwrite: `Dockerfile`, `docker-compose.yml`, `Makefile`, `Gemfile`, `Gemfile.lock` (all copied from arc42.org-site)
- Create: `docker/jekyll-entrypoint.sh` (copied)
- Modify: `_config.yml` (plugins list)

**Interfaces:**
- Produces: working `make build` / `make dev` / `make site` / `make check-links` identical to arc42.org-site; image tag `arc42-site:latest`; Jekyll 4.3 build of the de site.

- [ ] **Step 1: Copy the six build files verbatim**

```bash
cd /Users/gernotstarke/projects/arc42/arc42.de-site
cp ../arc42.org-site/Dockerfile ../arc42.org-site/docker-compose.yml ../arc42.org-site/Makefile ../arc42.org-site/Gemfile ../arc42.org-site/Gemfile.lock .
mkdir -p docker && cp ../arc42.org-site/docker/jekyll-entrypoint.sh docker/
chmod +x docker/jekyll-entrypoint.sh
```

Note: the entrypoint refuses to start when the repo's `Gemfile.lock` differs from the one baked into the image — that is why the lockfile must be byte-identical to arc42.org's, and why any future gem change must happen in both repos together.

- [ ] **Step 2: Reconcile `_config.yml` plugins with the new Gemfile**

The new Gemfile provides only `jekyll-include-cache` and `jekyll-sitemap`. In `_config.yml`:
- In the `plugins:` list (~line 164): remove `- jemoji` (verified unused: no `:emoji:` codes anywhere in `_pages/` or `articles/`).
- Remove the `whitelist:` block (GH-Pages `--safe` mimicry, meaningless under self-built Jekyll 4).
- Remove the `github: metadata` line near the top (the github-metadata gem is gone). Then run `grep -rn "site.github" _includes _layouts _pages` — if any hit exists, replace/remove that usage (expected: none or only theme fallbacks that render empty harmlessly).

- [ ] **Step 3: Build the image and the site**

```bash
make build
make site
```

Expected: image `arc42-site:latest` builds; `jekyll build` completes under Jekyll 4.3 **without errors**. Warnings about sass `@import` deprecation must NOT appear (the pinned `jekyll-sass-converter ~> 2.2` prevents them). If the build fails, fix forward (this is the riskiest step of the whole plan — minimal-mistakes vendored theme moving 3.9 → 4.3); typical issues: `site.github` usage, plugin references, `relative_url` on nil.

- [ ] **Step 4: Smoke-check the output**

```bash
test -f _site/index.html && test -f _site/termine/index.html && test -f _site/books/index.html && echo OK
```

Expected: `OK`. (The old publication pages still exist at this point — they are replaced in Task 8.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Adopt arc42.org's Docker/build stack: same image (arc42-site:latest), Jekyll 4.3"
```

---

### Task 3: GitHub-Actions-based Pages deployment

**Files:**
- Create: `.github/workflows/pages.yml`

**Interfaces:**
- Produces: production builds use the SAME Jekyll 4.3 gem set as local dev (bundler-cache from the shared `Gemfile.lock`). Default branch is `main`.

- [ ] **Step 1: Write the workflow**

```yaml
# .github/workflows/pages.yml
# Builds the site with the repo's own Gemfile (Jekyll 4.3 — same stack as the
# arc42-site:latest dev image) and deploys to GitHub Pages. Replaces the
# native github-pages (Jekyll 3.9) build.
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: "3.4"
          bundler-cache: true
      - name: Build site
        run: JEKYLL_ENV=production bundle exec jekyll build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify YAML parses**

Run: `ruby -ryaml -e 'YAML.load_file(".github/workflows/pages.yml"); puts "yaml ok"'`
Expected: `yaml ok`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/pages.yml
git commit -m "Deploy via GitHub Actions with the repo's own Jekyll 4.3 gems"
```

**⚠️ MANUAL STEP for the user (after merge to main):** in the GitHub repo settings of `arc42/arc42.de-site`, switch *Settings → Pages → Build and deployment → Source* from "Deploy from a branch" to "**GitHub Actions**". The custom domain (arc42.de) setting persists; the `CNAME` file stays in the repo and is harmless.

---

### Task 4: Resource mechanism infrastructure (collection, include, layouts, JS, CSS)

**Files:**
- Modify: `_config.yml` (collection + defaults)
- Create: `_includes/resource-item.html`, `_layouts/resource.html`, `_layouts/redirect.html`, `assets/js/resources-filter.js` (all copied from arc42.org-site, then German-adapted), `assets/css/arc42-resources.css`
- Modify: `assets/css/main.scss`

**Interfaces:**
- Produces: collection `site.resources` rendering at `/publikationen/:name/` with layout `resource`; card include `{% include resource-item.html resource=r %}`; redirect layout consuming `redirect_to` / `redirect_label` front matter; CSS classes `.resource-*`, `.dl-hero`, `.btn--arc42`, `.btn--arc42-outline` and the `--arc42-*` design tokens.
- Consumed by: Tasks 5, 6, 7, 8.

- [ ] **Step 1: Register the collection in `_config.yml`**

Add (top level):

```yaml
collections:
  resources:
    output: true
    permalink: /publikationen/:name/
```

and append to the **existing** `defaults:` list (which already has a `type: posts` scope — keep it):

```yaml
  - scope:
      path: ""
      type: resources
    values:
      layout: resource
```

- [ ] **Step 2: Copy the four mechanism files**

```bash
cp ../arc42.org-site/_includes/resource-item.html _includes/
cp ../arc42.org-site/_layouts/resource.html ../arc42.org-site/_layouts/redirect.html _layouts/
cp ../arc42.org-site/assets/js/resources-filter.js assets/js/
```

- [ ] **Step 3: German-adapt `_includes/resource-item.html`**

Exact replacements (keep everything else byte-identical):
- `{%- assign lang = 'English' -%}{%- if r.language == 'de' -%}{%- assign lang = 'German' -%}{%- endif -%}` → `{%- assign lang = 'Englisch' -%}{%- if r.language == 'de' -%}{%- assign lang = 'Deutsch' -%}{%- endif -%}`
- The meta `<span>{{ r.type | capitalize }}</span>` → a German type label. Insert before the `<article>` line:
  ```liquid
  {%- case r.type -%}
    {%- when 'book' -%}{%- assign type_label = 'Buch' -%}
    {%- when 'article' -%}{%- assign type_label = 'Artikel' -%}
    {%- when 'talk' -%}{%- assign type_label = 'Vortrag' -%}
    {%- else -%}{%- assign type_label = 'Video' -%}
  {%- endcase -%}
  ```
  and use `<span>{{ type_label }}</span>` in the meta line.
- `alt="{{ r.title | escape }} cover"` → `alt="Cover: {{ r.title | escape }}"`
- `More details` → `Mehr Details`
- `{{ r.link_label | default: 'Open' }}` → `{{ r.link_label | default: 'Öffnen' }}`

- [ ] **Step 4: German-adapt `_layouts/resource.html`**

Same `lang`/`type_label` treatment as Step 3 for the hero kicker (`{{ page.type | capitalize }}` → `{{ type_label }}`), plus:
- `{{ page.link_label | default: 'Open' }}` → `{{ page.link_label | default: 'Öffnen' }}`
- `<a href="/resources/">&#8592; All resources</a>` → `<a href="/publikationen/">&#8592; Alle Publikationen</a>`
- `alt="{{ page.title | escape }} cover"` → `alt="Cover: {{ page.title | escape }}"`

- [ ] **Step 5: German-adapt `_layouts/redirect.html`**

- `<html lang="en">` → `<html lang="de">`
- `<title>Page moved | arc42</title>` → `<title>Seite verschoben | arc42</title>`
- `<p>This page has moved to <a href="{{ page.redirect_to }}">{{ page.redirect_label | default: "its new location" }}</a>.</p>` → `<p>Diese Seite ist umgezogen: <a href="{{ page.redirect_to }}">{{ page.redirect_label | default: "zur neuen Adresse" }}</a>.</p>`

- [ ] **Step 6: German-adapt `assets/js/resources-filter.js`**

At the count/context lines (~35-36), replace:

```js
count.textContent = visible + (visible === 1 ? " resource" : " resources");
context.textContent = selectedType === "all" ? " across all types" : " in " + selectedType + "s";
```

with:

```js
count.textContent = visible + (visible === 1 ? " Publikation" : " Publikationen");
var typeLabels = { book: "Bücher", article: "Artikel", talk: "Vorträge", video: "Videos" };
context.textContent = selectedType === "all" ? " in allen Kategorien" : " – " + typeLabels[selectedType];
```

Then scan the whole file for any further user-visible English strings (`grep -n '"' assets/js/resources-filter.js`) and translate those too (data-attribute values, class names, and `?type=` URL values must stay unchanged).

- [ ] **Step 7: Create `assets/css/arc42-resources.css`**

Assemble from `../arc42.org-site/assets/css/arc42-org.css`, copied verbatim in this order, with a header comment noting the source:
1. The leading `:root { ... }` design-token block (starts ~line 5, ends ~line 55 — copy the complete block including `--arc42-focus-ring`).
2. The `.btn.btn--arc42` and `.btn.btn--arc42-outline` rules (~lines 180-210).
3. All `.dl-hero*` rules (~lines 288-400, including the media queries in that range).
4. The full resource block, ~lines 684-987: `.resource-browser` through `.resource-detail*` including the responsive blocks at the end.

Then in `assets/css/main.scss`, after the existing `@import` for `arc42-de.css`, add:

```scss
@import 'arc42-resources.css';
```

Sanity check for collisions first: `grep -c 'resource-\|dl-hero\|--arc42-' assets/css/arc42-de.css assets/css/*.css` — expected 0 in every pre-existing file (verified during planning: de defines no `--arc42-*` tokens, no `.dl-hero`, no `.resource-*`).

- [ ] **Step 8: Build check**

Run: `make site`
Expected: builds clean; `test -f _site/assets/css/main.css && grep -c 'resource-item' _site/assets/css/main.css` returns ≥ 1.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Add the arc42.org resource mechanism: collection, card include, layouts, filter JS, CSS"
```

---

### Task 5: Copy the 47 org entries + cover images

**Files:**
- Create: `_resources/*.md` (47 files from arc42.org-site, excluding `arc42-by-example-anniversary.md`)
- Create/overwrite: cover images under `images/books/` and `images/resources/`

**Interfaces:**
- Consumes: collection config from Task 4.
- Produces: `site.resources` with 47 entries; card anchors `#arc42-by-example-3rd` and `#arc42-by-example-vol2` (front-matter `id:`), detail pages `/publikationen/arc42-in-aktion/`, `/publikationen/basiswissen-softwarearchitektur/`, `/publikationen/canvas-101/`, `/publikationen/effektive-softwarearchitekturen/`, `/publikationen/patterns-kompakt/`, `/publikationen/fundamentals-of-software-architecture/`, `/publikationen/whats-in-a-name/` (the seven `detail: true` entries).

- [ ] **Step 1: Copy the entries**

```bash
mkdir -p _resources
rsync -a --exclude 'arc42-by-example-anniversary.md' ../arc42.org-site/_resources/ _resources/
ls _resources | wc -l   # expected: 47
```

- [ ] **Step 2: Copy every referenced cover image**

```bash
mkdir -p images/resources images/books
grep -h '^cover:' _resources/*.md | sed -E 's/cover: *"?([^"]*)"?/\1/' | sort -u | while read -r p; do
  cp "../arc42.org-site${p}" ".${p}" || echo "MISSING: ${p}"
done
```

Expected: no `MISSING:` lines. Overwriting same-named files in `images/books/` is intended — org's versions are the current cover art.

- [ ] **Step 3: Audit root-relative links in the copied entries**

```bash
grep -n 'link: *"/' _resources/*.md
grep -n '](/' _resources/*.md
grep -n 'href="/' _resources/*.md
```

For every hit, decide:
- Target exists in this repo (e.g. `/downloads/Zehnkaempfer.pdf`, `/downloads/Handeln-statt-Jammern.pdf` — both present) → keep as-is. If a referenced `/downloads/...` file is missing here but exists in `../arc42.org-site/downloads/`, copy it over.
- Target is an arc42.org-only page (known case: `20-years-arc42.md` links `/20yrs-ecosystem/`) → rewrite to the absolute URL `https://arc42.org/20yrs-ecosystem/`.
- Check the seven `detail: true` entry **bodies** the same way (facts blocks may contain relative links).

- [ ] **Step 4: Build and count**

Run: `make site && ls _site/publikationen/ | wc -l`
Expected: build clean; 47 entry directories (the listing page itself doesn't exist yet — that's Task 6).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Copy 47 publication entries + covers from arc42.org (anniversary edition excluded)"
```

---

### Task 6: The `/publikationen/` listing page

**Files:**
- Create: `_pages/publikationen.md`

**Interfaces:**
- Consumes: `resource-item.html`, `resources-filter.js`, CSS from Task 4; entries from Task 5.
- Produces: `/publikationen/` — referenced by nav, stubs, and deep links in Task 8.

- [ ] **Step 1: Write the page**

German translation of `../arc42.org-site/_pages/resources.md` — same structure, classes, and data attributes, translated chrome:

```markdown
---
title: "Publikationen"
layout: splash
permalink: /publikationen/
excerpt: "Bücher, Artikel, Vorträge und Videos der Menschen hinter arc42 — gesammelt in einer durchsuchbaren Bibliothek."
---

<section class="dl-hero resource-hero">
  <div class="dl-hero__inner">
    <p class="dl-hero__kicker">Bücher &middot; Artikel &middot; Vorträge &middot; Videos</p>
    <h1 class="dl-hero__title">Publikationen</h1>
    <p class="dl-hero__sub">Eine kompakte Bibliothek dessen, was wir über arc42 und Softwarearchitektur geschrieben, vorgetragen und aufgezeichnet haben. Stöbern Sie in der gesamten Sammlung — oder filtern Sie nach Ihrem Lieblingsformat.</p>
  </div>
</section>

{% assign dated = site.resources | where_exp: "r", "r.year" | sort: "year" | reverse %}
{% assign undated = site.resources | where_exp: "r", "r.year == nil" %}
{% assign resources = dated | concat: undated %}
{% assign books = site.resources | where: "type", "book" | size %}
{% assign articles = site.resources | where: "type", "article" | size %}
{% assign talks = site.resources | where: "type", "talk" | size %}
{% assign videos = site.resources | where: "type", "video" | size %}

<div class="resource-browser" data-resource-browser>
  <div class="resource-controls" id="resource-controls" tabindex="-1" aria-label="Publikationen filtern">
    <fieldset class="resource-types">
      <legend>Kategorie</legend>
      <div class="resource-types__options">
        <button type="button" class="resource-filter is-active" data-resource-type="all" aria-pressed="true">Alle <span data-type-count="all">{{ site.resources | size }}</span></button>
        <button type="button" class="resource-filter" data-resource-type="book" aria-pressed="false">Bücher <span data-type-count="book">{{ books }}</span></button>
        <button type="button" class="resource-filter" data-resource-type="article" aria-pressed="false">Artikel <span data-type-count="article">{{ articles }}</span></button>
        <button type="button" class="resource-filter" data-resource-type="talk" aria-pressed="false">Vorträge <span data-type-count="talk">{{ talks }}</span></button>
        <button type="button" class="resource-filter" data-resource-type="video" aria-pressed="false">Videos <span data-type-count="video">{{ videos }}</span></button>
      </div>
    </fieldset>

    <div class="resource-controls__secondary">
      <label class="resource-field">
        <span>Sprache</span>
        <select data-resource-language>
          <option value="all">Alle Sprachen</option>
          <option value="de">Deutsch</option>
          <option value="en">Englisch</option>
        </select>
      </label>
      <label class="resource-field resource-field--search">
        <span>Suche</span>
        <input type="search" data-resource-search placeholder="Titel, Autor oder Thema" autocomplete="off">
      </label>
      <button type="button" class="resource-reset" data-resource-reset>Zurücksetzen</button>
    </div>
  </div>

  <div class="resource-summary" aria-live="polite">
    <p><strong data-resource-count>{{ site.resources | size }} Publikationen</strong><span data-resource-context> in allen Kategorien</span></p>
  </div>

  <div class="resource-list" data-resource-list>
    {% for resource in resources %}{% include resource-item.html resource=resource %}
    {% endfor %}
  </div>

  <div class="resource-empty" data-resource-empty hidden>
    <h2>Keine passenden Publikationen</h2>
    <p>Versuchen Sie eine andere Kategorie, Sprache oder einen anderen Suchbegriff.</p>
    <button type="button" class="btn btn--arc42-outline" data-resource-reset>Filter zurücksetzen</button>
  </div>

  <button type="button" class="resource-backtop" data-resource-backtop hidden><span aria-hidden="true">&#8593;</span> Zurück zu den Filtern</button>
</div>

<div class="resource-footnote">
  <p><strong>Noch mehr Aufzeichnungen?</strong> Besuchen Sie den <a href="https://youtube.com/arc42-video" rel="noopener">arc42-YouTube-Kanal</a> oder <a href="https://speakerdeck.com/gernotstarke" rel="noopener">Gernots Speaker-Deck-Profil</a>.</p>
</div>

<script src="/assets/js/resources-filter.js" defer></script>
```

Cross-check against the org original before saving: the `data-*` attributes, class names, and Liquid logic must match it exactly — only human-readable text differs.

- [ ] **Step 2: Build and inspect**

```bash
make site
grep -c 'data-resource data-type' _site/publikationen/index.html
```

Expected: 47.

- [ ] **Step 3: Visual smoke test**

Run `make dev`, open http://localhost:4000/publikationen/ and verify: hero renders, filter buttons show counts (Alle 47 / Bücher 16 / Artikel 15 / Vorträge 10 / Videos 6), clicking "Bücher" filters and sets `?type=book`, language select and search work, reset works. Then stop the server.

- [ ] **Step 4: Commit**

```bash
git add _pages/publikationen.md
git commit -m "Add the German /publikationen/ listing page"
```

---

### Task 7: Author the three de-only gap entries

**Files:**
- Create: `_resources/two-shockingly-recurring-problems.md`, `_resources/requirements-ueberblick.md`, `_resources/sparsame-dokumentation-artikel.md`
- Modify: `articles/2022-11-Requirements-Ueberblick.md` (front matter only)

**Interfaces:**
- Consumes: schema from Task 4/5 (`type`, `title`, `language`, `year`, `summary`, `search`, `link`, `link_label`).
- Produces: total entry count rises 47 → 50 (books 16, articles 17, talks 11, videos 6).

- [ ] **Step 1: The SAG-2022 talk**

First try to resolve the real Speaker Deck URL: WebFetch `https://speakerdeck.com/gernotstarke` and look for a deck titled "Two shockingly recurring problems" (Nov 2022). If found, use its URL as `link`; otherwise fall back to the profile URL as below.

```markdown
---
type: "talk"
title: "Two shockingly recurring problems"
language: "en"
year: 2022
link: "https://speakerdeck.com/gernotstarke"
link_label: "Speaker Deck"
summary: "Peter Hruschka and Gernot Starke on two shockingly recurring problems in software systems — presented at the Software Architecture Gathering, November 2022."
search: "two shockingly recurring problems hruschka starke software architecture gathering sag 2022 requirements architecture"
---
```

- [ ] **Step 2: The requirements-overview article (links to the on-site full text)**

```markdown
---
type: "article"
title: "Behalten Sie den Überblick"
language: "de"
year: 2022
link: "/articles/2022-11-requirements-overview/"
link_label: "Artikel lesen"
summary: "Peter Hruschka und Gernot Starke zeigen, wie Teams mit einem knappen Anforderungs-Überblick den Durchblick über ihre Requirements behalten."
search: "requirements überblick anforderungen requirements-overview hruschka starke"
---
```

Then edit `articles/2022-11-Requirements-Ueberblick.md` front matter: delete the `sidebar:`/`nav: "publications"` lines (the sidebar nav group disappears in Task 8); leave permalink, layout, toc untouched.

- [ ] **Step 3: The INNOQ article (org has only the video of the same name)**

```markdown
---
type: "article"
title: "Sparsame Dokumentation"
language: "de"
year: 2022
link: "https://www.innoq.com/de/articles/2022/09/sparsame-dokumentation/"
link_label: "Bei INNOQ lesen"
summary: "Wie Architekturdokumentation knapp und trotzdem nützlich bleibt — Artikel von Gernot Starke im INNOQ-Blog, September 2022."
search: "sparsame dokumentation arc42 innoq starke architekturdokumentation"
---
```

- [ ] **Step 4: Build and count**

Run: `make site && grep -c 'data-resource data-type' _site/publikationen/index.html`
Expected: 50.

- [ ] **Step 5: Commit**

```bash
git add _resources/ articles/2022-11-Requirements-Ueberblick.md
git commit -m "Add three de-only entries: SAG-2022 talk, Requirements-Überblick, Sparsame Dokumentation (Artikel)"
```

---

### Task 8: Navigation, redirect stubs, deep links, docs

**Files:**
- Modify: `_data/navigation.yml`, `_includes/masthead.html`, `_pages/home.md`, `_pages/overview.md`, `_pages/consulting.md`, `search.json` (if it enumerates pages), `Makefile` (test-theme target re-added), `README.md`, `CLAUDE.md`
- Overwrite as stubs: `_pages/books.md`, `_pages/articles.md`, `_pages/videos.md`, `_pages/talks.md`, `_pages/more.md`
- Delete: `_pages/recommendations.html` (replaced by `_pages/recommendations.md` stub)

**Interfaces:**
- Consumes: `/publikationen/` page (Task 6), `redirect` layout (Task 4).

- [ ] **Step 1: Navigation — one "Publikationen" item**

In `_data/navigation.yml`, replace the whole `publications:` group (parent + 4 children) with:

```yaml
publications:
  - title: Publikationen
    url: /publikationen/
```

The drawer (`_includes/masthead.html`) renders a group section's `url` as a linked `<h2>`; with no `children` it would emit an empty `<ul>`. Wrap that `<ul>...</ul>` in `{%- if section.children -%} ... {%- endif -%}`.

- [ ] **Step 2: Replace the five old pages with redirect stubs**

Overwrite each file's entire content with a stub. Template (books shown; repeat with the listed values):

```markdown
---
permalink: /books/
layout: redirect
redirect_to: /publikationen/?type=book
redirect_label: "Publikationen – Bücher"
sitemap: false
---
```

| File | permalink | redirect_to | redirect_label |
|---|---|---|---|
| `_pages/books.md` | `/books/` | `/publikationen/?type=book` | `Publikationen – Bücher` |
| `_pages/articles.md` | `/articles/` | `/publikationen/?type=article` | `Publikationen – Artikel` |
| `_pages/videos.md` | `/videos/` | `/publikationen/?type=video` | `Publikationen – Videos` |
| `_pages/talks.md` | `/talks/` | `/publikationen/?type=talk` | `Publikationen – Vorträge` |
| `_pages/more.md` | `/more/` | `/publikationen/` | `Publikationen` |
| `_pages/recommendations.md` (new; delete `recommendations.html`) | `/recommendations/` | `/publikationen/?type=book` | `Publikationen – Bücher` |

- [ ] **Step 3: Update internal deep links**

Known link sites (verify each with grep before editing — line numbers may have drifted):
- `_pages/home.md:46` `/articles/#handeln-statt-jammern` → `/publikationen/?type=article`
- `_pages/home.md:48` `/books/#arc42-in-aktion` → `/publikationen/arc42-in-aktion/`
- `_pages/home.md:65` `/more/` (tile "arc42 Lesestoff") → `/publikationen/`
- `_pages/overview.md:303-306`: `#arc42-in-aktion` → `/publikationen/arc42-in-aktion/`; `#arc42-by-example` → `/publikationen/#arc42-by-example-3rd`; `#arc42-by-example-vol2` → `/publikationen/#arc42-by-example-vol2`
- `_pages/consulting.md:42` → whatever it targets (`/books/...` or `/talks/...`), map to the matching `/publikationen/...` form.

Then sweep for stragglers:

```bash
grep -rnE 'href="/(books|articles|videos|talks|more|recommendations)[/#"]|\]\(/(books|articles|videos|talks|more|recommendations)[/#)]' _pages _includes _layouts articles index* 2>/dev/null | grep -v '_pages/(books|articles|videos|talks|more|recommendations)'
```

Fix every remaining reference except the stubs' own permalinks and the untouched `/articles/2022-11-requirements-overview/` links.

- [ ] **Step 4: Make detail pages searchable (site search)**

`search.json` iterates `site.pages`, which excludes collection docs. Add a loop over `site.resources` mirroring the existing page loop (fields: title, url, content/summary). If the JSON template uses `strip_html | strip_newlines`, do the same for resource `summary` + `content`.

- [ ] **Step 5: Re-add an adapted `test-theme` target to the Makefile**

Append the old repo's `test-theme` target (from git history: `git show HEAD~N:Makefile` or the baseline commit) with these adaptations:
- `docker run ... arc42-jekyll` → `docker compose run --rm jekyll` (image is now `arc42-site:latest` via compose).
- In the page-existence checks: keep `_site/articles/index.html` and `_site/videos/index.html` (stubs still emit them), add `test -f _site/publikationen/index.html` and `test -f _site/publikationen/arc42-in-aktion/index.html`.
- Add `publikationen` to the trailing-slash grep alternation lists.
- Drop the `assets/js/main.min.js` existence check only if that file no longer ships; otherwise keep.
- Add `test-theme` to `.PHONY`.

- [ ] **Step 6: Update docs**

- `README.md`: rewrite the local-dev/build section to the new make targets (`make dev`, `make build`, `make site`, `make check-links`, `make test-theme`), the shared-image note ("same image as arc42.org-site: `arc42-site:latest`; keep `Gemfile`/`Gemfile.lock` identical in both repos"), and fix any `_site/...` path examples that changed.
- `CLAUDE.md`: change "(… Jekyll + Markdown, GitHub Pages)" to note the GitHub-Actions build (Jekyll 4.3, same stack as arc42.org-site) and add a short section "Publikationen": entries live in `_resources/*.md` (schema: type/title/language/year/summary/search/cover/link/link_label/id/detail), listing at `/publikationen/`, new entries on arc42.org must be copied here once (and vice versa), anniversary edition intentionally absent.

- [ ] **Step 7: Build check**

Run: `make site`
Expected: clean build; `_site/books/index.html` now contains `http-equiv="refresh"`; `grep -c 'publikationen' _site/sitemap.xml` ≥ 48; `grep -c '/books/' _site/sitemap.xml` = 0 (stubs have `sitemap: false`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Publikationen nav item, redirect stubs for old URLs, deep-link updates, docs"
```

---

### Task 9: Full verification + cross-check

**Files:** none (verification only; fixes as needed).

- [ ] **Step 1: Full build + link check**

```bash
make site
make check-links
```

Expected: html-proofer passes (internal links, images, HTML). Fix anything it flags.

- [ ] **Step 2: test-theme**

Run: `make test-theme` → all assertions pass.

- [ ] **Step 3: Entry cross-check against the old arc42.de content**

Every old .de entry (except the excluded Sonderausgabe/anniversary edition) must be findable in the new collection. Run and require 26/26 hits:

```bash
for t in "Effektive Softwarearchitekturen" "Patterns kompakt" "Software Architecture Foundation" "arc42 by Example, 3rd" "arc42 by Example, Volume 2" "Basiswissen Softwarearchitektur" "Requirements-Skills" "Software Reviews" "Zertifizierung" "Packt" "Business Analysis" "arc42-Primer" "arc42 by Example, 2nd" "IT-Knigge" "arc42 in Aktion" \
  "Behalten Sie den Überblick" "Sparsame Dokumentation" "Principles of technical documentation" "Handeln statt jammern" "Quality-Driven Software Architecture" "What's in a Name" "Software Architecture Foundation Curriculum" "Zehnkämpfer" \
  "Diagramm des Grauens" "Kontextabgrenzung" "Two shockingly recurring problems"; do
  grep -rliF "$t" _resources/ >/dev/null && echo "OK  $t" || echo "FAIL $t"
done
```

(Old videos "Qualität…", "Explain your architecture", "Sparsame Dokumentation mit arc42" and old talks "Im Stich gelassen", "Art of Software Reviews", "How to explain", "Rise/Ruin/Rescue", "Hände waschen", "Hitchhikers Guide" are known-covered by org copies — spot-check any two.)

- [ ] **Step 4: Manual browse**

`make dev` → check `/publikationen/` (filters, search, language), one detail page (`/publikationen/arc42-in-aktion/`), one redirect (`/books/` → lands filtered on Bücher), the drawer menu ("Publikationen" as single linked item), and the home page tiles. Stop the server.

- [ ] **Step 5: Final commit (if fixes were made) — do NOT push**

Leave pushing and the PR to the user; remind them of the manual Pages-settings flip (Task 3) that must accompany the merge.
