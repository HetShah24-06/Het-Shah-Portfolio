/* Het Shah — portfolio v3
   1. Inline response blocks for small screens
   2. Desktop console: "sends" a request and types the response for the section in view
   3. Motion: name decode, request-flow pulses, scroll reveals, timeline rail,
      sliding nav pill, cursor spotlight, project tilt
   4. Mobile menu
   All motion is skipped when the visitor prefers reduced motion. */

(function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const root = document.documentElement;
  if (!reduceMotion) root.classList.add("js-motion");

  const sections = Array.from(document.querySelectorAll(".sec[data-endpoint]"));
  const navLinks = Array.from(document.querySelectorAll(".nav a"));
  const consoleBody = document.getElementById("console-body");
  const consoleState = document.getElementById("console-state");
  const sendBtn = document.getElementById("console-send");
  const responses = {};
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ── 1. Read each section's response template ── */
  sections.forEach(function (sec) {
    const tpl = sec.querySelector("template.resp");
    if (!tpl) return;
    const html = tpl.innerHTML.replace(/^\s*\n/, "");
    responses[sec.id] = html;

    const head = sec.querySelector(".sec-head code");
    const method = sec.querySelector(".sec-head .m");
    const label = head
      ? (method ? method.textContent + " " : "") + head.textContent
      : "GET /developer";

    const details = document.createElement("details");
    details.className = "inline-resp";
    if (sec.id === "hello") details.open = true;
    details.innerHTML =
      "<summary>Response for " + label + "</summary><pre>" + html + "</pre>";
    sec.appendChild(details);
  });

  /* ── 2. Console: send + type ── */
  let current = null;
  let runId = 0;

  function setState(text, cls) {
    if (!consoleState) return;
    consoleState.textContent = text;
    consoleState.className = "console-state" + (cls ? " " + cls : "");
  }

  // Types HTML character by character while keeping the syntax-colour spans intact.
  async function typeInto(target, html, id) {
    const src = document.createElement("div");
    src.innerHTML = html;
    let budget = 0;

    async function walk(node, parent) {
      for (const child of Array.from(node.childNodes)) {
        if (id !== runId) return;
        if (child.nodeType === 3) {
          const text = child.textContent;
          const tn = document.createTextNode("");
          parent.appendChild(tn);
          for (let i = 0; i < text.length; i++) {
            if (id !== runId) return;
            tn.textContent += text[i];
            if (++budget % 4 === 0) await sleep(text[i] === "\n" ? 18 : 6);
          }
        } else if (child.nodeType === 1) {
          const el = child.cloneNode(false);
          parent.appendChild(el);
          await walk(child, el);
        }
      }
    }
    await walk(src, target);
  }

  async function send(id) {
    if (!consoleBody || !responses[id]) return;
    const my = ++runId;

    if (reduceMotion) {
      consoleBody.innerHTML = responses[id];
      setState("200 OK", "ok");
      return;
    }

    const html = responses[id];
    const split = html.indexOf("\n\n"); // request line(s) | response
    const request = split > -1 ? html.slice(0, split) : "";
    const response = split > -1 ? html.slice(split + 2) : html;

    consoleBody.innerHTML = "";
    consoleBody.scrollTop = 0;
    setState("Sending request…", "sending");
    await typeInto(consoleBody, request, my);
    if (my !== runId) return;
    consoleBody.insertAdjacentHTML(
      "beforeend",
      '\n<span class="c-dim">…</span>',
    );
    await sleep(380);
    if (my !== runId) return;
    consoleBody.lastChild && consoleBody.removeChild(consoleBody.lastChild);
    consoleBody.insertAdjacentHTML("beforeend", "\n");
    setState("200 OK", "ok");
    await typeInto(consoleBody, response, my);
    if (my !== runId) return;
    consoleBody.insertAdjacentHTML(
      "beforeend",
      '\n<span class="caret" aria-hidden="true"></span>',
    );
  }

  function swapTo(id) {
    if (id === current) return;
    current = id;
    send(id);
  }
  if (sendBtn)
    sendBtn.addEventListener("click", function () {
      send(current || "hello");
    });

  /* ── 3a. Active section + nav pill ── */
  const pill = document.querySelector(".nav-pill");
  function movePill(link) {
    if (!pill || !link) return;
    pill.style.setProperty("--pill-y", link.offsetTop + "px");
    pill.style.height = link.offsetHeight + "px";
    pill.classList.add("on");
  }

  function setActive(id) {
    navLinks.forEach(function (a) {
      const on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("active", on);
      if (on) {
        a.setAttribute("aria-current", "location");
        movePill(a);
      } else a.removeAttribute("aria-current");
    });
    swapTo(id);
  }

  /* ── 3b. Timeline rail ── */
  const timeline = document.querySelector(".timeline");
  const jobs = Array.from(document.querySelectorAll(".job"));
  function updateTimeline() {
    if (!timeline) return;
    const r = timeline.getBoundingClientRect();
    const line = window.innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
    timeline.style.setProperty("--tl", reduceMotion ? 1 : p.toFixed(3));
    jobs.forEach(function (j) {
      j.classList.toggle(
        "lit",
        j.getBoundingClientRect().top + 30 < line || reduceMotion,
      );
    });
  }

  function onScroll() {
    const probe = window.innerHeight * 0.35;
    let id = sections[0].id;
    for (const sec of sections)
      if (sec.getBoundingClientRect().top - probe <= 0) id = sec.id;
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4)
      id = sections[sections.length - 1].id;
    setActive(id);
    updateTimeline();
  }
  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true },
  );
  window.addEventListener("resize", onScroll);

  /* ── 3c. Name decode ── */
  const decodeEl = document.querySelector(".decode");
  function decode() {
    if (!decodeEl || reduceMotion) return;
    const final = decodeEl.dataset.text;
    const glyphs = "{}[]<>/=*#$_01";
    decodeEl.setAttribute("aria-label", final);
    decodeEl.innerHTML = final
      .split("")
      .map(function (c) {
        return c === " "
          ? " "
          : '<span class="ch scr" aria-hidden="true">' + c + "</span>";
      })
      .join("");
    const spans = Array.from(decodeEl.querySelectorAll(".ch"));
    const letters = final.replace(/ /g, "").split("");
    let frame = 0;
    (function tick() {
      frame++;
      spans.forEach(function (s, i) {
        if (frame > 8 + i * 3) {
          s.textContent = letters[i];
          s.classList.remove("scr");
        } else
          s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      });
      if (frame <= 8 + spans.length * 3) setTimeout(tick, 38);
    })();
  }

  /* ── 3d. Request flow: light up each node as the packet arrives ── */
  const nodes = document.querySelectorAll(".flow-node");
  function flowCycle() {
    if (!nodes.length || reduceMotion) return;
    // arrival times (ms) matched to the CSS keyframes (4s loop)
    [
      [0, 0],
      [600, 1],
      [1300, 2],
      [2200, 1],
      [2900, 0],
    ].forEach(function (step) {
      setTimeout(function () {
        const n = nodes[step[1]];
        n.classList.add("hit");
        setTimeout(function () {
          n.classList.remove("hit");
        }, 420);
      }, step[0]);
    });
  }

  /* ── 3e. Scroll reveals ── */
  function setupReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const groups = [
      ".sec:not(.hello) .sec-head",
      ".sec:not(.hello) > p",
      ".job",
      ".proj",
      ".skills tr",
      ".edu",
      ".contact-list li",
      ".facts > div",
      ".flow",
      ".cert",
    ];
    const els = document.querySelectorAll(groups.join(","));
    els.forEach(function (el) {
      el.classList.add("rv");
      const sibs = Array.from(el.parentElement.children).filter(function (c) {
        return c.tagName === el.tagName;
      });
      el.style.setProperty("--d", Math.min(sibs.indexOf(el), 6) * 0.07 + "s");
    });
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ── 3f. Cursor spotlight + project tilt (pointer devices only) ── */
  function setupPointer() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
    window.addEventListener(
      "pointermove",
      function (e) {
        root.style.setProperty("--mx", e.clientX + "px");
        root.style.setProperty("--my", e.clientY + "px");
      },
      { passive: true },
    );

    document.querySelectorAll("a.proj-img").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (x * 6).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-y * 6).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* ── 4. Mobile menu ── */
  const menuBtn = document.getElementById("menu-btn");
  const nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "Close" : "Menu";
      if (open)
        requestAnimationFrame(function () {
          movePill(document.querySelector(".nav a.active"));
        });
    });
    navLinks.forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "Menu";
      });
    });
  }

  /* ── Start ── */
  decode();
  setupReveal();
  setupPointer();
  flowCycle();
  if (!reduceMotion) setInterval(flowCycle, 4000);
  onScroll();
})();
