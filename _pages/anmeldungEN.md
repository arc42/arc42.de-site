---
title: "Registration"
layout: single
classes: wide
permalink: /anmeldungEN/

botpoison: nospam

header:
  overlay_filter: rgba(15, 80, 180, 0.5)
  overlay_image: /images/splash/anmeldung-yves-moret-3vSGseoQj40.jpg
  caption: "Photo: [**Yves Moret**](https://unsplash.com/@yvesmoret)"

excerpt: "Looking forward meeting you!"
---

{% comment %}
  The English twin of _pages/anmeldung.md — same structure, same behaviour,
  same assets/js/arc42-anmeldung.js (that script carries no user-visible
  strings, so both languages share it). Keep the two files in step: a change
  to the field set, the summary panel or the commitment block belongs in both.

  It differs from the German page in exactly two ways: the copy, and the
  `d.language != "en"` filter on the course list, which was already here.

  See anmeldung.md for why the form is no longer hidden behind
  `display:none` + an inline reveal script.
{% endcomment %}

<noscript>
  <div class="anmeldung-noscript">
    <p><strong>Your browser is not running JavaScript right now.</strong>
    You can still read the form below, but our spam protection needs
    JavaScript, so submitting it will not work.</p>
    <p>Please send us your registration by e-mail instead — it takes under a
    minute. We only need the course, the date, the names and a billing address.</p>
    <p><a class="button buttonAnmeldung" href="mailto:info@arc42.de?subject=[arc42]%20Registration&amp;body=Your%20name:%0A%0AWhich%20course%20and%20date:%0A-----------------------%0ACourse:%0AStart%20date:%0A%0AParticipant(s):%0A-----------------------%0AFirst%20name,%20last%20name:%0AEmail:%0A%0ABilling%20address:%0A%0A%0A-----------------------%0AComments:%0A">Register by e-mail</a></p>
  </div>
</noscript>

<div id="kurs-summary" class="booking-summary" hidden>
  <p class="booking-summary__eyebrow">Your selection</p>
  <p class="booking-summary__title" data-summary="title"></p>
  <dl class="booking-summary__facts">
    <dt>Date</dt><dd data-summary="date"></dd>
    <dt data-summary-row="where">Location</dt><dd data-summary="where"></dd>
    <dt data-summary-row="trainers">Trainer</dt><dd data-summary="trainers"></dd>
    <dt data-summary-row="credits">iSAQB credits</dt><dd data-summary="credits"></dd>
    <dt data-summary-row="price">Fee</dt><dd class="booking-summary__price" data-summary="price"></dd>
  </dl>
</div>

<form action="https://submit-form.com/AIKiYyJP"
      data-botpoison-public-key="pk_8e195655-38ed-4eec-a445-a1e0d68a488d"
      id="arc42anmeldung"
      class="anmeldung-form">

<fieldset class="form-section">
  <legend>Who is registering?</legend>
  <p class="form-section__hint">We send the confirmation and, later, the invoice to this address.</p>

  <div class="field-row">
    <div class="field">
      <label for="nachname">Last name <span class="req" aria-hidden="true">*</span></label>
      <input type="text" id="nachname" name="last name" autocomplete="family-name" required />
    </div>
    <div class="field">
      <label for="vorname">First name</label>
      <input type="text" id="vorname" name="first name" autocomplete="given-name" />
    </div>
  </div>

  <div class="field">
    <label for="email">E-Mail <span class="req" aria-hidden="true">*</span>
      <span class="label-hint">For the confirmation and any follow-up questions.</span>
    </label>
    <input type="email" id="email" name="Email" autocomplete="email" required multiple />
  </div>
</fieldset>

