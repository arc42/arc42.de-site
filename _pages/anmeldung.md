---
title: "Anmeldung"
layout: single
classes: wide
permalink: /anmeldung
header:
  overlay_filter: rgba(15, 80, 180, 0.5)
  overlay_image: /images/splash/anmeldung-yves-moret-3vSGseoQj40.jpg
  caption: "Photo: [**Yves Moret**](https://unsplash.com/@yvesmoret)"

excerpt: "Wir freuen uns auf Sie!"
---


<form action="https://submit-form.com/AIKiYyJP">

  <strong>Wer meldet an?</strong>
  <br>

  <input type="text" id="lastname" name="lastname" placeholder="Nachname" size="20" required c />
  <input type="text" id="firstname" name="vorname" placeholder="Vorname" size="20"  />

  <label for="email">E-Mail (für Anmeldebestätigung und Ähnliches)</label>
  <input type="email" id="email" name="email" placeholder="E-Mail" required multiple />

  <label for="kurs" class="required">Für welchen Kurs melden Sie an?</label>
  <select id="kurs" name="kursdatum" required>
    <option value=""></option>
    <option value="21-12">Mastering, 30.11-3.12. 2021, München</option>
    <option value="21-11">IMPROVE, November 2021 Hamburg</option>
    <option value="21-10">REQ4ARC, Oktober 2021 Frankfurt</option>
    <option value="22-03">Mastering, März 2022 München</option>
    <option value="sonstige">Sonstige</option>
  </select>
  
<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">
 
  <strong>Teilnehmende Person(en)</strong>

  Falls Sie mehr als eine Person anmelden, schreiben Sie die weiteren Namen als Bemerkung.
  <input type="text" id="lastnameTN" name="lastnameTN" placeholder="Nachname teilnehmende Person"   />
  <input type="text" id="firstnameTN" name="vornameTN" placeholder="Vorname teilnehmende Person"  />

  <label for="email">E-Mail (teilnehmende Person(en), falls abweichend zu obiger E-Mail)</label>
  <input type="email" id="emailTN" name="emailTN" placeholder="E-Mail TN" multiple />
  
  <label for="ra">Rechnungsadresse</label>
  <textarea id="ra" name="Rechnungsadresse" placeholder="Diese Adresse benötigen wir zur Abrechnung" required ></textarea>

<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">
    
  <label for="comments">Bemerkungen (z.B. weitere TN, Bestell-/Auftragsnummer)</label>
  <textarea id="comments" name="comments" placeholder="Bemerkungen"></textarea>

<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">
  
  <button type="submit" class="button buttonRed" >Anmeldung absenden</button>
  <input type="button" value="Zurück" class="button buttonGrey" onclick="history.back()" style="float: right;">
  
<!-- The following is the custom redirect configuration for Formspark -->

<input
    type="hidden"
    name="_redirect"
    value="{{ '/anmeldung-erfolg' | absolute_url }}"
  />  
</form>


