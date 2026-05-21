# CLAUDE.md

Notizen für Claude / Agenten zu diesem Repo (arc42.de-site, Jekyll + Markdown, GitHub Pages).

## Kurse / Termine verwalten

Kursdaten leben **zentral** im YAML-Frontmatter von `_pages/termine.md` unter `courses:`.
Felder pro Kurs: `type`, `date`, `location`, `anchor_id`, `pricing`, `trainer`, `credits`,
`sold_out`, `few_seats`.

Rendering-Kette (Jekyll-Includes):
`termine.md` → `_includes/timeline_auto.html` (alternierende Positionen, reicht alle Felder durch)
→ `_includes/timeline_course.html` (dispatch per `type` im `{% case %}`)
→ `_includes/timeline_<type>.html` (konkretes Template, z. B. `timeline_improve.html`, `timeline_msa.html`).

Kurstypen: `msa`, `msa_online`, `req4arc`, `improve`, `adoc`, `adoc_online`.

### Kurs auf "ausgebucht / nur Warteliste" setzen

1. In `_pages/termine.md` beim Kurs `sold_out: true` ergänzen.
2. Sicherstellen, dass `timeline_course.html` `sold_out` (und `few_seats`) an das jeweilige
   `timeline_<type>.html` durchreicht — **nicht alle Typen tun das bereits**.
3. Im jeweiligen `timeline_<type>.html` muss `sold_out` behandelt werden:
   - `{% assign sold_out = include.sold_out | default: false %}`
   - Inhalt ausgrauen: `<div class="content"{% if sold_out %} style="color:darkgrey"{% endif %}>`
   - Hinweis: `{% if sold_out %}<p style="color:red;">(Ausgebucht, nur noch Warteliste)</p>{% endif %}`
   - Anmeldung-Button verstecken: `{% unless sold_out %}<a href="/anmeldung/">…</a>{% endunless %}`
   - Referenzimplementierung: `timeline_msa.html`.
4. **Anmeldeformular separat anpassen:** `_pages/anmeldung.md` hat eine eigene, manuell
   gepflegte `<select id="kurs">`-Liste (NICHT aus `termine.md` generiert). Bei ausgebucht /
   Warteliste die entsprechende `<option>` dort entfernen, damit keine Online-Anmeldung mehr
   möglich ist.

### `few_seats`
Optionaler Text (z. B. "nur noch wenige Plätze"), wird orange/fett angezeigt. Gleiche
Durchreich-Logik wie `sold_out`.

## Doku
Das Timeline-System ist zusätzlich in `TIMELINE_SYSTEM.md` beschrieben.
