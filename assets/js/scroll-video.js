/*
 * Scroll-scrubbed hero video. The hero video plays its normal ambient loop
 * on load; once the offscreen frame cache finishes extracting, control
 * hands off to a canvas whose frame follows how far the hero has scrolled
 * past — the video becomes something you drive, not just watch.
 */
(function () {
  var hero = document.querySelector('.hero');
  var video = hero && hero.querySelector('.hero-video');
  var canvas = hero && hero.querySelector('.hero-video-canvas');
  if (!hero || !video || !canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var MIN_FRAMES = 24;
  var MAX_FRAMES = 90;
  var FRAMES_PER_SECOND = 12;
  var MAX_FRAME_WIDTH = 960;
  var LERP_FACTOR = 0.12;
  var MAX_DPR = 2;

  var frames = [];
  var frameW = 0;
  var frameH = 0;
  var smoothed = 0;
  var ready = false;

  function drawCover(ctx, source, sw, sh, cw, ch) {
    var scale = Math.max(cw / sw, ch / sh);
    var dw = sw * scale;
    var dh = sh * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(source, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    var ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function extractFrames(url) {
    return new Promise(function (resolve, reject) {
      var off = document.createElement('video');
      off.src = url;
      off.muted = true;
      off.playsInline = true;
      off.preload = 'auto';

      off.onloadedmetadata = function () {
        var duration = off.duration;
        if (!isFinite(duration) || duration <= 0) {
          reject(new Error('offscreen video has no usable duration'));
          return;
        }

        var count = Math.min(
          MAX_FRAMES,
          Math.max(MIN_FRAMES, Math.round(duration * FRAMES_PER_SECOND))
        );
        var vw = off.videoWidth || 1280;
        var vh = off.videoHeight || 720;
        var scale = Math.min(1, MAX_FRAME_WIDTH / vw);
        var w = Math.round(vw * scale);
        var h = Math.round(vh * scale);

        var scratch = document.createElement('canvas');
        scratch.width = w;
        scratch.height = h;
        var sctx = scratch.getContext('2d');
        if (!sctx) {
          reject(new Error('2d context unavailable'));
          return;
        }

        var out = [];
        var lastT = Math.max(duration - 0.05, 0);
        var i = 0;

        function seekNext() {
          if (i >= count) {
            resolve({ frames: out, w: w, h: h });
            return;
          }
          var t = count === 1 ? 0 : (i / (count - 1)) * lastT;
          var onSeeked = function () {
            off.removeEventListener('seeked', onSeeked);
            sctx.drawImage(off, 0, 0, w, h);
            createImageBitmap(scratch).then(function (bmp) {
              out.push(bmp);
              i++;
              seekNext();
            }, reject);
          };
          off.addEventListener('seeked', onSeeked);
          off.currentTime = t;
        }

        seekNext();
      };
      off.onerror = function () {
        reject(new Error('offscreen video metadata failed to load'));
      };
    });
  }

  function tick() {
    var rect = hero.getBoundingClientRect();
    var target = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
    smoothed += (target - smoothed) * LERP_FACTOR;

    if (ready && frames.length) {
      var ctx = canvas.getContext('2d');
      if (ctx) {
        var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        var cw = canvas.width / dpr;
        var ch = canvas.height / dpr;
        var idx = Math.min(
          frames.length - 1,
          Math.max(0, Math.floor(smoothed * (frames.length - 1)))
        );
        drawCover(ctx, frames[idx], frameW, frameH, cw, ch);
      }
    }

    requestAnimationFrame(tick);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(tick);

  extractFrames(video.currentSrc || video.src)
    .then(function (result) {
      frames = result.frames;
      frameW = result.w;
      frameH = result.h;
      ready = true;
      canvas.classList.add('ready');
      video.classList.add('scrub-active');
      video.pause();
    })
    .catch(function (err) {
      console.warn('[hero scroll-video] frame cache unavailable, keeping ambient loop', err);
    });
})();
