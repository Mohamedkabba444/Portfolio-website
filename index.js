//  ══════════════════════════════════════════════════════════════
//     JAVASCRIPT
//     All interactions bundled in a single <script> block.
//     Each section is wrapped in an IIFE with a descriptive name.

//     A. initSmoothScroll   — intercepts all internal anchor links
//     B. initScrollSpy      — highlights active nav link on scroll
//     C. initMobileMenu     — hamburger toggle with a11y management
//     D. initRevealAnimations — scroll-driven fade-up for sections
//     E. initSkillBarAnimations — fills skill progress bars on entry
//     F. initContactForm    — validates + submits via Formspree
//   ══════════════════════════════════════════════════════════════

"use strict";

/* ──────────────────────────────────────────────────────────
 * A. SMOOTH-SCROLL NAVIGATION
 *    Uses event delegation on document so it catches ALL
 *    internal anchor links (including those added later).
 *    Closes the mobile menu if it's open.
 * ────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  /*
   * Uses window.scrollTo() instead of scrollIntoView() because
   * scrollIntoView does not reliably respect scroll-padding-top
   * across all browsers and embedded environments.
   *
   * We manually subtract the nav bar height (plus 8px breathing
   * room) so the target section always lands cleanly below the
   * fixed header.
   */
  document.addEventListener("click", function (event) {
    // Walk up the DOM tree to find the nearest anchor ancestor.
    // This handles clicks on child elements (SVG icons, spans, etc.)
    var anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;

    var targetHash = anchor.getAttribute("href");
    // Ignore bare '#' links (no-op anchors like placeholder hrefs)
    if (!targetHash || targetHash === "#") return;

    var targetSectionId = targetHash.slice(1); // strip the leading '#'
    var targetSection = document.getElementById(targetSectionId);
    if (!targetSection) return; // section not found — bail safely

    event.preventDefault();

    // Calculate scroll position: top of section minus nav height offset.
    // getBoundingClientRect().top is relative to viewport, so add
    // window.pageYOffset to convert to absolute document position.
    var navElement = document.querySelector(".site-nav");
    var navHeight = navElement ? navElement.offsetHeight : 0;
    var sectionTop =
      targetSection.getBoundingClientRect().top + window.pageYOffset;
    var scrollDestination = sectionTop - navHeight - 8; // 8px breathing room

    window.scrollTo({
      top: scrollDestination,
      behavior: "smooth",
    });

    // Close the mobile menu if it is currently open.
    // Guard: only call if the panel element actually exists.
    if (typeof closeMobileMenu === "function") {
      closeMobileMenu();
    }
  });
})();

/* ──────────────────────────────────────────────────────────
 * B. SCROLL-SPY
 *    Watches scroll position and marks the nav link for the
 *    currently visible section as active (.is-active class
 *    + aria-current="page" for screen readers).
 * ────────────────────────────────────────────────────────── */
(function initScrollSpy() {
  // Ordered list matching the actual page sequence
  var SECTION_IDS = ["home", "about", "projects", "skills", "contact"];
  var allNavLinks = document.querySelectorAll("[data-section]");

  /**
   * Applies .is-active + aria-current to the matching nav link(s).
   * @param {string} activeSectionId
   */
  function highlightActiveSection(activeSectionId) {
    allNavLinks.forEach(function (link) {
      var matches = link.getAttribute("data-section") === activeSectionId;
      link.classList.toggle("is-active", matches);
      if (matches) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  /**
   * Determines which section is dominant in the current viewport.
   * Trigger line: 40% down from the top of the viewport.
   * Resets to 'home' when within 80px of the top of the page.
   * @returns {string} section ID
   */
  function detectActiveSection() {
    if (window.pageYOffset < 80) return "home";

    var triggerLineY = window.pageYOffset + window.innerHeight * 0.4;
    var currentSectionId = SECTION_IDS[0];

    SECTION_IDS.forEach(function (sectionId) {
      var sectionElement = document.getElementById(sectionId);
      if (sectionElement && sectionElement.offsetTop <= triggerLineY) {
        currentSectionId = sectionId;
      }
    });

    return currentSectionId;
  }

  // Throttle via requestAnimationFrame — keeps scroll handler non-blocking
  var rafScheduled = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(function () {
          highlightActiveSection(detectActiveSection());
          rafScheduled = false;
        });
      }
    },
    { passive: true },
  );

  // Run once the DOM is ready, and again after fonts/images load.
  // The deferred load call handles pages reloaded mid-scroll
  // where the browser may restore scroll position asynchronously.
  highlightActiveSection(detectActiveSection());
  window.addEventListener("load", function () {
    highlightActiveSection(detectActiveSection());
  });
})();

/* ──────────────────────────────────────────────────────────
 * C. MOBILE MENU (hamburger toggle)
 *    Manages open/close state, ARIA attributes, and keyboard
 *    interactions (Escape key to close).
 * ────────────────────────────────────────────────────────── */
