/* ---- Theme toggle (dark is the unattributed default; light is opt-in and
   persisted). The actual attribute-setting for returning visitors happens
   in an inline head script so it applies before first paint -- this just
   wires up the button and keeps it in sync. ---- */
(function () {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const current = () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  const sync = (theme) => {
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  };

  // Some engines don't live-recompute var()-based SVG stroke/fill on a
  // custom-property change the way they do for ordinary CSS properties --
  // logo color would then only update on the next full page load. Force it
  // explicitly so the toggle is instant everywhere, including the mark.
  const restrokeLogo = () => {
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    document.querySelectorAll('.brand-mark path, .cta-mark path').forEach((p) => {
      p.style.stroke = accent;
    });
  };

  sync(current());

  btn.addEventListener('click', () => {
    const next = current() === 'light' ? 'dark' : 'light';
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try { localStorage.setItem('cyntraix-theme', next); } catch (e) {}
    sync(next);
    restrokeLogo();
    window.dispatchEvent(new Event('cyntraix:themechange'));
  });
})();

/* ---- Mobile nav toggle ---- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ---- Live clock for the scope panel ---- */
(function () {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const d = new Date();
    el.textContent =
      `${pad(d.getUTCHours())} : ${pad(d.getUTCMinutes())} : ${pad(d.getUTCSeconds())} · UTC`;
  };
  tick();
  setInterval(tick, 1000);
})();

/* ---- Reveal on scroll (fade-up + declassify redaction bars + count-up) ---- */
(function () {
  const els = document.querySelectorAll('.reveal, .redact');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    if (!isFinite(target)) return;
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 900;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const frame = (now) => {
      const p = Math.min(1, (now - start) / duration);
      el.textContent = Math.round(ease(p) * target);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const activate = (el) => {
    el.classList.add('in');
    el.querySelectorAll('.redact').forEach((r) => r.classList.add('in'));
    el.querySelectorAll('.count').forEach(countUp);
  };
  if (!('IntersectionObserver' in window)) {
    els.forEach(activate);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
})();

/* ---- Live feed typewriter (posture panel) ---- */
(function () {
  const el = document.getElementById('feedLine');
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = 'scan_complete :: 14,204 assets indexed';
    return;
  }
  const lines = [
    'scan_complete :: 14,204 assets indexed',
    'intel_sync :: 42 feeds reconciled',
    'anomaly_check :: 0 flagged, 3 reviewed',
    'perimeter_probe :: no drift detected',
    'session_audit :: 118 active, 0 stale',
    'trust_eval :: all principals verified',
  ];
  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = lines[lineIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        setTimeout(() => { deleting = true; tick(); }, 2200);
        return;
      }
      setTimeout(tick, 34);
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % lines.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 16);
    }
  };
  tick();
})();

/* ---- Magnetic buttons ---- */
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const MAX_X = 10, MAX_Y = 7;
  document.querySelectorAll('.cta-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      btn.style.transform = `translate(${relX * MAX_X * 2}px, ${relY * MAX_Y * 2 - 1}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ---- Expandable service rows (services page) ---- */
(function () {
  const rows = document.querySelectorAll('.service-row[data-expandable]');
  const toggle = (row) => {
    const trigger = row.querySelector('.row-inner');
    const wasOpen = row.classList.contains('expanded');
    rows.forEach(r => {
      r.classList.remove('expanded');
      const t = r.querySelector('.row-inner');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) {
      row.classList.add('expanded');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }
  };
  rows.forEach(row => {
    const trigger = row.querySelector('.row-inner');
    if (!trigger) return;
    trigger.addEventListener('click', () => toggle(row));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggle(row);
      }
    });
  });
})();

/* ---- Active nav link (belt-and-braces if aria-current wasn't set server-side) ---- */
(function () {
  const path = location.pathname.replace(/\/index\.html$/, '/').replace(/index\.html$/, '');
  document.querySelectorAll('.nav-links a, .foot-col a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    const normalized = href.replace(/\/index\.html$/, '/').replace(/^index\.html$/, '/');
    if (normalized === path || (normalized === '/' && (path === '' || path === '/'))) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
