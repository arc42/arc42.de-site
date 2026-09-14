# Timeline Course System

This branch introduces a new modular system for managing course timelines in `termine.md`.

## Features

### 1. Individual Course Type Includes
- `_includes/timeline_msa.html` / `timeline_msa_online.html` - MSA courses
- `_includes/timeline_req4arc.html` / `timeline_req4arc_online.html` - REQ4ARC courses
- `_includes/timeline_improve.html` / `timeline_improve_online.html` - IMPROVE courses
- `_includes/timeline_adoc.html` / `timeline_adoc_online.html` - ADOC courses

All card copy is German (the page language). A course held in English only gets
the note from `_includes/timeline-language-note.html`.

### 2. Automatic Anchor Links
Each course gets a unique `anchor_id` that can be linked to from other pages:
- Example: `https://arc42.de/termine#msa-dec-2025`
- Links directly to specific course entries

### 3. Two Usage Approaches

#### Approach A: Auto-alternating Timeline (data-driven, used by `termine.md`)
Course data is **not** stored in this repo. The single source of truth is
`trainings.arc42.org-site/_data/trainings.yml`. It is synced into this repo's
`_data/trainings.json` by `.github/workflows/refresh-trainings.yml` (weekly, on
`repository_dispatch` from the trainings repo, or manual `workflow_dispatch`).
**Never hand-edit `_data/trainings.json`** — the next sync overwrites it.

`_includes/timeline_auto.html` reads `site.data.trainings.courses`, drops dates
with `status: cancelled` or `end < today`, sorts all dates chronologically across
every course, alternates left/right position, derives `type` from `course.id`
(plus `_online` suffix when `date.format == "online"`), formats the date label via
`_includes/training-date-label.html`, and passes a `trainer` override only when a
date explicitly sets one (course-default trainers stay baked into the
`timeline_<type>.html` templates, unchanged from before).

Price, iSAQB credits and the few-seats note are built in `timeline_auto.html` in
the page language (`page_lang`, default `de`) from the structured feed fields
`price`, `credit_points` and `seats_limited`, via `_includes/price-label.html`,
`credits-label.html` and `money.html` (ported from trainings.arc42.org-site),
and handed to the cards as finished strings. The feed's legacy strings
`pricing`/`credits`/`few_seats` are not used. Only types listed in `known_types`
count for the left/right alternation.

Usage in a page: `{% include timeline_auto.html %}` (no parameters — see
`_pages/termine.md`).

To change a date (add, remove, reschedule, mark sold out): edit
`trainings.arc42.org-site/_data/trainings.yml`, not anything in this repo.

#### Approach B: Manual Control
Use individual includes with explicit positioning:

```liquid
{% include timeline_course.html 
   type="msa" 
   position="right" 
   date="2.-5. Dezember 2025" 
   location="München" 
   anchor_id="msa-dec-2025" 
   sold_out=true 
   pricing="Frühbucherpreis: €2690" %}
```

## Parameters

### Common Parameters
- `type`: Course type (msa, msa_online, req4arc, req4arc_online, improve, improve_online, adoc, adoc_online)
- `date`: Course date string
- `location`: Course location (not needed for online courses)
- `anchor_id`: Unique anchor for deep linking
- `position`: "left" or "right" for timeline positioning (manual approach only)

### Optional Parameters
- `sold_out`: true/false - Shows "Ausgebucht" message and grays out content
- `pricing`: Price sentence in the page language (no hardcoded fallback price)
- `credits`: iSAQB credit points in the page language, without the noun
- `few_seats`: Limited-availability text
- `delivery_lang`: Language the course is held in (`de`|`en`); only drives the language note

## Benefits

1. **Single Source of Truth**: Update `trainings.arc42.org-site/_data/trainings.yml` once,
   and the timeline, the DE/EN registration forms, and (eventually) other consumers all
   pick it up — no more editing course data in multiple repos.
2. **Consistent Formatting**: All courses use the same templates
3. **Deep Linking**: Every course has a unique anchor for external links
4. **Automatic Alternation**: No need to manually track left/right positioning
5. **Maintainable**: Course types are centralized in include files

## Migration

`termine.md` no longer carries a `courses:` frontmatter list. All course/date data
was moved to `trainings.arc42.org-site/_data/trainings.yml`, synced into this repo
as `_data/trainings.json`, and consumed by the parameterless
`{% include timeline_auto.html %}` in `termine.md`'s body. `timeline_course.html`
and the `timeline_<type>.html` templates are unchanged.