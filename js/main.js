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
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: "smooth" });
  });
});


/* ── HERO TERMINAL ANIMATION ── */
(function initTerminal() {
  const body = document.getElementById("terminal-body");
  if (!body) return;

  const lines = [
    { type: "prompt", text: "~/het-shah $ ", cmd: "whoami" },
    {
      type: "output",
      parts: [
        { cls: "ht-key", t: "name" },
        { cls: "ht-dim", t: "       → " },
        { cls: "ht-str", t: '"Het Shah"' },
      ],
    },
    {
      type: "output",
      parts: [
        { cls: "ht-key", t: "role" },
        { cls: "ht-dim", t: "       → " },
        { cls: "ht-str", t: '"Full Stack Engineer"' },
      ],
    },
    {
      type: "output",
      parts: [
        { cls: "ht-key", t: "location" },
        { cls: "ht-dim", t: "   → " },
        { cls: "ht-str", t: '"Brampton, ON 🇨🇦"' },
      ],
    },
    { type: "blank" },
    { type: "prompt", text: "~/het-shah $ ", cmd: "cat stack.json" },
    { type: "output", parts: [{ cls: "ht-dim", t: "{" }] },
    {
      type: "output",
      parts: [
        { cls: "ht-dim", t: "  " },
        { cls: "ht-key", t: "backend" },
        { cls: "ht-dim", t: ":  " },
        { cls: "ht-amber", t: '["Node.js", "PostgreSQL"]' },
      ],
    },
    {
      type: "output",
      parts: [
        { cls: "ht-dim", t: "  " },
        { cls: "ht-key", t: "frontend" },
        { cls: "ht-dim", t: ": " },
        { cls: "ht-amber", t: '["React", "Next.js"]' },
      ],
    },
    {
      type: "output",
      parts: [
        { cls: "ht-dim", t: "  " },
        { cls: "ht-key", t: "arch" },
        { cls: "ht-dim", t: ":     " },
        { cls: "ht-amber", t: '"Microservices"' },
      ],
    },
    { type: "output", parts: [{ cls: "ht-dim", t: "}" }] },
    { type: "blank" },
    { type: "prompt", text: "~/het-shah $ ", cmd: "status --check" },
    {
      type: "output",
      parts: [
        { cls: "ht-green", t: "✓ " },
        { cls: "ht-val", t: "Open to Work" },
      ],
    },
    {
      type: "output",
      parts: [
        { cls: "ht-green", t: "✓ " },
        { cls: "ht-val", t: "Dean's Honours List" },
      ],
    },
    {
      type: "output",
      parts: [
        { cls: "ht-green", t: "✓ " },
        { cls: "ht-val", t: "3+ Years Experience" },
      ],
    },
    { type: "blank" },
    { type: "cursor" },
  ];

  let lineIndex = 0;

  function makeLine(line) {
    const div = document.createElement("div");
    div.className = "ht-line";
    return div;
  }

  function typeText(el, text, speed, cb) {
    let i = 0;
    function next() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(next, speed + Math.random() * 30);
      } else if (cb) cb();
    }
    next();
  }

  function renderOutputLine(line, cb) {
    const div = makeLine(line);
    body.appendChild(div);
    line.parts.forEach((p) => {
      const span = document.createElement("span");
      span.className = p.cls;
      span.textContent = p.t;
      div.appendChild(span);
    });
    setTimeout(cb, 60);
  }

  function renderPromptLine(line, cb) {
    const div = makeLine(line);
    body.appendChild(div);

    const promptSpan = document.createElement("span");
    promptSpan.className = "ht-prompt";
    promptSpan.textContent = line.text;
    div.appendChild(promptSpan);

    const cmdSpan = document.createElement("span");
    cmdSpan.className = "ht-cmd";
    div.appendChild(cmdSpan);

    typeText(cmdSpan, line.cmd, 55, () => setTimeout(cb, 180));
  }

  function renderCursor() {
    const div = makeLine({ type: "cursor" });
    body.appendChild(div);

    const promptSpan = document.createElement("span");
    promptSpan.className = "ht-prompt";
    promptSpan.textContent = "~/het-shah $ ";
    div.appendChild(promptSpan);

    const cursor = document.createElement("span");
    cursor.className = "ht-cursor";
    div.appendChild(cursor);
  }

  function renderBlank(cb) {
    const div = document.createElement("div");
    div.style.height = "0.4rem";
    body.appendChild(div);
    setTimeout(cb, 60);
  }

  function renderNext() {
    if (lineIndex >= lines.length) return;
    const line = lines[lineIndex++];

    if (line.type === "blank") {
      renderBlank(renderNext);
    } else if (line.type === "prompt") {
      renderPromptLine(line, renderNext);
    } else if (line.type === "output") {
      renderOutputLine(line, renderNext);
    } else if (line.type === "cursor") {
      renderCursor();
    }
  }

  // Start after hero entrance animation settles
  setTimeout(renderNext, 900);
})();
