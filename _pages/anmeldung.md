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


<noscript>
     <h1>Zur Anmeldung muss Ihr Browser JavaScript erlauben!</h1>
     Aktuell ist das ausgeschaltet... Sie können uns entweder die Anmeldung
     per Email senden, 
     oder aber JavaScript einschalten und dann diese Seite im Browser erneut laden.
    <br><br>
     <a href='mailto:info@arc42.de?subject=[arc42] Anmeldung&body=Ihr Name:%0A%0AFür%20welchen%20Kurs%20melden%20Sie an:%0A-----------------------%0AKursbezeichnung:%0ADatum%20Kursbeginn:%0A%0ATeilnehmende%20Person(en):%0A-----------------------%0AVorname,%20Nachname:%0AEmail:%0A%0ARechnungsadresse:%0A%0A%0A-----------------------%0ABemerkungen:%0A'>
     <button class='button buttonAnmeldung'>Anmeldung<br>per E-Mail</button></a>
    
</noscript> 

<div id="main_body" style="display: none;">

<form action="https://submit-form.com/AIKiYyJP"
      data-botpoison-public-key="pk_8e195655-38ed-4eec-a445-a1e0d68a488d"
      id="arc42anmeldung">

<strong>Wer meldet an?</strong>
  <br>

<input type="text" id="nachname" name="Nachname" placeholder="* Nachname" size="20" required  />
<input type="text" id="vorname" name="Vorname" placeholder="Vorname" size="20"  />

<label for="email">E-Mail (für Anmeldebestätigung und Ähnliches)</label>
<input type="email" id="email" name="Email" placeholder="* E-Mail" required multiple  />

<label for="kurs">Für welchen Kurs melden Sie an?</label>
<select id="kurs" name="Kurs" required>
  <option value="*"></option>
  <option value="23-06 IMPROVE">IMPROVE, 19.-21. Juni 2023 Mannheim</option>
  <option value="23-06 ADOC">ADOC, 22.-23. Juni 2023 Mannheim</option>
  <option value="23-06 MSA">Mastering SW Architectures, 27.-30. Juni 2023 Frankfurt (Warteliste)</option>
  <option value="23-09 Req4Arc">Req4Arc, 5.-7. September 2023 Frankfurt/Main</option>
  <option value="23-09 MSA">Mastering SW Architectures, 12.-15. September 2023 Frankfurt (Warteliste)</option>
  <option value="23-11 MSA">Mastering SW Architectures, 14.-16. November (ONLINE, ENGLISH)</option>
  <option value="22-11 Improve">IMPROVE, 28.-30. November 2023 Hamburg</option>
  <option value="23-12 MSA">Mastering SW Architectures, 5.-8. Dezember 2023 München (Warteliste)</option>
  <option value="24-01 MSA">Mastering SW Architectures, 23.-26. Januar 2024 München</option>
  <option value="24-03 MSA">Mastering SW Architectures, 19.-22. März 2024 München</option>
 <!-- 
  <option value="23-06 IMPROVE">IMPROVE, 19.-21. Juni 2023 Mannheim</option>
  <option value="23-06 ADOC">ADOC, 22.-23. Juni 2023 Mannheim</option>
  -->
  <option value="24-04 Req4Arc">Req4Arc, 16.-18. April 2024 Frankfurt/Main</option>
  <option value="24-06 MSA">Mastering SW Architectures, 11.-14. Juni 2024 Frankfurt/Main</option>
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

</div>

<script type="text/javascript">
document.getElementById("main_body").style.display="block";
</script>


