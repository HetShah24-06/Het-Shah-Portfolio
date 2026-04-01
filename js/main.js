/* ============================================================
   HET SHAH PORTFOLIO — main.js (Clean Minimal)
   ============================================================ */

/* ── 1. NAV scroll + active + hamburger ── */
(function initNav() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(
    '.nav-links a[href^="#"], .nav-drawer a[href^="#"]',
  );
  const btn = document.getElementById("nav-hamburger");
  const drawer = document.getElementById("nav-drawer");
  const backTop = document.getElementById("back-top");
  let drawerOpen = false;

  /* ── Back to top ── */
  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── Scroll: back-to-top + active nav ── */
  function onScroll() {
    if (backTop) {
      if (window.scrollY > 300) {
        backTop.classList.add("visible");
      } else {
        backTop.classList.remove("visible");
      }
    }
    let current = "";
    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Hamburger ── */
  function openDrawer() {
    drawerOpen = true;
    drawer.classList.add("open");
    btn.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeDrawer() {
    drawerOpen = false;
    drawer.classList.remove("open");
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  if (btn && drawer) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (drawerOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeDrawer();
      });
    });

    document.addEventListener("click", function (e) {
      if (drawerOpen && !drawer.contains(e.target) && !btn.contains(e.target)) {
        closeDrawer();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawerOpen) closeDrawer();
    });
  }
})();

/* ── 2. SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => io.observe(el));
})();

/* ── 3. HERO ENTRANCE ── */
window.addEventListener("load", () => {
  const items = [
    ".hero-avail",
    ".hero-heading",
    ".hero-desc",
    ".hero-actions",
    ".hero-stats",
    ".hero-right",
  ];
  items.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`;
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 60);
  });
});

/* ── 4. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ── 5. PROJECT ROW HOVER SOUND EFFECT (subtle) ── */
document.querySelectorAll(".proj-row").forEach((row) => {
  row.addEventListener("mouseenter", () => {
    row.style.paddingLeft = "0.5rem";
    row.style.transition = "padding 0.2s ease";
  });
  row.addEventListener("mouseleave", () => {
    row.style.paddingLeft = "0";
  });
});
