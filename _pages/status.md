---
title: "Status und Info über diese Website"
layout: single
permalink: /status
header:
  overlay_filter: rgba(15, 80, 180, 0.5)
  overlay_image: /images/splash/develop-header.jpg
  caption: "Photo: [**Unsplash**](https://unsplash.com)"
sidebar:
  nav: "about"
---

# Technische Informationen

Der Inhalt dieser Seite wird auf Github gepflegt, hauptsächlich in Markdown.

Wir verwenden Jekyll als Site-Generator (ähnlich den bekannten github-pages).
Als Build-Werkzeug und zum Deployment der Site verwenden wir [Netlify](https://netlify.com), weil wir dabei
spezifische Informationen über einzelne builds bzw die dabei aufgetretenen Probleme erhalten.

# Build und Repo Status

![GitHub issues](https://img.shields.io/github/issues/arc42/arc42.de-site)
![GitHub issues](https://img.shields.io/github/issues-raw/arc42/arc42.de-site)
[![Netlify Status](https://api.netlify.com/api/v1/badges/801e5a9f-f256-478f-89fb-84c9d3df710f/deploy-status)](https://app.netlify.com/sites/arc42de-site/deploys)


Die aktuelle Version dieser Site:

* wurde gebaut (_built_) {{ site.time | date: "%Y-%b-%d %H:%M"}}
* enthält {{ site.pages | size }} Seiten und {{site.posts | size }} Posts
