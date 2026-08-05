/*
 * arc42.de — navigation behaviour
 * 2026-08-05
 *
 * Vanilla, no jQuery, and it never touches assets/js/main.min.js — that file is
 * a committed build artifact with no build step in this repo.
 *
 * Three jobs:
 *
 *   1. The masthead "Mehr" drawer (_includes/masthead.html).
 *   2. The "/" hotkey, which focuses the masthead search field.
 *   3. The sidebar rail toggle (_includes/nav_list), which replaced a
 *      CSS-checkbox accordion that had no keyboard path at all and left its
 *      links focusable while invisible. See that include for the full story.
 *
 * The vendored greedy-nav plugin is no longer involved: the masthead component
 * is `.arc42-nav`, so the plugin binds to nothing. The code that used to mirror
 * its state onto aria-expanded went with it.
 */
(function () {
  "use strict";

  /* --------------------------------------------------------- collapsibles -- */

  /**
   * Wire a button to the region named by its aria-controls.
   *
   * @param {Element} btn      the trigger
   * @param {Function} setOpen applies the open state to the region
   * @returns {Object|null}    a small handle, or null if the region is missing
   */
  function collapsible(btn, setOpen) {
    var region = document.getElementById(btn.getAttribute("aria-controls"));
    if (!region) {
      return null;
    }

    function apply(open) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      setOpen(region, open);
    }

    apply(false);

    btn.addEventListener("click", function () {
      apply(btn.getAttribute("aria-expanded") !== "true");
    });

    // Escape closes and returns focus to the trigger, so focus is never
    // stranded inside a region the visitor just dismissed.
    region.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        apply(false);
        btn.focus();
      }
    });

    return { close: function () { apply(false); }, region: region };
  }

  /* -------------------------------------------------------------- drawer -- */

  var moreBtn = document.querySelector(".arc42-nav__more");
  var drawer = null;

  if (moreBtn) {
    drawer = collapsible(moreBtn, function (region, open) {
      region.classList.toggle("is-open", open);
    });
  }

  if (drawer) {
    // A click outside closes it — otherwise the drawer stays open while the
    // visitor reads the page underneath it.
    document.addEventListener("click", function (event) {
      if (moreBtn.getAttribute("aria-expanded") !== "true") {
        return;
      }
      if (!drawer.region.contains(event.target) && !moreBtn.contains(event.target)) {
        drawer.close();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && moreBtn.getAttribute("aria-expanded") === "true") {
        drawer.close();
        moreBtn.focus();
      }
    });
  }

  /* ---------------------------------------------------------------- rail -- */

  Array.prototype.forEach.call(
    document.querySelectorAll(".nav__toggle"),
    function (btn) {
      collapsible(btn, function (region, open) {
        region.setAttribute("data-open", open ? "true" : "false");
      });
    }
  );

  /* -------------------------------------------------------------- hotkey -- */

  var searchField = document.getElementById("masthead-search");

  if (searchField) {
    document.addEventListener("keydown", function (event) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      // Never steal the key while the visitor is typing.
      var el = document.activeElement;
      if (el) {
        var tag = el.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable) {
          return;
        }
      }

      // The field is display:none below 800px, so it cannot be focused there.
      if (!searchField.offsetParent) {
        return;
      }

      event.preventDefault();
      searchField.focus();
    });
  }
})();