var hamburgerButton = document.getElementById("hamburger-btn");
var mobileMenuPanel = document.getElementById("mobile-menu-panel");

/**
 * Opens the mobile navigation panel.
 * Guard: returns silently if either DOM element is missing.
 */
function openMobileMenu() {
  if (!mobileMenuPanel || !hamburgerButton) return;
  mobileMenuPanel.classList.add("is-open");
  mobileMenuPanel.setAttribute("aria-hidden", "false");
  hamburgerButton.setAttribute("aria-expanded", "true");
  hamburgerButton.setAttribute("aria-label", "Close navigation menu");
}

/**
 * Closes the mobile navigation panel.
 * Guard: returns silently if either DOM element is missing.
 * Called from initSmoothScroll on every internal link click,
 * so it must never throw.
 */
function closeMobileMenu() {
  if (!mobileMenuPanel || !hamburgerButton) return;
  mobileMenuPanel.classList.remove("is-open");
  mobileMenuPanel.setAttribute("aria-hidden", "true");
  hamburgerButton.setAttribute("aria-expanded", "false");
  hamburgerButton.setAttribute("aria-label", "Open navigation menu");
}

(function initMobileMenu() {
  // Guard: bail if either element is missing (e.g. on non-mobile renders
  // where the hamburger is display:none and may not exist in older builds)
  if (!hamburgerButton || !mobileMenuPanel) return;

  hamburgerButton.addEventListener("click", function () {
    var isCurrentlyOpen = mobileMenuPanel.classList.contains("is-open");
    if (isCurrentlyOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close when the user presses Escape (keyboard accessibility)
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      mobileMenuPanel.classList.contains("is-open")
    ) {
      closeMobileMenu();
      hamburgerButton.focus(); // return focus to trigger button
    }
  });
})();

/* ──────────────────────────────────────────────────────────
 * D. SCROLL REVEAL ANIMATIONS
 *    Sections and groups with .reveal or .reveal-stagger
 *    start at opacity:0 / translateY(24px).
 *    IntersectionObserver adds .is-revealed when they cross
 *    the 8% visibility threshold, triggering CSS transitions.
 *    Each observed element is unwatched once animated — no
 *    re-triggering, no layout thrash on re-entry.
 * ────────────────────────────────────────────────────────── */
(function initRevealAnimations() {
  /*
   * prefers-reduced-motion is handled entirely in CSS via
   * @media (prefers-reduced-motion: no-preference).
   * This function only manages IntersectionObserver —
   * adding .is-revealed when elements enter the viewport.
   *
   * If js-io-ready is NOT on <html> (IO unavailable), elements
   * are visible by default in CSS — nothing to do.
   */
  var ioReady = document.documentElement.classList.contains("js-io-ready");
  var revealElements = document.querySelectorAll(".reveal, .reveal-stagger");

  if (!ioReady) {
    /* IO not available — mark all revealed for API consistency */
    revealElements.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target); /* fire once only */
        }
      });
    },
    {
      threshold: 0 /* trigger the instant ANY pixel is visible */,
      rootMargin:
        "0px 0px -60px 0px" /* don't fire until 60px above fold-bottom */,
    },
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });
})();

/* ──────────────────────────────────────────────────────────
 * E. SKILL BAR FILL ANIMATIONS
 *    Each .skill-item__fill stores its target width in the
 *    data-fill-width attribute. Bars animate from 0 to that
 *    value the first time the skills section enters view.
 *    Uses staggered timeouts (80ms apart) for a cascade effect.
 * ────────────────────────────────────────────────────────── */
(function initSkillBarAnimations() {
  var skillsSection = document.getElementById("skills-section");
  if (!skillsSection) return;

  /*
   * Fill bars immediately in all cases.
   * When reduced-motion is active, the CSS transition:none rule
   * makes them snap to width instantly. When motion is allowed,
   * the CSS transition: width 1.2s makes them animate smoothly.
   * Either way we don't need to detect the preference here —
   * CSS handles it.
   *
   * If IntersectionObserver is available, wait for the skills
   * section to scroll into view before filling. Otherwise fill now.
   */
  function fillBars() {
    document
      .querySelectorAll(".skill-item__fill")
      .forEach(function (bar, index) {
        var targetWidth = bar.getAttribute("data-fill-width");
        /* Small per-bar stagger so they cascade nicely when animated */
        setTimeout(function () {
          bar.style.width = targetWidth + "%";
        }, index * 80);
      });
  }

  var ioReady = document.documentElement.classList.contains("js-io-ready");
  if (!ioReady) {
    fillBars();
    return;
  }

  var hasAnimated = false;
  var skillsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          fillBars();
          skillsObserver.unobserve(skillsSection);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" },
  );

  skillsObserver.observe(skillsSection);
})();

