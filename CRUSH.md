# CRUSH.md - arc42.de Jekyll Site

## Build & Development Commands
- **Local development**: `docker compose up` (serves on http://localhost:4000)
- **Alternative local**: `bundle install && bundle exec jekyll serve --watch`
- **Gitpod setup**: `bundle install`
- **Build only**: `bundle exec jekyll build`

## Site Structure
- Jekyll static site using MinimalMistakes theme (remote_theme: "mmistakes/minimal-mistakes@4.24.0")
- German locale with mixed German/English content
- Hosted on GitHub Pages, auto-deploys from main branch
- Uses Docker for local development (bretfisher/jekyll-serve image)

## Content Conventions
- **Pages**: Stored in `_pages/` directory with `.md` extension
- **Images**: Organized in `/images/` subdirectories (splash/, books/, home/, template/)
- **Prefer WebP**: Use `.webp` format for images when possible
- **Permalinks**: Use clean URLs via `permalink:` in front matter

## YAML Front Matter Patterns
```yaml
---
title: "Page Title"
layout: single|splash
permalink: /path
header:
  overlay_image: /images/splash/image.jpg
  overlay_filter: rgba(15, 80, 180, 0.5)
excerpt: "Brief description"
---
```

## Markdown Style
- Use `**bold**` for emphasis, `_italic_` for subtle emphasis
- Images: `![Alt text](/images/path/image.webp){: .align-right}` for alignment
- Feature rows: Define in front matter, include with `{% include feature_row id="name" %}`
- Consistent Ukraine support message across pages

## File Organization
- Custom CSS in `/assets/css/`
- Navigation in `_data/navigation.yml`
- Includes in `_includes/` (custom.html, feature_row, gallery)
- Downloads in `/downloads/` for PDFs and files