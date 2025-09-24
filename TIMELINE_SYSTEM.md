# Timeline Course System

This branch introduces a new modular system for managing course timelines in `termine.md`.

## Features

### 1. Individual Course Type Includes
- `_includes/timeline_msa.html` - MSA courses (German, in-person)
- `_includes/timeline_msa_online.html` - MSA online courses (English)
- `_includes/timeline_req4arc.html` - REQ4ARC courses
- `_includes/timeline_improve.html` - IMPROVE courses
- `_includes/timeline_adoc.html` - ADOC courses

### 2. Automatic Anchor Links
Each course gets a unique `anchor_id` that can be linked to from other pages:
- Example: `https://arc42.de/termine#msa-dec-2025`
- Links directly to specific course entries

### 3. Two Usage Approaches

#### Approach A: Auto-alternating Timeline
Define courses in YAML front matter and use auto-alternating positions:

```yaml
courses:
  - type: "msa"
    date: "2.-5. Dezember 2025"
    location: "München"
    anchor_id: "msa-dec-2025"
    sold_out: true
    pricing: "Frühbucherpreis: €2690"
```

Then use: `{% include timeline_auto.html courses=page.courses %}`

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
- `type`: Course type (msa, msa_online, req4arc, improve, adoc)
- `date`: Course date string
- `location`: Course location (not needed for online courses)
- `anchor_id`: Unique anchor for deep linking
- `position`: "left" or "right" for timeline positioning (manual approach only)

### Optional Parameters
- `sold_out`: true/false - Shows "Ausgebucht" message and grays out content
- `pricing`: Custom pricing text (overrides default pricing)

## Benefits

1. **Easy Updates**: Just modify YAML data instead of HTML
2. **Consistent Formatting**: All courses use the same templates
3. **Deep Linking**: Every course has a unique anchor for external links
4. **Automatic Alternation**: No need to manually track left/right positioning
5. **Maintainable**: Course types are centralized in include files

## Migration

The current `termine.md` has been updated to use the new system while preserving all existing course data and functionality.