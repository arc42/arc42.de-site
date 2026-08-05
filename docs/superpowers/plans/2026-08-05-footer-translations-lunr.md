# arc42.de Footer Parity, German Summaries, Lunr Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the arc42.de footer identical to arc42.org's (plain-text links, monochrome INNOQ logo, no FontAwesome), give all German-language publication entries German summaries/labels/detail bodies, and replace Simple-Jekyll-Search with an incremental lunr.js site search reachable via Ctrl/Cmd-Enter from the Publikationen filter box.

**Architecture:** Footer: copy arc42.org's `_includes/footer.html` structure + its CSS rules + monochrome SVG, German labels. Translations: pure content edits in `_resources/*.md`, exact strings specified below. Search: `/search/` page rebuilt on the vendored `assets/js/lunr/lunr.min.js`, indexing the existing `/search.json`, incremental with prefix matching; the Publikationen search box gets a Ctrl/Cmd-Enter handler jumping to `/search/?q=…`.

**Tech Stack:** Jekyll 4.3 (Docker `arc42-site:latest`, `make site` / `make test-theme` / `make check-links`), vanilla JS, lunr.js 2.x (vendored).

## Global Constraints

- `/Users/gernotstarke/projects/arc42/arc42.org-site` is **read-only reference. Never modify it.**
- Work in `/Users/gernotstarke/projects/arc42/arc42.de-site` on the existing branch `new-publication-approach`.
- German UI text throughout; entry **titles** and **`search:` keyword lines stay unchanged** (bilingual keywords help search).
- The Publikationen filter mechanism's `data-*` attributes, class names, and `?type=` values stay unchanged.
- No new external dependencies: lunr comes from the already-vendored `assets/js/lunr/lunr.min.js`.
- FontAwesome (`all.css`) stays imported for now (≈14 theme includes still use it); the footer itself must contain NO `<i class="fa…">` elements.
- Every task ends with `make site` building clean and a commit.

---

### Task 1: Footer identical to arc42.org

**Files:**
- Overwrite: `_includes/footer.html`
- Create: `images/supported-by-innoq.svg` (copied from arc42.org-site)
- Modify: `assets/css/arc42-de.css` (append footer rules)
- Delete: `images/supported-by-innoq--petrol-apricot.svg` (if unreferenced after the change)

**Interfaces:**
- Produces: footer markup using classes `.footer-center`, `.footer-innoq`, `.supported-by-innoq`, `.footer-links`, `.copyright-size` — styled by rules copied from `arc42.org-site/assets/css/arc42-org.css`.

- [ ] **Step 1: Verify link targets exist**

Run: `grep -rn 'permalink:' _pages/ | grep -E '/(about|contact|license|imprint)/'`
Expected: all four permalinks exist (the files may be .md or .html). If `/license/` or any other target is missing, find the correct permalink (`grep -rn 'permalink' _pages/ | grep -i <name>`) and use that.

- [ ] **Step 2: Write the new footer**

Replace the entire content of `_includes/footer.html` with the arc42.org structure, German labels:

```html
<div class="page__footer-follow footer-center">
  <p class="footer-innoq">
    <a href="https://www.innoq.com" target="_blank" rel="noopener noreferrer nofollow"><img class="supported-by-innoq" src="/images/supported-by-innoq.svg" alt="Supported by INNOQ"></a>
  </p>

  {%- comment -%} Plain text links with dot separators (styled in
      arc42-de.css, rules copied from arc42.org). No FontAwesome icons:
      the labels carry the meaning; the icons only added noise at this
      size. {%- endcomment -%}
  <ul class="footer-links">
    <li><a href="{{ '/about/' | relative_url }}">Über arc42</a></li>
    <li><a href="{{ '/contact/' | relative_url }}">Kontakt</a></li>
    <li><a href="{{ '/license/' | relative_url }}">Lizenz</a></li>
    <li><a href="{{ '/imprint/' | relative_url }}">Impressum &amp; Datenschutz</a></li>
    <li><a href="https://github.com/arc42">GitHub</a></li>
  </ul>
</div>

<div class="page__footer-copyright footer-center copyright-size">
  &copy; {{ site.time | date: '%Y' }} Dr. Peter Hruschka und Dr. Gernot Starke. <br class="mobile">
  Unterstützt von <a href="https://kroener-starke.ch/">Kröner &amp; Starke</a>.
</div>
```

