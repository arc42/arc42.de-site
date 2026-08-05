(function () {
  "use strict";

  var browser = document.querySelector("[data-resource-browser]");
  if (!browser) { return; }

  var items = Array.prototype.slice.call(browser.querySelectorAll("[data-resource]"));
  var typeButtons = Array.prototype.slice.call(browser.querySelectorAll("[data-resource-type]"));
  var language = browser.querySelector("[data-resource-language]");
  var search = browser.querySelector("[data-resource-search]");
  var count = browser.querySelector("[data-resource-count]");
  var context = browser.querySelector("[data-resource-context]");
  var empty = browser.querySelector("[data-resource-empty]");
  var resetButtons = Array.prototype.slice.call(browser.querySelectorAll("[data-resource-reset]"));
  var selectedType = "all";

  function normalize(value) {
    return (value || "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function update() {
    var selectedLanguage = language ? language.value : "all";
    var query = normalize(search ? search.value.trim() : "");
    var visible = 0;

    items.forEach(function (item) {
      var matchesType = selectedType === "all" || item.dataset.type === selectedType;
      var matchesLanguage = selectedLanguage === "all" || item.dataset.language === selectedLanguage;
      var matchesSearch = !query || normalize(item.dataset.search + " " + item.textContent).indexOf(query) !== -1;
      var matches = matchesType && matchesLanguage && matchesSearch;
      item.hidden = !matches;
      if (matches) { visible += 1; }
    });

    count.textContent = visible + (visible === 1 ? " Publikation" : " Publikationen");
    var typeLabels = { book: "Bücher", article: "Artikel", talk: "Vorträge", video: "Videos" };
    context.textContent = selectedType === "all" ? " in allen Kategorien" : " – " + typeLabels[selectedType];
    empty.hidden = visible !== 0;
  }

  function selectType(button, updateAddress) {
    selectedType = button.dataset.resourceType;
    typeButtons.forEach(function (candidate) {
      var active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (updateAddress && window.history && window.history.replaceState) {
      var address = new URL(window.location.href);
      if (selectedType === "all") {
        address.searchParams.delete("type");
      } else {
        address.searchParams.set("type", selectedType);
      }
      window.history.replaceState({}, "", address.pathname + address.search + address.hash);
    }
    update();
  }

  typeButtons.forEach(function (button) {
    button.addEventListener("click", function () { selectType(button, true); });
  });
  if (language) { language.addEventListener("change", update); }
  if (search) { search.addEventListener("input", update); }
  if (search) {
    search.addEventListener("keydown", function (event) {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        var value = search.value.trim();
        if (value) {
          event.preventDefault();
          window.location.href = "/search/?q=" + encodeURIComponent(value);
        }
      }
    });
  }

  resetButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (language) { language.value = "all"; }
      if (search) { search.value = ""; }
      selectType(typeButtons[0], true);
      if (search) { search.focus(); }
    });
  });

  var totals = { all: items.length };
  items.forEach(function (item) { totals[item.dataset.type] = (totals[item.dataset.type] || 0) + 1; });
  Object.keys(totals).forEach(function (type) {
    var target = browser.querySelector('[data-type-count="' + type + '"]');
    if (target) { target.textContent = totals[type]; }
  });

  var requestedType = new URLSearchParams(window.location.search).get("type");
  var requestedButton = typeButtons.filter(function (button) {
    return button.dataset.resourceType === requestedType;
  })[0];

  browser.classList.add("is-ready");
  if (requestedButton) {
    selectType(requestedButton, false);
  } else {
    update();
  }

  // Re-anchor after that first filter pass — ONCE, on load only.
  //
  // The browser scrolls to #anchor before this script runs. Then `is-ready`
  // reveals the control bar and update() sets [hidden] on every non-matching
  // card, so for a URL like /publikationen/?type=book#arc42-in-aktion (what the
  // /books/ stub forwards to, and the shape of most search.json hits) 30+ cards
  // ABOVE the target collapse and the reader ends up parked at an arbitrary
  // offset. The page and the filter are both right; only the position is wrong.
  //
  // Deliberately not wired to hashchange or to the filter handlers: yanking the
  // page around while the reader is filtering by hand would be its own bug.
  var hashId = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
  var hashTarget = hashId ? document.getElementById(hashId) : null;
  if (hashTarget && browser.contains(hashTarget) && !hashTarget.hidden) {
    // One frame, so the revealed control bar has been laid out first.
    window.requestAnimationFrame(function () {
      hashTarget.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    });
  }

  // "Back to filters": surfaces once the filter bar leaves the viewport,
  // so the return trip from the bottom of a 48-item list is one click.
  var backtop = browser.querySelector("[data-resource-backtop]");
  var controls = browser.querySelector(".resource-controls");

  if (backtop && controls && "IntersectionObserver" in window) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    var toggleBacktop = function (show) {
      if (show === !backtop.hidden) { return; }
      if (!show) {
        backtop.hidden = true;
        return;
      }
      backtop.classList.add("is-entering");
      backtop.hidden = false;
      window.requestAnimationFrame(function () {
        backtop.classList.remove("is-entering");
      });
    };

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // Only when the controls sit above the viewport — not when the reader
        // is still above them, which happens on the resource detail pages.
        toggleBacktop(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
    }).observe(controls);

    backtop.addEventListener("click", function () {
      controls.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });
      // Keyboard users continue from the filters, not from the page bottom.
      controls.focus({ preventScroll: true });
    });
  }
}());
