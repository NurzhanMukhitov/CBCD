(function () {
  "use strict";

  var STICKY_NAV_HEIGHT = 56;
  var ROOT = document.documentElement;

  // ---------- Sticky nav visibility ----------
  var stickyNav = document.getElementById("sticky-nav");
  var hero = document.querySelector(".hero");
  if (stickyNav && hero) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          stickyNav.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0, rootMargin: "0px 0px 0px 0px" }
    );
    navObserver.observe(hero);
  }

  // ---------- Scrollspy ----------
  var sections = document.querySelectorAll("[data-section]");
  var navLinks = document.querySelectorAll(".sticky-nav__link[data-scroll-to]");

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

  if (sections.length && navLinks.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-" + (STICKY_NAV_HEIGHT + 20) + "px 0px -60% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      if (section.id) spyObserver.observe(section);
    });
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
    var y = el.getBoundingClientRect().top + window.pageYOffset - STICKY_NAV_HEIGHT;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  document.querySelectorAll("[data-scroll-to]").forEach(function (node) {
    node.addEventListener("click", function (e) {
      var target = this.getAttribute("data-scroll-to");
      if (!target || target === "#") return;
      if (node.tagName.toLowerCase() === "a") {
        e.preventDefault();
      }
      scrollToTarget(target);
    });
  });

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

  // ---------- Video: lazy load embed (with optional poster + fade-in) ----------
  document.querySelectorAll('.module--video[data-video-type="embed"]').forEach(function (module) {
    var placeholder = module.querySelector(".module__video-placeholder");
    var trigger = module.querySelector(".module__video-trigger");
    var playBtn = module.querySelector(".module__video-play");
    var posterImg = module.querySelector(".module__video-poster");
    var src = module.getAttribute("data-video-src");
    var posterUrl = module.getAttribute("data-video-poster");
    if (!placeholder || !src) return;

    if (posterUrl && posterImg) {
      posterImg.src = posterUrl;
    }
    var runPlay = function () {
      var container = document.createElement("div");
      container.className = "module__video-container";
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = "Видео";
      container.appendChild(iframe);
      module.appendChild(container);
      placeholder.style.display = "none";
      requestAnimationFrame(function () {
        container.classList.add("is-visible");
      });
    };
    if (trigger) {
      trigger.addEventListener("click", runPlay);
    }
    if (playBtn) {
      playBtn.addEventListener("click", runPlay);
    }
  });

  // ---------- Command Palette: stub for future Cmd+K / Ctrl+K ----------
  // TODO: bind keydown (metaKey+K / ctrlKey+K), show #command-palette, focus search, render results

  // link type: already <a target="_blank" rel="noopener"> in HTML, no JS needed
})();
