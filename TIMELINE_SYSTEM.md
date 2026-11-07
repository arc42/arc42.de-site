# Timeline Course System

This branch introduces a new modular system for managing course timelines in `termine.md`.

## Features

### 1. Individual Course Type Includes
- `_includes/timeline_msa.html` / `timeline_msa_online.html` - MSA courses
- `_includes/timeline_req4arc.html` / `timeline_req4arc_online.html` - REQ4ARC courses
- `_includes/timeline_improve.html` / `timeline_improve_online.html` - IMPROVE courses
- `_includes/timeline_adoc.html` / `timeline_adoc_online.html` - ADOC courses
- `_includes/timeline_card.html` - the data-driven **standard card** for every
  other type (e.g. MAS), ported from `trainings.arc42.org-site`

**A new course needs no template.** `timeline_course.html` sends every type
without a `when` of its own to `timeline_card.html`, which builds the card from
the feed alone (`course` and `course_date`): title, a certification line only
when `certification` is non-empty, the description, the trainers (the date's,
else the course's, joined with " und "), status note, few-seats, price, iSAQB
credits only together with a certification, "Mehr Info" to `course.url` (made
root-relative by `_includes/course-info-url.html` when it points at this site,
because `make test-theme` rejects that host) and "Anmeldung" exactly as the
hand-made cards link it. A hand-made `timeline_<type>.html`, with its `when`,
overrides the standard card for its course while it exists. Every variable of
the standard card is `tc_`-prefixed: includes share the caller's scope.

Description on the standard card: the page language's field (`blurb_de`), else
the other language's (`blurb_en`), else the legacy `blurb` (the only one a feed
from before trainings.arc42.org PR #79 carries), else none.

All card copy is German (the page language). A course held in English only gets
the note from `_includes/timeline-language-note.html`.

### Where a course is shown: `show_on`
Optional course field in the feed: the list of site names that advertise the
course. **Absent means every site.** If it is present and does not contain
`www.arc42.de` (`trainings_site_name` in `_config.yml`), the course is not
advertised here: `timeline_auto.html` drops its dates before sorting (not
rendered, not counted for left/right), `course-bridge.html` and
`course-cards.html` skip the course, `resource-item.html` drops its course line.

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

`_includes/timeline_auto.html` reads `site.data.trainings.courses`, drops
courses whose `show_on` does not name this site, drops dates
with `status: cancelled` or `end < today`, sorts all dates chronologically across
every course, alternates left/right position, derives `type` from `course.id`
(plus `_online` suffix when `date.format == "online"`), formats the date label via
`_includes/training-date-label.html`, passes `course` and `course_date` for the
standard card, and passes a `trainer` override only when a
date explicitly sets one (course-default trainers stay baked into the hand-made
`timeline_<type>.html` templates; the standard card reads them from the data).

Price, iSAQB credits and the few-seats note are built in `timeline_auto.html` in
the page language (`page_lang`, default `de`) from the structured feed fields
`price`, `credit_points` and `seats_limited`, via `_includes/price-label.html`,
`credits-label.html` and `money.html` (ported from trainings.arc42.org-site),
and handed to the cards as finished strings. The feed's legacy strings
`pricing`/`credits`/`few_seats` are not used. Every rendered card counts for the
left/right alternation (there is no `known_types` list any more: every type
renders).

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
- `type`: Course type (hand-made: msa, msa_online, req4arc, req4arc_online, improve, improve_online, adoc, adoc_online; anything else gets the standard card)
- `course`, `course_date`: the course and the date from the feed; only the standard card reads them
- `date`: Course date string
- `location`: Course location (not needed for online courses)
- `anchor_id`: Unique anchor for deep linking
- `position`: "left" or "right" for timeline positioning (manual approach only)

### Optional Parameters
- `sold_out`: true/false - Grays out content
- `hide_register`: true/false - Hides the Anmeldung button (set for `full` only; `waitlist` stays registrable)
- `status_note`: the sold-out text, chosen per status in `timeline_auto.html` (waitlist: "Ausgebucht, Warteliste verfügbar", full: "Ausgebucht")
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
`{% include timeline_auto.html %}` in `termine.md`'s body. Since Nov 2026
`timeline_course.html` falls back to the standard card `timeline_card.html`
instead of an HTML comment, so a date of a new course is never invisible.