# CLAUDE.md

Notizen für Claude / Agenten zu diesem Repo (arc42.de-site, Jekyll + Markdown).

Gebaut wird **nicht** mit dem GitHub-Pages-Gem-Set, sondern per GitHub Actions mit den
eigenen Gems dieses Repos: Jekyll 4.3, identischer Stack und identisches Docker-Image
(`arc42-site:latest`) wie in `arc42.org-site`. `Gemfile`/`Gemfile.lock` in beiden Repos
gleich halten. Lokal: `make dev` (Server), `make site` (Build), `make check-links`
(html-proofer), `make test-theme` (Struktur-Assertions auf `_site`).

## Publikationen

Bücher, Artikel, Vorträge und Videos liegen als je eine Datei in `_resources/*.md`
(Collection `resources`, `permalink: /publikationen/:name/`). Front-Matter-Schema:

| Feld | Bedeutung |
|---|---|
| `type` | `book` \| `article` \| `talk` \| `video` (Pflicht, steuert Filter + Label) |
| `title` | Anzeigetitel (Pflicht) |
| `language` | `de` \| `en` (Pflicht, steuert den Sprachfilter) |
| `year` | Jahr; Einträge ohne Jahr sortieren ans Ende |
| `summary` | Einzeiler auf der Karte (Pflicht) |
| `search` | zusätzliche Suchbegriffe für den Filter |
| `cover` | Thumbnail-Pfad; ohne Cover wird ein Buchstaben-Marker gezeichnet |
| `link` | Ziel-URL (extern oder site-lokal); weglassen für Einträge ohne Link |
| `link_label` | Text des CTA-Links |
| `course` | optionale Kurs-Id aus `_data/trainings.json` (`msa`, `improve`, `req4arc`, `adoc`); erzeugt auf der Karte eine zweite Zeile „Zum Kurs: … →" nach `/info-<id>/`. Weglassen heißt: keine Kurszeile. Die URL wird aus der Id gebildet — **nie** aus `course.url`, das eine absolute `https://www.arc42.de/…`-Adresse enthält und `make test-theme` scheitern lässt |
| `id` | **wirkungslos** — der Anker jeder Karte ist immer der Dateiname ohne `.md`, also `/publikationen/#arc42-by-example-vol2`. Jekyll überschreibt ein Front-Matter-`id` mit der internen Dokument-Id; das Feld existiert nur noch für Byte-Gleichheit mit arc42.org |
| `detail` | `true` ⇒ der Body der Datei wird als eigene Detailseite gerendert |

Die Liste rendert `_pages/publikationen.md` (Karten via `_includes/resource-item.html`,
Filter via `assets/js/resources-filter.js`, Deep-Links der Form
`/publikationen/?type=book`). Die alten Seiten `/books/`, `/articles/`, `/videos/`,
`/talks/`, `/more/`, `/recommendations/` sind nur noch Redirect-Stubs
(`layout: redirect`, `sitemap: false`) — dort **keinen Inhalt** mehr einpflegen.

Der Bestand ist bewusst **dupliziert**, nicht synchronisiert: ein neuer Eintrag auf
arc42.org muss einmal nach `_resources/` hierher kopiert werden (und umgekehrt).
Die Jubiläums-Ausgabe von *arc42 by Example* (auf arc42.org
`_resources/arc42-by-example-anniversary.md`) fehlt hier **absichtlich** — nicht
übersehen, also bitte nicht „nachtragen". Das Feld `course:` existiert nur hier und
propagiert **nicht** nach arc42.org.

Bei `language: "de"`-Einträgen sind `summary`, `link_label` und (falls `detail: true`)
der Detailseiten-Body hier **deutschsprachig** und weichen bewusst vom englischen
Text auf arc42.org ab — das ist kein Sync-Fehler. Beim Kopieren eines neuen Eintrags
von arc42.org hierher also `summary`/`link_label` übersetzen (und den Body, wenn
`detail: true` gesetzt ist und es sich um ein deutschsprachiges Werk handelt).

## Suche (`/search/`)

`/search/` nutzt lunr.js (`assets/js/arc42-search.js` gegen den generierten Index
`search.json`); das frühere `search-script.js` (Simple-Jekyll-Search) ist entfernt.
Mehrwort-Anfragen sind **AND**-verknüpft (nicht OR) — alle Terme müssen matchen.

Der Diakritik-Folding-Helper (`toLocaleLowerCase().normalize("NFD")`, gefolgt von
`.replace()` der kombinierenden Unicode-Akzentzeichen — Bereich `U+0300`-`U+036F`,
z. B. "über" → "uber") ist **dreifach dupliziert**: als `fold()` in
`assets/js/arc42-search.js`, als `normalize()` in `assets/js/resources-filter.js`
(Publikationen-Filter) und als `fold()` in `assets/js/arc42-autocomplete.js`
(Masthead-Autocomplete). Alle drei Stellen bei Änderungen **gemeinsam** anpassen.

## Masthead-Autocomplete

Das Suchfeld im Masthead (`_includes/masthead.html`) ist eine ARIA-Combobox:
`assets/js/arc42-autocomplete.js` blendet unter dem Feld ein Vorschlags-Panel ein und
belegt **⌘K / Strg-K**. Der Index dafür ist `search-lookup.json` (Repo-Root, Liquid),
**nicht** `search.json`: er enthält nur Titel, Typ, URL und Suchbegriffe, kein
Body-Text, und wird mit einem deterministischen Prefix-/Substring-Scorer bewertet —
lunr scheidet aus, weil dessen Stemmer Prefix-Anfragen beim Tippen ins Leere laufen
lässt. `/search/` bleibt bei lunr. Ergebnisse werden nach Typ gruppiert
(Seiten · Bücher · Artikel · Vorträge · Videos), max. 4 pro Gruppe, 12 insgesamt.

