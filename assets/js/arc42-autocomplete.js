/*
 * arc42.de — masthead search autocomplete
 * 2026-08-05, ported from quality.arc42.org-site/src/scripts/site/autocomplete.js
 *
 * A deterministic prefix-and-substring scorer over the titles and keywords in
 * /search-lookup.json. It deliberately does NOT use lunr, even though lunr is
 * already on this site for /search/: lunr's German stemmer rewrites tokens
 * ("Architekturen" -> "architektur"), which makes a prefix query like
 * "architektu" miss and surfaces unrelated body-level hits. An autocomplete
 * needs predictable ranking while the visitor is still typing, not stemmed
 * full-text recall. /search/ keeps lunr for the full-body results page.
 *
 * There is no build step in this repo (see CLAUDE.md), so this ships as a plain
 * IIFE in ES5-compatible syntax, like arc42-nav.js and resources-filter.js.
 *
 * Keyboard:
 *   Cmd/Ctrl + K       focus the masthead search from anywhere
 *   Up / Down          walk the results across groups
 *   Home / End         first / last row
 *   Enter              open the highlighted row (else the form submits)
 *   Cmd/Ctrl/Shift+↵   jump to /search/?q=… whatever is highlighted
 *   Esc                close the panel; again clears the field; again blurs
 *
 * The "/" hotkey is NOT handled here — arc42-nav.js already owns it and focuses
 * the same field. Two handlers for one key would call preventDefault twice and
 * fight over focus, so this file stays out of it.
 */
