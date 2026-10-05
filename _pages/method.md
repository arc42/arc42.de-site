---
title: "arc42 Methodik"
layout: splash
permalink: /method/
classes:
  - method-page
excerpt: "arc42 ist mehr als ein Dokumentations-Template: eine iterative Methodik für Entwurf und Weiterentwicklung von Softwarearchitektur, aufgebaut aus sechs wiederkehrenden Tätigkeiten, ständigem Lernen und kontinuierlichem Feedback."
---

{% comment %}
  Redesign von /method/ nach dem Vorbild von arc42.org/method/.
  Blöcke in <div class="method-legacy"> sind unveränderter Originaltext der
  alten deutschen Methodik-Seite (_pages/method.md) und werden auf der Seite
  bernsteinfarben markiert: dort ist sprachliche Überarbeitung fällig.
  Alles außerhalb dieser Blöcke ist neu (aus dem Englischen übertragen).
{% endcomment %}

<section class="dl-hero">
  <div class="dl-hero__inner">
    <p class="dl-hero__kicker">Mehr als ein Template</p>
    <h1 class="dl-hero__title">Die arc42-Methodik</h1>
    <p class="dl-hero__sub">Die meisten kennen arc42 als Template für Architekturdokumentation. Dahinter steckt aber auch eine klare <strong>Methodik</strong>: sechs wiederkehrende, eng verzahnte Tätigkeiten, die Architektur, Code und Stakeholder im Einklang halten, in agilen, schlanken oder formalen Projekten gleichermaßen.</p>
  </div>
</section>

<p class="method-legacy-note"><strong>Entwurf.</strong> Bernsteinfarben markierte Abschnitte sind Originaltext der bisherigen Methodik-Seite und noch zu überarbeiten.</p>

<div class="method-legacy" markdown="1">
arc42 gibt praxisorientierte Antwort die folgenden zwei Fragen, und lässt sich einfach an Ihre spezifischen Bedürfnisse anpassen:

* **_Was_** sollen wir über unsere Architektur kommunizieren/dokumentieren?
* **_Wie_** sollen wir kommunizieren/dokumentieren?
</div>

<figure class="method-diagram" id="method-diagram">
  {% include method-activities-diagram.svg %}
  <figcaption>Die sechs Tätigkeiten und wie sie sich gegenseitig speisen. Strukturen und querschnittliche Konzepte überlappen: Keines lässt sich ohne das andere entwerfen. Ein Klick auf eine Tätigkeit springt zu ihrer Beschreibung.</figcaption>
</figure>

<aside class="method-principles" markdown="1">
## Zwei Prinzipien ziehen sich durch alles {#prinzipien}

<div class="method-legacy" markdown="1">
**Ständig lernen.** Wir (genauer: alle Menschen, die in der IT-Entwicklung arbeiten) haben es mit einer sehr dynamischen Branche, ständig neuen Technologien, Methoden, Bibliotheken, Frameworks und Vorgehensweisen zu tun.
Wir müssen bei Entwurf, Implementierung und Betrieb von IT-Systemen diese Innovationen berücksichtigen - zumindest ihre Auswirkungen auf unser aktuelles System einschätzen können.
Aus unserer Sicht können wir das nur leisten, wenn wir das _ständig lernen_ zu einem grundsätzlichen Verhalten machen.
Dank Internet und omnipräsentem Zugang zu Informationen haben wir dazu die Möglichkeit, wir müssen sie lediglich für uns angemessen nutzen.

**Iterativ, mit Feedback.** Methodisches Vorgehen in Architektur und Entwicklung soll grundsätzlich _iterativ_ sein: Ergänzen und begleiten Sie immer (!) analytische und konstruktive Aufgaben durch systematische Rückmeldungen (_Feedback_).
</div>
</aside>

## 1 · Anforderungen klären {#anforderungen-klaeren}

<div class="method-legacy" markdown="1">
Entwicklungsteams benötigen ein robustes und tragfähiges Fundament von Zielen, Anforderungen und Randbedingungen, um zielgerichtet entscheiden und entwickeln zu können.

Softwarearchitekt:innen können zur Klärung von Anforderung entscheidend beitragen, in dem sie beispielsweise Qualitätsanforderungen hinterfragen, funktionale Anforderungen kategorisieren und technische Risiken aufzeigen.
</div>

<p class="method-backtop"><a href="#method-diagram"><span aria-hidden="true">&#8593;</span> Zurück zum Diagramm</a></p>

