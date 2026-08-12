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

/* ---- Reveal on scroll ---- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(e => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
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
