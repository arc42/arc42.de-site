---
title: "Prototyp: Firmenlogos"
layout: single
classes: wide
permalink: /prototypes/firmen-logos/
robots: noindex, nofollow
sitemap: false
excerpt: "Prototyp — gedimmte Firmenlogos als Vertrauenssignal für die Kurs-Seiten."
---

Prototyp für eine "diese Firmen schulen mit arc42"-Logowand, wie sie z. B. auf `/schulungen/`
unterhalb des Angebots stehen könnte. Logos sind gedimmt/monochrom, beim Hover erscheinen sie
in Originalfarbe; das Band läuft in Dauerschleife von rechts nach links und pausiert bei Hover.
Quellen: `docs/firmen-logos-quellen.md` (Wikimedia Commons, freie Dateien — vor produktivem
Einsatz Markenrichtlinien der jeweiligen Firma prüfen).

{% assign firmen_logos = "bosch|Robert Bosch GmbH,zeiss|Carl Zeiss AG,enbw|EnBW Energie Baden-Württemberg AG,trumpf|TRUMPF,db|Deutsche Bahn AG,fraunhofer|Fraunhofer-Gesellschaft,buehler|Bühler AG,gea|GEA Group,swm|Stadtwerke München,soprasteria|Sopra Steria,knds|KNDS Deutschland,barmenia|Barmenia Krankenversicherung AG,abus|ABUS Security Center,pepperlfuchs|Pepperl+Fuchs SE,bose|Bose Corporation" | split: "," %}

<div class="firmen-logos">
  <div class="firmen-logos__track">
    {% for pair in firmen_logos %}
      {% assign parts = pair | split: "|" %}
      <div class="firmen-logos__item"><img src="/assets/img/firmen-logos/{{ parts[0] }}.svg" alt="{{ parts[1] }}" loading="lazy"></div>
    {% endfor %}
    {% for pair in firmen_logos %}
      {% assign parts = pair | split: "|" %}
      <div class="firmen-logos__item" aria-hidden="true"><img src="/assets/img/firmen-logos/{{ parts[0] }}.svg" alt="" loading="lazy"></div>
    {% endfor %}
  </div>
</div>

<style>
.firmen-logos {
  margin: 3em 0;
  padding: 2.5em 0;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
  mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
}
.firmen-logos__track {
  display: flex;
  align-items: center;
  width: max-content;
  animation: firmen-logos-scroll 35s linear infinite;
}
.firmen-logos:hover .firmen-logos__track {
  animation-play-state: paused;
}
.firmen-logos__item {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 56px;
}
.firmen-logos__item img {
  max-width: 100%;
  max-height: 44px;
  width: auto;
  height: auto;
  filter: grayscale(1);
  opacity: 0.45;
  transition: filter 0.25s ease, opacity 0.25s ease;
}
.firmen-logos__item img:hover,
.firmen-logos__item img:focus {
  filter: none;
  opacity: 1;
}
@keyframes firmen-logos-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .firmen-logos__track {
    animation: none;
  }
}
</style>
