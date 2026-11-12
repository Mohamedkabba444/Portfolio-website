/* Portfolio enhancements — progressive only.
   All content is readable with JavaScript disabled.
   This script only adds: a collapsible mobile nav and the footer year. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) {
    return;
  }

  function setOpen(open) {
    nav.setAttribute("data-open", open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(nav.getAttribute("data-open") !== "true");
  });

  /* Close the menu after choosing a link, and on Escape. */
  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setOpen(false);
      toggle.focus();
    }
  });

  /* If the viewport grows past the mobile breakpoint, reset the menu. */
  var mq = window.matchMedia("(min-width: 43.75rem)");
  function onViewportChange(event) {
    if (event.matches) {
      setOpen(false);
    }
  }
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onViewportChange);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(onViewportChange);
  }
})();