## 2 · Strukturen entwerfen {#strukturen-entwerfen}

<div class="method-legacy" markdown="1">
Der Aufbau eines Systems aus kleineren Teilen (arc42 nutzt die Bezeichnung _Bausteine_ dafür, weil das technologieneutral ist) gehört zu den fundamentalen Aufgaben in der Architektur und Entwicklung.

Die (statische) _Bausteinsicht_ und deren (dynamisches) Pendant _Laufzeitsicht_ fallen in den Bereich dieser Aufgabe.
Ebenfalls gehören _Schnittstellen_ dazu, die Verbindung zwischen Bausteinen bzw. unserem System und der Außenwelt (_externe Schnittstellen_).
</div>

<p class="method-backtop"><a href="#method-diagram"><span aria-hidden="true">&#8593;</span> Zurück zum Diagramm</a></p>

## 3 · Querschnittliche Konzepte entwerfen {#konzepte-entwerfen}

<div class="method-legacy" markdown="1">
Übergreifende Entscheidungen, wie etwa die Auswahl der grundlegenden Technologie für Entwicklung oder Betrieb, die Wahl der Infrastruktur oder auch die eingesetzten Frameworks oder Bibliotheken - das versteht arc42 als _querschnittliche Konzepte_.
Solche Konzepte können direkte Auswirkung auf einzelne oder auch alle Bausteine haben.
Es kann sich um mehrfach oder übergreifend verwendete Architektur- oder Entwurfsmuster handeln.
Konzepte können sich auch auf andere Themen beziehen, beispielsweise Techniken und Methodik für Build, Deployment, Test und/oder Release des Systems.

arc42 schlägt einen ganzen Zoo von Themen vor, die Sie in der Architektur _querschnittlich_ lösen könnten (aber nicht müssen) - hier ein kleiner Auszug:

* Wie wird die (grafische) Benutzungsoberfläche strukturiert und implementiert? Welche Bibliotheken oder Patterns kommen zum Einsatz?
* Wie, wo und womit werden persistente Daten gespeichert, verteilt und wieder gelesen? Welche Datenbanken kommen zum Einsatz?
* Wie werden Geschäfts-, Validierungs- oder Plausibilisierungsregeln umgesetzt?
* Wie geht das System und dessen Bausteine mit Fehler- oder Ausnahmesituationen um?
* Wie geht das System mit Protokollierung und Logging um?

Mehr Details finden Sie in Sektion 8 des arc42 Templates...
</div>

<p class="method-backtop"><a href="#method-diagram"><span aria-hidden="true">&#8593;</span> Zurück zum Diagramm</a></p>

## 4 · Kommunizieren und dokumentieren {#kommunizieren}

<div class="method-legacy" markdown="1">
Sie sollten Ihre Architektur- und Entwurfsentscheidungen mit den relevanten Stakeholdern abstimmen, deren Feedback einholen und ggfs. einarbeiten.
Manche Entscheidungen sollten Sie schriftlich fixieren:
Je nach Branche, Art des Systems, Kritikalität, Risiko und/oder Vorgehensmodell mal mehr, mal weniger.

Grundsätzlich empfehlen wir, mündlich intensiv über Architekturentscheidungen zu kommunizieren, insbesondere mit und innerhalb des Entwicklungsteams.
Dafür sollten Sie so sparsam wie möglich schriftlich dokumentieren:
Die Schriftform erzeugt bei zukünftigen Änderungen Pflegeaufwand, den viele Teams verständlicherweise scheuen.

Das arc42 Template eignet sich sowohl für sehr sparsame wie auch sehr ausführliche und gründliche Dokumentation.
</div>

<p class="method-backtop"><a href="#method-diagram"><span aria-hidden="true">&#8593;</span> Zurück zum Diagramm</a></p>

## 5 · Umsetzung begleiten {#umsetzung-begleiten}

<div class="method-legacy" markdown="1">
Während der Entwicklungsiterationen haben Sie mit Ihrem Team viel diskutiert und sich gründlich abgestimmt.
Sie haben (hoffentlich gemeinsam) Bausteine, Schnittstellen und Konzepte entworfen - kurzum:
Sie haben alles richtig gemacht.

Leider ist solch gute Kommunikation nicht ausreichend:
Es könnte nämlich sein, dass sich in die Implementierung, also in den Quellcode, Abweichungen von den diskutierten, besprochenen oder sogar dokumentierten Entscheidungen einschleichen:

