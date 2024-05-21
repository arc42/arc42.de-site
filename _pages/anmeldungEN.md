---
title: "Registration"
layout: single
classes: wide
permalink: /anmeldungEN

botpoison: nospam

header:
  overlay_filter: rgba(15, 80, 180, 0.5)
  overlay_image: /images/splash/anmeldung-yves-moret-3vSGseoQj40.jpg
  caption: "Photo: [**Yves Moret**](https://unsplash.com/@yvesmoret)"

excerpt: "Looking forward meeting you!"
---


<noscript>
     <h1>Your browser needs to have JavaScript enabled!</h1>
     Currently, it seems to be deactivated... You may send your registration via email, or
activate JavaScript and reload this page.
    <br><br>
     <a href='mailto:info@arc42.de?subject=[arc42] registration&body=your name :%0A%0AFür%20which%20course%20?%0AEmail:%0A%0Abilling adress:%0A%0A%0A-----------------------%0Aremarks:%0A'>
     <button class='button buttonAnmeldung'>Registration<br>via E-Mail</button></a>
    
</noscript> 

<div id="main_body" style="display: none;">

<form action="https://submit-form.com/AIKiYyJP"
      data-botpoison-public-key="pk_8e195655-38ed-4eec-a445-a1e0d68a488d"
      id="arc42anmeldung">

<strong>Who registers?</strong>
  <br>

<input type="text" id="nachname" name="last name" placeholder="* last name" size="20" required  />
<input type="text" id="vorname" name="first name" placeholder="first name" size="20"  />

<label for="email">E-Mail </label>
<input type="email" id="email" name="Email" placeholder="* E-Mail" required multiple  />

<label for="kurs">Which training?</label>
<select id="kurs" name="Kurs" required>
  <option value="*"></option>
  <option value="24-11 MSA online">Mastering SW Architectures, November 12.-14.th 2024<strong>ONLINE</strong> (Trainer Wolfgang Reimesch)</option>

  <option value="other">other</option>
</select>

<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">

<strong>Participants</strong>
<br>

In case you register more than one person, please state their names in the comments.
<input type="text" id="lastnameTN" name="NachnameTN" placeholder="last name of participant"   />
<input type="text" id="firstnameTN" name="VornameTN" placeholder="first name of participant"  />

<label for="email">E-Mail (participant)</label>
<input type="email" id="emailTN" name="EmailTN" placeholder="E-Mail participant" />

<label for="ra">Billing address</label>
<textarea id="ra" name="Billing address" placeholder="* required to produce and send the invoice" required ></textarea>

<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">
  
<label for="comments">Comments (e.g. additional participants, order-numbers or similar)</label>
<textarea id="comments" name="Comments" placeholder="Comments"></textarea>
<hr style="height:2px; width:100%; border-width:0; color:CadetBlue; background-color:CadetBlue">
  
  <button type="submit" id="submit" class="button buttonAnmeldung" >Send registration</button>
  <input type="button" value="back" class="button buttonGrey" onclick="history.back()" style="float: right;">
  
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
<input type="hidden" name="_email.subject" value="[arc42.de] Registration" />
<input type="hidden" name="_email.from" value="arc42.de Website (via formspark.io)" />
<input type="hidden" name="_email.template.title" value="Registration (via arc42.de)" />


</form>

</div>

<script type="text/javascript">
document.getElementById("main_body").style.display="block";
</script>


