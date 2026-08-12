/*
 * Ambient node network — a live, cursor-reactive system replacing a static
 * background image. Nodes drift, connect to nearby neighbors, and both
 * brighten in the brand's orange near the cursor. Pauses when the tab is
 * hidden and is skipped entirely under prefers-reduced-motion.
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'net-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var MAX_DPR = 2;
  var LINK_DIST = 150;
  var CURSOR_RADIUS = 220;
  var NODE_COUNT_PER_PX = 1 / 22000; // scales with viewport area
  var MAX_NODES = 90;

  var w = 0, h = 0, dpr = 1;
  var nodes = [];
  var pointer = { x: -9999, y: -9999, active: false };
  var running = true;
  var rafId = null;

  function rand(min, max) { return min + Math.random() * (max - min); }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var target = Math.min(MAX_NODES, Math.round(w * h * NODE_COUNT_PER_PX));
    if (nodes.length > target) {
      nodes.length = target;
    } else {
      while (nodes.length < target) {
        nodes.push({
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.12, 0.12),
          vy: rand(-0.12, 0.12),
        });
      }
    }
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      n.x = Math.max(0, Math.min(w, n.x));
      n.y = Math.max(0, Math.min(h, n.y));
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // links
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > LINK_DIST) continue;

        var midX = (a.x + b.x) / 2;
        var midY = (a.y + b.y) / 2;
        var cursorDist = pointer.active
          ? Math.sqrt(Math.pow(midX - pointer.x, 2) + Math.pow(midY - pointer.y, 2))
          : Infinity;
        var proximity = Math.max(0, 1 - cursorDist / CURSOR_RADIUS);
        var baseAlpha = (1 - dist / LINK_DIST) * 0.12;
        var alpha = baseAlpha + proximity * 0.35;

        ctx.strokeStyle = proximity > 0.05
          ? 'rgba(242, 92, 43, ' + Math.min(0.6, alpha) + ')'
          : 'rgba(238, 236, 228, ' + Math.min(0.35, alpha) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // nodes
    for (var k = 0; k < nodes.length; k++) {
      var node = nodes[k];
      var d = pointer.active
        ? Math.sqrt(Math.pow(node.x - pointer.x, 2) + Math.pow(node.y - pointer.y, 2))
        : Infinity;
      var prox = Math.max(0, 1 - d / CURSOR_RADIUS);
      var r = 1.1 + prox * 1.6;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = prox > 0.05
        ? 'rgba(242, 92, 43, ' + Math.min(1, 0.4 + prox * 0.6) + ')'
        : 'rgba(238, 236, 228, 0.28)';
      ctx.fill();
    }
  }

  function tick() {
    if (!running) return;
    step();
    draw();
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  });
  window.addEventListener('pointerleave', function () { pointer.active = false; });
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running && !rafId) tick();
  });

  resize();
  tick();
})();
