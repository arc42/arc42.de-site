---
title: "Publikationen"
layout: splash

permalink: /publications
header:
  overlay_filter: rgba(15, 80, 180, 0.5)
  overlay_image: /images/splash/publications-unsplash.jpg
  caption: "Photo: [**Glen Carstens Peters**](https://unsplash.com/@glenncarstenspeters)"
  actions: 
   - label: "Bücher"
     url: /books
   - label: "Artikel"
     url: "/articles"
   - label: "Videos"
     url: /videos  
   - label: "Vorträge"
     url: /talks

excerpt: "wir schreiben und sprechen über Architektur...<span style='font-size:80px;'>&#128521;</span>"


books_feature:
  - image_path: /images/publications/book-feature.png
    alt: "books"
    title: "Bücher"
    excerpt: 'Wir haben über 25 Bücher geschrieben, von der Anforderungsklärung, Business-Analyse, Architektur, Dokumentation, Verhaltensmuster (Knigge) bis zu Patterns.'
    url: /books
    btn_label: "mehr dazu ..."
    btn_class: "btn--primary"


videos_feature:
  - image_path: /images/publications/video-feature.png
    alt: "Videos"
    title: "Videos"
    excerpt: 'Mehrfach sind unsere Konferenzvorträge aufgezeichnet worden, oder wir haben uns selbst als Produzenten versucht... 
    Immerhin besitzt arc42 einen eigenen Youtube-Channel... '
    url: /videos
    btn_label: "mehr dazu ..."
    btn_class: "btn--primary"

articles_feature:
  - image_path: /images/publications/article-feature.png
    alt: "Artikel"
    title: "Artikel"
    excerpt: "Mehr als hundert Fachartikel in diversen Zeitschriften. Unter anderem unsere mehrjährige Kolumne 'Knigge für Softwarearchitektur', 
    die Kolumne 'Req4Arcs', oder die Kolumne 'Hitchhikers Guide to Documentation'. Viele davon sind online verfügbar."
    url: /articles
    btn_label: "mehr dazu ..."
    btn_class: "btn--primary"

talks_feature:
  - image_path: /images/publications/talks-feature.jpeg
    alt: "Vorträge"
    title: "Vorträge"
    excerpt: 'Wir haben über 25 Bücher geschrieben, von der Anforderungsklärung, Business-Analyse, Architektur, Dokumentation, Verhaltensmuster (Knigge) bis zu Patterns'
    url: /talks
    btn_label: "mehr dazu ..."
    btn_class: "btn--primary"


---

{% include feature_row id="books_feature" type="left" %}

{% include feature_row id="articles_feature" type="right" %}

{% include feature_row id="videos_feature" type="left" %}

{% include feature_row id="talks_feature" type="right" %}



 