<fieldset class="form-section">
  <legend>Which training?</legend>

  <div class="field">
    <label for="kurs">Course and date <span class="req" aria-hidden="true">*</span></label>
    {%- assign today = 'now' | date: '%Y-%m-%d' -%}
    <select id="kurs" name="Kurs" required>
      <option value="" disabled selected>Please choose a course and date</option>
      {%- for course in site.data.trainings.courses -%}
        {%- for d in course.dates -%}
          {%- if d.status != "open" -%}{%- continue -%}{%- endif -%}
          {%- if d.end < today -%}{%- continue -%}{%- endif -%}
          {%- if d.language != "en" -%}{%- continue -%}{%- endif -%}
          {%- capture datelabel %}{% include training-date-label.html date=d lang="en" style="short" %}{% endcapture -%}
          {%- assign trainerlist = d.trainers | default: course.trainers -%}
          {%- capture wherelabel -%}
            {%- if d.format == "online" -%}Online{%- else -%}{{ d.city }}{%- endif -%}
          {%- endcapture -%}
      <option value="{{ d.code }}"
              data-id="{{ d.id }}"
              data-title="{{ course.title | default: course.short_title | escape }}"
              data-date="{{ datelabel | strip | escape }}"
              data-where="{{ wherelabel | strip | escape }}"
              {% if trainerlist %}data-trainers="{{ trainerlist | join: ' and ' | escape }}"{% endif %}
              {% if course.credits %}data-credits="{{ course.credits | escape }}"{% endif %}
              {% if d.pricing %}data-price="{{ d.pricing | escape }}"{% endif %}>{{ datelabel | strip }} · {{ course.short_title }}{% if d.format == "online" %}, online{% elsif d.city %}, {{ d.city }}{% endif %}</option>
        {%- endfor -%}
      {%- endfor -%}
      <option value="other">Another date / in-house enquiry</option>
    </select>
  </div>
</fieldset>

<fieldset class="form-section">
  <legend>Participant</legend>
  <p class="form-section__hint">Only needed if the participant is not the person registering.
  For several people, please list the others under “Comments” below.</p>

  <div class="field-row">
    <div class="field">
      <label for="lastnameTN">Last name</label>
      <input type="text" id="lastnameTN" name="NachnameTN" autocomplete="off" />
    </div>
    <div class="field">
      <label for="firstnameTN">First name</label>
      <input type="text" id="firstnameTN" name="VornameTN" autocomplete="off" />
    </div>
  </div>

  <div class="field">
    <label for="emailTN">Participant’s e-mail
      <span class="label-hint">If different from the address above.</span>
    </label>
    <input type="email" id="emailTN" name="EmailTN" autocomplete="off" />
  </div>
</fieldset>

<fieldset class="form-section">
  <legend>Invoice</legend>

  <div class="field">
    <label for="ra">Billing address <span class="req" aria-hidden="true">*</span>
      <span class="label-hint">Company, street, postal code and city — plus VAT ID, cost centre
      or purchase-order number if your finance team needs them on the invoice.</span>
    </label>
    <textarea id="ra" name="Billing address" autocomplete="street-address" required></textarea>
  </div>

  <div class="field">
    <label for="comments">Comments
      <span class="label-hint">Additional participants, questions, anything else.</span>
    </label>
    <textarea id="comments" name="Comments"></textarea>
  </div>
</fieldset>

<div class="anmeldung-terms">
  <ul>
    <li>All fees are <strong>per person and exclude VAT</strong> at the applicable statutory rate.
        <a href="/terms-en/#prices">What the fee includes</a></li>
    <li>Cancellation is <strong>free of charge up to 21 days before the course starts</strong>,
        on a sliding scale after that. You may name a replacement participant at any time at no
        extra cost. <a href="/terms-en/#deregistration">Cancellation terms</a></li>
    <li>We confirm every registration by e-mail. Your seat is reserved from that point;
        the registration becomes binding with our confirmation.</li>
  </ul>
</div>

<div class="anmeldung-actions">
  <button type="submit" id="submit" class="btn btn--arc42">Send registration</button>
  <a class="btn btn--arc42-outline" href="/termine/">Back to the schedule</a>
</div>

<p class="anmeldung-fallback">Prefer e-mail? Write to
<a href="mailto:info@arc42.de?subject=[arc42]%20Registration">info@arc42.de</a> —
with the course, the date, the names and a billing address.</p>

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
<input type="hidden" name="_email.subject" value="[arc42.de] Registration" />
<input type="hidden" name="_email.from" value="arc42.de Website (via formspark.io)" />
<input type="hidden" name="_email.template.title" value="Registration (via arc42.de)" />

</form>

<script src="/assets/js/arc42-anmeldung.js" defer></script>
