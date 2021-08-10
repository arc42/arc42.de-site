---
title: "arc42 Template"
layout: splash
permalink: /overview/
header:
  overlay_color: "#000"
  overlay_filter: "0.4"
  overlay_image: /images/splash/frantisek-duris-OdoWsR99gYA-unsplash.jpg
  caption: "Photo credit: [**Frantisek Duris**](https://unsplash.com/@modry_dinosaurus)"
excerpt: "Perfekt zur Kommunikation und Dokumentation Ihrer Softwarearchitektur."


feature_row1:
  - image_path: /images/template/01-intro-and-goals.png
    alt: "intro-image"
    title: "1. Einführung und Ziele"
    excerpt: 'Kurze Beschreibung und Extrakt der **requirements**, Die Top3 (bis maximal 5) **Qualitätsziele für die Architektur**, deren Erreichung für die wichtigsten Stakeholder kritisch ist.
Eine Übersicht über die wichtigsten **Stakeholder** mit deren Erwartungen bezüglich der Architektur.'
    url: "https://docs.arc42.org/section-1/"
    btn_label: "mehr dazu ..."
    btn_class: "btn--inverse"

feature_row2:
  - image_path: /images/template/02-constraints-overview.png
    alt: "constraints-image"
    title: "2. Randbedingungen"
    excerpt: 'Alles, was das Team beim Design und der Implementierun der Architektur einschränkt. Diese Einschränkungen sind manchmal auch außerhalb eines Projekts in der gesamten Organisation gültig.'
    url: "https://docs.arc42.org/section-2/"
    btn_label: "mehr dazu ..."
    btn_class: "btn--inverse"    

feature_row3:
  - image_path: /images/template/03-context-overview.png
    alt: "solution strategy overview"
    title: "3. Kontextabgrenzung"
    excerpt: 'Grenzt das System, an dem Sie arbeiten, von externen Kommunikationspartnern (Nachbarsystemsen und Benutzern) ab. Spezifiziert die externen Schnittstellen aus Sicht des Business (immer) und aus Sicht der Technologie (optional)'
    url: "https://docs.arc42.org/section-3/"
    btn_label: "mehr dazu ..."
    btn_class: "btn--inverse"    


feature_row4:
  - image_path: /images/template/04-solution-strategy-overview.svg
    alt: "solution strategy overview"
    title: "4. Lösungsstrategie"
    excerpt: 'Zusammenfassung der fundamentalen Entwurfsentscheidungen und Lösungsstrategien für die Gesamtarchitektur. Kann Technologieentschekidungen, Top-Level-Zerlegungsstrategie oder Ansätze zur Erreichung der Top-Qualitätsziele beinhalten, bzw. relevante Organisationsentscheidungen.'
    url: "https://docs.arc42.org/section-4/"
    btn_label: "mehr dazu ..."
    btn_class: "btn--inverse"    


feature_row5:
- image_path: /images/template/05-building-block-overview.png
  alt: "building block view"
  title: "5. Bausteinsicht"
  excerpt: 'Statische Zerlegung des Systems. Die Abstration des Sourcecodes, dargestellt als Hierarchie von "White-Boxes" (die wiederum kleinere Black-Boxes beinhalten), bis zu einem angemessenen Detaillierungsgrad.'
  url: "https://docs.arc42.org/section-5/"
  btn_label: "mehr dazu ..."
  btn_class: "btn--inverse"    

feature_row6:
- image_path: /images/template/06-runtime-overview.png
  alt: "runtime view"
  title: "6. Laufzeitsicht"
  excerpt: 'Das Verhalten der Bausteine in Form von dynamischen Szenarien, die die wichtisten Prozesse oder Features abdecken, Interaktionen an kritischen externen Schnittstellen oder "interessante" interne Abläufe und krtische Ausnahme- oder Fehlerfälle.'
  url: "https://docs.arc42.org/section-6/"
  btn_label: "mehr dazu ..."
  btn_class: "btn--inverse"    

feature_row7:
- image_path: /images/template/07-deployment-overview.png
  alt: "deployment view"
  title: "7. Verteilungssicht"
  excerpt: 'Technische Infrastruktur mit (echten oder virtuellen) Prozessoren, Systemtopologie, und die Abbildung der Software-Bausteine aif diese Infrastruktur.'
  url: "https://docs.arc42.org/section-7/"
  btn_label: "mehr dazu ..."
  btn_class: "btn--inverse"    

feature_row8:
- image_path: /images/template/08-concepts-overview.png
  alt: "crosscutting concepts"
  title: "8. Querschnittliche Konzepte"
  excerpt: 'Übergreifende, generelle Prinzipien und Lösungsansätze, die in vielen Teilen der Architektur einheitlich benutzt werden (→ cross-cutting). Konzepte beziehen sich oft auf **mehrere Bausteine**. Hier findet man Themen wie Domänenmodelle, Architekturmuster und -stile, Regeln zur Nutzung bestimmter Technologiestacks, etc.'
  url: "https://docs.arc42.org/section-8/"
  btn_label: "mehr dazu ..."
  btn_class: "btn--inverse"    

