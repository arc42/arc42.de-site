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

## Technische Informationen

Der Inhalt dieser Seite wird auf Github gepflegt, hauptsächlich in Markdown:

![Github issues open](https://badgen.net/github/open-issues/arc42/arc42.de-site)
![GitHub closed issues](https://img.shields.io/github/issues-closed/arc42/arc42.de-site)
![Github issues total](https://badgen.net/github/issues/arc42/arc42.de-site)



Wir verwenden Jekyll als Site-Generator (ähnlich den bekannten github-pages).
Als Build-Werkzeug und zum Deployment der Site verwenden wir [Netlify](https://netlify.com), weil wir dabei
spezifische Informationen über einzelne builds bzw die dabei aufgetretenen Probleme erhalten.

## Monitoring

Wir nutzen [UptimeRobot](https://uptimerobot.com) zum Monitoring der Site:

![](https://badgen.net/uptime-robot/day/m778709372-640fbdf765be9486dbffe066)
![](https://badgen.net/uptime-robot/week/m778709372-640fbdf765be9486dbffe066)
![](https://badgen.net/uptime-robot/month/m778709372-640fbdf765be9486dbffe066)
![](https://badgen.net/uptime-robot/response/m778709372-640fbdf765be9486dbffe066)


## Build und Repo Status


[![Netlify Status](https://api.netlify.com/api/v1/badges/801e5a9f-f256-478f-89fb-84c9d3df710f/deploy-status)](https://app.netlify.com/sites/arc42de-site/deploys)

Build Status wird über Webhooks an einen privaten Slack-Channel weitergeleitet.


## Aktuelle Version dieser Site:

* wurde gebaut (_built_) {{ site.time | date: "%Y-%b-%d %H:%M"}}
* enthält {{ site.pages | size }} Seiten und {{site.posts | size }} Posts
