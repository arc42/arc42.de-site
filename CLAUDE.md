# CLAUDE.md

Notizen für Claude / Agenten zu diesem Repo (arc42.de-site, Jekyll + Markdown, GitHub Pages).

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
   weg — **keine manuelle Pflege der Select-Liste mehr nötig**.

### `few_seats`
Optionaler Text (z. B. "nur noch wenige Plätze"), im Datenfeld `few_seats` in
`trainings.yml`. Wird orange/fett angezeigt, gleiche Durchreich-Logik wie `sold_out`.

## Doku
Das Timeline-System ist zusätzlich in `TIMELINE_SYSTEM.md` beschrieben.