feature_row9:
- image_path: /images/template/09-decision-overview.png
  alt: "risks and technical decisions"
  title: "9. Architekturentscheidungen"
  excerpt: 'Wichtige, teure oder kritische oder riskante Architekturentscheidungen, die zentrale Bedeutung für das Gesamtsystem haben, mit Begründungen für diese Entscheidungen.'
  url: "https://docs.arc42.org/section-9/"
  btn_label: "mehr dazu ..."
  btn_class: "btn--inverse"    


feature_row10:
- image_path: /images/template/10-q-scenario-overview.png
  alt: "quality"
  title: "10. Qualitätsanforderungen"
  excerpt: 'Qualitätanforderungen in Form von Szenarien, mit einem Qualitätsbaum für den Überblick. Die allerwichtigsten Qualitätsziele sollten schon im Kapitel 1.2. (Qualitätsziele) aufgeführt sein. 
section 1.2. (quality goals).'
  url: "https://docs.arc42.org/section-10/"
  btn_label: "mehr dazu ..."
  btn_class: "btn--inverse"    

feature_row11:
- image_path: /images/template/11-risk-overview.png
  alt: "risk"
  title: "11. Risiken und technische Schulden"
  excerpt: 'Bekannte Risiken und angehäufte technische Schulden. Welche potentiellen problems lauern im und um das System? Über welche Schwächen beklagt sich die Entwicklungsteam?'
  url: "https://docs.arc42.org/section-11/"
  btn_label: "mehr dazu ..."
  btn_class: "btn--danger"    

feature_row12:
- image_path: /images/template/12-glossary-overview.png
  alt: "glossary"
  title: "12. Glossar"
  excerpt: 'Wichtige Domänenbegriffe und technische Begriffe, die Stakeholder kennen sollten, wenn sie über die Architektur des Systems diskutieren. Manchmal auch Übersetzungstabellen, wenn in einer mehrsprachigen Umgebung gearbeitet wird.'
  url: "https://docs.arc42.org/section-12/"
  btn_label: "mehr dazu ..."
  btn_class: "btn--inverse"    



---

arc42 gibt praxisorientierte Antwort die folgenden zwei Fragen, und läßt sich einfach an Ihre spezifischen Bedürfnisse anpassen:

* **_Was_** sollen wir über unsere Architektur kommunizieren/dokumentieren?
* **_Wie_** sollen wir kommunizieren/dokumentieren?

Dazu haben wir ein einfaches Template mit 12 Kapiteln entwickelt, in denen Sie alles Wissenswerte über die Architektur unterbringen können.

![](/images/template/template-struktur-focus.png)


Den Kern der Architekturdokumentation bilden die Kontexabgrenzung (Kap. 3), die drei Sichten (Bausteinsicht, Laufzeitsicht und Verteilungssicht - Kap. 5 - 7), sowie die querschnittlichen Konzepte (Kap. 8).

Die restlichen Kapitel runden die Dokumentation ab. Sie halten u.a. Ziele, wichtige Entscheidungen und Risiken fest. Ein abeschließendes Glossar stellt sicher, dass alle über das Gleiche sprechen.

Wenn Sie mehr zu den Kapiteln wissen wollen, lesen Sie weiter oder lernen Sie noch mehr Details über die jeweiligen Links.


<hr>

{% include feature_row id="feature_row1" type="left" %}

{% include feature_row id="feature_row2" type="right" %}

{% include feature_row id="feature_row3" type="left" %}

{% include feature_row id="feature_row4" type="right" %}

{% include feature_row id="feature_row5" type="left" %}

{% include feature_row id="feature_row6" type="right" %}

{% include feature_row id="feature_row7" type="left" %}

{% include feature_row id="feature_row8" type="right" %}

{% include feature_row id="feature_row9" type="left" %}

{% include feature_row id="feature_row10" type="right" %}

{% include feature_row id="feature_row11" type="left" %}

{% include feature_row id="feature_row12" type="right" %}

<hr>

# Weitere Informationen

So - jetzt kennen Sie die einzelnen Teile des Templates. Gerne können Sie noch weiterlesen:

Schauen Sie in unsere weiterführende Doku:

* Die ausführliche [Dokumentation des Templates](https://docs.arc42.org), geordnet nach den Sektionen des Templates.
Inklusive über 100 Tipps zur Anwendung.
* FAQ - [Häufig gestellte Fragen)](https://faq.arc42.org)
* Einige der von uns geschriebenen [Bücher](/books) beschäftigen sich mit arc42, beispielsweise:
  * [arc42 in Aktion]()
  * [arc42 by Example, Vol. 1](/books#arc42-by-example), arc42 anhand von sechs praktischen Beispielen erklärt
  * [arc42 by Example, Vol. 2](/books#arc42-by-example-vol2), Beispiele aus den Bereichen Echtzeit- und Embedded

