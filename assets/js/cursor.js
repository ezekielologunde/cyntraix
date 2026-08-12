/* Custom crosshair cursor: a tight dot tracks the pointer exactly, a lagging
   ring eases toward it and grows/tints orange over interactive elements. */
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('has-cursor');

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  var ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var rx = mx, ry = my;
  var seen = false;

  window.addEventListener('pointermove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    seen = true;
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
  });

  function tick() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  var HOVER_SELECTOR = 'a, button, [role="button"], input, textarea, select, .service-row';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(HOVER_SELECTOR)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest(HOVER_SELECTOR)) ring.classList.remove('hover');
  });

  document.addEventListener('mouseleave', function () {
    if (seen) { dot.style.opacity = '0'; ring.style.opacity = '0'; }
  });
  document.addEventListener('mouseenter', function () {
    dot.style.opacity = '1'; ring.style.opacity = '1';
  });
})();
