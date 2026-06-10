/* ════════════════════════════════════════════════════════════════
   vladdev — Gen X Soft Club portfolio logic
   particles · scroll reveal · stat count-up · grid filter · modal
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Hero particles ─────────────────────────────────────────
     25 dots, slow drift, no connecting lines, rAF loop.        */
  (function particles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext('2d');
    const COUNT = 25;
    let dots = [];
    let w = 0, h = 0;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }

    function spawn() {
      dots = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        o: 0.15 + Math.random() * 0.15,
        blue: Math.random() > 0.5
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -4) d.x = w + 4; else if (d.x > w + 4) d.x = -4;
        if (d.y < -4) d.y = h + 4; else if (d.y > h + 4) d.y = -4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.blue
          ? `rgba(127,219,255,${d.o})`
          : `rgba(255,255,255,${d.o})`;
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', () => { resize(); });
    resize();
    spawn();
    requestAnimationFrame(tick);
  })();

  /* ── Nav slide-in after 20% viewport scroll ─────────────── */
  (function navReveal() {
    const nav = document.getElementById('nav');
    const threshold = () => window.innerHeight * 0.2;
    function onScroll() {
      nav.classList.toggle('nav--visible', window.scrollY > threshold());
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ── Mobile menu ──────────────────────────────────────────── */
  (function mobileMenu() {
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('mobile-menu');
    const close = document.getElementById('mobile-menu-close');

    function setOpen(open) {
      menu.classList.toggle('mobile-menu--open', open);
      menu.setAttribute('aria-hidden', String(!open));
      burger.setAttribute('aria-expanded', String(open));
    }

    burger.addEventListener('click', () => setOpen(true));
    close.addEventListener('click', () => setOpen(false));
    menu.querySelectorAll('.mobile-menu-link').forEach(a =>
      a.addEventListener('click', () => setOpen(false)));
  })();

  /* ── Scroll reveal (IntersectionObserver) ─────────────────── */
  const revealObserver = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('reveal--in');
        revealObserver.unobserve(e.target);
      }
    }
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Stat count-up ────────────────────────────────────────── */
  (function statCounters() {
    const stats = document.getElementById('about-stats');
    if (!stats) return;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function countUp(el) {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      if (reducedMotion) { el.textContent = target + suffix; return; }
      const start = performance.now();
      const DURATION = 1200;
      function frame(now) {
        const t = Math.min((now - start) / DURATION, 1);
        el.textContent = Math.round(easeOutCubic(t) * target) + suffix;
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    const obs = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        stats.querySelectorAll('.stat-num').forEach(countUp);
        obs.disconnect();
      }
    }, { threshold: 0.4 });

    obs.observe(stats);
  })();

  /* ── Games grid ───────────────────────────────────────────── */
  const grid = document.getElementById('grid');
  const ENGINE_LABEL = { uefn: 'UEFN', unity: 'UNITY', godot: 'GODOT', pygame: 'PYGAME' };

  function ctaLabel(status) {
    if (status === 'Prototype') return '[ view repo → ]';
    if (status === 'In Development') return '[ view project → ]';
    return '[ play / view → ]';
  }

  function buildCard(game, index) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card' + (game.featured ? ' card--wide' : '');
    card.dataset.engine = game.engine;
    card.dataset.index = index;
    card.setAttribute('aria-label', `${game.title} — details`);

    if (game.thumbnail) {
      const bg = document.createElement('div');
      bg.className = 'card-bg';
      bg.style.backgroundImage = `url("${game.thumbnail}")`;
      card.appendChild(bg);
    }

    const year = document.createElement('span');
    year.className = 'card-year';
    year.textContent = game.year;
    card.appendChild(year);

    const content = document.createElement('div');
    content.className = 'card-content';

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = game.title;
    content.appendChild(title);

    const tags = document.createElement('div');
    tags.className = 'card-tags';
    const engineTag = document.createElement('span');
    engineTag.className = 'tag';
    engineTag.textContent = `[ ${ENGINE_LABEL[game.engine] || game.engine.toUpperCase()} ]`;
    tags.appendChild(engineTag);
    const genreTag = document.createElement('span');
    genreTag.className = 'tag tag--genre';
    genreTag.textContent = game.genre;
    tags.appendChild(genreTag);
    content.appendChild(tags);

    const reveal = document.createElement('div');
    reveal.className = 'card-reveal';
    const blurb = document.createElement('p');
    blurb.className = 'card-blurb';
    blurb.textContent = game.blurb;
    reveal.appendChild(blurb);
    const cta = document.createElement('span');
    cta.className = 'card-cta';
    cta.textContent = ctaLabel(game.status);
    reveal.appendChild(cta);
    content.appendChild(reveal);

    card.appendChild(content);
    card.addEventListener('click', () => openModal(game));
    return card;
  }

  GAMES.forEach((game, i) => grid.appendChild(buildCard(game, i)));

  /* ── Engine filter (ghost non-matching cards) ─────────────── */
  (function filters() {
    const buttons = document.querySelectorAll('.filter');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.toggle('filter--active', b === btn));
        const f = btn.dataset.filter;
        grid.querySelectorAll('.card').forEach(card => {
          card.classList.toggle('card--ghost', f !== 'all' && card.dataset.engine !== f);
        });
      });
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

  /* ── Modal ────────────────────────────────────────────────── */
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalMetrics = document.getElementById('modal-metrics');
  const modalDesc = document.getElementById('modal-desc');
  const modalShots = document.getElementById('modal-shots');
  const modalCta = document.getElementById('modal-cta');
  let lastFocus = null;

  function openModal(game) {
    lastFocus = document.activeElement;
    modalTitle.textContent = game.title;

    modalMeta.innerHTML = '';
    const engineTag = document.createElement('span');
    engineTag.className = 'tag';
    engineTag.textContent = `[ ${ENGINE_LABEL[game.engine] || game.engine.toUpperCase()} ]`;
    modalMeta.appendChild(engineTag);
    const genreTag = document.createElement('span');
    genreTag.className = 'tag tag--genre';
    genreTag.textContent = game.genre;
    modalMeta.appendChild(genreTag);
    const engineLabel = ENGINE_LABEL[game.engine] || game.engine.toUpperCase();
    (game.tags || [])
      .filter(t => t.toUpperCase() !== engineLabel)
      .forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tag tag--genre';
        tag.textContent = t;
        modalMeta.appendChild(tag);
      });
    if (game.dateRange) {
      const date = document.createElement('span');
      date.className = 'meta-date';
      date.textContent = game.dateRange;
      modalMeta.appendChild(date);
    }

    modalMetrics.innerHTML = '';
    (game.metrics || []).forEach(m => {
      const block = document.createElement('div');
      block.className = 'metric';
      block.innerHTML =
        `<div class="metric-num">${escapeHtml(m.value)}</div>` +
        `<div class="metric-label">${escapeHtml(m.label)}</div>`;
      modalMetrics.appendChild(block);
    });

    modalDesc.innerHTML = renderMarkdown(game.description || '');

    modalShots.innerHTML = '';
    (game.screenshots || []).forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${game.title} screenshot`;
      img.loading = 'lazy';
      modalShots.appendChild(img);
    });

    modalCta.href = game.link;
    modalCta.textContent = ctaLabel(game.status);

    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-close').focus();
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) closeModal();
  });

  /* ── Footer link cursor trail ─────────────────────────────── */
  (function cursorTrail() {
    if (reducedMotion) return;
    let last = 0;
    document.querySelectorAll('.footer-link').forEach(link => {
      link.addEventListener('mousemove', e => {
        const now = performance.now();
        if (now - last < 60) return; // max ~3 dots per 200ms sweep
        last = now;
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = (e.clientX - 2) + 'px';
        dot.style.top = (e.clientY - 2) + 'px';
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 320);
      });
    });
  })();

})();
