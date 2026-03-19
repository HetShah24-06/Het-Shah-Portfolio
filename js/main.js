/* ============================================================
   HET SHAH PORTFOLIO — main.js
   ============================================================ */

/* ── 1. MATRIX RAIN ── */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>{}[]=+-*/&|!@#$%^ヲァィゥェォ';
  const FS = 13;
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / FS);
    drops = Array.from({ length: cols }, () => Math.random() * -(canvas.height / FS));
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(2,4,8,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ffc8';
    ctx.font = `${FS}px JetBrains Mono`;
    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.globalAlpha = 0.4 + Math.random() * 0.6;
      ctx.fillText(char, i * FS, drops[i] * FS);
      if (drops[i] * FS > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.45;
    }
    ctx.globalAlpha = 1;
  }
  setInterval(draw, 55);
})();


/* ── 2. CUSTOM CURSOR ── */
(function initCursor() {
  const dot  = document.getElementById('cur');
  const ring = document.getElementById('curRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Lagged ring
  (function animRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hover shrink on interactive elements
  const interactives = 'a, button, .skill-card, .proj-card, .stat-box, .cert-card, .edu-card';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
  });
})();


/* ── 3. TYPED TEXT ── */
(function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'React · Next.js · Node.js',
    'TypeScript Enthusiast',
    'Open to Opportunities 🇨🇦',
  ];
  let pi = 0, ci = 0, deleting = false, wait = 0;

  function tick() {
    if (wait > 0) { wait--; setTimeout(tick, 80); return; }
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; wait = 30; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; wait = 8; }
    }
    setTimeout(tick, deleting ? 38 : 82);
  }
  tick();
})();


/* ── 4. SCROLL REVEAL (IntersectionObserver) ── */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        // Stagger children if they have data-delay
        e.target.querySelectorAll('[data-delay]').forEach(child => {
          child.style.transitionDelay = child.dataset.delay + 'ms';
        });
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up, .fade-left').forEach(el => io.observe(el));
})();


/* ── 5. NAV — scroll shrink + active link highlight ── */
(function initNav() {
  const nav  = document.querySelector('nav');
  const links = document.querySelectorAll('.nav-links a[href^="#"], .nav-drawer a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Shrink nav
    nav && nav.classList.toggle('scrolled', window.scrollY > 60);

    // Back-to-top button
    const btn = document.getElementById('back-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();


/* ── 6. HAMBURGER MOBILE NAV ── */
(function initHamburger() {
  const btn    = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('nav-drawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Close on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();


/* ── 7. HERO ENTRANCE ANIMATION ── */
window.addEventListener('load', () => {
  const items = [
    '.hero-status', '.hero-name', '.hero-title',
    '.hero-sub', '.hero-ctas', '.hero-avatar'
  ];
  items.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.75s ease ${i * 0.13}s, transform 0.75s ease ${i * 0.13}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 80);
  });
});


/* ── 8. CARD TILT EFFECT ── */
(function initTilt() {
  const cards = document.querySelectorAll('.proj-card, .skill-card, .edu-card');
  const MAX = 8; // max tilt degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${-y * MAX}deg) rotateY(${x * MAX}deg)`;
      card.style.transition = 'transform 0.05s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });
  });
})();


/* ── 9. SKILL TAG RIPPLE ── */
(function initTagRipple() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', e => {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;
        background:rgba(0,255,200,0.3);
        width:60px;height:60px;
        left:${e.offsetX - 30}px;top:${e.offsetY - 30}px;
        pointer-events:none;
        animation:rippleAnim .5s ease forwards;
      `;
      tag.style.position = 'relative';
      tag.style.overflow = 'hidden';
      tag.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframes
  const style = document.createElement('style');
  style.textContent = '@keyframes rippleAnim{0%{transform:scale(0);opacity:1}100%{transform:scale(3);opacity:0}}';
  document.head.appendChild(style);
})();


/* ── 10. SMOOTH SCROLL (for browsers that need it) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ── 11. STAT COUNTER ANIMATION ── */
(function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = parseFloat(e.target.dataset.count);
      const isDecimal = target % 1 !== 0;
      const duration = 1200;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        e.target.textContent = isDecimal ? value.toFixed(1) : Math.floor(value) + '+';
        if (progress < 1) requestAnimationFrame(update);
        else e.target.textContent = isDecimal ? target.toFixed(1) : target + '+';
      }
      requestAnimationFrame(update);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-count]').forEach(el => io.observe(el));
})();
