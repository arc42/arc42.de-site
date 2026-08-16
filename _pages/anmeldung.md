---
title: "Anmeldung"
layout: single
classes: wide
permalink: /anmeldung/

botpoison: nospam

header:
  overlay_filter: rgba(15, 80, 180, 0.5)
  overlay_image: /images/splash/anmeldung-yves-moret-3vSGseoQj40.jpg
  caption: "Photo: [**Yves Moret**](https://unsplash.com/@yvesmoret)"

excerpt: "Wir freuen uns auf Sie!"
---

{% comment %}
  The form is rendered visible and is no longer gated behind
  `display:none` + an inline reveal script. That gate meant any JavaScript
  failure — a blocked unpkg.com (botpoison), a strict corporate CSP, a
  network hiccup — left this page showing nothing but its <h1>.

  Three states are covered now:
  - JS works        -> summary block + preselection light up, form submits.
  - JS off          -> <noscript> notice, form still readable, e-mail route offered.
  - JS loaded, then broke -> form is there, e-mail route is there, and a failed
                             submit still lands on /anmeldung-fail/.

  Deep links: /anmeldung/?kurs=<date-id>, where <date-id> is the `id` of a date
  in _data/trainings.json (e.g. msa-dez-2026). That is the same value used as
  the timeline anchor on /termine/, so the buttons there hand their date over
  instead of dropping it. Unknown or stale ids fall through harmlessly to "no
  preselection". The submitted value stays `d.code`, so nothing changes for
  Formspark.
{% endcomment %}

<noscript>
  <div class="anmeldung-noscript">
    <p><strong>Ihr Browser führt derzeit kein JavaScript aus.</strong>
    Das Formular unten können Sie weiterhin lesen, aber unser Spamschutz
    braucht JavaScript — das Absenden funktioniert deshalb nicht.</p>
    <p>Senden Sie uns Ihre Anmeldung bitte per E-Mail, es dauert keine Minute.
    Wir brauchen darin nur Kurs, Termin, Namen und Rechnungsadresse.</p>
    <p><a class="button buttonAnmeldung" href="mailto:info@arc42.de?subject=[arc42]%20Anmeldung&amp;body=Ihr%20Name:%0A%0AF%C3%BCr%20welchen%20Kurs%20melden%20Sie%20an:%0A-----------------------%0AKursbezeichnung:%0ADatum%20Kursbeginn:%0A%0ATeilnehmende%20Person(en):%0A-----------------------%0AVorname,%20Nachname:%0AEmail:%0A%0ARechnungsadresse:%0A%0A%0A-----------------------%0ABemerkungen:%0A">Anmeldung per E-Mail</a></p>
  </div>
</noscript>

<div id="kurs-summary" class="booking-summary" hidden>
  <p class="booking-summary__eyebrow">Ihre Auswahl</p>
  <p class="booking-summary__title" data-summary="title"></p>
  <dl class="booking-summary__facts">
    <dt>Termin</dt><dd data-summary="date"></dd>
    <dt data-summary-row="where">Ort</dt><dd data-summary="where"></dd>
    <dt data-summary-row="trainers">Trainer</dt><dd data-summary="trainers"></dd>
    <dt data-summary-row="credits">iSAQB-Punkte</dt><dd data-summary="credits"></dd>
    <dt data-summary-row="price">Preis</dt><dd class="booking-summary__price" data-summary="price"></dd>
  </dl>
</div>

<form action="https://submit-form.com/AIKiYyJP"
      data-botpoison-public-key="pk_8e195655-38ed-4eec-a445-a1e0d68a488d"
      id="arc42anmeldung"
      class="anmeldung-form">

<fieldset class="form-section">
  <legend>Wer meldet an?</legend>
  <p class="form-section__hint">An diese Adresse geht die Anmeldebestätigung und später die Rechnung.</p>

  <div class="field-row">
    <div class="field">
      <label for="nachname">Nachname <span class="req" aria-hidden="true">*</span></label>
      <input type="text" id="nachname" name="Nachname" autocomplete="family-name" required />
    </div>
    <div class="field">
      <label for="vorname">Vorname</label>
      <input type="text" id="vorname" name="Vorname" autocomplete="given-name" />
    </div>
  </div>

  <div class="field">
    <label for="email">E-Mail <span class="req" aria-hidden="true">*</span>
      <span class="label-hint">Für Anmeldebestätigung und Rückfragen.</span>
    </label>
    <input type="email" id="email" name="Email" autocomplete="email" required multiple />
  </div>
</fieldset>