/* ──────────────────────────────────────────────────────────
 * F. CONTACT FORM
 *    Validates all fields client-side with per-field error
 *    states, then submits to Formspree via fetch().
 *
 *    SETUP:
 *    1. Sign up at https://formspree.io (free — 50 msgs/month)
 *    2. Create a new form and copy the form ID (e.g. "xabcdefg")
 *    3. Replace YOUR_FORM_ID below with your actual form ID
 *
 *    Until configured, a mailto: fallback opens the user's
 *    email client with all fields pre-filled.
 * ────────────────────────────────────────────────────────── */
(function initContactForm() {
  var FORMSPREE_FORM_ID = "YOUR_FORM_ID"; // ← replace with your Formspree ID
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/" + FORMSPREE_FORM_ID;

  // ── Element references ──
  var contactForm = document.getElementById("contact-form");
  var nameField = document.getElementById("contact-name");
  var emailField = document.getElementById("contact-email");
  var subjectField = document.getElementById("contact-subject");
  var messageField = document.getElementById("contact-message");
  var statusEl = document.getElementById("contact-status");
  var submitButton = document.getElementById("contact-submit-btn");

  // Guard — form not present on this page
  if (!contactForm) return;

  /**
   * Validates an email address with a simple, reliable regex.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmailAddress(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Applies the error state (red border + shake animation) to a form input.
   * @param {HTMLElement} inputElement
   */
  function applyFieldError(inputElement) {
    inputElement.classList.add("field-error");
    // Remove the class after the shake animation finishes so it can replay
    setTimeout(function () {
      inputElement.classList.remove("field-error");
    }, 600);
  }

  /**
   * Updates the status text element with a message and visual state.
   * @param {string} message    - Text to show
   * @param {'success'|'error'|''} type - Visual style
   */
  function updateFormStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className =
      "form-status-message" + (type ? " form-status-message--" + type : "");
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // ── Collect values ──
    var nameValue = nameField.value.trim();
    var emailValue = emailField.value.trim();
    var subjectValue = subjectField.value.trim();
    var messageValue = messageField.value.trim();

    // ── Clear previous error states ──
    updateFormStatus("", "");

    // ── Validate fields ──
    var formIsValid = true;

    if (!nameValue) {
      applyFieldError(nameField);
      formIsValid = false;
    }
    if (!isValidEmailAddress(emailValue)) {
      applyFieldError(emailField);
      formIsValid = false;
    }
    if (!subjectValue) {
      applyFieldError(subjectField);
      formIsValid = false;
    }
    if (!messageValue) {
      applyFieldError(messageField);
      formIsValid = false;
    }

    if (!formIsValid) {
      updateFormStatus("Please fill in all fields correctly.", "error");
      return;
    }

    // ── Formspree not yet configured — use mailto fallback ──
    if (FORMSPREE_FORM_ID === "YOUR_FORM_ID") {
      var mailtoBody = [
        messageValue,
        "",
        "---",
        "From: " + nameValue + " <" + emailValue + ">",
      ].join("\n");

      var mailtoHref =
        "mailto:hello@mdkportfolio.dev" +
        "?subject=" +
        encodeURIComponent(subjectValue) +
        "&body=" +
        encodeURIComponent(mailtoBody);

      // Programmatic anchor click — most reliable cross-browser mailto trigger
      var mailtoAnchor = document.createElement("a");
      mailtoAnchor.href = mailtoHref;
      mailtoAnchor.style.display = "none";
      document.body.appendChild(mailtoAnchor);
      mailtoAnchor.click();
      document.body.removeChild(mailtoAnchor);

      updateFormStatus("Opening your email client…", "success");
      return;
    }

    // ── Submit to Formspree ──
    submitButton.disabled = true;
    submitButton.querySelector(".form-submit-btn__label").textContent =
      "Sending…";

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameValue,
        email: emailValue,
        subject: subjectValue,
        message: messageValue,
      }),
    })
      .then(function (response) {
        // Parse JSON body and attach the HTTP ok flag
        return response.json().then(function (data) {
          return { httpOk: response.ok, data: data };
        });
      })
      .then(function (result) {
        submitButton.disabled = false;
        submitButton.querySelector(".form-submit-btn__label").textContent =
          "Send message";

        if (result.httpOk) {
          updateFormStatus("✓ Message sent — I'll reply soon!", "success");
          // Clear the form on success
          nameField.value = "";
          emailField.value = "";
          subjectField.value = "";
          messageField.value = "";
        } else {
          var serverError =
            result.data && result.data.error
              ? result.data.error
              : "Something went wrong. Please try again.";
          updateFormStatus(serverError, "error");
        }
      })
      .catch(function (networkError) {
        // Network failure — give the user actionable guidance
        submitButton.disabled = false;
        submitButton.querySelector(".form-submit-btn__label").textContent =
          "Send message";
        updateFormStatus(
          "Network error. Please email hello@mdkportfolio.dev directly.",
          "error",
        );
      });
  });
})(); // end initContactForm
