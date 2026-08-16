# Brücken von den Inhalten zu den Kursen — Design

**Datum:** 2026-08-11
**Branch:** `improve-the-flow`
**Plan:** `IMPROVEMENT_PLAN.md`, Punkt 2 (P0, M)
**Entwurfsvergleich:** `todo/bridges-review.html` — drei Bandvarianten, echte Daten,
Originalmaße. Bewusst **nicht** eingecheckt: die Datei bettet Schrift und Cover als
Data-URI ein (108 KB, überwiegend Base64) und gehört nicht dauerhaft in die
Git-Historie. Sie liegt lokal im Arbeitsverzeichnis und zusätzlich unter
<https://claude.ai/code/artifact/b322fd35-76e3-4b30-b2eb-61e0cd5c0c31>.

---

## 1. Problem

`/publikationen/` rendert 50 kuratierte Werke und 46 Links im Hauptinhalt. **Keiner**
davon zeigt auf `/schulungen/`, `/termine/` oder `/anmeldung/`. Die Homepage-Karte
„Lesestoff" schickt Leute dorthin, der einzige Link auf `/consulting/` schickt Leute
dorthin — und dort endet der Weg.

Das Geschäftsmodell der Seite lautet: erstklassige kostenlose Inhalte schaffen
Vertrauen, Vertrauen führt zu Buchungen. Die erste Hälfte existiert. Die zweite nicht.
Dies ist der Punkt mit der höchsten Hebelwirkung im gesamten Plan, weil er genau den
Schritt herstellt, von dem das erklärte Geschäftsmodell abhängt.

## 2. Entscheidungen

Getroffen vor dem Entwurf, hier festgehalten, damit die Umsetzung sie nicht neu
verhandelt:

| # | Entscheidung | Gewählt |
|---|---|---|
| E1 | Umfang der Zuordnung | Nur `type: book` und `type: article`, enge thematische Passung. Vorträge und Videos bleiben unberührt. |
| E2 | Linkziel auf der Karte | Die Kursseite `/info-<id>/`, nicht `/termine/`. Wer ein Buch ansieht, stöbert; die Kursseite erklärt erst, worum es geht. |
| E3 | Bandvariante je Seite | **B2** (umrandete Karte) auf `/publikationen/`, `/method/`, `/overview/`; **B1** (Haarlinie) auf `/canvas/`. |
| E4 | Texte | Wie im Entwurf vorgeschlagen, unverändert übernommen. |
| E5 | Grenzfälle | *Patterns kompakt*, *Babylon as a Feature* und *Eine kleine Geschichte über Qualität* bleiben **ohne** Zuordnung — die enge Passung aus E1 wird nicht aufgeweicht. |
| E6 | Kardinalität von `course:` | Ein einzelner Wert, keine Liste. Kein Eintrag der Bibliothek brauchte zwei Kurse. |

## 3. Randbedingung: der Preis ist nicht darstellbar

Der Plan sah im Abschlussband ein „ab € …" vor. Das ist derzeit nicht sauber möglich:

- `pricing` steht in `_data/trainings.json` als **deutscher Fließtext** —
  `"Frühbucherpreis bei Anmeldung bis 8. August 2026: € 2690, Normalpreis: € 2890"` —
  nicht als Zahl. Eine Zahl daraus zu gewinnen hieße, in Liquid Prosa zu zerlegen.
- Nur die **MSA**-Termine tragen überhaupt ein `pricing`-Feld. Der nächste offene
  Termin überhaupt — Req4Arc, 15.–17. September 2026, Frankfurt/Main — hat keinen.

Das Band führt deshalb mit **Kurs, Termin und Ort**, nie mit dem Preis. Reparieren
lässt sich das ausschließlich per PR gegen `trainings.arc42.org-site/_data/trainings.yml`;
`_data/trainings.json` ist generiert und darf nicht von Hand angefasst werden.

## 4. Teil A — die zweite Zeile auf der Karte

### 4.1 Schema

Ein optionales Feld im Front Matter von `_resources/*.md`:

```yaml
course: "msa"   # msa | improve | req4arc | adoc — Kurs-Id aus _data/trainings.json
```