<fieldset class="form-section">
  <legend>Welcher Kurs?</legend>

  <div class="field">
    <label for="kurs">Kurs und Termin <span class="req" aria-hidden="true">*</span></label>
    {%- assign today = 'now' | date: '%Y-%m-%d' -%}
    <select id="kurs" name="Kurs" required>
      <option value="" disabled selected>Bitte Kurs und Termin wählen</option>
      {%- for course in site.data.trainings.courses -%}
        {%- for d in course.dates -%}
          {%- if d.status != "open" -%}{%- continue -%}{%- endif -%}
          {%- if d.end < today -%}{%- continue -%}{%- endif -%}
          {%- comment -%}
            The visible label is deliberately short — date first, because that is
            what people decided on over on /termine/. Everything else (full title,
            trainers, credits, price) rides along in data-* and is shown in the
            summary block above, where it does not have to fit in a dropdown.
          {%- endcomment -%}
          {%- capture datelabel %}{% include training-date-label.html date=d lang="de" style="short" %}{% endcapture -%}
          {%- assign trainerlist = d.trainers | default: course.trainers -%}
          {%- capture wherelabel -%}
            {%- if d.format == "online" -%}Online{% if d.language == "en" %}, in englischer Sprache{% endif %}
            {%- else -%}{{ d.city }}{% if d.language == "en" %}, in englischer Sprache{% endif %}
            {%- endif -%}
          {%- endcapture -%}
      <option value="{{ d.code }}"
              data-id="{{ d.id }}"
              data-title="{{ course.title | default: course.short_title | escape }}"
              data-date="{{ datelabel | strip | escape }}"
              data-where="{{ wherelabel | strip | escape }}"
              {% if trainerlist %}data-trainers="{{ trainerlist | join: ' und ' | escape }}"{% endif %}
              {% if course.credits %}data-credits="{{ course.credits | escape }}"{% endif %}
              {% if d.pricing %}data-price="{{ d.pricing | escape }}"{% endif %}>{{ datelabel | strip }} · {{ course.short_title }}{% if d.format == "online" %}, online{% if d.language == "en" %} (EN){% endif %}{% elsif d.city %}, {{ d.city }}{% endif %}</option>
        {%- endfor -%}
      {%- endfor -%}
      <option value="sonstige">Ein anderer Termin / Inhouse-Anfrage</option>
    </select>
  </div>
</fieldset>

<fieldset class="form-section">
  <legend>Teilnehmende Person</legend>
  <p class="form-section__hint">Nur ausfüllen, falls die teilnehmende Person nicht die anmeldende ist.
  Mehrere Personen tragen Sie bitte unten unter „Bemerkungen“ ein.</p>

  <div class="field-row">
    <div class="field">
      <label for="lastnameTN">Nachname</label>
      <input type="text" id="lastnameTN" name="NachnameTN" autocomplete="off" />
    </div>
    <div class="field">
      <label for="firstnameTN">Vorname</label>
      <input type="text" id="firstnameTN" name="VornameTN" autocomplete="off" />
    </div>
  </div>

  <div class="field">
    <label for="emailTN">E-Mail der teilnehmenden Person
      <span class="label-hint">Falls abweichend von der Adresse oben.</span>
    </label>
    <input type="email" id="emailTN" name="EmailTN" autocomplete="off" />
  </div>
</fieldset>

<fieldset class="form-section">
  <legend>Rechnung</legend>

  <div class="field">
    <label for="ra">Rechnungsadresse <span class="req" aria-hidden="true">*</span>
      <span class="label-hint">Firma, Straße, PLZ und Ort — plus USt-IdNr., Kostenstelle oder
      Bestellnummer, falls Ihre Buchhaltung die auf der Rechnung braucht.</span>
    </label>
    <textarea id="ra" name="Rechnungsadresse" autocomplete="street-address" required></textarea>
  </div>

  <div class="field">
    <label for="comments">Bemerkungen
      <span class="label-hint">Weitere teilnehmende Personen, Fragen, alles Weitere.</span>
    </label>
    <textarea id="comments" name="Bemerkungen"></textarea>
  </div>
</fieldset>

<div class="anmeldung-terms">
  <ul>
    <li>Alle Preise verstehen sich <strong>pro Person und zuzüglich der gesetzlichen
        Mehrwertsteuer</strong>. <a href="/terms/#preise">Was im Preis enthalten ist</a></li>
    <li>Die Abmeldung ist <strong>bis 21 Tage vor Kursbeginn kostenfrei</strong> möglich,
        danach gestaffelt. Eine Ersatzperson können Sie jederzeit ohne Mehrkosten benennen.
        <a href="/terms/#abmeldung">Abmeldebedingungen</a></li>
    <li>Sie erhalten von uns eine Bestätigung per E-Mail. Der Platz ist damit für Sie
        reserviert; verbindlich wird die Anmeldung mit unserer Bestätigung.</li>
  </ul>
</div>

<div class="anmeldung-actions">
  <button type="submit" id="submit" class="btn btn--arc42">Anmeldung absenden</button>
  <a class="btn btn--arc42-outline" href="/termine/">Zurück zu den Terminen</a>
</div>

<p class="anmeldung-fallback">Lieber per E-Mail? Schreiben Sie uns an
<a href="mailto:info@arc42.de?subject=[arc42]%20Anmeldung">info@arc42.de</a> —
mit Kurs, Termin, Namen und Rechnungsadresse.</p>

<!--
 The following is the custom REDIRECT configuration for Formspark
 =================================================================
-->

<input type="hidden"
    name="_redirect"
    value="{{ '/anmeldung-erfolg/' | absolute_url }}"
  />
<input type="hidden"
    name="_error"
    value="{{ '/anmeldung-fail/' | absolute_url }}"
  />

<input type="hidden" name="_source" value="arc42.de" />

<!-- As we generate static HTML, we do NOT want to append field values to the redirect URL -->
<input type="hidden"
    name="_append"
    value="false"
 />

<!--
The following is the custom EMAIL customization for Formspark
see https://documentation.formspark.io/customization/email.html#subject
-->
<input type="hidden" name="_email.subject" value="[arc42.de] ANMELDUNG" />
<input type="hidden" name="_email.from" value="arc42.de Website (via formspark.io)" />
<input type="hidden" name="_email.template.title" value="Anmeldung (via arc42.de)" />

</form>

<script src="/assets/js/arc42-anmeldung.js" defer></script>
