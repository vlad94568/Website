/* ════════════════════════════════════════════════════════════════
   PS4 portfolio — UI logic
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────
  const state = {
    section:      'games',   // 'games' | 'about'
    focusedIndex: 0,
    cards:        []
  };

  // ── DOM refs ─────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);

  const dom = {
    shelf:        $('shelf'),
    arrowLeft:    $('arrow-left'),
    arrowRight:   $('arrow-right'),
    timeline:     $('timeline'),

    detail:       $('detail'),
    detailThumb:  $('detail-thumb'),
    detailFb:     $('detail-thumb-fallback'),
    detailTitle:  $('detail-title'),
    detailYear:   $('detail-year'),
    detailMeta:        $('detail-meta'),
    detailMetrics:     $('detail-metrics'),
    detailDesc:        $('detail-desc'),
    detailScreenshots: $('detail-screenshots'),
    detailLink:        $('detail-link'),
    playIcon:          $('play-btn-icon'),
    playLabel:         $('play-btn-label'),
    lightbox:          $('lightbox'),
    lightboxImg:       $('lightbox-img'),
    lightboxPrev:      $('lightbox-prev'),
    lightboxNext:      $('lightbox-next'),
    emptyMsg:     $('empty-msg'),

    sectionAbout: $('about-section'),
    sectionGames: $('games-section'),
    tabAbout:     $('tab-about'),
    tabGames:     $('tab-games'),

    statGames:    $('stat-games')
  };

  // ── Status → button label / CSS modifier ─────────────────────
  function statusInfo(status) {
    switch ((status || '').toLowerCase()) {
      case 'prototype':       return { label: 'VIEW REPO',    cls: 'status--prototype' };
      case 'in development':  return { label: 'VIEW PROJECT', cls: 'status--in-dev'    };
      case 'released':
      default:                return { label: 'PLAY GAME',    cls: 'status--released'  };
    }
  }

  // ── Display order ────────────────────────────────────────────
  // Portfolio row stays in release order (oldest → newest).
  const games = Array.isArray(GAMES) ? GAMES.slice() : [];

  // ── Render game cards ────────────────────────────────────────
  function renderCards() {
    dom.shelf.innerHTML = '';
    state.cards = [];

    if (games.length === 0) {
      dom.emptyMsg.hidden = false;
      dom.detail.classList.remove('detail--visible');
      return;
    }

    dom.emptyMsg.hidden = true;

    games.forEach((game, i) => {
      const card = createCard(game, i);
      dom.shelf.appendChild(card);
      state.cards.push(card);
    });

    renderTimeline();
    setFocus(0, { scroll: false });
  }

  // ── Timeline strip ───────────────────────────────────────────
  // All geometry (dot size, stack step, axis offset, container height)
  // lives in CSS custom properties on .timeline so the layout scales with
  // viewport via clamp(). JS only sets the stack index per dot and the
  // max-stack count on the container.
  function renderTimeline() {
    if (!dom.timeline) return;
    dom.timeline.innerHTML = '';
    if (games.length === 0) { dom.timeline.hidden = true; return; }
    dom.timeline.hidden = false;

    const years = games.map(g => Number(g.year) || 0);
    const minY  = Math.min.apply(null, years);
    const maxY  = Math.max.apply(null, years);
    const span  = Math.max(1, maxY - minY);

    // Per-year occurrence index so duplicates stack upward
    const stackIndex = new Array(games.length).fill(0);
    const counts = {};
    games.forEach((g, i) => {
      const y = Number(g.year) || minY;
      stackIndex[i] = counts[y] || 0;
      counts[y] = stackIndex[i] + 1;
    });
    const maxStack = Math.max.apply(null, Object.values(counts));
    dom.timeline.style.setProperty('--tl-max-stack', String(maxStack));

    const axis = document.createElement('div');
    axis.className = 'timeline-axis';
    dom.timeline.appendChild(axis);

    // Year labels at both endpoints + interior whole years (one per year)
    for (let y = minY; y <= maxY; y++) {
      const tick = document.createElement('div');
      tick.className = 'timeline-tick';
      tick.style.left = ((y - minY) / span * 100) + '%';
      tick.textContent = String(y);
      if (y === minY) tick.classList.add('timeline-tick--start');
      if (y === maxY) tick.classList.add('timeline-tick--end');
      dom.timeline.appendChild(tick);
    }

    games.forEach((g, i) => {
      const y = Number(g.year) || minY;
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'timeline-dot';
      dot.dataset.index = i;
      dot.style.left = ((y - minY) / span * 100) + '%';
      dot.style.setProperty('--idx', String(stackIndex[i]));
      dot.setAttribute('aria-label', (g.title || '') + ' (' + y + ')');
      dot.title = (g.title || '') + ' — ' + y;
      dot.addEventListener('click', () => setFocus(i));
      dom.timeline.appendChild(dot);
    });
  }

  function updateTimelineFocus(index) {
    if (!dom.timeline) return;
    const dots = dom.timeline.querySelectorAll('.timeline-dot');
    dots.forEach((d, i) => d.classList.toggle('timeline-dot--focused', i === index));
  }

  function createCard(game, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.dataset.index = index;

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'card-thumb-wrap';

    const fallback = document.createElement('div');
    fallback.className = 'card-fallback';
    fallback.textContent = (game.title || '?').charAt(0).toUpperCase();
    fallback.style.display = 'flex';

    const img = document.createElement('img');
    img.className = 'card-thumb';
    img.alt = game.title || '';
    img.style.opacity = '0';
    img.addEventListener('load', () => {
      img.style.transition = 'opacity 250ms ease';
      img.style.opacity = '1';
      fallback.style.display = 'none';
    });
    img.addEventListener('error', () => {
      img.remove();
      fallback.style.display = 'flex';
    });
    if (game.thumbnail) img.src = game.thumbnail;
    else img.dispatchEvent(new Event('error'));

    // Status badge (corner of thumb)
    if (game.status) {
      const info = statusInfo(game.status);
      const badge = document.createElement('span');
      badge.className = 'status-badge ' + info.cls;
      badge.textContent = game.status.toUpperCase();
      thumbWrap.appendChild(badge);
    }

    thumbWrap.appendChild(fallback);
    thumbWrap.appendChild(img);

    const label = document.createElement('div');
    label.className = 'card-label';
    label.textContent = game.title || 'Untitled';

    const year = document.createElement('div');
    year.className = 'card-year';
    year.textContent = game.year ? String(game.year) : '';

    card.appendChild(thumbWrap);
    card.appendChild(label);
    card.appendChild(year);

    // Tech tag badges
    const tags = Array.isArray(game.tags) ? game.tags : [];
    if (tags.length) {
      const tagWrap = document.createElement('div');
      tagWrap.className = 'card-tags';
      tags.forEach(t => {
        const pill = document.createElement('span');
        pill.className = 'tech-tag';
        pill.textContent = t;
        tagWrap.appendChild(pill);
      });
      card.appendChild(tagWrap);
      card.classList.add('card--has-tags');
    }

    card.addEventListener('click', () => setFocus(index));
    card.addEventListener('focus', () => setFocus(index));

    return card;
  }

  // ── Focus / selection ────────────────────────────────────────
  function setFocus(index, opts) {
    opts = opts || {};
    if (games.length === 0) return;

    const clamped = clamp(index, 0, games.length - 1);
    // Mouse click on a card fires BOTH the click and focus listeners — both
    // call setFocus with the same index in the same tick. Without this guard
    // we restart the smooth-scroll twice, which Firefox renders as a teleport.
    const same = clamped === state.focusedIndex &&
                 state.cards[clamped] &&
                 state.cards[clamped].classList.contains('card--focused');

    state.focusedIndex = clamped;
    state.cards.forEach((c, i) => {
      c.classList.toggle('card--focused', i === state.focusedIndex);
    });

    if (!same && opts.scroll !== false) scrollCardIntoView(state.focusedIndex);
    updateDetail(state.focusedIndex);
    updateTimelineFocus(state.focusedIndex);
  }

  function scrollCardIntoView(index, opts) {
    opts = opts || {};
    const card = state.cards[index];
    if (!card) return;
    // Smooth-scroll the shelf horizontally only (avoids jolting the page
    // vertically the way Element.scrollIntoView can).
    const target = card.offsetLeft - (dom.shelf.clientWidth - card.offsetWidth) / 2;
    const max = Math.max(0, dom.shelf.scrollWidth - dom.shelf.clientWidth);
    const left = clamp(target, 0, max);
    const behavior = opts.instant ? 'auto' : 'smooth';
    dom.shelf.scrollTo({ left: left, behavior: behavior });
  }

  // ── Detail panel ─────────────────────────────────────────────
  let detailSwapTimer = null;
  function updateDetail(index) {
    const game = games[index];
    if (!game) {
      dom.detail.classList.remove('detail--visible');
      return;
    }

    // Quick fade-out → fade-in for content swap
    dom.detail.classList.remove('detail--visible');

    // Clear stale content immediately so old game's tags/metrics/screenshots
    // disappear during the fade rather than lingering visibly.
    dom.detailMeta.innerHTML = '';
    dom.detailMetrics.innerHTML = '';
    dom.detailScreenshots.innerHTML = '';
    dom.detailDesc.innerHTML = '';

    // Cancel any pending swap so rapid arrow-key spam doesn't stack writes
    if (detailSwapTimer !== null) clearTimeout(detailSwapTimer);

    detailSwapTimer = setTimeout(() => {
      detailSwapTimer = null;
      dom.detailTitle.textContent = game.title || '';
      dom.detailYear.textContent  = game.dateRange || (game.year ? String(game.year) : '');
      dom.detailDesc.innerHTML    = renderMarkdown(game.description || '');

      // Status badge + tech tags row
      if (game.status) {
        const info = statusInfo(game.status);
        const badge = document.createElement('span');
        badge.className = 'status-badge status-badge--detail ' + info.cls;
        badge.textContent = game.status.toUpperCase();
        dom.detailMeta.appendChild(badge);
      }
      const tags = Array.isArray(game.tags) ? game.tags : [];
      tags.forEach(t => {
        const pill = document.createElement('span');
        pill.className = 'tech-tag tech-tag--detail';
        pill.textContent = t;
        dom.detailMeta.appendChild(pill);
      });

      // Big-stat metric callouts
      const metrics = Array.isArray(game.metrics) ? game.metrics : [];
      metrics.forEach(m => {
        const block = document.createElement('div');
        block.className = 'metric-block';
        const v = document.createElement('div');
        v.className = 'metric-value';
        v.textContent = m.value || '';
        const l = document.createElement('div');
        l.className = 'metric-label';
        l.textContent = m.label || '';
        block.appendChild(v);
        block.appendChild(l);
        dom.detailMetrics.appendChild(block);
      });

      // Play button label driven by status
      const info = statusInfo(game.status);
      dom.playLabel.textContent = info.label;
      dom.playIcon.textContent  = '▶';
      dom.detailLink.href = game.link || '#';
      dom.detailLink.style.pointerEvents = game.link ? 'auto' : 'none';
      dom.detailLink.style.opacity       = game.link ? '1' : '0.4';

      // Thumbnail with fallback
      const fbLetter = (game.title || '?').charAt(0).toUpperCase();
      dom.detailFb.textContent = fbLetter;

      if (game.thumbnail) {
        dom.detailThumb.style.opacity = '0';
        dom.detailThumb.onload = () => {
          dom.detailThumb.style.transition = 'opacity 220ms ease';
          dom.detailThumb.style.opacity = '1';
          dom.detailFb.style.display = 'none';
        };
        dom.detailThumb.onerror = () => {
          dom.detailThumb.style.display = 'none';
          dom.detailFb.style.display = 'flex';
        };
        dom.detailThumb.style.display = 'block';
        dom.detailThumb.src = game.thumbnail;
      } else {
        dom.detailThumb.style.display = 'none';
        dom.detailFb.style.display = 'flex';
      }

      // Screenshots
      const shots = Array.isArray(game.screenshots) ? game.screenshots : [];
      shots.forEach((src, i) => {
        const img = document.createElement('img');
        img.className = 'detail-screenshot-img';
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox(shots, i));
        img.addEventListener('error', () => img.remove());
        dom.detailScreenshots.appendChild(img);
      });

      dom.detail.classList.add('detail--visible');
    }, 90);
  }

  // ── Open game link ───────────────────────────────────────────
  function openGame(index) {
    const game = games[index];
    if (game && game.link) window.open(game.link, '_blank', 'noopener');
  }

  // ── Section switching ────────────────────────────────────────
  function showSection(name) {
    state.section = name;

    const isGames = name === 'games';
    dom.sectionGames.classList.toggle('section--active', isGames);
    dom.sectionAbout.classList.toggle('section--active', !isGames);

    dom.tabGames.classList.toggle('tab--active', isGames);
    dom.tabAbout.classList.toggle('tab--active', !isGames);
    dom.tabGames.setAttribute('aria-selected', String(isGames));
    dom.tabAbout.setAttribute('aria-selected', String(!isGames));
  }

  // ── Keyboard navigation ──────────────────────────────────────
  function isTextEntryFocused() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = (el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  }

  document.addEventListener('keydown', (e) => {
    if (isTextEntryFocused()) return;
    // Lightbox owns the keyboard while open
    if (dom.lightbox.classList.contains('lightbox--open')) return;

    // Up/Down toggles section unless user is typing
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      showSection(state.section === 'games' ? 'about' : 'games');
      return;
    }

    if (state.section !== 'games') return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setFocus(state.focusedIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocus(state.focusedIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        setFocus(0);
        break;
      case 'End':
        e.preventDefault();
        setFocus(games.length - 1);
        break;
      case 'Enter': {
        // Let native Enter activation run on focused interactive elements
        // (Play link, timeline dots, arrow buttons, tabs).
        const ae = document.activeElement;
        if (ae) {
          const tag = ae.tagName;
          if (tag === 'A' || tag === 'BUTTON') return;
        }
        e.preventDefault();
        openGame(state.focusedIndex);
        break;
      }
    }
  });

  // ── Mouse / button handlers ──────────────────────────────────
  dom.arrowLeft .addEventListener('click', () => setFocus(state.focusedIndex - 1));
  dom.arrowRight.addEventListener('click', () => setFocus(state.focusedIndex + 1));

  dom.tabGames.addEventListener('click', () => showSection('games'));
  dom.tabAbout.addEventListener('click', () => showSection('about'));

  // Mouse wheel on shelf scrolls horizontally
  dom.shelf.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      dom.shelf.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // Window resize → re-center the focused card so the shelf doesn't drift
  // out of alignment when card widths or shelf width changes. Use instant
  // scroll (no smooth lerp) since the layout already animated via resize.
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer !== null) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeTimer = null;
      scrollCardIntoView(state.focusedIndex, { instant: true });
    }, 80);
  });

  // ── Stat: games shipped (auto from data, Released only) ──────
  if (dom.statGames) {
    const shipped = games.filter(g => (g.status || 'Released').toLowerCase() === 'released').length;
    dom.statGames.textContent = String(shipped);
  }

  // ── Helpers ──────────────────────────────────────────────────
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(v, hi)); }

  function renderMarkdown(text) {
    const lines = text.split('\n');
    const html = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const listMatch = line.match(/^[-*] (.+)/);

      if (listMatch) {
        if (!inList) { html.push('<ul>'); inList = true; }
        html.push('<li>' + inlineMarkdown(listMatch[1]) + '</li>');
      } else {
        if (inList) { html.push('</ul>'); inList = false; }
        if (line.trim() === '') {
          // blank line — paragraph break (skip empty output)
        } else {
          html.push('<p>' + inlineMarkdown(line) + '</p>');
        }
      }
    }

    if (inList) html.push('</ul>');
    return html.join('');
  }

  // ── Lightbox ─────────────────────────────────────────────────
  const lightboxState = { list: [], index: 0 };

  function openLightbox(list, index) {
    lightboxState.list = list || [];
    lightboxState.index = index || 0;
    showLightboxImage();
    const multiple = lightboxState.list.length > 1;
    dom.lightboxPrev.hidden = !multiple;
    dom.lightboxNext.hidden = !multiple;
    dom.lightbox.classList.add('lightbox--open');
    dom.lightbox.setAttribute('aria-hidden', 'false');
  }

  function showLightboxImage() {
    dom.lightboxImg.src = lightboxState.list[lightboxState.index] || '';
  }

  function stepLightbox(delta) {
    const n = lightboxState.list.length;
    if (n === 0) return;
    lightboxState.index = (lightboxState.index + delta + n) % n;
    showLightboxImage();
  }

  function closeLightbox() {
    dom.lightbox.classList.remove('lightbox--open');
    dom.lightbox.setAttribute('aria-hidden', 'true');
  }

  // Click backdrop closes; clicks on image/arrows don't bubble to it.
  dom.lightbox.addEventListener('click', closeLightbox);
  dom.lightboxImg.addEventListener('click', (e) => e.stopPropagation());
  dom.lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(-1); });
  dom.lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(1); });

  document.addEventListener('keydown', (e) => {
    if (!dom.lightbox.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape')     closeLightbox();
    else if (e.key === 'ArrowLeft')  { e.preventDefault(); stepLightbox(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepLightbox(1); }
  });

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inlineMarkdown(text) {
    // Extract [label](url) first so escape doesn't mangle the URL's `&`.
    const tokens = [];
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, (_, label, url) => {
      tokens.push({ label: label, url: url });
      return 'LINK' + (tokens.length - 1) + '';
    });

    text = escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>');

    return text.replace(/LINK(\d+)/g, (_, i) => {
      const tok = tokens[Number(i)];
      const safeUrl = /^(https?:|mailto:)/i.test(tok.url)
        ? tok.url.replace(/"/g, '%22')
        : '#';
      return '<a href="' + safeUrl + '" target="_blank" rel="noopener noreferrer">' +
        escapeHtml(tok.label) + '</a>';
    });
  }

  // ── Boot ─────────────────────────────────────────────────────
  renderCards();
  showSection('games');
}());
