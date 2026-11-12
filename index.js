/* Portfolio enhancements — progressive only.
   All content is readable with JavaScript disabled.
   This script only adds: a collapsible mobile nav, the footer year,
   scroll-reveal animations, a scroll progress bar, active-section
   highlighting in the nav, and a back-to-top button. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* Respect reduced motion: skip animation-driven features. */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
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
  }

  /* Scroll reveal — only when motion is welcome and the API exists.
     Without JS (or without IntersectionObserver) every .reveal stays
     fully visible, because the hidden state is applied by CSS only
     when html.js is present and this code adds .reveal--visible. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal--visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("reveal--visible");
    });
  }

  /* Active-section highlighting in the nav */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".site-nav__list a[href^='#']")
  );
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  function setActive(link) {
    navLinks.forEach(function (l) {
      if (l === link) {
        l.setAttribute("aria-current", "true");
      } else {
        l.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var match = sections.find(function (item) {
            return item.section === entry.target;
          });
          if (match) {
            setActive(match.link);
          }
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });

    sections.forEach(function (item) {
      sectionObserver.observe(item.section);
    });
  }

  /* Scroll progress bar + back-to-top button */
  var progressBar = document.getElementById("scroll-progress-bar");
  var backToTop = document.getElementById("back-to-top");
  var ticking = false;

  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && max > 0) {
      progressBar.style.width = (scrollY / max * 100) + "%";
    }
    if (backToTop) {
      backToTop.hidden = scrollY < 600;
    }
    ticking = false;
  }

  function requestScrollTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }

  window.addEventListener("scroll", requestScrollTick, { passive: true });
  onScroll();
})();