(function () {
  "use strict";

  var LOOKUP_URL = "/search-lookup.json"; // root-relative: arc42.de is served from /
  var DEBOUNCE_MS = 100;
  var MIN_QUERY = 2;
  var PER_GROUP = 4;
  var TOTAL_VISIBLE = 12;

  // Render order of the result groups, and — via TYPE_RANK below — the
  // tie-break order. Pages first: someone typing in the masthead is usually
  // navigating the site, not looking up a publication.
  var GROUPS = [
    { type: "page", label: "Seiten" },
    { type: "book", label: "Bücher" },
    { type: "article", label: "Artikel" },
    { type: "talk", label: "Vorträge" },
    { type: "video", label: "Videos" }
  ];

  var TYPE_RANK = { page: 0, book: 1, article: 2, talk: 3, video: 4 };

  // Scoring weights — higher is better. Tuned for typical autocomplete intent:
  // title prefix matches dominate, substring and keyword matches break ties at
  // the bottom.
  //
  // The ALIAS_* tiers are carried over from the quality.arc42.org original and
  // can never fire here: the de lookup has no `aliases` field, so `_aliasesL`
  // is always "" and `_aliasWords` always []. They are kept so the two files
  // stay diffable — if arc42.de ever grows an alias field, wiring it up is a
  // one-line change in loadLookup().
  var W = {
    TITLE_EXACT: 1000,
    TITLE_PREFIX: 500,
    TITLE_WORD_PREFIX: 320,
    ALIAS_EXACT: 400,
    ALIAS_PREFIX: 240,
    ALIAS_WORD_PREFIX: 180,
    TITLE_SUBSTR: 90,
    ALIAS_SUBSTR: 60,
    TAG_PREFIX: 50,
    TAG_SUBSTR: 25
  };

  /* ---------------------------------------------------------------- fold -- */

  // Diacritic folding — the same one-liner assets/js/arc42-search.js:41 and
  // assets/js/resources-filter.js:18 use, so all three search surfaces on this
  // site answer the same way ("uber" finds "Über", "qualitat" finds "Qualität").
  // CLAUDE.md: change one, change all three.
  //
  // Applied SYMMETRICALLY — to the indexed fields and to the query terms.
  // Folding only one side would be worse than folding neither.
  //
  // The combining-mark range is written as \u escapes so the file survives
  // being served as anything but UTF-8 — same reason arc42-search.js does.
  function fold(value) {
    return (value || "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  /* --------------------------------------------------------------- lookup -- */

  var lookupPromise = null;
  var lookupItems = null;

  function loadLookup() {
    if (lookupPromise) {
      return lookupPromise;
    }
    lookupPromise = fetch(LOOKUP_URL)
      .then(function (r) {
        if (!r.ok) {
          throw new Error("search-lookup.json: HTTP " + r.status);
        }
        return r.json();
      })
      .then(function (data) {
        // Pre-fold once. With ~80 entries this is a sub-millisecond one-time
        // cost, and it keeps fold() out of the per-keystroke inner loop.
        lookupItems = (data || []).map(function (d) {
          var titleL = fold(d.title);
          var aliasesL = fold(d.aliases); // always "" on this site — see W above
          var tagsL = fold(d.tags);
          return {
            title: d.title,
            type: d.type,
            url: d.url,
            _titleL: titleL,
            _aliasesL: aliasesL,
            _tagsL: tagsL,
            _titleWords: titleL.split(/[\s\-_/]+/).filter(Boolean),
            _aliasWords: aliasesL.split(/[\s\-_/]+/).filter(Boolean),
            _tagWords: tagsL.split(/[\s,]+/).filter(Boolean)
          };
        });
        return lookupItems;
      })
      .catch(function (err) {
        lookupPromise = null; // let a later keystroke retry
        throw err;
      });
    return lookupPromise;
  }

  /* --------------------------------------------------------------- scorer -- */

  function scoreItem(item, terms) {
    var score = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var termScore = 0;

      if (item._titleL === term) termScore = W.TITLE_EXACT;
      else if (item._titleL.indexOf(term) === 0) termScore = W.TITLE_PREFIX;
      else if (item._aliasWords.indexOf(term) !== -1) termScore = W.ALIAS_EXACT;
      else if (startsAny(item._titleWords, term)) termScore = W.TITLE_WORD_PREFIX;
      else if (item._aliasesL.indexOf(term) === 0) termScore = W.ALIAS_PREFIX;
      else if (startsAny(item._aliasWords, term)) termScore = W.ALIAS_WORD_PREFIX;
      else if (item._titleL.indexOf(term) !== -1) termScore = W.TITLE_SUBSTR;
      else if (item._aliasesL.indexOf(term) !== -1) termScore = W.ALIAS_SUBSTR;
      else if (startsAny(item._tagWords, term)) termScore = W.TAG_PREFIX;
      else if (item._tagsL.indexOf(term) !== -1) termScore = W.TAG_SUBSTR;

      if (termScore === 0) {
        return 0; // every term must contribute — multi-word queries are AND,
                  // the same rule /search/ applies (CLAUDE.md)
      }
      score += termScore;
    }
    // Shorter titles slightly preferred when scores tie, so a title that is
    // about the term outranks one that mentions it in passing.
    score -= Math.min(item._titleL.length, 40) * 0.5;
    return score;
  }

  function startsAny(words, term) {
    for (var i = 0; i < words.length; i++) {
      if (words[i].indexOf(term) === 0) {
        return true;
      }
    }
    return false;
  }

  function rank(terms) {
    if (!lookupItems || terms.length === 0) {
      return [];
    }
    var scored = [];
    for (var i = 0; i < lookupItems.length; i++) {
      var s = scoreItem(lookupItems[i], terms);
      if (s > 0) {
        scored.push({ item: lookupItems[i], score: s });
      }
    }
    scored.sort(function (a, b) {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      var ra = TYPE_RANK[a.item.type];
      var rb = TYPE_RANK[b.item.type];
      if (ra === undefined) ra = 99;
      if (rb === undefined) rb = 99;
      if (ra !== rb) {
        return ra - rb;
      }
      return a.item._titleL.localeCompare(b.item._titleL);
    });
    return scored;
  }

  /* ------------------------------------------------------------- rendering -- */

  function escapeHtml(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Marks the matched runs in `text`. The terms arrive folded ("uber"), the
  // title does not ("Über"), so a plain regex would never match — the offsets
  // are found in the folded copy and applied to the original instead.
  //
  // That mapping is only valid while folding is length-preserving, which it is
  // for the precomposed Latin accents German uses (NFD splits the letter, the
  // combining mark is dropped, one char in / one char out). Anything else
  // (a real ligature, a Turkish dotted I) is left unmarked rather than
  // mis-marked — the row is still shown, just without the highlight.
  function highlight(text, terms) {
    var raw = String(text === null || text === undefined ? "" : text);
    if (!terms.length) {
      return escapeHtml(raw);
    }
    var folded = fold(raw);
    if (folded.length !== raw.length) {
      return escapeHtml(raw);
    }

    var marked = new Array(raw.length);
    var i;
    var hasMark = false;
    for (var t = 0; t < terms.length; t++) {
      var term = terms[t];
      if (!term) {
        continue;
      }
      var from = folded.indexOf(term);
      while (from !== -1) {
        for (i = from; i < from + term.length; i++) {
          marked[i] = true;
        }
        hasMark = true;
        from = folded.indexOf(term, from + term.length);
      }
    }
    if (!hasMark) {
      return escapeHtml(raw);
    }

    var out = "";
    var runStart = -1;
    for (i = 0; i <= raw.length; i++) {
      var on = i < raw.length && marked[i] === true;
      if (on && runStart === -1) {
        runStart = i;
      } else if (!on && runStart !== -1) {
        out += "<mark>" + escapeHtml(raw.slice(runStart, i)) + "</mark>";
        runStart = -1;
      }
      if (!on && i < raw.length) {
        out += escapeHtml(raw.charAt(i));
      }
    }
    return out;
  }

  function groupAndCap(scored) {
    var groups = {};
    GROUPS.forEach(function (g) {
      groups[g.type] = [];
    });
    var total = 0;
    for (var i = 0; i < scored.length; i++) {
      if (total >= TOTAL_VISIBLE) {
        break;
      }
      var bucket = groups[scored[i].item.type];
      if (!bucket || bucket.length >= PER_GROUP) {
        continue;
      }
      bucket.push(scored[i]);
      total++;
    }
    return { groups: groups, totalRendered: total };
  }

  function renderPanel(opts) {
    var scored = opts.scored;
    var terms = opts.terms;
    var q = opts.query;
    var capped = groupAndCap(scored);

    if (capped.totalRendered === 0) {
      return {
        html:
          '<div class="arc42-search__empty" role="status">' +
          "Keine Treffer für <strong>" + escapeHtml(q) + "</strong>. " +
          '<span class="arc42-search__hint-line">Enter: Volltextsuche.</span>' +
          "</div>",
        optionCount: 0,
        resultCount: 0
      };
    }

    var idx = 0;
    var parts = ['<div class="arc42-search__scroll" role="presentation">'];

    GROUPS.forEach(function (g) {
      var bucket = capped.groups[g.type] || [];
      if (bucket.length === 0) {
        return;
      }
      parts.push(
        '<div class="arc42-search__group" data-type="' + g.type + '" role="group" aria-label="' + g.label + '">' +
          '<div class="arc42-search__group-label">' + g.label + "</div>" +
          '<ul class="arc42-search__list" role="presentation">'
      );
      bucket.forEach(function (entry) {
        var item = entry.item;
        parts.push(
          '<li role="option" id="arc42-search-opt-' + idx + '" class="arc42-search__item" ' +
            'data-type="' + g.type + '" data-href="' + escapeHtml(item.url) + '" ' +
            'data-index="' + idx + '" aria-selected="false">' +
            '<span class="arc42-search__title">' + highlight(item.title, terms) + "</span>" +
            '<span class="arc42-search__path" aria-hidden="true">' + escapeHtml(item.url) + "</span>" +
            "</li>"
        );
        idx++;
      });
      parts.push("</ul></div>");
    });

    if (scored.length > capped.totalRendered) {
      // Selectable "alle Treffer" row: it lives inside the listbox so Arrow ↓
      // past the last result lands on it, and Enter then routes to /search/?q=…
      // through the same data-href handler as every other row.
      var allUrl = "/search/?q=" + encodeURIComponent(q);
      parts.push(
        '<div class="arc42-search__group arc42-search__group--all" role="group" aria-label="Mehr">' +
          '<ul class="arc42-search__list" role="presentation">' +
          '<li role="option" id="arc42-search-opt-' + idx + '" ' +
          'class="arc42-search__item arc42-search__item--all" ' +
          'data-href="' + escapeHtml(allUrl) + '" data-index="' + idx + '" aria-selected="false">' +
          '<span class="arc42-search__title">' +
          "Alle <strong>" + scored.length + "</strong> Treffer für <strong>" + escapeHtml(q) + "</strong> anzeigen" +
          "</span></li></ul></div>"
      );
      idx++;
    }

    parts.push("</div>"); // close .arc42-search__scroll

    // Persistent footer — always shown, never scrolls. Decorative
    // (aria-hidden); the aria-live status region carries the counts for
    // assistive technology.
    parts.push(
      '<div class="arc42-search__footer" aria-hidden="true">' +
        '<span class="arc42-search__footer-hint">' +
        "<kbd>↵</kbd> öffnen" +
        " · <kbd>" + escapeHtml(opts.chordLabel) + "</kbd> alle Treffer" +
        " · <kbd>↑↓</kbd> navigieren" +
        " · <kbd>esc</kbd> schließen" +
        "</span></div>"
    );

    return { html: parts.join(""), optionCount: idx, resultCount: scored.length };
  }

  /* ----------------------------------------------------------------- init -- */

  var form = document.querySelector(".arc42-search");
  if (!form) {
    return;
  }

  var input = document.getElementById("masthead-search");
  var panel = document.getElementById("arc42-search-panel");
  if (!input || !panel) {
    return;
  }

  var status = form.querySelector("[data-arc42-search-status]");
  var hint = form.querySelector("[data-arc42-search-hint]");
  var hintDesc = form.querySelector("[data-arc42-search-hint-desc]");

  // navigator.platform is deprecated but is the only check that works in every
  // browser this site still sees; a wrong guess only mislabels the hint.
  var isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || "");

  if (hint) {
    // On a Mac the "/" hotkey from arc42-nav.js still works, but ⌘K is the
    // shortcut people expect from a search field, so that is what is advertised.
    // Elsewhere the kbd keeps saying "/" (Ctrl-K works either way).
    hint.textContent = isMac ? "⌘K" : "/";
    hint.setAttribute("title", isMac ? "⌘K fokussiert die Suche" : "/ fokussiert die Suche");
  }
  if (hintDesc) {
    hintDesc.textContent = isMac
      ? "Befehlstaste-K fokussiert diese Suche. Befehlstaste-Enter öffnet alle Treffer."
      : "Schrägstrich fokussiert diese Suche. Strg-Enter öffnet alle Treffer.";
  }
  var chordLabel = isMac ? "⌘⏎" : "Strg ⏎";

  var activeIndex = -1;
  var currentOptions = [];
  var lastQuery = "";
  var debounceTimer = null;
  var scrollEl = null; // the inner .arc42-search__scroll region, set on each render

  function setStatus(message) {
    if (status) {
      status.textContent = message || "";
    }
  }

  function closePanel() {
    panel.hidden = true;
    panel.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
    scrollEl = null;
    currentOptions = [];
  }

  function openPanel(html, optionCount) {
    panel.innerHTML = html;
    panel.hidden = false;
    input.setAttribute("aria-expanded", optionCount > 0 ? "true" : "false");
    scrollEl = panel.querySelector(".arc42-search__scroll");
    currentOptions = Array.prototype.slice.call(panel.querySelectorAll(".arc42-search__item"));
    activeIndex = currentOptions.length > 0 ? 0 : -1;
    applyActive();
  }

  function applyActive() {
    currentOptions.forEach(function (el, i) {
      var on = i === activeIndex;
      el.setAttribute("aria-selected", on ? "true" : "false");
      el.classList.toggle("is-active", on);
    });
    if (activeIndex >= 0 && currentOptions[activeIndex]) {
      var el = currentOptions[activeIndex];
      input.setAttribute("aria-activedescendant", el.id);
      var view = scrollEl || panel;
      var elTop = el.offsetTop;
      var elBottom = elTop + el.offsetHeight;
      if (elTop < view.scrollTop) {
        view.scrollTop = elTop;
      } else if (elBottom > view.scrollTop + view.clientHeight) {
        view.scrollTop = elBottom - view.clientHeight;
      }
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function moveActive(delta) {
    if (currentOptions.length === 0) {
      return;
    }
    activeIndex = (activeIndex + delta + currentOptions.length) % currentOptions.length;
    applyActive();
  }

  function runQuery(q) {
    if (!q || q.trim().length < MIN_QUERY) {
      closePanel();
      setStatus("");
      return;
    }
    var render = function () {
      if (q !== lastQuery) {
        return; // a newer query is already in flight
      }
      var terms = fold(q.trim()).split(/\s+/).filter(Boolean);
      var scored = rank(terms);
      var result = renderPanel({
        scored: scored,
        terms: terms,
        query: q,
        chordLabel: chordLabel
      });
      openPanel(result.html, result.optionCount);
      setStatus(
        result.resultCount > 0
          ? result.resultCount + " Treffer für „" + q + "“."
          : "Keine Treffer für „" + q + "“."
      );
    };

    if (lookupItems) {
      render();
      return;
    }
    loadLookup().then(render, function () {
      setStatus("Suche nicht verfügbar. Mit Enter die Volltextsuche öffnen.");
      closePanel();
    });
  }

  input.addEventListener("input", function () {
    var q = input.value;
    lastQuery = q;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      runQuery(q);
    }, DEBOUNCE_MS);
  });

  input.addEventListener("focus", function () {
    // Warm the index on focus so the first keystroke does not wait on the fetch.
    if (!lookupItems && !lookupPromise) {
      loadLookup().catch(function () {
        /* surfaced on the next keystroke via runQuery */
      });
    }
    if (input.value.trim().length >= MIN_QUERY && panel.hidden) {
      lastQuery = input.value;
      runQuery(input.value);
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
      if (panel.hidden && input.value.trim().length >= MIN_QUERY) {
        e.preventDefault();
        lastQuery = input.value;
        runQuery(input.value);
        return;
      }
      if (!panel.hidden) {
        e.preventDefault();
        moveActive(1);
      }
    } else if (e.key === "ArrowUp") {
      if (!panel.hidden) {
        e.preventDefault();
        moveActive(-1);
      }
    } else if (e.key === "Home" && !panel.hidden && currentOptions.length) {
      e.preventDefault();
      activeIndex = 0;
      applyActive();
    } else if (e.key === "End" && !panel.hidden && currentOptions.length) {
      e.preventDefault();
      activeIndex = currentOptions.length - 1;
      applyActive();
    } else if (e.key === "Escape") {
      // Three steps, so Escape never does more than the visitor asked for:
      // close the panel, then clear the field, then give the page focus back.
      //
      // Every step calls stopPropagation(), because arc42-nav.js:84-89 listens
      // for Escape on `document` and does not check defaultPrevented. Without
      // this, one Escape typed in the search field would close the panel AND
      // close the "Mehr" drawer AND move focus to the drawer button — three
      // things for one keystroke, two of them nowhere near what was asked.
      // Escape belongs to the innermost open thing; the drawer's own Escape
      // still works from anywhere else on the page. arc42-nav.js is left alone.
      e.stopPropagation();
      if (!panel.hidden) {
        e.preventDefault();
        closePanel();
      } else if (input.value !== "") {
        e.preventDefault();
        input.value = "";
        lastQuery = "";
        setStatus("");
      } else {
        // No preventDefault: some browsers map Escape on a search field to
        // "revert the value", and by this point the field is already empty.
        input.blur();
      }
    } else if (e.key === "Enter") {
      // Cmd/Ctrl/Shift + Enter jumps to the full-text /search/ page whatever
      // row is highlighted. Plain Enter keeps opening the highlighted row.
      // Mirrors the same chord in the Publikationen filter box.
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        var q = input.value.trim();
        if (q.length >= MIN_QUERY) {
          e.preventDefault();
          window.location.assign("/search/?q=" + encodeURIComponent(q));
          return;
        }
      }
      if (!panel.hidden && activeIndex >= 0 && currentOptions[activeIndex]) {
        var href = currentOptions[activeIndex].getAttribute("data-href");
        if (href) {
          e.preventDefault();
          window.location.assign(href);
          return;
        }
      }
      // Otherwise the form submits to /search/?q=… — the no-JS path, unchanged.
    }
  });

  // mousedown, not click. The panel closes as soon as focus leaves the form
  // (the focusout handler below) or the pointer goes down outside it (the
  // document mousedown handler below), and either of those can fire between a
  // real mousedown and the click that would have followed — so by click time
  // the row the pointer went down on may no longer be in the DOM.
  //
  // Event order for a row click, which is why this stays safe:
  //
  //   1. mousedown fires here first — before any focus change, so before
  //      focusout.
  //   2. preventDefault() suppresses mousedown's default action, which is
  //      moving focus. Focus never leaves the input, focusout never fires,
  //      and nothing tears the panel down under the navigation below.
  //   3. the same event then bubbles to the document mousedown handler, whose
  //      `form.contains(e.target)` guard is true for anything in the panel, so
  //      that one does not close it either.
  //
  // Mousedown on the panel's chrome (footer hints, group labels) deliberately
  // does NOT preventDefault: focus does leave the input, focusout fires with a
  // null relatedTarget, and the panel closes. That is the right outcome — a
  // combobox listbox should not stay open once its input is unfocused.
  panel.addEventListener("mousedown", function (e) {
    var item = e.target.closest ? e.target.closest(".arc42-search__item") : null;
    if (!item) {
      return;
    }
    var href = item.getAttribute("data-href");
    if (href) {
      e.preventDefault();
      window.location.assign(href);
    }
  });

  panel.addEventListener("mousemove", function (e) {
    var item = e.target.closest ? e.target.closest(".arc42-search__item") : null;
    if (!item) {
      return;
    }
    var idx = currentOptions.indexOf(item);
    if (idx >= 0 && idx !== activeIndex) {
      activeIndex = idx;
      applyActive();
    }
  });

  // Focus loss closes the panel. Without this, Tab out of the field leaves an
  // open listbox floating over the page with aria-expanded="true" and a stale
  // aria-activedescendant pointing at a row nobody can reach — the state WAI-
  // ARIA APG forbids for a combobox, and invisible to anyone testing with a
  // mouse. focusout rather than blur because it bubbles, so one listener on the
  // form covers the input and anything focusable that ends up in the panel.
  //
  // relatedTarget is where focus is going: null when it goes nowhere (clicking
  // dead space, closing the tab), so `contains(null)` is false and the panel
  // closes, which is correct.
  form.addEventListener("focusout", function (e) {
    if (!form.contains(e.relatedTarget)) {
      closePanel();
    }
  });

  // Pointer down anywhere outside the form. This is not redundant with
  // focusout: a mousedown on a non-focusable region of the page does not always
  // move focus, so focusout alone can leave the panel open behind a click.
  document.addEventListener("mousedown", function (e) {
    if (!form.contains(e.target)) {
      closePanel();
    }
  });

  // Cmd/Ctrl-K from anywhere. The "/" hotkey stays in arc42-nav.js; this file
  // must not claim it too.
  document.addEventListener("keydown", function (e) {
    if (!(e.metaKey || e.ctrlKey) || !e.key || e.key.toLowerCase() !== "k") {
      return;
    }
    // Below 800px .arc42-search is display:none and search lives in the drawer,
    // so there is nothing to focus — same guard as arc42-nav.js's "/" handler.
    if (!input.offsetParent) {
      return;
    }
    e.preventDefault();
    input.focus();
    input.select();
  });
})();
