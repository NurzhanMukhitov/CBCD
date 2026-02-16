(function () {
  "use strict";

  var STICKY_NAV_HEIGHT = 56;

  // ---------- Sticky nav visibility ----------
  var stickyNav = document.getElementById("sticky-nav");
  var scrollToTopBtn = document.querySelector(".scroll-to-top");
  var hero = document.querySelector(".hero");
  if (hero) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var isScrolled = !entry.isIntersecting;
          if (stickyNav) {
            stickyNav.classList.toggle("is-visible", isScrolled);
          }
          if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle("is-visible", isScrolled);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    navObserver.observe(hero);
  }

  // ---------- Scrollspy ----------
  var sections = document.querySelectorAll("[data-section]");
  var navLinks = document.querySelectorAll(".sticky-nav__link[data-scroll-to]");
  var scrollSpyTriggerY = STICKY_NAV_HEIGHT + 20;

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var target = link.getAttribute("data-scroll-to") || link.getAttribute("href");
      if (target === "#" + id) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  function updateActiveSection() {
    if (!navLinks.length) return;
    var best = null;
    var bestTop = -Infinity;
    sections.forEach(function (section) {
      if (!section.id) return;
      var rect = section.getBoundingClientRect();
      if (rect.top <= scrollSpyTriggerY && rect.top > bestTop) {
        best = section;
        bestTop = rect.top;
      }
    });
    if (best) setActiveLink(best.id);
  }

  if (sections.length && navLinks.length) {
    window.addEventListener("scroll", function () {
      updateActiveSection();
    }, { passive: true });
    updateActiveSection();
  }

  // ---------- Reading progress bar ----------
  var progressBar = document.querySelector(".progress-bar");
  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    progressBar.style.setProperty("--progress", progress);
  }
  if (progressBar) {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // ---------- Smooth scroll with offset (buttons + sticky links) ----------
  function scrollToTarget(selector) {
    var el = document.querySelector(selector);
    if (!el) return;
    // scroll-margin-top on sections already accounts for sticky nav
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  var scrollToNodes = document.querySelectorAll("[data-scroll-to]");
  if (!window.__cbsdScrollToBound) {
    window.__cbsdScrollToBound = true;
    scrollToNodes.forEach(function (node) {
      node.addEventListener("click", function (e) {
        var target = this.getAttribute("data-scroll-to");
        if (!target || target === "#") return;
        if (this.tagName.toLowerCase() === "a") {
          e.preventDefault();
        }
        scrollToTarget(target);
        // Обновляем hash в URL после прокрутки
        history.replaceState(null, "", target);
      });
    });
  }

  // ---------- Section enter animation (is-visible) ----------
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { rootMargin: "0px 0px -80px 0px", threshold: 0 }
  );
  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ---------- Command Palette: stub for future Cmd+K / Ctrl+K ----------
  // TODO: bind keydown (metaKey+K / ctrlKey+K), show #command-palette, focus search, render results

  // link type: already <a target="_blank" rel="noopener"> in HTML, no JS needed
})();