Die **"/"-Taste gehört weiterhin `arc42-nav.js`** — das Autocomplete registriert dafür
bewusst *keinen* zweiten Handler. Ohne JavaScript bleibt das Panel `hidden` und das
Formular submitted wie bisher nach `/search/?q=…`.

**Enter** öffnet die aktuell markierte Zeile des Panels (die erste per Default,
sobald Treffer da sind). **⌘/Strg/Shift-Enter** überspringt das Panel und springt
immer nach `/search/?q=…`. Der Publikationen-Filter kennt dieselbe Abkürzung, dort
aber nur mit ⌘/Strg — Shift-Enter gibt es ausschließlich im Autocomplete.

`search-lookup.json` schließt dieselben Seiten aus wie `search.json` (404, die beiden
Formular-Stubs), zusätzlich alle `layout: redirect`-Stubs (darunter `/status/`, das
extern nach `https://status.arc42.org/` weiterleitet — der Footer verlinkt dorthin)
und `/info-msa-EN/`
(titelgleich mit `/info-msa/`, dazu die Begründung in der Datei). Der Anker für
Publikationen ohne Detailseite ist — wie überall sonst — der Dateiname, nicht `id`.

## Kurse / Termine verwalten

Kursdaten leben **nicht mehr** in diesem Repo. Single Source of Truth ist
`trainings.arc42.org-site/_data/trainings.yml`. Von dort wird `_data/trainings.json`
hier im Repo per `.github/workflows/refresh-trainings.yml` synchronisiert (wöchentlich
Montag 04:17 UTC, per `repository_dispatch` vom trainings-Repo, oder manuell via
`workflow_dispatch`). **`_data/trainings.json` niemals von Hand editieren** — jede
Änderung wird beim nächsten Sync überschrieben. Um ein Datum zu ändern, hinzuzufügen
oder zu entfernen: PR gegen `trainings.arc42.org-site/_data/trainings.yml`.

Rendering-Kette (Jekyll-Includes):
`_pages/termine.md` → `_includes/timeline_auto.html` (liest `site.data.trainings.courses`,
filtert `status: cancelled` und vergangene Termine (`end < today`) heraus, sortiert
chronologisch über alle Kurse hinweg, alterniert links/rechts, reicht alle Felder durch)
→ `_includes/timeline_course.html` (dispatch per `type` im `{% case %}`)
→ `_includes/timeline_<type>.html` (konkretes Template, z. B. `timeline_improve.html`, `timeline_msa.html`).

`type` wird aus `course.id` gebildet, plus Suffix `_online` wenn `date.format == "online"`.
Kurstypen: `msa`, `msa_online`, `req4arc`, `improve`, `adoc`, `adoc_online`.

Zweiter Konsument von `site.data.trainings`: `_includes/course-bridge.html`, die
Conversion-Band am Ende einer Inhaltsseite, je einmal eingebunden auf
`/publikationen/`, `/method/`, `/overview/` (Variante `card`) und `/canvas/`
(Variante `hairline`). Ermittelt den nächsten buchbaren Termin über denselben
Key-Sort wie `timeline_auto.html` — Details und die eine bewusste Abweichung
im Kommentarkopf der Datei.

Datumslabels werden über `_includes/training-date-label.html` aus den ISO-Strings
`start`/`end` erzeugt (lange deutsche Form, z. B. "15.-17. September 2026").

### Kurs auf "ausgebucht / nur Warteliste" setzen

1. In `trainings.arc42.org-site/_data/trainings.yml` beim betreffenden Datum
   `status: waitlist` (oder `status: full`, wenn komplett ausgebucht) statt
   `status: open` setzen.
2. Sync abwarten (wöchentlich) oder `workflow_dispatch` von
   `.github/workflows/refresh-trainings.yml` manuell auslaufen lassen, um
   `_data/trainings.json` sofort zu aktualisieren.
3. Timeline und Anmeldeformulare sind generiert und reagieren automatisch:
   `timeline_auto.html` setzt `sold_out=true` für `waitlist`/`full`, wodurch
   `timeline_<type>.html` den Kurs ausgraut, den Hinweis "(Ausgebucht, nur noch
   Warteliste)" zeigt und den Anmeldung-Button versteckt. Die Anmeldeformulare
   (`_pages/anmeldung.md`, `_pages/anmeldungEN.md`) generieren ihre `<select>`-Optionen
   ebenfalls aus `site.data.trainings` und lassen `waitlist`/`full`-Termine automatisch
   weg — **keine manuelle Pflege der Select-Liste mehr nötig**. Achtung, dritter
   Konsument mit abweichendem Verhalten: `course-bridge.html` überspringt
   `waitlist`/`full`-Termine komplett und springt zum nächsten offenen Termin
   weiter, statt sie wie die Timeline ausgegraut weiter anzuzeigen — das Band auf
   `/publikationen/`, `/method/`, `/overview/` und `/canvas/` wechselt also
   sichtbar den beworbenen Termin, sobald ein Status auf `waitlist`/`full`
   gesetzt wird.

### `few_seats`
Optionaler Text (z. B. "nur noch wenige Plätze"), im Datenfeld `few_seats` in
`trainings.yml`. Wird orange/fett angezeigt, gleiche Durchreich-Logik wie `sold_out`.

## Doku
Das Timeline-System ist zusätzlich in `TIMELINE_SYSTEM.md` beschrieben.
