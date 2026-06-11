/* ════════════════════════════════════════════════════════════════
   vladdev — Collected Works
   catalog accordion · engine filter · thumbnail peek · ticker
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ENGINE_LABEL = { uefn: 'UEFN', unity: 'UNITY', godot: 'GODOT', pygame: 'PYGAME' };

  /* ── Theme toggle (light "day edition" / dark "night edition") ── */
  (function themeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    function apply(theme) {
      if (theme === 'dark') document.documentElement.dataset.theme = 'dark';
      else delete document.documentElement.dataset.theme;
      btn.textContent = theme === 'dark' ? 'DAY' : 'NIGHT';
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    apply(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      apply(next);
    });
  })();

  /* ── Minimal markdown → HTML (bold, italics, links, bullets) ── */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inlineMd(s) {
    return s
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  function renderMarkdown(text) {
    const blocks = text.trim().split(/\n\s*\n/);
    return blocks.map(block => {
      const lines = block.split('\n');
      if (lines.every(l => l.trim().startsWith('- '))) {
        const items = lines
          .map(l => `<li>${inlineMd(escapeHtml(l.trim().slice(2)))}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${inlineMd(escapeHtml(block))}</p>`;
    }).join('');
  }

  function ctaLabel(status) {
    if (status === 'Prototype') return 'View repo ↗';
    if (status === 'In Development') return 'View project ↗';
    return 'Play the game ↗';
  }

  /* ── Build catalog entries ────────────────────────────────── */
  const container = document.getElementById('entries');

  function setDetailHeight(entry, open) {
    const detail = entry.querySelector('.entry-detail');
    const inner = detail.firstElementChild;
    if (open) {
      detail.style.height = inner.scrollHeight + 'px';
      detail.addEventListener('transitionend', function done(e) {
        if (e.propertyName !== 'height') return;
        if (entry.classList.contains('entry--open')) detail.style.height = 'auto';
        detail.removeEventListener('transitionend', done);
      });
    } else {
      // pin current height so the transition has a start value
      detail.style.height = detail.offsetHeight + 'px';
      void detail.offsetHeight;
      detail.style.height = '0px';
    }
  }

  function buildEntry(game, index) {
    const no = String(index + 1).padStart(3, '0');
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.dataset.engine = game.engine;

    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'entry-row';
    row.setAttribute('aria-expanded', 'false');
    row.innerHTML =
      `<span class="entry-no">${no}</span>` +
      `<span class="entry-title">${escapeHtml(game.title)}</span>` +
      `<span class="entry-engine">${ENGINE_LABEL[game.engine] || game.engine.toUpperCase()}</span>` +
      `<span class="entry-genre">${escapeHtml(game.genre)}</span>` +
      `<span class="entry-year">${game.year}</span>` +
      `<span class="entry-toggle" aria-hidden="true">+</span>`;

    const detail = document.createElement('div');
    detail.className = 'entry-detail';

    const metricsHtml = (game.metrics || []).map(m =>
      `<div class="emetric">` +
      `<div class="emetric-num">${escapeHtml(m.value)}</div>` +
      `<div class="emetric-label">${escapeHtml(m.label)}</div>` +
      `</div>`
    ).join('');

    const shotsHtml = (game.screenshots || []).slice(0, 3).map(src =>
      `<img src="${src}" alt="${escapeHtml(game.title)} screenshot" loading="lazy">`
    ).join('');

    const mediaHtml = shotsHtml ||
      (game.thumbnail
        ? `<img src="${game.thumbnail}" alt="${escapeHtml(game.title)} cover" loading="lazy">`
        : '');

    detail.innerHTML =
      `<div class="entry-detail-inner">` +
      `<div class="entry-detail-rule">${escapeHtml(game.dateRange || String(game.year))}</div>` +
      `<div class="entry-detail-main">` +
      `<div class="entry-metrics">${metricsHtml}</div>` +
      `<div class="entry-desc">` + renderMarkdown(game.description || '') + `</div>` +
      `<div class="entry-media">${mediaHtml}</div>` +
      `<a class="entry-cta" href="${game.link}" target="_blank" rel="noopener">${ctaLabel(game.status)}</a>` +
      `</div>` +
      `</div>`;

    row.addEventListener('click', () => {
      const open = entry.classList.toggle('entry--open');
      row.setAttribute('aria-expanded', String(open));
      setDetailHeight(entry, open);
    });

    entry.appendChild(row);
    entry.appendChild(detail);
    return entry;
  }

  GAMES.forEach((game, i) => container.appendChild(buildEntry(game, i)));

  /* ── Engine filter (ghost non-matching rows) ──────────────── */
  (function filters() {
    const buttons = document.querySelectorAll('.filter');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.toggle('filter--active', b === btn));
        const f = btn.dataset.filter;
        container.querySelectorAll('.entry').forEach(entry => {
          const ghost = f !== 'all' && entry.dataset.engine !== f;
          entry.classList.toggle('entry--ghost', ghost);
          if (ghost && entry.classList.contains('entry--open')) {
            entry.classList.remove('entry--open');
            entry.querySelector('.entry-row').setAttribute('aria-expanded', 'false');
            setDetailHeight(entry, false);
          }
        });
      });
    });
  })();

  /* ── Cursor-following thumbnail peek (desktop only) ───────── */
  (function peek() {
    const img = document.getElementById('peek');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || reducedMotion) return;

    const OFFX = 28, OFFY = -70;
    let tx = 0, ty = 0;          // target (cursor + offset)
    let cx = 0, cy = 0;          // current (lagged)
    let prevX = 0;               // last frame x, for velocity
    let lean = 0;                // smoothed horizontal velocity → rotation
    let visible = false, raf = null;

    function move(e) {
      tx = e.clientX + OFFX;
      ty = e.clientY + OFFY;
    }

    function loop(now) {
      // position lags behind cursor — the heavier the lerp, the more drift
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;

      // velocity of the lagged point drives the lean (rotate into the swing)
      const vx = cx - prevX;
      prevX = cx;
      lean += (vx - lean) * 0.2;

      const rot = Math.max(-22, Math.min(22, lean * 1.6)) - 1.5; // base −1.5° rest tilt
      const bob = Math.sin(now / 420) * 6;                        // gentle float
      const skew = Math.max(-6, Math.min(6, lean * 0.5));         // slight whip

      img.style.left = cx + 'px';
      img.style.top = (cy + bob) + 'px';
      img.style.transform = `rotate(${rot.toFixed(2)}deg) skewX(${skew.toFixed(2)}deg)`;

      raf = visible ? requestAnimationFrame(loop) : null;
    }

    function show(thumb, e) {
      img.src = thumb;
      tx = cx = e.clientX + OFFX;
      ty = cy = e.clientY + OFFY;
      prevX = cx;
      lean = 0;
      img.classList.add('peek--on');
      if (!visible) { visible = true; raf = requestAnimationFrame(loop); }
    }

    function hide() {
      visible = false;
      img.classList.remove('peek--on');
      img.style.transform = '';
    }

    container.querySelectorAll('.entry').forEach((entry, i) => {
      const row = entry.querySelector('.entry-row');
      const thumb = GAMES[i] && GAMES[i].thumbnail;
      if (!thumb) return;

      row.addEventListener('mouseenter', e => {
        if (entry.classList.contains('entry--open')) return;
        show(thumb, e);
      });
      row.addEventListener('mousemove', move);
      row.addEventListener('mouseleave', hide);
      row.addEventListener('click', hide);
    });
  })();

  /* ── Row sway: title drifts toward cursor ─────────────────── */
  (function sway() {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || reducedMotion) return;

    container.querySelectorAll('.entry-row').forEach(row => {
      const title = row.querySelector('.entry-title');

      row.addEventListener('mousemove', e => {
        const r = row.getBoundingClientRect();
        const t = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
        title.style.transform = `translateX(${(t * 18).toFixed(1)}px)`;
      });

      row.addEventListener('mouseleave', () => {
        title.style.transform = '';
      });
    });
  })();

  /* ── Ticker: duplicate content for seamless loop ──────────── */
  (function ticker() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    track.appendChild(track.querySelector('.ticker-content').cloneNode(true));
  })();

  /* ── Scroll reveal ────────────────────────────────────────── */
  (function reveals() {
    const targets = document.querySelectorAll('.entry, .tool, .about-lede, .about-body, .about-stats');
    targets.forEach(t => t.classList.add('reveal'));
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal--in');
          obs.unobserve(e.target);
        }
      }
    }, { threshold: 0.1 });
    targets.forEach(t => obs.observe(t));
  })();

})();
