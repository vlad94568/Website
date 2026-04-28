/* ════════════════════════════════════════════════════════════════
   PS4-style abstract wave field — Canvas 2D renderer

   Renders 5 translucent ribbon layers over the gradient background.
   Each wave's centerline follows y(x, t) = y0 + A1·sin(F1·x + P1 + S1·t)
                                              + A2·sin(F2·x + P2 + S2·t).
   Each ribbon is built from a wide blurred glow stroke + medium body
   stroke + (optionally) a thin pale-blue highlight stroke, composited
   additively with globalCompositeOperation = 'lighter'.
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('bg-waves');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ── Wave parameter table ─────────────────────────────────────
  // y0, A1, A2 are normalized to viewport HEIGHT (0..1)
  // F1, F2 are full sine cycles across viewport WIDTH
  // S1, S2 are radians per second (negative = reverse drift)
  // *Width values are normalized to viewport HEIGHT
  const WAVES = [
    {
      // Far atmospheric — broad, blurry, very faint
      y0:   0.54,
      A1:   0.030, A2:   0.014,
      F1:   1.05,  F2:   2.40,
      P1:   0.4,   P2:   1.7,
      S1:   0.10,  S2:   0.05,
      bodyW: 0.075, glowW: 0.135, hlW: 0,
      bodyA: 0.10,  glowA: 0.05,  hlA: 0,
      bodyColor: '#1C5BC2', glowColor: '#1D5FD1', hlColor: '#9AE6FF',
      glowBlur: 18
    },
    {
      // Secondary back wave — soft, medium thickness
      y0:   0.49,
      A1:   0.026, A2:   0.011,
      F1:   0.85,  F2:   2.00,
      P1:   1.2,   P2:   0.7,
      S1:   0.13,  S2:   0.07,
      bodyW: 0.045, glowW: 0.090, hlW: 0,
      bodyA: 0.16,  glowA: 0.07,  hlA: 0,
      bodyColor: '#184CA8', glowColor: '#2C75E8', hlColor: '#9AE6FF',
      glowBlur: 12
    },
    {
      // Main wave — the most visible drifting ribbon
      y0:   0.44,
      A1:   0.034, A2:   0.013,
      F1:   1.20,  F2:   2.55,
      P1:   2.1,   P2:   1.5,
      S1:   0.20,  S2:   0.12,
      bodyW: 0.030, glowW: 0.070, hlW: 0.0040,
      bodyA: 0.26,  glowA: 0.08,  hlA: 0.55,
      bodyColor: '#2C75E8', glowColor: '#3C8EF5', hlColor: '#D5F7FF',
      glowBlur: 14
    },
    {
      // Support wave — thinner companion to main, slightly above
      y0:   0.405,
      A1:   0.024, A2:   0.010,
      F1:   1.10,  F2:   2.30,
      P1:   0.8,   P2:   0.3,
      S1:   0.17,  S2:   0.10,
      bodyW: 0.020, glowW: 0.050, hlW: 0,
      bodyA: 0.20,  glowA: 0.06,  hlA: 0,
      bodyColor: '#1C5BC2', glowColor: '#2C75E8', hlColor: '#9AE6FF',
      glowBlur: 9
    },
    {
      // Top highlight strand — thin cyan-white, drifts in REVERSE
      y0:   0.37,
      A1:   0.020, A2:   0.008,
      F1:   1.40,  F2:   2.75,
      P1:   1.9,   P2:   0.5,
      S1:  -0.18,  S2:  -0.11,
      bodyW: 0.0040, glowW: 0.018, hlW: 0,
      bodyA: 0.45,   glowA: 0.10,  hlA: 0,
      bodyColor: '#6FD6FF', glowColor: '#3C8EF5', hlColor: '#D5F7FF',
      glowBlur: 5
    }
  ];

  // ── Sizing ───────────────────────────────────────────────────
  // DPR is capped at 1 — the waves are intentionally soft, so doubling
  // pixel work on retina screens just burns cycles for invisible gain.
  let width = 0, height = 0, dpr = 1;

  function resize() {
    dpr = 1;
    width  = canvas.clientWidth  || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    canvas.width  = Math.round(width  * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Reduced-motion handling ──────────────────────────────────
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = motionQuery.matches;
  motionQuery.addEventListener('change', (e) => { reduceMotion = e.matches; });

  // ── Wave centerline equation ─────────────────────────────────
  // x is in pixels (0..width); returns y in pixels.
  function waveCenter(x, t, w) {
    const xn = x / width;                      // normalized x: 0..1
    const k1 = w.F1 * 2 * Math.PI;
    const k2 = w.F2 * 2 * Math.PI;
    return (
      w.y0 * height
      + w.A1 * height * Math.sin(k1 * xn + w.P1 + w.S1 * t)
      + w.A2 * height * Math.sin(k2 * xn + w.P2 + w.S2 * t)
    );
  }

  // Build the wave's centerline path on the current ctx.
  // 8px sampling — for soft blurred ribbons, finer sampling adds CPU
  // cost without visible benefit (round line joins smooth the rest).
  const SAMPLE_STEP = 8;
  function tracePath(w, t) {
    ctx.beginPath();
    let x = 0;
    ctx.moveTo(x, waveCenter(x, t, w));
    for (x = SAMPLE_STEP; x <= width; x += SAMPLE_STEP) {
      ctx.lineTo(x, waveCenter(x, t, w));
    }
    if (x - SAMPLE_STEP < width) {
      ctx.lineTo(width, waveCenter(width, t, w));
    }
  }

  // Draw one ribbon: glow → body → highlight, all on the same path.
  // Glow is built from 3 stacked strokes of decreasing width and
  // increasing alpha — under additive compositing this approximates
  // a Gaussian falloff WITHOUT the per-frame ctx.filter='blur(...)'
  // call, which is the slowest operation in Canvas 2D.
  function drawWave(w, t) {
    tracePath(w, t);

    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    // Glow falloff: 3 concentric strokes (additive). Sums to ~glowA
    // at center; tapers to ~0.20·glowA at the outermost edge.
    if (w.glowA > 0 && w.glowW > 0) {
      const gw = w.glowW * height;
      ctx.strokeStyle = w.glowColor;

      ctx.lineWidth   = gw;
      ctx.globalAlpha = w.glowA * 0.20;
      ctx.stroke();

      ctx.lineWidth   = gw * 0.65;
      ctx.globalAlpha = w.glowA * 0.30;
      ctx.stroke();

      ctx.lineWidth   = gw * 0.35;
      ctx.globalAlpha = w.glowA * 0.50;
      ctx.stroke();
    }

    // Body: medium width, defined edge — the main visible ribbon.
    if (w.bodyA > 0 && w.bodyW > 0) {
      ctx.lineWidth   = w.bodyW * height;
      ctx.strokeStyle = w.bodyColor;
      ctx.globalAlpha = w.bodyA;
      ctx.stroke();
    }

    // Highlight: thin, sharp, brighter pale blue along the crest.
    if (w.hlA > 0 && w.hlW > 0) {
      ctx.lineWidth   = Math.max(1, w.hlW * height);
      ctx.strokeStyle = w.hlColor;
      ctx.globalAlpha = w.hlA;
      ctx.stroke();
    }
  }

  // ── Frame loop ───────────────────────────────────────────────
  let startTime = null;
  let frozenT = 0;
  let rafId = 0;

  function frame(now) {
    if (startTime === null) startTime = now;
    const t = reduceMotion ? frozenT : (now - startTime) / 1000;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';   // additive: overlap = brighten

    for (let i = 0; i < WAVES.length; i++) {
      drawWave(WAVES[i], t);
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    if (!reduceMotion) {
      rafId = requestAnimationFrame(frame);
    }
  }

  // Pause when tab is hidden to avoid wasted work.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    } else {
      startTime = null;                          // resume cleanly
      rafId = requestAnimationFrame(frame);
    }
  });

  rafId = requestAnimationFrame(frame);
}());