Ob das aus Absicht oder Versehen geschieht - Sie sollten in jedem Fall gemeinsam mit Ihrem Team sicherstellen, dass der Quellcode die Strukturen und Konzepte auch so implementiert, wie das vorgesehen war.
Überprüfen Sie, ob Entscheidungen angemessen umgesetzt werden beziehungsweise die von Ihnen gewünschten Auswirkungen zeigen.

Übrigens kommt es manchmal sogar vor, dass einzelne Entwickler:innen noch viel bessere Ideen haben als die Architekturgruppe - solche _Goldstücke_ der Implementierung könnten Sie durch die systematische Begleitung der Umsetzung finden und zum Bestandteil der Architektur machen!

Auf der anderen Seite könnten Entwickler:innen auch Entwurfsentscheidungen oder Konzepte missverstehen oder schlecht umsetzen.
In solchen Fällen sollten Sie coachen und den Betroffenen die Entscheidungen oder Konzepte erläutern oder sie bei deren Implementierung unterstützen.

In jedem Fall sollten Sie in den Quellcode Ihrer Systeme schauen (= _Code-Reviews_) und die Ist-Implementierung mit dem gewünschten Soll vergleichen.
Erst durch diese (Detail-)Arbeit können Sie wirklich erkennen, ob und wie Architekturentscheidungen letztlich umgesetzt werden.

Gerade in größeren Teams kann eine einzelne Person nicht mehr den gesamten erstellten oder geänderten Quellcode überprüfen.
Codeanalyse-Werkzeuge können helfen, aber in wesentlichen Fällen (kritische oder wichtige Stellen im System) sollten Menschen solche Reviews durchführen (nur sie können nach Gründen fragen und diese situativ einschätzen).
Oft genügt es auch, kleine Teile des Quellcodes zu inspizieren, um den Aufwand dieser Aufgabe in angemessenem Rahmen zu halten.
</div>

<p class="method-backtop"><a href="#method-diagram"><span aria-hidden="true">&#8593;</span> Zurück zum Diagramm</a></p>

## 6 · Analysieren und bewerten {#analysieren-bewerten}

<div class="method-legacy" markdown="1">
Fragen Sie sich als Softwarearchitekt:in in regelmäßigen Abständen, ob ihre Entscheidungen und Konzepte die gewünschte Wirkung erzielen bzw. aus heutiger Sicht immer noch angemessen erscheinen.
Diese einfache Rückkopplungsschleife bildet die Grundlage von iterativen (neudeutsch: _agilen_) Prozessen.
Der Plan-Do-Check-Act-Kreislauf (PDCA oder Deming-Kreis) hat den systematischen Rückblick (die Check-Phase) zum System erhoben, aus gutem Grund:
Nur Handeln und Entscheiden ohne Reflektion, ohne Rückblick, führt leicht zu Zielverfehlung und Aktionismus.
Blicken Sie also in einen _methodischen Rückspiegel_ und unterziehen Ihr System, Ihre Architektur- und Entwurfsentscheidungen, Ihre Konzepte etc. ab-und-zu einem methodischen Review.

Im besten Fall finden Sie (bzw. Entwicklungsteam und andere betroffenen Stakeholder) immer noch alle Entscheidungen super - dann machen Sie weiter!
In anderen Fällen können Sie durch die Analyse und Bewertung mögliche Schwachstellen oder Risiken zu einem frühen Zeitpunkt identifizieren und passende Verbesserungsmaßnahmen einplanen und einleiten.
</div>

<p class="method-backtop"><a href="#method-diagram"><span aria-hidden="true">&#8593;</span> Zurück zum Diagramm</a></p>

<section class="method-cta">
  <h2>Die Methodik anwenden</h2>
  <p>Sechs Tätigkeiten, ein Template, zwanzig Jahre Praxis. Fangen Sie mit dem Download an; die Methodik ist gleich eingebaut.</p>
  <p>
    <a href="https://arc42.org/download" class="btn btn--arc42"><span aria-hidden="true">&#8595;</span> arc42 herunterladen</a>
    <a href="/overview/" class="btn btn--arc42-outline">Das Template erkunden</a>
    <a href="/schulungen/" class="btn btn--arc42-outline">Im Workshop lernen</a>
  </p>
</section>

{% include course-bridge.html variant="card" %}