Weglassen heißt: keine Kurszeile. Das Feld wird in `CLAUDE.md` neben `type`/`link`/`detail`
dokumentiert, mitsamt dem Hinweis, dass es **nicht** nach arc42.org propagiert (die
Publikationsliste ist dort bewusst dupliziert, nicht synchronisiert).

### 4.2 Rendering in `_includes/resource-item.html`

Der Kursname wird aus `site.data.trainings.courses` geholt, die URL aus der Id
abgeleitet — `/info-{{ course }}/`. Alle vier Ids treffen eine existierende Seite
(`/info-msa/`, `/info-improve/`, `/info-req4arc/`, `/info-adoc/`). Damit ist weder der
Titel noch der Pfad im Template fest verdrahtet.

Wird `course:` auf eine unbekannte Id gesetzt, rendert die Zeile **nicht** — stiller
Ausfall statt kaputter Link. `make check-links` fängt einen falschen Pfad ohnehin.

### 4.3 Zwei Fallen im Markup

Beide sind derselben Familie wie die in `todo/HANDOVER.md` §3 dokumentierten.

**a) `.resource-item` ist ein dreispaltiges Raster.**

```css
grid-template-columns: 4.75rem minmax(0, 1fr) minmax(9rem, auto);
```

Cover, Text, Link. Ein zweiter Link als Geschwisterelement öffnet eine **vierte**
Rasterzelle und bricht in eine implizite zweite Reihe um. Beide Links kommen deshalb
in einen gemeinsamen Container `.resource-item__links` (Flex, Spalte, rechtsbündig),
der die dritte Spalte besetzt. Die 720px-Regel, die heute
`.resource-item__link { grid-column: 2 }` setzt, muss auf den neuen Container
umgeschrieben werden — sonst rutscht auf dem Telefon nur einer der beiden Links
an die richtige Stelle.

**b) `.resource-item__body > p:last-child` formatiert die Zusammenfassung.**

Wird irgendetwas **innerhalb** von `.resource-item__body` hinter die
Zusammenfassung gesetzt, ist diese nicht mehr `:last-child` und verliert Farbe,
Schriftgröße und Zeilenhöhe. Das ist der Grund, warum die Kurszeile in die dritte
Spalte gehört und nicht in den Textkörper — die naheliegendere Platzierung wäre
still kaputtgegangen.

### 4.4 Die Zuordnung — 22 Paare

**`msa` — Mastering Software Architectures (7)**

| Datei | Warum |
|---|---|
| `basiswissen-softwarearchitektur` | ausdrücklich für den CPSA-Foundation-Lehrplan 2025 |
| `effektive-softwarearchitekturen` | Standardwerk, nach aktuellem iSAQB-Lehrplan |
| `zertifizierung-3` | Lehrplan, Prüfungsthemen, Zertifizierungsprozess |
| `software-architecture-foundation-2nd` | Study Guide zu jedem CPSA-F-Lernziel |
| `software-architecture-foundation-curriculum` | über den Foundation-Lehrplan selbst |
| `fundamentals-of-software-architecture` | was Architektur ist und wie sie betrieben wird |
| `quality-driven-software-architecture` | methodisches Konstruieren nach Qualitätszielen |

**`adoc` — ADOC: Architecture Documentation (9)**

| Datei | Warum |
|---|---|
| `arc42-by-example-2nd` | arc42-Dokumentation an realen Systemen |
| `arc42-by-example-3rd` | dito |
| `arc42-by-example-packt` | dito |
| `arc42-by-example-vol2` | dito, Embedded/IoT |
| `arc42-in-aktion` | „das fehlende Handbuch" zur Architekturdokumentation |
| `arc42-primer` | kompakte Einführung, Dokumentation unter Zeitdruck |
| `brief-introduction-to-arc42` | Rundgang durch das Template |
| `principles-of-technical-documentation` | 30+ Prinzipien für tragfähige Dokumentation |
| `sparsame-dokumentation-artikel` | knappe, trotzdem nützliche Architekturdokumentation |

**`req4arc` — Req4Arc: Getting your Requirements right (4)**

| Datei | Warum |
|---|---|
| `requirements-skills` | laut eigener Zusammenfassung Grundlage des iSAQB-Moduls Req4Arc |
| `business-analysis-requirements-engineering` | Requirements Engineering, Peter Hruschka |
| `requirements-ueberblick` | Anforderungs-Überblick für Teams |
| `handeln-statt-jammern` | wenn Anforderungen zu spät oder implizit kommen |