(Adjust the `/license/` href in line with Step 1's findings if needed. Dropped per user decision: LinkedIn, YouTube, Dev, No-Cookies, Status.)

- [ ] **Step 3: Copy the monochrome logo and the CSS**

```bash
cp ../arc42.org-site/images/supported-by-innoq.svg images/
```

From `../arc42.org-site/assets/css/arc42-org.css` copy into `assets/css/arc42-de.css` (append, with a source comment): the `.footer-center` rule (~line 123), `.footer-innoq` (~line 131), `.supported-by-innoq` sizing rule (search for the class name), and the whole `.footer-links` block (~lines 1563–1600: `.footer-links`, `.page__footer-follow .footer-links li`, `.page__footer-follow .footer-links li + li::before`, `.footer-links a` and its hover/focus rules). First check which of these classes arc42-de.css already styles (`grep -n 'footer-center\|copyright-size\|footer-innoq\|supported-by-innoq\|footer-links' assets/css/arc42-de.css` and the `_sass` theme) — copy only what's missing, and remove/override de rules that conflict (e.g. old `.social-icons` sizing for the colored logo). If `.social-icons` styling is now unused elsewhere, leave the theme's rules alone (theme file) but remove any arc42-de.css-local `.social-icons` additions.

- [ ] **Step 4: Delete the colored logo if orphaned**

Run: `grep -rn 'petrol-apricot' --exclude-dir=_site --exclude-dir=.git .` — if only the old footer referenced it, delete `images/supported-by-innoq--petrol-apricot.svg`.

- [ ] **Step 5: Build and verify**

```bash
make site
grep -c 'fa-' _site/index.html            # footer contributes 0; other includes may still emit fa- classes elsewhere on the page — so instead:
grep -A3 'page__footer-follow' _site/index.html | grep -c '<i class'   # expected: 0
grep -c 'supported-by-innoq.svg' _site/index.html                      # expected: ≥1 (monochrome, no --petrol-apricot)
grep -c 'linkedin\|youtube\|dev.to\|No-Cookies\|status.arc42.org' _site/index.html  # footer area: expected 0 hits from the footer (verify matches, if any, come from page content not footer)
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Footer identical to arc42.org: plain links, monochrome INNOQ logo, no FontAwesome"
```

---

### Task 2: German summaries and link labels for German-language entries

**Files:**
- Modify: 28 files in `_resources/` (summaries) plus `link_label` values in all `language: "de"` entries.

- [ ] **Step 1: Apply the 28 summary replacements**

Replace ONLY the `summary:` line value in each file (keep quoting style). Exact strings:

| File | New `summary` |
|---|---|
| `arc42-in-aktion.md` | `Das fehlende Handbuch zu arc42: pragmatische Praxistipps für nützliche, wirtschaftliche und wartbare Architekturdokumentation, von Gernot Starke und Peter Hruschka.` |
| `arc42-primer.md` | `Eine kompakte Einführung, die mit Dokumentations-Mythen aufräumt und zeigt, wie wartbare Architekturdokumentation auch unter Zeitdruck gelingt.` |
| `business-analysis-requirements-engineering.md` | `Peter Hruschka zeigt, wie Product Owner, Business-Analysten und Requirements Engineers Produkte und Prozesse nachhaltig verbessern.` |
| `code-wird-billig.md` | `Wenn GenAI Code zur billigen Massenware macht, wird das Denken im Gesamtsystem zur wertvollsten Währung. Ein Appell an die Zunft: Entkopplung, transparente Trade-offs und ganzheitlicher Entwurf sind die Fähigkeiten, die uns KI nicht abnimmt.` |
| `architekten-zehnkaempfer.md` | `Warum Softwarearchitekten mehr als Technologiewissen brauchen, um Stakeholder zu verbinden und verantwortungsvoll zu entscheiden.` |
| `cognitive-biases.md` | `Warum gute Architekten schlechte Entscheidungen treffen: wie Confirmation Bias, Optimismus-Verzerrung und Sunk-Cost-Falle Technologiewahl, Schätzungen und Migrationen unbemerkt lenken — und praktische Gegenmittel wie Pre-Mortems und strukturierte Entscheidungsformate.` |
| `basiswissen-softwarearchitektur.md` | `Grundlagenwissen der Softwarearchitektur, überarbeitet für den iSAQB-CPSA-Foundation-Lehrplan 2025, jetzt mit eigenen Kapiteln zu Anforderungen und zu Daten.` |
| `effektive-softwarearchitekturen.md` | `Das deutschsprachige Standardwerk für praktizierende Softwarearchitekten, überarbeitet nach dem aktuellen iSAQB-Lehrplan, jetzt mit C4, Cloud und Data Contracts.` |
| `business-model-canvas.md` | `Wie der Business Model Canvas ein komplettes Geschäftsmodell auf eine Seite bringt — und warum dieser Blick für Architektur- und Strategiearbeit zählt.` |
| `bessere-anforderungen.md` | `Garbage in, garbage out gilt auch für Software. Gute Anforderungsarbeit gehört zur Architektur und lässt sich nicht auslagern. Von der Vision zu messbaren Anforderungen an einem echten Hyrox-Beispiel, eingeordnet im Twin-Peaks-Modell von Anforderungen und Architektur.` |
| `handeln-statt-jammern.md` | `Wie Entwicklungsteams konstruktiv reagieren, wenn wichtige Anforderungen zu spät kommen oder implizit bleiben.` |
| `diaet-architekturdokumentation.md` | `Architekturdokumentation hat ein Gewichtsproblem: zu viele Seiten, zu wenig Substanz. Wie arc42 Dokumentation aufs Wesentliche reduziert — von der 17-Seiten-Minimaldoku bis zum 4000-Personentage-Projekt, dazu der arc42-Canvas und ein Blick auf agentische Workflows.` |
| `hitchhikers-guide-architecture-documentation.md` | `Gernot Starke und Ralf D. Müller zeigen typische Diagramm-Fehler — und was stattdessen hilft.` |
| `canvas-101.md` | `Ein kostenloser INNOQ-Primer mit sieben praktischen One-Pagern (Canvases) für IT-Projekte, von Geschäftsmodellen über Architektur bis zur Teamarbeit.` |
| `kleine-geschichte-zu-qualitaet.md` | `Eine kurze Parabel darüber, warum Qualitätsanforderungen präzise verstanden sein müssen, bevor die richtige Lösung entstehen kann.` |
| `it-knigge-3.md` | `Eine kritisch-praktische Sammlung zu bimodaler IT, Industrie 4.0 und besserer Softwarequalität.` |
| `diagramm-des-grauens.md` | `Gernot Starke zeigt, woran Architekturdiagramme scheitern und was sie wirklich nützlich macht.` |
| `pixie-und-der-sumpf.md` | `Ein praxisnaher Streifzug durchs Bare-Metal-Provisioning: Firmware, DHCP und PXE-Netzwerk-Boot, um ein Betriebssystem von Grund auf zu installieren.` |
| `kontextabgrenzung.md` | `Eine knappe Einführung in den Systemkontext, eine der wichtigsten Sichten der Softwarearchitektur.` |
| `qualitaet-problematischer-begriff.md` | `Warum Qualitätsanforderungen konkreter sein müssen, als Alltagsdefinitionen von Qualität nahelegen.` |
| `requirements-skills.md` | `Pragmatische Methoden, mit denen Entwicklungsteams unvollständige oder unklare Anforderungen verbessern — auch Grundlage des iSAQB-Moduls Req4Arc.` |
| `software-reviews.md` | `Praktische Wege, Probleme in Software aufzudecken und gezielte Verbesserungen abzuleiten — aus langjähriger Review-Erfahrung.` |
| `haende-waschen-zaehne-putzen.md` | `Gernot Starke erinnert an Software-Engineering-Grundlagen wie Modularität, Komplexität, KISS und Kopplung.` |
| `swa-kompakt-mikroskop-falle.md` | `Die Mikroskop-Falle: Warum zu früher Zoom ins technische Detail den architektonischen Überblick verstellt.` |
| `im-stich-gelassen.md` | `Daniel Lauxtermann und Gernot Starke erklären, warum Softwareteams aktiv an besseren Anforderungen arbeiten sollten.` |
| `zertifizierung-3.md` | `Eine kompakte Einführung in den iSAQB-CPSA-Foundation-Lehrplan, die Prüfungsthemen und den Zertifizierungsprozess.` |
| `sparsame-dokumentation.md` | `Ein praktischer Blick auf das nützliche Minimum an Architekturdokumentation, erklärt an Beispielen.` |
| `patterns-kompakt.md` | `Der kompakte Katalog der wichtigsten Entwurfsmuster für Entwickler und Architekten, geordnet nach Anliegen, von Karl Eilebrecht und Gernot Starke.` |

(`requirements-ueberblick.md` and `sparsame-dokumentation-artikel.md` are already German — leave them.)

- [ ] **Step 2: Translate `link_label` values of `language: "de"` entries**

List them: `grep -l 'language: "de"' _resources/*.md | xargs grep -H 'link_label'`. Translate each to idiomatic German, e.g.: `At Carl Hanser Verlag` → `Beim Carl Hanser Verlag`, `Buy at Hanser` → `Beim Hanser Verlag kaufen`, `Visit book site` → `Zur Buch-Website`, `Download the free primer` → `Primer kostenlos laden`, `View on Leanpub` → `Bei Leanpub ansehen`, `Watch on YouTube` → `Auf YouTube ansehen`, `Read at INNOQ` → `Bei INNOQ lesen`, `Download PDF` → `PDF laden`, `Open` → drop the field (German default is `Öffnen`). Keep `en`-language entries untouched. Document the full mapping you applied in your report.

- [ ] **Step 3: Build, spot-check, commit**

```bash
make site
grep -c 'Das fehlende Handbuch zu arc42' _site/publikationen/index.html   # expected 1
grep -c 'The missing manual' _site/publikationen/index.html               # expected 0
git add _resources && git commit -m "German summaries and link labels for German-language entries"
```

---

### Task 3: German detail-page bodies (5 books)

**Files:**
- Modify: `_resources/arc42-in-aktion.md`, `_resources/basiswissen-softwarearchitektur.md`, `_resources/canvas-101.md`, `_resources/effektive-softwarearchitekturen.md`, `_resources/patterns-kompakt.md` — body only (below the closing `---`), front matter untouched (except nothing).

- [ ] **Step 1: Replace the five bodies with these exact texts**

`arc42-in-aktion.md` body:

```markdown
*arc42 in Aktion* ist das fehlende Handbuch zu arc42 — das Buch, das wir vermutlich
schon vor Jahren hätten schreiben sollen. Es versammelt pragmatische Praxistipps für
Architekturdokumentation: von den allgemeinen Grundlagen guter technischer
Dokumentation bis zu konkreten Hinweisen für jeden Teil von arc42.

## Was drinsteckt

- Praktische Anleitung für Dokumentation, die nützlich, wirtschaftlich und wartbar
  ist — statt Dokumentation um ihrer selbst willen.
- Durchgängige Beispiele, darunter ein umfangreiches zweites Beispiel aus der Welt
  der **Realtime- und Embedded-Systeme**.
- Erweiterte Behandlung von Werkzeugen, verfeinerte Tipps und insgesamt eine
  aufgeräumtere, vollständigere Darstellung gegenüber früheren Auflagen.

## Für wen

Für alle, die arc42 in der Praxis einsetzen und weniger schreiben, mehr kommunizieren
und ihre Architekturdokumentation dauerhaft wartbar halten wollen.

<div class="resource-detail__facts" markdown="1">
**Autoren** Gernot Starke, Peter Hruschka &middot; **Verlag** Carl Hanser Verlag
</div>
```

`basiswissen-softwarearchitektur.md` body:

```markdown
*Basiswissen Softwarearchitektur* vermittelt Grundlagenwissen zu Konzepten und Praxis
der Softwarearchitektur: die wesentlichen Begriffe, die zentralen Techniken und
Methoden, um Architekturen zu entwerfen und zu entwickeln, sie zu beschreiben und zu
kommunizieren sowie ihre Qualität zu sichern. Ebenso behandelt es Rolle und Aufgaben
von Softwarearchitekten sowie Kategorien und Entscheidungskriterien für die Auswahl
konkreter Werkzeuge.

## Neu in der 6. Auflage

Die sechste, überarbeitete und aktualisierte Auflage ergänzt ein eigenes Kapitel zu
**Anforderungen und Randbedingungen** und behandelt nun auch **Daten und
Datenmodelle**. Sie folgt der Version 2025 des Lehrplans *Certified Professional for
Software Architecture, Foundation Level* (CPSA-F) des iSAQB.

## Für wen

Entwickler und Architekten, die ein solides, lehrplan-konformes Fundament aufbauen —
und alle, die sich auf die iSAQB-CPSA-Foundation-Zertifizierung vorbereiten.

<div class="resource-detail__facts" markdown="1">
**Autoren** Gharbi, Koschel, Rausch, Starke &middot; **Verlag** dpunkt.verlag
&middot; **Auflage** 6. Auflage, 2025 &middot; **Lehrplan** iSAQB CPSA-F 2025
</div>
```

`canvas-101.md` body:

```markdown
Ein Canvas bringt ein komplexes Thema auf eine einzige strukturierte Seite:
Geschäftsmodelle, Anwendungsfälle, Anforderungen, Architekturen, Betriebsaspekte,
Teamarbeit. Dieser kostenlose INNOQ-Primer (Februar 2025) stellt sieben One-Pager
vor, die sich in anspruchsvollen IT-Projekten bewährt haben — mit knapper Anleitung,
wann und wie jeder einzusetzen ist.

## Die sieben Canvases

- **Business Model Canvas** — der Klassiker für Geschäftsmodelle.
- **Architecture Inception Canvas** — der Startpunkt für IT-Projekte, von den
  Anforderungen bis zu ersten Lösungsideen.
- **Architecture Communication Canvas** — kompakte Architekturdokumentation auf
  Basis von [arc42](/canvas/).
- **Software Analytics Canvas** — strukturierte, datengetriebene Analyse von
  Softwaresystemen.
- **Tech Stack Canvas** — technische Basis und Werkzeugwahl auf einen Blick.
- **Team Communication Canvas** — Struktur für erfolgreiche Zusammenarbeit.

## Autorinnen und Autoren

Entstanden gemeinsam mit INNOQ-Kolleginnen und -Kollegen: Gernot Starke, Jörg Müller,
Benjamin Wolf, Aminata Sidibe, Markus Harrer, Lena Kraaz, Anja Kammer, Patrick Roos
und Gil Breth.

<div class="resource-detail__facts" markdown="1">
**Verlag** INNOQ Primer &middot; **Erschienen** Februar 2025 &middot; **Preis**
kostenlos (PDF) &middot; **Mehr** <a href="https://www.innoq.com/de/topics/primer/" rel="noopener">innoq.com/de/topics/primer</a>
</div>
```

`effektive-softwarearchitekturen.md` body:

```markdown
Seit mehr als zwanzig Jahren ist *Effektive Softwarearchitekturen* ein
deutschsprachiges Standardwerk für praktizierende Softwarearchitekten. Die zehnte
Auflage ist gründlich überarbeitet und am aktuellen iSAQB-CPSA-Foundation-Lehrplan
ausgerichtet. Ein praktischer, methodenorientierter Leitfaden, eng an der Art, wie
arc42 Architekturarbeit strukturiert: vom Klären der Anforderungen über den Entwurf
von Strukturen und Querschnittskonzepten bis zum Kommunizieren, Bewerten und
systematischen Verbessern eines Systems.

## Neu in der 10. Auflage

- **C4-Modell** als Notation neben UML zur Beschreibung von Strukturen.
- **Cloud-Computing** und seine architektonischen Konsequenzen.
- **Data Contracts**, um Datenabhängigkeiten explizit und stabil zu halten.
- Aktualisierte Beispiele, Checklisten und Fragen zur iSAQB-Foundation-Prüfung.

## Inhalt

- Die Grundlagen: lose Kopplung, hohe Kohäsion, Trennung von Verantwortlichkeiten,
  Modularisierung, Abstraktion und Kapselung.
- Architekturmuster wie Schichten, Microservices und ereignisgetriebene Systeme.
- Qualitätsgetriebener Entwurf, Persistenz, Sicherheit, Skalierbarkeit und Evolution.
- Durchgearbeitete Fallstudien aus realen Projekten.

## Für wen

Entwickler auf dem Weg in Architekturrollen, erfahrene Architekten, die eine
systematische Referenz suchen — und alle, die sich auf die
iSAQB-CPSA-Foundation-Prüfung vorbereiten.

<div class="resource-detail__facts" markdown="1">
**Verlag** Carl Hanser Verlag &middot; **ISBN** 978-3-446-47672-1 &middot;
**Seiten** 372 &middot; **Erschienen** August 2024 &middot; **Preis** € 49,99
</div>

Die Begleitseite [esabuch.de](https://www.esabuch.de/) bietet das vollständige
Inhaltsverzeichnis und weiteres Material.
```

`patterns-kompakt.md` body:

```markdown
*Patterns kompakt* ist ein knapper, praxisnaher Katalog der Entwurfsmuster, die im
Entwickleralltag wirklich zählen. Statt die volle Theorie zu wiederholen, verdichtet
es jedes Muster auf den Kern: das Problem, die Idee, und wann man dazu greift. Die
Muster sind nach den Anliegen gruppiert, denen Entwickler tatsächlich begegnen — von
Basismustern über Präsentation, Kommunikation und Verteilung bis zu Integration und
Persistenz.

Die sechste Auflage (Springer Vieweg, 2024) hält den Katalog aktuell und nah am Code
— ein handliches Nachschlagewerk für Entwickler wie Architekten.

## Über den Autor

Das Buch ist in erster Linie das Werk von **Karl Eilebrecht**, dem Hauptautor aller
Auflagen, mit Gernot Starke als Co-Autor. Karl ist Softwareentwickler und Architekt —
seine praktische, implementierungsnahe Perspektive hält *Patterns kompakt* pragmatisch
statt akademisch: Muster zum Anwenden, erklärt so, wie ein Entwickler sie braucht.

Die [Begleitseite](https://patterns-kompakt.de/) bietet die vollständige Musterliste
und weiteres Material.
```

- [ ] **Step 2: Build, verify, commit**

```bash
make site
grep -c 'Was drinsteckt' _site/publikationen/arc42-in-aktion/index.html   # expected 1
grep -c "What's inside" _site/publikationen/arc42-in-aktion/index.html    # expected 0
git add _resources && git commit -m "German detail-page bodies for the five German books"
```

---

### Task 4: Lunr.js incremental site search on /search/

**Files:**
- Rewrite: `_pages/search.html`
- Create: `assets/js/arc42-search.js`
- Delete: `search-script.js` (Simple-Jekyll-Search — after verifying no other consumer: `grep -rn 'search-script' --exclude-dir=_site --exclude-dir=.git .`)
- Keep: `search.json` (the index source), `assets/js/lunr/lunr.min.js` (verify it is the raw lunr library without Jekyll front matter; the other `lunr-*.js` files there are theme leftovers — leave them untouched)

**Interfaces:**
- Produces: `/search/` reads `?q=` on load, incremental search while typing; consumed by the masthead form (already submits `/search/?q=…`) and by Task 5's Ctrl/Cmd-Enter jump.

- [ ] **Step 1: Write `assets/js/arc42-search.js`**

Vanilla IIFE, no dependencies besides `window.lunr`:
- Fetch `/search.json` (respect `relative_url` — pass the URL in via a `data-` attribute on the container or an inline var).
- Build the index once: `lunr(function () { this.ref('url'); this.field('title', {boost: 10}); this.field('content'); docs.forEach(...) })`. Skip entries without `title`.
- Incremental: `input` listener with ~150 ms debounce. Query strategy: split the raw query into tokens, search with `index.query(...)` adding each token as both exact and trailing-wildcard clause (`lunr.Query.wildcard.TRAILING`) so prefixes match while typing (works acceptably for German and English without language stemmers).
- Render ALL matches (no artificial limit — this page IS the all-results page): `<li><a href="{url}">{title}</a><p class="search-excerpt">…</p></li>` with a ~30-word excerpt from `content` centered on the first matched token (fall back to the first 30 words), matched tokens wrapped in `<mark>`. Escape all HTML from the JSON before inserting.
- Show a live count line ("N Treffer") and "Keine Ergebnisse!" when empty; clear results when the field is emptied.
- On load: read `?q=` (URLSearchParams), fill the input, run the search, focus the input. Keep the query in the URL while typing via `history.replaceState` (`?q=…`) so results are shareable/bookmarkable.

- [ ] **Step 2: Rewrite `_pages/search.html`**

Keep front matter (`layout: single`, `permalink: /search/`), German heading/labels ("Suche", placeholder "Suchbegriff…", visually-hidden label). Structure: input `#search-input`, count `#search-count` (aria-live="polite"), results `<ul id="results-container">`. Load `{{ '/assets/js/lunr/lunr.min.js' | relative_url }}` then `{{ '/assets/js/arc42-search.js' | relative_url }}` (both with `defer`; init on DOMContentLoaded). Include a `<noscript>` note that the search needs JavaScript. Keep the existing comment-documented pitfall in mind: script srcs MUST be root-relative.

- [ ] **Step 3: Verify + commit**

```bash
make site
node --check assets/js/arc42-search.js
grep -c 'lunr.min.js' _site/search/index.html      # expected 1
grep -rn 'search-script' _site/search/index.html   # expected: no hits
python3 -c "import json;d=json.load(open('_site/search.json'));print(len(d),'entries');print(sum(1 for e in d if e.get('title')),'with title')"
git add -A && git commit -m "Replace Simple-Jekyll-Search with incremental lunr.js search"
```

Static checks only here; interactive verification happens in Task 6.

---

### Task 5: Ctrl/Cmd-Enter from the Publikationen filter box to /search/

**Files:**
- Modify: `assets/js/resources-filter.js`, `_pages/publikationen.md` (title-attribute hint only)

- [ ] **Step 1: Add the keydown handler**

In `resources-filter.js`, on the existing search input (`data-resource-search`): a `keydown` listener — when `(event.metaKey || event.ctrlKey) && event.key === "Enter"` and the trimmed value is non-empty, `event.preventDefault()` and navigate to `"/search/?q=" + encodeURIComponent(value)`. Nothing else changes; plain Enter keeps its current behavior.

- [ ] **Step 2: Discoverability hint**

In `_pages/publikationen.md`, add to the search `<input>`: `title="Strg/Cmd + Enter: gesamte Website durchsuchen"`. No other markup changes.

- [ ] **Step 3: Verify + commit**

```bash
node --check assets/js/resources-filter.js
make site && grep -c 'gesamte Website durchsuchen' _site/publikationen/index.html   # expected 1
git add -A && git commit -m "Ctrl/Cmd-Enter in the Publikationen search jumps to the site-wide /search/"
```

---

### Task 6: Verification + docs

**Files:**
- Modify: `CLAUDE.md` (translation contract note)

- [ ] **Step 1: Full checks**

```bash
make site && make check-links && make test-theme
```
All exit 0. Fix minimal causes if not (never weaken assertions).

- [ ] **Step 2: Interactive smoke test (headless)**

Start `make dev` in the background; then with curl verify `/search/` serves lunr.min.js and arc42-search.js with HTTP 200, and `/publikationen/` serves the updated filter JS. If a browser automation tool is available, additionally: type "dokumentation" on /search/ → results appear incrementally; /publikationen/ search + Ctrl-Enter → lands on /search/?q=…. Otherwise document that the interactive check is left to the human. Stop the server afterwards.

- [ ] **Step 3: Update CLAUDE.md**

In the "Publikationen" section, amend the duplication contract: summaries, `link_label`s and detail bodies of `language: "de"` entries are **German here** and deliberately diverge from arc42.org's English text; when copying a new entry from arc42.org, translate `summary`/`link_label` (and the body, if `detail: true` and the work is German). Note that `/search/` uses lunr.js (`assets/js/arc42-search.js` + `search.json`); `search-script.js` is gone.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Docs: German-content contract for de entries; lunr search note"
```
