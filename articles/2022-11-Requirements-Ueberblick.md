---
title: Behalten Sie den Überblick
layout: single

toc: right
toc_label: "Inhalt"

permalink: /articles/2022-11-requirements-overview
header:
  overlay_filter: rgba(15, 150, 150, 0.8)
  overlay_image: /images/splash/magazines-unsplash.jpg
  caption: "Photo: [**Charisse Kenion**](https://unsplash.com/@charissek)"

sidebar:
  nav: "publications"
---


Peter Hruschka und Gernot Starke

Ersticken Sie manchmal in Details und wünschen sich dringend mehr Überblick?
Wir haben viele Projekte und Entwicklungsteams erlebt, die jede Menge feingranulare, ganz detaillierte Anforderungen vorliegen hatten. Manchmal hatten wir mit Hunderten oder sogar einige Tausend einzelnen („atomaren“) Anforderungen zu tun.
Um eine solche Menge an (Detail-)Anforderungen effektiv bearbeiten zu können, brauchen Sie Überblick. Eine solche Vogelperspektive sollten Sie systematisch schaffen, und nicht darauf vertrauen, dass die Beteilgten den Überblick von allein bekommen.

In der heutigen (zum Glück ja meistens agilen) Welt können wir in den meisten Fällen auf aufgeblähte und formal abgenommene Pflichtenhefte verzichten. Um mit der Systementwicklung (also Architekturentscheidungen und Implementierung ) zu beginnen, genügen die wesentlichen architekturrelevante Anforderungen. Hierin liegt die erste Chance zur Gewinnung von Überblick.

Aber starten wir mal mit einer grundlegenden Beobachtung.

## Anforderungen ermitteln“ macht 25% des Arbeitsaufwands aus.

So viel Zeit erhalten Sie nie. 
Es genügt auch, mit geringem A-Priori Aufwand (ca. 1-2% des gesamten Aufwands) die architekturrelevanten Anforderungen im Groben zu erarbeiten, und die anderen 23 – 24 Prozent „Just in Time“ dann begleitend und iterativ-inkrementell zu liefern. 
Diese Arbeitsweise propagiert das T-Stich Modell, wobei Sie den Querbalken des „T“ frühzeitig liefern, und pro Iteration dann in Details gehen.

Folgende Abbildung zeigt Ihnen dieses Modell. 

![T-Stich Modell](/images/articles/22-11-overview/t-stich.png)

## Breite vor Tiefe – Anforderungen „Just in Time“

Als Entwicklungsteam wollen wir uns primär um architekturrelevante Anforderungen kümmern – gar nicht so sehr um „alle“. 
Manche Anforderungen haben prägenden Einfluss auf Architektur- oder Technologieentscheidungen. Um genau diese Art von Anforderungen geht es uns hier. 
Um zu erkennen, ob eine Anforderung Relevanz für die Architektur besitzt, braucht es Architektur- und Entwicklungs-Know-How. 
Sprich: Nur das Entwicklungsteam oder die Architektur können diese Relevanz erkennen. 

Sie sollten bereits frühzeitig einen Überblick der funktionalen Anforderungen haben, um Ihre Gesamtaufgabe besser einschätzen zu können. 
Das halten wir für notwendig, damit Sie auf Basis von Business-Prioritäten und technischer Randbedingungen entscheiden können, was davon Sie früher und was später angehen wollen. 
Das visualisiert das T-Modell (siehe Abbildung).

![Einfaches T-Modell](/images/articles/22-11-overview/t-model-simple.png)

Zu  diesem Überblick gehören auch die 3 -5 für Sie wichtigsten Qualitätsanforderungen (Ihre Hitparade, beispielsweise wie Performance, Kapazität, Security oder Usability) und die härtesten Randbedingungen. 
Dann können Sie mit der Entwicklung loslegen. 

Das „große Ganze“ soll frühzeitig klar sein, damit Sie die grobe Richtung der Entwicklung absehen können, und auf dieser Basis beginnen, richtungsweisende Technologie- oder Strukturentscheidungen zu treffen. 
Die detaillierten Anforderungen können Sie Just-in-Time später ergänzen.


## In der Praxis: Den Wald vor lauter Bäumen...

Nur die Details zu kennen, hilft dem Entwicklungsteam nicht weiter, wie das folgende Quiz zeigt. 
Sie sehen in der folgenden Abbildung eine Menge Details. 
Können Sie feststellen, worum es sich bei dem System handelt? 
Bekommen Sie auf dieser Basis den Überblick? 
Falls Ihnen der Name _Kenworth Montana_ etwas sagt, dann war einer der Detailausschnitte vielleicht verräterisch. 
Wenn nicht, dann wissen Sie bestimmt nicht, worum es bei dem ganzen System geht.
Wir haben das Beispiel absichtlich so gestaltet, dass Ihnen der Überblick kaum gelingen kann - aber wir glauben, Sie verstehen das Problem.

![Zu viele Details](/images/articles/22-11-overview/too-many-details.png)

Am Ende dieser Seite finden Sie die Auflösung...

## Schaffen Sie Überblick

In der IT bezeichnen wir den Überblick als Scope und Kontext eines Systems. 

Gehen Sie von Top-Level Geschäftsprozessen aus, und bauen systematisch eine Hierarchie auf, die es erlaubt in verschiedenen Bereich einzutauchen. 
Für unser Beispiel könnte das eine Zerlegung in Fahrgestell, Motor, Auspuff und Kabine sein:

![Epics](/images/articles/epics.webp)

Diese Top-Level Zerlegung könnten wir beispielsweise _Epics_ nennen.
Von dort aus bekommen Sie die Details des Systems (etwa: _User-Storys_ oder lower-level _Features_) in das Gesamtbild eingeordnet. 

Damit entsteht die gewünschte Hierarchie:

![Hierarchie von Anforderungen](/images/articles/22-11-overview/req-hierarchy.png)

## Was bringt das?
Rechnen Sie mit uns: 
1000 detaillierte Anforderungen sind vielleicht zu 100 Features gruppiert, und diese wiederum zu 10 Epics innerhalb des Gesamtsystems. 
Wir gewinnen mit jeder Ebene der Hierarchie also eine Größenordnung (Faktor-10) an Vereinfachung.

Diese Epics sollten Sie für die Architekturarbeit möglichst frühzeitig kennen. 
Es ist auch ok, wenn zu manchen Epics bereits Details existieren. 
Leider können Sie aber auf Basis solcher Details kaum sinnvolle Architekturentscheidungen treffen :-(


## Quellen

1. Requirements-for-Architects [(REQ4ARC) von iSAQB](https://www.isaqb.org/de/zertifizierungen/zertifizierungen-uebersicht/cpsa-advanced-level/req4arc-requirements-fuer-softwarearchitekten/)
2. P.Hruschka & G.Starke: Requirements Skills erfolgreicher Softwareteams. [Das Buch zum REQ4ARC Lehrplan](https://leanpub.com/requirements-skills)
3. [REQ4ARC Workshops und Training](https://arc42.de/termine)


## Auflösung: Der Gesamtüberblick

![Gesamtsystem](/images/articles/22-11-overview/overview.webp)