**`improve` — IMPROVE: Evolve and maintain systems (2)**

| Datei | Warum |
|---|---|
| `software-reviews` | Probleme aufdecken, Verbesserungen ableiten |
| `technical-and-other-debt` | Schulden über Anforderungen, Architektur, Betrieb hinweg |

**Bewusst ohne Zuordnung (11)** — `20-years-arc42`, `architekten-zehnkaempfer`,
`business-model-canvas`, `canvas-101`, `it-knigge-3`, `pixie-und-der-sumpf`,
`whats-in-a-name`, `wie-ich-meine-konzentration-wiederfand`, sowie die drei Grenzfälle
aus E5: `patterns-kompakt`, `babylon-as-a-feature`, `kleine-geschichte-zu-qualitaet`.

**Zwei Beobachtungen, die aus der Zuordnung fallen** und keine Mängel des Entwurfs sind:

1. **IMPROVE bekommt 2 von 22.** Der Kurs zu Legacy und Weiterentwicklung ist in der
   Bibliothek fast nicht vertreten. Die drei einschlägigen Vorträge (*The Art of
   Software Reviews*, *The Rise, the Ruin and the Rescue*, *Two shockingly recurring
   problems*) würden helfen, sind aber durch E1 ausgeschlossen. Inhaltliche Lücke,
   getrennt zu entscheiden.
2. **ADOC bekommt 9**, und Bücher stehen in der Liste beieinander. Mehrere benachbarte
   Karten werden „Zum Kurs: ADOC" lesen. Nach der Umsetzung visuell prüfen.

## 5. Teil B — der Abschlussblock

### 5.1 Ein Include, zwei Varianten

`_includes/course-bridge.html`, Parameter `variant` (`card` = B2, `hairline` = B1).
Beide zeigen dieselben Daten; sie unterscheiden sich nur in der Lautstärke.

```liquid
{% include course-bridge.html variant="card" %}
{% include course-bridge.html variant="hairline" %}
```

Platzierung nach E3:

| Seite | Variante | Warum |
|---|---|---|
| `/publikationen/` | `card` | die Seite öffnet bereits mit dem dunklen `.dl-hero`-Band; ein zweites am Fuß wäre eine Dublette, die zurückhaltende Karte nicht |
| `/method/` | `card` | endet heute in Fließtext, verträgt einen echten Abschluss |
| `/overview/` | `card` | endet heute in einer Linkliste |
| `/canvas/` | `hairline` | endet in einer Bildergalerie und verweist ohnehin nach außen auf canvas.arc42.org |

Genau **ein** Block je Seite, immer ganz unten. Das ist die Obergrenze, nicht der
Startwert.

### 5.2 Nächster Termin — dieselbe Logik wie die Timeline

`_includes/timeline_auto.html` löst das Problem bereits korrekt und wird nachgebaut,
nicht neu erfunden:

1. Über alle Kurse und Termine `"{{ d.start }}|{{ courseIndex }}|{{ dateIndex }}"`
   sammeln (ISO-Datum sortiert lexikografisch).
2. `d.status == "cancelled"` überspringen und `d.end < today` überspringen.
3. **Zusätzlich** `waitlist` und `full` überspringen — ein ausgebuchter Termin ist ein
   schlechter Handlungsaufruf. Das ist der einzige Unterschied zur Timeline, die
   ausgebuchte Termine bewusst weiterhin anzeigt.
4. `| sort`, den **ersten** Schlüssel nehmen, Kurs und Termin daraus auflösen.
5. Datumsbeschriftung über `{% include training-date-label.html date=d lang="de" style="long" %}` —
   nicht von Hand formatieren.
6. Ort aus `d.city`.

**Kein Termin gefunden:** die Faktenzeile entfällt, Überschrift, Text und Buttons
bleiben stehen. Der Block darf nie ganz verschwinden und nie eine leere Zeile
hinterlassen.

### 5.3 Texte (E4, unverändert)

Variante `card`:

- Kicker: **Schulungen**
- Überschrift: **Diese Themen gibt es auch als Training**
- Fließtext: *Wir unterrichten, worüber wir schreiben — als offene Schulung in kleiner
  Gruppe, mit iSAQB-Zertifizierung.*
