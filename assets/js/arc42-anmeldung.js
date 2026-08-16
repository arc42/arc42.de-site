/*
 * arc42.de — registration form behaviour (/anmeldung/, /anmeldungEN/)
 * 2026-08-09
 *
 * Vanilla, no jQuery, no dependency on assets/js/main.min.js.
 *
 * One job: keep the decision the visitor already made.
 *
 * The "Anmeldung" buttons on /termine/ used to link to a bare /anmeldung/, so
 * everything the person had just weighed up — course, date, city, trainer,
 * price — was gone by the time they arrived, and they had to re-derive it from
 * a dropdown of near-identical strings. Those buttons now pass the date's id
 * (?kurs=msa-dez-2026), which is the same value /termine/ already uses as its
 * anchor.
 *
 * This script does two things with that:
 *
 *   1. Preselects the matching <option> (matched on data-id, so the value
 *      submitted to Formspark is still d.code and nothing changes downstream).
 *   2. Renders the summary panel from whichever <option> is selected — from the
 *      URL on arrival, and again whenever the visitor changes the dropdown.
 *
 * Everything is progressive: with no JavaScript there is no summary panel, and
 * the form is still complete, labelled and usable. An unknown or stale id in
 * the URL falls through to "nothing preselected" rather than erroring.
 *
 * The panel markup lives in _pages/anmeldung.md; the German and English pages
 * share this file, so no user-visible string appears here — every label comes
 * from the page, and this only fills in values and hides empty rows.
 */
(function () {
  "use strict";

  var select = document.getElementById("kurs");
  var panel = document.getElementById("kurs-summary");

  if (!select || !panel) {
    return;
  }

  /* Each fact is a <dt data-summary-row="x"> + <dd data-summary="x"> pair. The
     dt is optional — "date" has no row attribute because it is always present. */
  var FACTS = ["title", "date", "where", "trainers", "credits", "price"];

  /**
   * Show or hide one fact row, and fill in its value.
   *
   * @param {string} name  the data-summary key
   * @param {string} value the text to display; empty hides the row
   */
  function setFact(name, value) {
    var dd = panel.querySelector('[data-summary="' + name + '"]');
    var dt = panel.querySelector('[data-summary-row="' + name + '"]');
    var has = Boolean(value);

    if (dd) {
      dd.textContent = value || "";
      dd.hidden = !has;
    }
    if (dt) {
      dt.hidden = !has;
    }
  }

  /**
   * Render the panel from the currently selected option, or hide it when the
   * selection carries no course data (the placeholder, or "another date").
   */
  function render() {
    var option = select.options[select.selectedIndex];

    if (!option || !option.getAttribute("data-id")) {
      panel.hidden = true;
      return;
    }

    FACTS.forEach(function (name) {
      setFact(name, option.getAttribute("data-" + name));
    });

    panel.hidden = false;
  }

  /**
   * Preselect from ?kurs=<date-id>. Silent no-op when the parameter is absent,
   * unknown, or points at a date that has since sold out or passed — in all of
   * those cases the option simply is not in the list any more.
   */
  function preselect() {
    var requested;

    try {
      requested = new URLSearchParams(window.location.search).get("kurs");
    } catch (e) {
      return; // very old browser; the form still works unaided
    }

    if (!requested) {
      return;
    }

    var match = select.querySelector(
      'option[data-id="' + requested.replace(/"/g, "") + '"]'
    );

    if (match) {
      select.value = match.value;
    }
  }

  preselect();
  render();
  select.addEventListener("change", render);
})();
