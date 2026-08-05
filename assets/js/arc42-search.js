/* Site search for /search/ — lunr.js, incremental, no build step.
 *
 * Replaces Simple-Jekyll-Search (search-script.js), which matched substrings
 * against a truncated preview only. The index source is unchanged:
 * /search.json carries title, content, url and date for every titled page
 * plus every /publikationen/ entry.
 *
 * Requires window.lunr (assets/js/lunr/lunr.min.js, plain lunr 2.3.9).
 */
(function () {
  "use strict";

  var DEBOUNCE_MS = 150;
  var EXCERPT_WORDS = 30;   // words shown per hit
  var EXCERPT_LEAD = 10;    // words of run-up before the first matched word

  // lunr's default tokenizer splits on whitespace and hyphens. Query terms have
  // to be cut the same way, or "Modell-basiert" typed into the box would never
  // line up with the two tokens the index actually holds.
  var SEPARATOR = /[\s\-]+/;

  // Edge punctuation stripper, the replacement for lunr.trimmer (see below).
  // The class is "digits, ASCII letters, Latin-1/Latin-Extended letters" — the
  // point is that ß (which folding leaves alone) is a letter here, which \W in
  // lunr's own trimmer denies: it turns "Straße" into "stra". Tokens reach this
  // folded and lowercased, so no upper-case ranges are needed. Written as \u
  // escapes so the file survives being served as anything but UTF-8.
  var EDGES = /^[^0-9a-z\u00C0-\u024F]+|[^0-9a-z\u00C0-\u024F]+$/g;

  // Diacritic folding — the same one-liner resources-filter.js:18 uses for the
  // Publikationen filter box, so the two search fields on this site answer the
  // same way: "uber" finds "Über", "qualitat" finds "Qualität". NFD splits an
  // accented letter into base + combining mark, and the mark is dropped.
  //
  // Applied SYMMETRICALLY — to the index pipeline (trimEdges) and to the query
  // side (tokenize, normalize). Folding only one of the two would be worse than
  // folding neither: the folded half would stop meeting the unfolded half.
  //
  // Deliberately leaves ß alone and does not transliterate ae/oe/ue, so
  // "qualitaet" still finds nothing — same limit as the filter box, on purpose.
  function fold(value) {
    return (value || "").toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function init() {
    var page = document.querySelector("[data-search-page]");
    if (!page) { return; }

    var input = document.getElementById("search-input");
    var countLine = document.getElementById("search-count");
    var results = document.getElementById("results-container");
    if (!input || !countLine || !results) { return; }

    var indexUrl = page.getAttribute("data-search-index");
    if (!indexUrl || !window.lunr) {
      countLine.textContent = "Die Suche steht gerade nicht zur Verfügung.";
      return;
    }

    var index = null;
    var byUrl = {};
    var timer = null;

    function normalize(word) {
      return fold(word).replace(EDGES, "");
    }

    function tokenize(value) {
      return fold(value).split(SEPARATOR)
        .map(function (part) { return part.replace(EDGES, ""); })
        .filter(Boolean);
    }

    // search.json is HTML-derived: titles go through Liquid's `escape`, bodies
    // through `strip_html`, which removes tags but leaves entities standing. So
    // the JSON holds "Imprint &amp; Privacy" and "&#8599;". Escaping that again
    // at render time would print the entity ("&amp;amp;"), and indexing it
    // would file tokens like "amp" and "8599". Decode once on load, escape once
    // on output. Unknown entities are left alone and escaped normally.
    var NAMED = {
      amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: "\u00a0",
      middot: "·", hellip: "…", ndash: "–", mdash: "—",
      laquo: "«", raquo: "»", bdquo: "„", ldquo: "“",
      rdquo: "”", lsquo: "‘", rsquo: "’", szlig: "ß",
      auml: "ä", ouml: "ö", uuml: "ü", Auml: "Ä",
      Ouml: "Ö", Uuml: "Ü", eacute: "é", copy: "©",
      reg: "®", trade: "™", euro: "€", deg: "°",
      times: "\u00d7", shy: "\u00ad"
    };

    function decodeEntities(value) {
      return String(value || "").replace(/&(#\d+|#[xX][0-9a-fA-F]+|[a-zA-Z]+);/g,
        function (whole, body) {
          if (body.charAt(0) !== "#") {
            return Object.prototype.hasOwnProperty.call(NAMED, body) ? NAMED[body] : whole;
          }
          var hex = body.charAt(1) === "x" || body.charAt(1) === "X";
          var code = parseInt(hex ? body.slice(2) : body.slice(1), hex ? 16 : 10);
          if (!(code > 0 && code <= 0x10ffff)) { return whole; }
          return String.fromCodePoint(code);
        });
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    // A word counts as a hit when any query token is a prefix of it — the same
    // relation the trailing-wildcard clause uses, so what gets marked in the
    // excerpt is what actually earned the match. Hyphenated compounds are
    // checked per part, again mirroring the tokenizer.
    function isHit(word, tokens) {
      var parts = normalize(word).split("-");
      return tokens.some(function (token) {
        return parts.some(function (part) { return part.indexOf(token) === 0; });
      });
    }

    function excerpt(content, tokens) {
      var words = String(content || "").split(/\s+/).filter(Boolean);
      if (!words.length) { return ""; }

      var hit = -1;
      for (var i = 0; i < words.length; i++) {
        if (isHit(words[i], tokens)) { hit = i; break; }
      }

      var start = hit === -1 ? 0 : Math.max(0, hit - EXCERPT_LEAD);
      var end = start + EXCERPT_WORDS;
      var body = words.slice(start, end).map(function (word) {
        var safe = escapeHtml(word);
        return isHit(word, tokens) ? "<mark>" + safe + "</mark>" : safe;
      }).join(" ");

      return (start > 0 ? "… " : "") + body + (end < words.length ? " …" : "");
    }

    function buildIndex(docs) {
      // Registered so lunr does not warn about an unknown pipeline function.
      lunr.Pipeline.registerFunction(trimEdges, "arc42-trim-edges");

      return lunr(function () {
        // No stemmer. lunr ships an English one only, and this site is mixed
        // German/English: it would file "Dokumentation" under "dokument", so
        // the prefix query "dokumentati*" — what the visitor has typed halfway
        // through the word — would miss its own document. Prefix wildcards on
        // unstemmed terms do the job for both languages instead.
        this.pipeline.remove(lunr.stemmer);
        this.searchPipeline.remove(lunr.stemmer);
        this.pipeline.remove(lunr.trimmer);

        // Stopwords stay INDEXED. The two halves have to agree, and the query
        // half runs with usePipeline:false — so "the" arrives at lunr as a real
        // term while the index had dropped it, and the AND post-filter then
        // required a term nothing could satisfy. Pasting the exact title
        // "The Art of Software Reviews" returned "Keine Ergebnisse!"; "the
        // architecture" found 4 where "architecture" alone found 33. Over 74
        // documents the extra terms cost nothing worth measuring.
        this.pipeline.remove(lunr.stopWordFilter);
        this.pipeline.add(trimEdges);

        this.ref("url");
        this.field("title", { boost: 10 });
        this.field("content");

        docs.forEach(function (doc) { this.add(doc); }, this);
      });
    }

    // The index-side half of the normalisation. lunr's tokenizer has already
    // lowercased the token; fold() then strips the diacritics and EDGES the
    // punctuation, so an indexed term is exactly what tokenize() produces from
    // the same word typed into the box.
    function trimEdges(token) {
      return token.update(function (value) { return fold(value).replace(EDGES, ""); });
    }

    function search(tokens) {
      return index.query(function (query) {
        tokens.forEach(function (token) {
          // Two clauses per token: the exact term (weighted up, so a finished
          // word beats a coincidental prefix) and the trailing wildcard, which
          // keeps results flowing while the word is still being typed.
          query.term(token, { usePipeline: false, boost: 10 });
          query.term(token, {
            usePipeline: false,
            boost: 1,
            wildcard: lunr.Query.wildcard.TRAILING
          });
        });
      });
    }

    function render(matches, tokens) {
      results.innerHTML = matches.map(function (match) {
        var doc = byUrl[match.ref];
        if (!doc) { return ""; }
        return "<li><a href=\"" + escapeHtml(doc.url) + "\">" + escapeHtml(doc.title) + "</a>" +
          "<p class=\"search-excerpt\">" + excerpt(doc.content, tokens) + "</p></li>";
      }).join("");
    }

    function rememberQuery(value) {
      if (!window.history || !window.history.replaceState) { return; }
      var address = new URL(window.location.href);
      if (value) {
        address.searchParams.set("q", value);
      } else {
        address.searchParams.delete("q");
      }
      try {
        window.history.replaceState({}, "", address.pathname + address.search + address.hash);
      } catch (error) {
        // Safari rate-limits replaceState and throws SecurityError once a fast
        // typist trips the limit. A shareable URL is a nicety; letting the
        // exception escape would abort run() and leave the field dead until
        // reload, which is not. Swallow it and carry on searching.
      }
    }

    function run() {
      var raw = input.value.trim();
      rememberQuery(raw);

      if (!raw) {
        results.innerHTML = "";
        countLine.textContent = "";
        return;
      }
      if (!index) {
        // Typed before search.json arrived; the load handler re-runs this.
        countLine.textContent = "Suchindex wird geladen …";
        return;
      }

      var tokens = tokenize(raw);
      if (!tokens.length) {
        // Punctuation only ("***", "()"). Nothing searchable is left after
        // folding and trimming, but the reader HAS typed something, so answer
        // them instead of leaving the line blank as if the box were empty.
        results.innerHTML = "";
        countLine.textContent = "Keine Ergebnisse!";
        return;
      }

      var matches;
      try {
        matches = search(tokens);
      } catch (error) {
        // lunr throws on malformed clauses (a lone "*", for instance).
        matches = [];
      }

      // Multi-word queries are AND, not OR. lunr's default clause presence is
      // OPTIONAL, so "Starke Hruschka" scored every document carrying EITHER
      // name — 62 of 74, on a page that shows every hit, which reads as broken.
      // Intersecting afterwards over matchData is cheaper than a second query
      // pass: metadata is keyed by the terms the index actually matched, and a
      // wildcard clause records the EXPANDED term ("hruschk" matched via
      // "hruschka"), hence the prefix test rather than equality. Single-token
      // queries are left alone — there is nothing to intersect.
      if (tokens.length > 1) {
        matches = matches.filter(function (match) {
          var matched = Object.keys(match.matchData.metadata);
          return tokens.every(function (token) {
            return matched.some(function (term) { return term.indexOf(token) === 0; });
          });
        });
      }

      // Every surviving hit is listed: this page IS the all-results page, there
      // is no "more results" anywhere else to send the reader to.
      render(matches, tokens);
      countLine.textContent = matches.length
        ? matches.length + " Treffer"
        : "Keine Ergebnisse!";
    }

    input.addEventListener("input", function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(run, DEBOUNCE_MS);
    });

    // The masthead search field is a real <form> that submits here as
    // /search/?q=… so it also works with JavaScript disabled. Pick the term up
    // and run it — otherwise arriving from the masthead lands on an empty page
    // and the visitor types the same thing twice.
    var requested = new URLSearchParams(window.location.search).get("q");
    if (requested) {
      input.value = requested;
      countLine.textContent = "Suchindex wird geladen …";
    }
    input.focus();

    window.fetch(indexUrl, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) { throw new Error("HTTP " + response.status); }
        return response.json();
      })
      .then(function (data) {
        // search.json emits a bare {} for every page it filters out (404, the
        // thank-you stubs, anything without a title). Those carry no ref and
        // would poison lunr's index — drop them here.
        var docs = (data || []).filter(function (entry) {
          return entry && entry.title && entry.url;
        }).map(function (entry) {
          return {
            url: entry.url,
            title: decodeEntities(entry.title),
            content: decodeEntities(entry.content)
          };
        });
        docs.forEach(function (doc) { byUrl[doc.url] = doc; });
        index = buildIndex(docs);
        run();
      })
      .catch(function (error) {
        countLine.textContent = "Die Suche konnte nicht geladen werden.";
        if (window.console && window.console.error) {
          window.console.error("arc42 search: " + indexUrl, error);
        }
      });
  }

  // The two <script defer> tags run in order after parsing, so the DOM is up;
  // the guard only covers the page being loaded some other way.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
