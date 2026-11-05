/* =========================================================
   AROMIRE KEHINDE — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ---------------- nav: scroll state + progress ---------------- */
  var nav = $("#nav");
  var toTop = $("#toTop");
  var scrollBar = $("#scrollBar");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (y / max) * 100 : 0;

    if (nav) nav.classList.toggle("is-scrolled", y > 24);
    if (toTop) toTop.classList.toggle("is-visible", y > 520);
    if (scrollBar) scrollBar.style.width = pct + "%";
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });
  onScroll();

  /* ---------------- nav: mobile menu ---------------- */
  var navToggle = $("#navToggle");
  var navLinks = $("#navLinks");

  function closeMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);
    });

    $$(".nav__link, .nav__cta", navLinks).forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------------- nav: active link ---------------- */
  var sections = $$("main section[id]");
  var navAnchors = $$(".nav__link");

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------- reveal on scroll ---------------- */
  var revealEls = $$(".reveal");
  revealEls.forEach(function (el) {
    var d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--rd", d + "ms");
  });

  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------- typed role ---------------- */
  var typedEl = $("#typedRole");
  var roles = ["Web & App Developer", "Front-End Designer", "Creative Problem Solver"];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      var roleIdx = 0, charIdx = 0, deleting = false;
      (function tick() {
        var current = roles[roleIdx];
        typedEl.textContent = current.slice(0, charIdx);

        if (!deleting && charIdx < current.length) {
          charIdx++;
          setTimeout(tick, 78);
        } else if (!deleting && charIdx === current.length) {
          deleting = true;
          setTimeout(tick, 1700);
        } else if (deleting && charIdx > 0) {
          charIdx--;
          setTimeout(tick, 38);
        } else {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(tick, 380);
        }
      })();
    }
  }

  /* ---------------- animated counters ---------------- */
  var counters = $$("[data-count]");

  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var start = performance.now();
    var dur = 1500;
    (function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------------- skill bars ---------------- */
  var bars = $$(".bar__fill");

  function fillBar(el) {
    var v = el.getAttribute("data-bar") || "0";
    el.style.width = v + "%";
  }

  if (!("IntersectionObserver" in window) || reduceMotion) {
    counters.forEach(runCounter);
    bars.forEach(fillBar);
  } else {
    var statObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var t = entry.target;
        if (t.hasAttribute("data-count")) runCounter(t);
        else fillBar(t);
        obs.unobserve(t);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { statObserver.observe(el); });
    bars.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------------- 3D tilt ---------------- */
  if (finePointer && !reduceMotion) {
    $$("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.getAttribute("data-tilt-max")) || 10;
      var raf = null, targetX = 0, targetY = 0, curX = 0, curY = 0, active = false;

      function apply() {
        curX += (targetX - curX) * 0.16;
        curY += (targetY - curY) * 0.16;

        var settled = Math.abs(targetX - curX) < 0.1 && Math.abs(targetY - curY) < 0.1;

        if (settled && !active) {
          /* back at rest: hand control back to CSS so :hover still works */
          curX = 0; curY = 0;
          el.style.transform = "";
          el.classList.remove("is-tilting");
          raf = null;
          return;
        }

        var lift = active ? -5 : 0;
        el.style.transform =
          "perspective(1000px) rotateX(" + curY.toFixed(2) + "deg) rotateY(" +
          curX.toFixed(2) + "deg) translateY(" + lift + "px)";
        raf = requestAnimationFrame(apply);
      }

      function start() { if (!raf) raf = requestAnimationFrame(apply); }

      el.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        /* the scroll-reveal transition is far too slow for pointer tracking,
           so drop it once the element is actually being tilted */
        el.classList.add("is-tilting");
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        targetX = px * max * 2;
        targetY = -py * max * 2;
        active = true;
        start();
      });

      el.addEventListener("pointerleave", function () {
        targetX = 0;
        targetY = 0;
        active = false;
        start();
      });
    });
  }

  /* ---------------- cursor glow ---------------- */
  var cursorGlow = $(".cursor-glow");
  if (cursorGlow && finePointer && !reduceMotion) {
    var gx = 0, gy = 0, cx = 0, cy = 0, gRaf = null, shown = false;

    function glowLoop() {
      cx += (gx - cx) * 0.1;
      cy += (gy - cy) * 0.1;
      cursorGlow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      if (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5) {
        gRaf = requestAnimationFrame(glowLoop);
      } else {
        gRaf = null;
      }
    }

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      gx = e.clientX;
      gy = e.clientY;
      if (!shown) {
        shown = true;
        cx = gx; cy = gy;
        cursorGlow.style.opacity = "1";
      }
      if (!gRaf) gRaf = requestAnimationFrame(glowLoop);
    }, { passive: true });

    document.addEventListener("pointerleave", function () {
      cursorGlow.style.opacity = "0";
    });
  }

  /* ---------------- contact form -> mailto ---------------- */
  var form = $("#contactForm");
  var status = $("#formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameEl = $("#cf-name");
      var emailEl = $("#cf-email");
      var msgEl = $("#cf-message");

      [nameEl, emailEl, msgEl].forEach(function (el) {
        var field = el.closest(".field");
        if (field) field.classList.remove("has-error");
      });
      if (status) {
        status.classList.remove("is-error");
        status.textContent = "";
      }

      var invalid = [];
      if (!nameEl.value.trim()) invalid.push(nameEl);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) invalid.push(emailEl);
      if (!msgEl.value.trim()) invalid.push(msgEl);

      if (invalid.length) {
        invalid.forEach(function (el) {
          var field = el.closest(".field");
          if (field) field.classList.add("has-error");
        });
        if (status) {
          status.classList.add("is-error");
          status.textContent = "Please complete the highlighted fields.";
        }
        invalid[0].focus();
        return;
      }

      var subject = "Project enquiry from " + nameEl.value.trim();
      var body =
        "Name: " + nameEl.value.trim() + "\n" +
        "Email: " + emailEl.value.trim() + "\n\n" +
        msgEl.value.trim();

      var url = "mailto:heisbale@gmail.com?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      if (status) status.textContent = "Opening your email app…";
      window.location.href = url;
      form.reset();
      setTimeout(function () {
        if (status) status.textContent = "Thanks, " + nameEl.value.trim().split(" ")[0] +
          "! Your mail app should be open — just hit send.";
      }, 900);
    });

    $$("input, textarea", form).forEach(function (el) {
      el.addEventListener("input", function () {
        var field = el.closest(".field");
        if (field) field.classList.remove("has-error");
      });
    });
  }

  /* ---------------- footer year ---------------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- smooth anchor fallback ---------------- */
  if (!("scrollBehavior" in document.documentElement.style)) {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 90);
      });
    });
  }
})();
