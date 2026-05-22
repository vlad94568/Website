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

    featured:          $('featured'),
    featuredCard:      $('featured-card'),
    featuredThumb:     $('featured-thumb'),
    featuredFb:        $('featured-thumb-fallback'),
    featuredTitle:     $('featured-title'),
    featuredYear:      $('featured-year'),
    featuredLinkLabel: $('featured-link-label'),

    detail:       $('detail'),
    detailThumb:  $('detail-thumb'),
    detailFb:     $('detail-thumb-fallback'),
    detailTitle:  $('detail-title'),
    detailYear:   $('detail-year'),
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

    statGames:    $('stat-games'),
    clock:        $('clock')
  };

  // ── Display order ────────────────────────────────────────────
  // Portfolio row stays in release order. The newest game is also shown
  // in a separate "Latest project" hero banner above the row, so it
  // never competes with the blue selection inside the row.
  const games = Array.isArray(GAMES) ? GAMES.slice() : [];
  const newestIndex = (function () {
    let n = -1;
    games.forEach((g, i) => {
      if (n === -1 || (g.year || 0) >= (games[n].year || 0)) n = i;
    });
    return n;
  }());

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

    renderHero();
    setFocus(0, { scroll: false });
  }

  // ── Featured (latest) hero banner ────────────────────────────
  function renderHero() {
    if (newestIndex < 0 || !dom.featured) return;
    const game = games[newestIndex];

    dom.featured.hidden = false;
    dom.featuredTitle.textContent = game.title || '';
    dom.featuredYear.textContent  = game.year ? String(game.year) : '';
    dom.featuredLinkLabel.textContent = 'VIEW PROJECT';

    const fb = dom.featuredFb;
    fb.textContent = (game.title || '?').charAt(0).toUpperCase();
    if (game.thumbnail) {
      dom.featuredThumb.style.display = 'block';
      dom.featuredThumb.onerror = () => {
        dom.featuredThumb.style.display = 'none';
        fb.style.display = 'flex';
      };
      dom.featuredThumb.onload = () => { fb.style.display = 'none'; };
      dom.featuredThumb.src = game.thumbnail;
    } else {
      dom.featuredThumb.style.display = 'none';
      fb.style.display = 'flex';
    }

    dom.featuredCard.onclick = () => setFocus(newestIndex);
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

    card.addEventListener('click',    () => setFocus(index));
    card.addEventListener('dblclick', () => openGame(index));
    card.addEventListener('focus',    () => setFocus(index));

    return card;
  }

  // ── Focus / selection ────────────────────────────────────────
  function setFocus(index, opts) {
    opts = opts || {};
    if (games.length === 0) return;

    state.focusedIndex = clamp(index, 0, games.length - 1);

    state.cards.forEach((c, i) => {
      c.classList.toggle('card--focused', i === state.focusedIndex);
    });

    if (opts.scroll !== false) scrollCardIntoView(state.focusedIndex);
    updateDetail(state.focusedIndex);
  }

  function scrollCardIntoView(index) {
    const card = state.cards[index];
    if (!card) return;
    // Smooth-scroll the shelf horizontally only (avoids jolting the page
    // vertically the way Element.scrollIntoView can).
    const target = card.offsetLeft - (dom.shelf.clientWidth - card.offsetWidth) / 2;
    const max = dom.shelf.scrollWidth - dom.shelf.clientWidth;
    dom.shelf.scrollTo({ left: clamp(target, 0, max), behavior: 'smooth' });
  }

  // ── Detail panel ─────────────────────────────────────────────
  function updateDetail(index) {
    const game = games[index];
    if (!game) {
      dom.detail.classList.remove('detail--visible');
      return;
    }

    // Quick fade-out → fade-in for content swap
    dom.detail.classList.remove('detail--visible');

    setTimeout(() => {
      dom.detailTitle.textContent = game.title || '';
      dom.detailYear.textContent  = game.year ? String(game.year) : '';
      dom.detailDesc.innerHTML    = renderMarkdown(game.description || '');
      // Play button — finished:false games show "VIEW PAGE" instead of "PLAY GAME"
      const finished = game.finished !== false;
      dom.playLabel.textContent = finished ? 'PLAY GAME' : 'VIEW PAGE';
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
      dom.detailScreenshots.innerHTML = '';
      const shots = Array.isArray(game.screenshots) ? game.screenshots : [];
      shots.forEach((src, i) => {
        const img = document.createElement('img');
        img.className = 'detail-screenshot-img';
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox(shots, i));
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
  document.addEventListener('keydown', (e) => {
    // Up/Down toggles section regardless of where you are
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
      case 'Enter':
        // Don't hijack Enter when a button (like the Play link) is focused
        if (document.activeElement && document.activeElement.tagName === 'A') return;
        e.preventDefault();
        openGame(state.focusedIndex);
        break;
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

  // ── Clock ────────────────────────────────────────────────────
  function tickClock() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (dom.clock) dom.clock.textContent = `${hh}:${mm}`;
  }
  tickClock();
  setInterval(tickClock, 30 * 1000);

  // ── Stat: games shipped (auto from data) ─────────────────────
  if (dom.statGames) dom.statGames.textContent = String(GAMES.length);

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

  function inlineMarkdown(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>');
  }

  // ── Boot ─────────────────────────────────────────────────────
  renderCards();
  showSection('games');
}());