- Fakten: *Nächster Termin · Req4Arc · 15.–17. September 2026 · Frankfurt/Main*
- Buttons: **Termine ansehen** (`.btn .btn--arc42`) · **Schulungsangebot**
  (`.btn .btn--arc42-outline`) → `/termine/` und `/schulungen/`

Variante `hairline`:

- Kicker: **Nächster Termin**
- Satz: *Wir unterrichten, worüber wir schreiben:* **Req4Arc — 15.–17. September 2026
  in Frankfurt/Main**, *mit iSAQB-CPSA-Advanced-Punkten.*
- Ein Textlink: **Alle Termine ansehen →** → `/termine/`

Die Zertifizierungsangabe im Hairline-Satz kommt aus `c.certification` und entfällt,
wenn das Feld fehlt.

### 5.4 CSS

Neue Regeln kommen ans Ende von `assets/css/arc42-resources.css`, wo `.btn--arc42`,
`.dl-hero` und die `:root`-Tokens bereits stehen. **Keine neue Datei** und kein neuer
`@import` — jeder zusätzliche Import in `main.scss` landet wegen der in `arc42-de.css`
dokumentierten Kaskadenfalle *vor* dem Theme und verliert jeden
Spezifitäts-Gleichstand.

Kein neues Farbbauteil. B2 besteht ausschließlich aus `--arc42-border`,
`--arc42-ink-strong`, `--arc42-text-muted`, `--arc42-primary` und den beiden
vorhandenen Buttons. **Keine zwölfte Buttonfarbe** (`button.css` führt bereits elf
gegen ein vierfarbiges `DESIGN.md`).

Der Button ist ein `<a class="btn btn--arc42">`, kein `<a><button>` — das Paar aus
Punkt 6 des Plans wird hier nicht neu erzeugt. `.btn` des Themes bringt
`display: inline-block` und `text-decoration: none` bereits mit. **Achtung auf die
`:visited`-Falle:** Minimal Mistakes setzt `a:visited { color: #4e91a5 }` mit (0,1,1)
und schlägt damit `.btn--arc42` mit (0,1,0). Beide Buttonregeln brauchen deshalb
explizite `:link`/`:visited`-Varianten oder eine Spezifitätsanhebung — und zwar
**geprüft in beiden Zuständen**, nicht nur im ungelesenen.

## 6. Abgrenzung

Nicht Teil dieser Arbeit:

- Vorträge und Videos (E1).
- Filterung von `/termine/` nach Kurs — das würde Punkt 6 des Plans vorwegnehmen.
- Preisangaben irgendeiner Art (Abschnitt 3).
- Die Umstellung der 44 `<a><button>`-Paare (Punkt 6).
- Das Kontrastthema (Punkt 3). Die Entscheidung *Tomate `#c33b21`* ist gefallen, gehört
  aber in denselben Commit wie der Rest von Punkt 3 und nicht hierher.

## 7. Fertig, wenn

1. Jeder der 22 Einträge trägt `course:` und rendert eine Kurszeile, die auf die
   richtige `/info-<id>/`-Seite zeigt.
2. Die übrigen 28 Einträge rendern **eine** Linkzeile wie bisher, mit unveränderter
   Formatierung der Zusammenfassung.
3. Die vier Seiten enden mit genau einem Block, in der Variante aus E3.
4. Der nächste offene Termin im Block stimmt mit dem obersten Eintrag auf `/termine/`
   überein — abgesehen von ausgebuchten Terminen, die der Block überspringt.
5. `make check-links` sauber, `make test-theme` OK.
6. Bei 390 px kein horizontaler Überlauf auf allen vier Seiten; kein interaktives
   Element unter 44 px im neuen Block.
7. Beide Buttons in **besuchtem und unbesuchtem** Zustand geprüft.
8. `CLAUDE.md` dokumentiert `course:` im Front-Matter-Schema.

## 8. Risiko

Gering. Additiv; kein bestehendes Verhalten ändert sich. Die beiden realen Risiken
sind die Rasterfalle aus 4.3 und die `:visited`-Falle aus 5.4 — beide sind bekannt,
benannt und werden geprüft.

Die verbleibende Ermessensfrage ist der Ton: dies ist eine Bibliothek, kein Trichter.
Ein Block je Seite, ganz unten, ist die Obergrenze.
