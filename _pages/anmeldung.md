---
title: "Anmeldung"
layout: single
classes: wide
permalink: /anmeldung

botpoison: nospam

header:
  overlay_filter: rgba(15, 80, 180, 0.5)
  overlay_image: /images/splash/anmeldung-yves-moret-3vSGseoQj40.jpg
  caption: "Photo: [**Yves Moret**](https://unsplash.com/@yvesmoret)"

excerpt: "Wir freuen uns auf Sie!"
---


<form action="https://submit-form.com/AIKiYyJP"
      data-botpoison-public-key="pk_8e195655-38ed-4eec-a445-a1e0d68a488d"
      id="arc42anmeldung">

  <strong>Wer meldet an?</strong>
  <br>

<input type="text" id="nachname" name="Nachname" placeholder="* Nachname" size="20" required />
<input type="text" id="vorname" name="Vorname" placeholder="Vorname" size="20"  />

<label for="email">E-Mail (für Anmeldebestätigung und Ähnliches)</label>
<input type="email" id="email" name="Email" placeholder="* E-Mail" required multiple />

<label for="kurs">Für welchen Kurs melden Sie an?</label>
<select id="kurs" name="Kurs" required>
  <option value="*"></option>
  <option value="21-10-05 Req4Arc">REQ4ARC, 5.-7. Oktober 2021 Frankfurt</option>
  <option value="21-11-23 Improve">IMPROVE, 23.-25. November 2021 Hamburg</option>
  <option value="21-12 MSA">Mastering SW Architectures, 30.11-3.12. 2021, München</option>
  <option value="22-03-01 Improve">IMPROVE, 1.-3. März 2022, online</option>
  <option value="22-03-15 MSA">Mastering SW Architectures, 15.-18. März 2022 München</option>
  <option value="sonstige">Sonstige</option>
</select>

<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">

<strong>Teilnehmende Person(en)</strong>
<br>

Falls Sie mehr als eine Person anmelden, schreiben Sie die weiteren Namen als Bemerkung.
<input type="text" id="lastnameTN" name="NachnameTN" placeholder="Nachname teilnehmende Person"   />
<input type="text" id="firstnameTN" name="VornameTN" placeholder="Vorname teilnehmende Person"  />

<label for="email">E-Mail (teilnehmende Person(en), falls abweichend zu obiger E-Mail)</label>
<input type="email" id="emailTN" name="EmailTN" placeholder="E-Mail TN" />

<label for="ra">Rechnungsadresse</label>
<textarea id="ra" name="Rechnungsadresse" placeholder="* Diese Adresse benötigen wir zur Abrechnung" required ></textarea>

<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">
  
<label for="comments">Bemerkungen (z.B. weitere TN, Bestell-/Auftragsnummer)</label>
<textarea id="comments" name="Bemerkungen" placeholder="Bemerkungen"></textarea>
<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">
  
  <button type="submit" id="submit" class="button buttonAnmeldung" >Anmeldung absenden</button>
  <input type="button" value="Zurück" class="button buttonGrey" onclick="history.back()" style="float: right;">
  
<!-- 
 The following is the custom REDIRECT configuration for Formspark 
 =================================================================
-->

<input type="hidden"
    name="_redirect"
    value="{{ '/anmeldung-erfolg' | absolute_url }}"
  />  
<input type="hidden" 
    name="_error" 
    value="{{ '/anmeldung-fail' | absolute_url }}" 
  />

  
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

<script>
  var formElement = document.getElementById("arc42anmeldung");
  var buttonElement = document.getElementById("submit");
  formElement.addEventListener("botpoison-challenge-start", function () {
    buttonElement.setAttribute("disabled", "disabled");
  });
  formElement.addEventListener("botpoison-challenge-success", function () {
    buttonElement.removeAttribute("disabled");
  });
  formElement.addEventListener("botpoison-challenge-error", function () {
    buttonElement.removeAttribute("disabled");
  });
</script>

