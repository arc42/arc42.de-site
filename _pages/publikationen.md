---
title: "Publikationen"
layout: splash
permalink: /publikationen/
excerpt: "Bücher, Artikel, Vorträge und Videos der Menschen hinter arc42 — gesammelt in einer durchsuchbaren Bibliothek."
---

<section class="dl-hero resource-hero">
  <div class="dl-hero__inner">
    <p class="dl-hero__kicker">Bücher &middot; Artikel &middot; Vorträge &middot; Videos</p>
    <h1 class="dl-hero__title">Publikationen</h1>
    <p class="dl-hero__sub">Eine kompakte Bibliothek dessen, was wir über arc42 und Softwarearchitektur geschrieben, vorgetragen und aufgezeichnet haben. Stöbern Sie in der gesamten Sammlung — oder filtern Sie nach Ihrem Lieblingsformat.</p>
  </div>
</section>

{% assign dated = site.resources | where_exp: "r", "r.year" | sort: "year" | reverse %}
{% assign undated = site.resources | where_exp: "r", "r.year == nil" %}
{% assign resources = dated | concat: undated %}
{% assign books = site.resources | where: "type", "book" | size %}
{% assign articles = site.resources | where: "type", "article" | size %}
{% assign talks = site.resources | where: "type", "talk" | size %}
{% assign videos = site.resources | where: "type", "video" | size %}

<div class="resource-browser" data-resource-browser>
  <div class="resource-controls" id="resource-controls" tabindex="-1" aria-label="Publikationen filtern">
    <fieldset class="resource-types">
      <legend>Kategorie</legend>
      <div class="resource-types__options">
        <button type="button" class="resource-filter is-active" data-resource-type="all" aria-pressed="true">Alle <span data-type-count="all">{{ site.resources | size }}</span></button>
        <button type="button" class="resource-filter" data-resource-type="book" aria-pressed="false">Bücher <span data-type-count="book">{{ books }}</span></button>
        <button type="button" class="resource-filter" data-resource-type="article" aria-pressed="false">Artikel <span data-type-count="article">{{ articles }}</span></button>
        <button type="button" class="resource-filter" data-resource-type="talk" aria-pressed="false">Vorträge <span data-type-count="talk">{{ talks }}</span></button>
        <button type="button" class="resource-filter" data-resource-type="video" aria-pressed="false">Videos <span data-type-count="video">{{ videos }}</span></button>
      </div>
    </fieldset>

    <div class="resource-controls__secondary">
      <label class="resource-field">
        <span>Sprache</span>
        <select data-resource-language>
          <option value="all">Alle Sprachen</option>
          <option value="de">Deutsch</option>
          <option value="en">Englisch</option>
        </select>
      </label>
      <label class="resource-field resource-field--search">
        <span>Suche</span>
        <input type="search" data-resource-search placeholder="Titel, Autor oder Thema" autocomplete="off" title="Strg/Cmd + Enter: gesamte Website durchsuchen">
      </label>
      <button type="button" class="resource-reset" data-resource-reset>Zurücksetzen</button>
    </div>
  </div>

  <div class="resource-summary" aria-live="polite">
    <p><strong data-resource-count>{{ site.resources | size }} Publikationen</strong><span data-resource-context> in allen Kategorien</span></p>
  </div>

  <div class="resource-list" data-resource-list>
    {% for resource in resources %}{% include resource-item.html resource=resource %}
    {% endfor %}
  </div>

  <div class="resource-empty" data-resource-empty hidden>
    <h2>Keine passenden Publikationen</h2>
    <p>Versuchen Sie eine andere Kategorie, Sprache oder einen anderen Suchbegriff.</p>
    <button type="button" class="btn btn--arc42-outline" data-resource-reset>Filter zurücksetzen</button>
  </div>

  <button type="button" class="resource-backtop" data-resource-backtop hidden><span aria-hidden="true">&#8593;</span> Zurück zu den Filtern</button>
</div>

<div class="resource-footnote">
  <p><strong>Noch mehr Aufzeichnungen?</strong> Besuchen Sie den <a href="https://youtube.com/arc42-video" rel="noopener">arc42-YouTube-Kanal</a> oder <a href="https://speakerdeck.com/gernotstarke" rel="noopener">Gernots Speaker-Deck-Profil</a>.</p>
</div>

{% include course-bridge.html variant="card" %}

<script src="/assets/js/resources-filter.js" defer></script>
