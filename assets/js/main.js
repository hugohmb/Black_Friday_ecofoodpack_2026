/*!
 * Landing Black Friday — Ecofoodpack
 * main.js — motor de rolagem, animações, física do rodapé, grade automática e interações.
 * Vanilla JS, sem dependências.
 */
(function () {
  'use strict';
  /* Configuração (links, produtos, datas) vem de assets/js/config.js */
  var C = window.EFP_CONFIG;
  if (!C) { console.error('EFP_CONFIG não encontrado: carregue assets/js/config.js antes de main.js'); return; }
  var IMG = C.IMG, WHATSAPP = C.WHATSAPP, FIM_CAMPANHA = C.FIM_CAMPANHA, LOJA = C.LOJA, OUTLET = C.OUTLET,
      PRODUTOS = C.PRODUTOS, EXCLUIR = C.EXCLUIR, GRADE = C.GRADE, SELOS = C.SELOS;
  function pct(de, por) {
    var n = function (v) { return parseFloat(String(v).replace(/[^0-9,]/g, '').replace(',', '.')); };
    if (!de) return '';
    var p = Math.round((1 - n(por) / n(de)) * 100);
    return p > 0 ? '-' + p + '%' : '';
  }

  /* ========================================================= */
  var root = document.getElementById('efp-bf');
  var $ = function (s, el) { return (el || root).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || root).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var idx = 0;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function phHTML(key, cls, style) {
    return '<div class="efp-ph ' + (cls || '') + '" style="' + (style || '') + '">' + esc(key) + '<br>(link pendente)</div>';
  }
  function imgHTML(key, alt, cls, style) {
    if (!IMG[key]) return phHTML(key, cls, style);
    return '<img class="' + (cls || '') + '" src="' + esc(IMG[key]) + '" alt="' + esc(alt || '') + '" style="' + (style || '') + '" loading="lazy" decoding="async">';
  }

  /* imagens estáticas */
  var PRIORIDADE = { logo: 1, selo: 1, chef: 1 };
  var SEM_LAZY = { caixa: 1 };  /* fica numa seção fixa: carrega junto para não dar pulo no texto */
  $$('img[data-img]').forEach(function (el) {
    var key = el.getAttribute('data-img');
    if (IMG[key]) {
      el.decoding = 'async';
      if (PRIORIDADE[key]) { el.fetchPriority = 'high'; } else if (!SEM_LAZY[key]) { el.loading = 'lazy'; }
      el.src = IMG[key]; return;
    }
    var ph = document.createElement('div');
    ph.className = 'efp-ph ' + el.className;
    ph.innerHTML = esc(key) + '<br>(link pendente)';
    var w = el.getAttribute('data-phw'); if (w) ph.style.width = w;
    el.parentNode.replaceChild(ph, el);
  });
  $$('[data-chefcut]').forEach(function (wrap) {
    var img = wrap.querySelector('img'); if (!img) return;
    var cut = +wrap.getAttribute('data-chefcut');
    var fit = function () {
      if (!img.naturalWidth) return;
      var ratio = img.naturalHeight / img.naturalWidth;
      if (window.innerWidth <= 760) {
        /* celular: a chef nunca cobre o título — o tamanho dela depende da altura livre abaixo do "FRIDAY" */
        var rows = root.querySelectorAll('.efp-title .efp-row'), last = rows[rows.length - 1];
        var hero = root.querySelector('.efp-hero .efp-sticky').getBoundingClientRect();
        var r = last.getBoundingClientRect();
        var free = window.innerHeight - (r.bottom - hero.top) + 18;   /* pode encostar um pouquinho no título */
        var w = Math.min(window.innerWidth * 0.88, Math.max(140, free / (ratio * cut)));
        wrap.style.width = w.toFixed(0) + 'px';
        /* selo sobre as perninhas do A e do Y */
        var selo = root.querySelector('.efp-hero-selo');
        if (selo) { selo.style.left = (r.left + r.width * 0.68).toFixed(0) + 'px'; selo.style.top = (r.top - hero.top + r.height * 0.35).toFixed(0) + 'px'; }
      } else { wrap.style.width = ''; var sl = root.querySelector('.efp-hero-selo'); if (sl) { sl.style.left = ''; sl.style.top = ''; } }
      wrap.style.height = (8 + img.clientWidth * ratio * cut).toFixed(0) + 'px';
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    if (img.complete) fit(); img.addEventListener('load', fit); window.addEventListener('resize', fit);
  });
  /* fundo kraft é pesado: carrega em segundo plano e só entra quando já está pronto (sem travar a abertura) */
  function loadKraft() {
    if (!IMG.kraft) return;
    var k = new Image(); k.decoding = 'async';
    k.onload = function () { $$('[data-bg="kraft"]').forEach(function (el) { el.style.backgroundImage = 'url("' + IMG.kraft + '")'; }); };
    k.src = IMG.kraft;
  }
  if (document.readyState === 'complete') setTimeout(loadKraft, 300); else window.addEventListener('load', function () { setTimeout(loadKraft, 300); });

  /* ---------- letras do título ---------- */
  var heroLetters = [];
  $$('[data-letters]').forEach(function (row) {
    var word = row.getAttribute('data-letters'), off = +row.getAttribute('data-offset'), dir = +row.getAttribute('data-dir');
    word.split('').forEach(function (ch, i) {
      var o = document.createElement('span'); o.className = 'efp-l';
      var n = document.createElement('span'); n.className = 'efp-li'; n.textContent = ch;
      n.style.animationDelay = (2.6 + (off + i) * 0.06).toFixed(2) + 's';
      o.appendChild(n); row.appendChild(o);
      heroLetters.push({ el: o, i: i, len: word.length, k: off + i, dir: dir });
    });
  });

  /* ---------- texto que se revela ---------- */
  function buildReveal(el, text, seed) {
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    var list = [], i = 0, total = text.replace(/ /g, '').length;
    text.toUpperCase().split(' ').forEach(function (word) {
      var w = document.createElement('span'); w.className = 'efp-w'; w.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (ch) {
        var c = document.createElement('span'); c.className = 'efp-c'; c.textContent = ch;
        var r = ((i * 7919 + seed * 131) % 997) / 997;
        list.push({ el: c, t: 0.62 * (i / total) + 0.28 * r, o: -1 });
        i++; w.appendChild(c);
      });
      el.appendChild(w);
    });
    return list;
  }
  function applyReveal(list, p) {
    for (var j = 0; j < list.length; j++) {
      var it = list[j], o = clamp((p - it.t) / 0.06, 0, 1);
      if (Math.abs(o - it.o) < 0.005) continue;
      it.o = o;
      it.el.style.opacity = o;
      it.el.style.transform = 'translate3d(0,' + ((1 - o) * 0.3).toFixed(3) + 'em,0)';
    }
  }
  var galleryH2 = $('[data-reveal="gallery"]');
  var splitH2 = $('.efp-split'), splitL1 = $('.efp-s1'), splitL2 = $('.efp-s2');
  var secContact = $('.efp-contact'), contactL1 = $('.efp-c1'), contactL2 = $('.efp-c2');
  var galleryReveal = buildReveal($('[data-reveal="gallery"]'), 'Um pedido tão caprichado que ninguém pergunta como você fez.', 7);
  var originReveal = [];

  /* ---------- super poderes ---------- */
  var superCards = [];
  function lerpColor(a, b, t) {
    var pa = [1, 3, 5].map(function (k) { return parseInt(a.substr(k, 2), 16); });
    var pb = [1, 3, 5].map(function (k) { return parseInt(b.substr(k, 2), 16); });
    return 'rgb(' + pa.map(function (v, k) { return Math.round(v + (pb[k] - v) * t); }).join(',') + ')';
  }

  /* ---------- render do produto atual ---------- */
  function renderProduct() {
    var p = PRODUTOS[idx], next = PRODUTOS[(idx + 1) % PRODUTOS.length];
    $$('[data-cur="nick"]').forEach(function (e) { e.textContent = p.nick.toUpperCase(); });
    $$('[data-cur="nickUpper"]').forEach(function (e) { e.textContent = p.nick.toUpperCase(); });
    var dn = p.nick.replace(/^O /, 'DO ').replace(/^A /, 'DA ').toUpperCase();
    $$('[data-cur="deNick"]').forEach(function (e) { e.textContent = dn; });
    $$('[data-cur="name"]').forEach(function (e) { e.textContent = p.name; });
    ['de', 'por', 'pix'].forEach(function (k) { $$('[data-cur="' + k + '"]').forEach(function (e) { e.textContent = p[k]; }); });
    var ch = $('[data-cur-href]'); if (ch) ch.href = p.link;
    originReveal = buildReveal($('[data-reveal="origin"]'), p.origin, idx + 1);
    var sc = $('[data-supers]'); sc.innerHTML = ''; superCards = [];
    p.supers.forEach(function (s, i) {
      var c = document.createElement('div'); c.className = 'efp-scard';
      c.innerHTML = '<div class="efp-scard-in"><div class="efp-scard-n">0' + (i + 1) + '</div><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
      sc.appendChild(c); superCards.push({ el: c, inner: c.firstChild });
    });
    var oi = $('[data-offer-img]'); if (oi) oi.innerHTML = imgHTML(p.img, p.name, 'efp-offer-img', 'width:150px;height:150px;border-radius:50%');
    if (typeof cache !== 'undefined') cache.cardH = 0;
    dirty = true;
  }

  /* chips e grade de ofertas */
  /* todo link que leva para fora da landing (loja, outlet, WhatsApp, Instagram...) abre em nova aba */
  function newTabLinks() {
    $$('a[href]').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(h)) return;
      a.target = '_blank'; a.rel = 'noopener';
    });
  }
  var io = null;
  function renderGrid(list) {
  list = list.filter(function (p) { return !EXCLUIR.some(function (x) { return p.link.indexOf(x) >= 0; }); });
  $('[data-grid]').innerHTML = list.map(function (p) {
    var off = pct(p.de, p.por);
    var img = p.src ? '<img class="efp-card-img" src="' + esc(p.src) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' : phHTML('foto pendente', 'efp-card-img', 'width:100%;aspect-ratio:1;border-radius:18px');
    return '<article class="efp-card">' + (off ? '<span class="efp-pricetag">' + off + '</span>' : '') + img +
      '<h3 style="margin:0;font-size:16px;font-weight:800;line-height:1.3">' + esc(p.name) + '</h3>' +
      '<div style="margin-top:auto">' + (p.de ? '<p style="margin:0;font-size:14px;color:#9A9C92"><s>de ' + esc(p.de) + '</s></p>' : '') +
      '<p style="margin:2px 0 0;font-size:26px;font-weight:900">por ' + esc(p.por) + '</p>' +
      (p.pix ? '<p style="margin:2px 0 12px;font-size:13px;color:#B9BBB1">ou ' + esc(p.pix) + ' no Pix</p>' : '<p style="margin:2px 0 12px"></p>') +
      '<a class="efp-btn efp-btn-lime" style="width:100%;min-height:48px;font-size:15px" href="' + esc(p.link) + '" target="_blank" rel="noopener">Comprar</a></div></article>';
  }).join('');
  observeCards();
  newTabLinks();
  }
  $$('[data-outlet]').forEach(function (a) { a.href = OUTLET; });
  newTabLinks();
  /* produtos entram conforme chegam na tela; ao sair, voltam ao estado inicial para entrar de novo */
  function observeCards() {
    if (!('IntersectionObserver' in window)) { $$('.efp-card').forEach(function (c) { c.classList.add('efp-in'); }); return; }
    if (!io) io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { en.target.classList.toggle('efp-in', en.isIntersecting); });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    $$('.efp-card').forEach(function (c) { io.observe(c); });
  }
  renderGrid(GRADE);

  /* =========================================================
     ATUALIZAÇÃO AUTOMÁTICA DA GRADE
     Lê a categoria /outlet da própria loja (todas as páginas ?pg=N) e monta a grade
     com o que estiver lá: produto novo entra sozinho, preço acompanha a loja.
     Se a leitura falhar, fica a lista de reserva (GRADE).
     ========================================================= */
  function money(t) { var m = String(t).match(/R\$\s*([\d.]+,\d{2})/); return m ? 'R$ ' + m[1] : ''; }
  function parseOutlet(html, base) {
    var doc = new DOMParser().parseFromString(html, 'text/html'), found = {}, out = [];
    doc.querySelectorAll('img').forEach(function (img) {
      /* sobe a partir da foto até achar o "card" do produto (tem preço e Pix) */
      var card = img.parentElement, lvl = 0;
      while (card && lvl < 9 && !/R\$/.test(card.textContent || '')) { card = card.parentElement; lvl++; }
      if (!card) return;
      var txt = (card.textContent || '').replace(/\s+/g, ' ');
      if (!/pix/i.test(txt) || (txt.match(/R\$/g) || []).length > 8) return;
      var a = card.querySelector('a[href]'); if (!a) return;
      var link = new URL(a.getAttribute('href'), base).href.split('#')[0].split('?')[0];
      if (link.indexOf(location.hostname || 'ecofoodpack.com.br') < 0 && link.indexOf('ecofoodpack.com.br') < 0) return;
      if (/\/(outlet)?\/?$/.test(link) || /carrinho|checkout|loja\/|javascript/i.test(link) || found[link]) return;
      var src = img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy') || '';
      if (!src && img.getAttribute('srcset')) src = img.getAttribute('srcset').split(',')[0].trim().split(' ')[0];
      if (!src) src = img.getAttribute('src') || '';
      if (/loading|lazy|blank|spinner|data:/i.test(src)) src = '';
      if (src) src = new URL(src, base).href;
      var name = (img.getAttribute('alt') || a.getAttribute('title') || '').trim();
      if (!name) { var h = card.querySelector('h2,h3,h4,[class*=name],[class*=nome],[class*=title]'); name = h ? h.textContent.trim() : a.textContent.trim(); }
      var pixM = txt.match(/R\$\s*([\d.]+,\d{2})\s*(à vista|a vista|no pix|via pix)/i);
      var clean = txt.replace(/\d+\s*x\s*de\s*R\$\s*[\d.]+,\d{2}/gi, ' ');
      if (pixM) clean = clean.replace(pixM[0], ' ');
      var prices = (clean.match(/R\$\s*[\d.]+,\d{2}/g) || []).map(money);
      if (!prices.length) return;
      found[link] = 1;
      out.push({ name: name, link: link, src: src, de: prices.length > 1 ? prices[0] : '', por: prices.length > 1 ? prices[1] : prices[0], pix: pixM ? 'R$ ' + pixM[1] : '' });
    });
    return out;
  }
  function autoGrid() {
    if (!window.fetch || !window.DOMParser) return;
    var KEY = 'efp-outlet-v1', cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (cached && Date.now() - cached.t < 10 * 60 * 1000 && cached.list.length) { applyAuto(cached.list); return; }
    var all = [], seen = {};
    function page(n) {
      var url = OUTLET + (n > 1 ? '?pg=' + n : '');
      return fetch(url, { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (html) {
        var items = parseOutlet(html, url), novos = 0;
        items.forEach(function (it) { if (!seen[it.link]) { seen[it.link] = 1; all.push(it); novos++; } });
        if (novos && n < 8 && /[?&]pg=/.test(html)) return page(n + 1);
      });
    }
    page(1).then(function () {
      if (!all.length) return;
      try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), list: all })); } catch (e) {}
      applyAuto(all);
    }).catch(function () { /* mantém a lista de reserva */ });
  }
  function applyAuto(list) {
    /* nomes e fotos conhecidos (lista de reserva) completam o que faltar na leitura */
    var known = {}; GRADE.forEach(function (g) { known[g.link.split('?')[0]] = g; });
    renderGrid(list.map(function (p) {
      var k = known[p.link] || {};
      return { name: k.name || p.name, link: p.link, src: p.src || k.src || '', de: p.de, por: p.por || k.por, pix: p.pix || k.pix || '' };
    }));
    cache.cardH = 0; dirty = true;
  }
  if (document.readyState === 'complete') setTimeout(autoGrid, 800); else window.addEventListener('load', function () { setTimeout(autoGrid, 800); });

  /* PUXE */
  var tag = $('.efp-tag');
  var tape = $('.efp-tape'), peekTimer = null;
  /* Clica e arrasta para baixo: a fita acompanha. Soltou: ela sobe sozinha, como fita que volta.
     Toque simples (ou teclado): a fita desce, mostra o desconto e sobe sozinha depois de alguns segundos. */
  function peek() {
    clearTimeout(peekTimer);
    root.classList.add('efp-pulled');
    peekTimer = setTimeout(function () { root.classList.remove('efp-pulled'); }, 2600);
  }
  var tdrag = null, skipClick = false;
  tag.addEventListener('pointerdown', function (e) {
    clearTimeout(peekTimer);
    var maxH = window.innerHeight * 0.64;
    var startH = root.classList.contains('efp-pulled') ? maxH : 0;
    tdrag = { y0: e.clientY, h0: startH, maxH: maxH, moved: false };
    try { tag.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });
  tag.addEventListener('pointermove', function (e) {
    if (!tdrag) return;
    var dy = e.clientY - tdrag.y0;
    if (!tdrag.moved && Math.abs(dy) < 6) return;
    if (!tdrag.moved) { tdrag.moved = true; root.classList.add('efp-tdrag'); root.classList.remove('efp-pulled'); }
    var h = clamp(tdrag.h0 + dy, 0, tdrag.maxH);
    tape.style.height = h.toFixed(0) + 'px';
    tag.style.top = h.toFixed(0) + 'px';
  });
  function endTape() {
    if (!tdrag) return;
    var d = tdrag; tdrag = null; skipClick = true;
    if (!d.moved) { peek(); return; }
    /* soltou: volta para cima sozinha */
    root.classList.remove('efp-tdrag');
    void tape.offsetWidth;
    tape.style.height = ''; tag.style.top = '';
  }
  tag.addEventListener('pointerup', endTape);
  tag.addEventListener('pointercancel', endTape);
  tag.addEventListener('click', function () { if (skipClick) { skipClick = false; return; } peek(); });

  /* contagem */
  var countEl = $('[data-count]'), end = new Date(FIM_CAMPANHA).getTime();
  function tickCount() {
    var s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    var p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    countEl.textContent = d + 'd ' + p2(h) + ':' + p2(m) + ':' + p2(s);
  }
  tickCount(); setInterval(tickCount, 1000);

  /* ---------- MOTOR DE ROLAGEM (um único requestAnimationFrame) ---------- */
  var secHero = $('.efp-hero'), secOrigin = $('.efp-origin'), secSupers = $('.efp-supers'), secGallery = $('.efp-gallery');
  var waves = $$('.efp-wave');
  /* letras de BLACK / FRIDAY separadas para a onda */
  var waveLetters = [];
  $$('[data-wave]').forEach(function (p) {
    var word = p.textContent, side = p.getAttribute('data-wave'); p.textContent = '';
    word.split('').forEach(function (ch, i) {
      var sp = document.createElement('span'); sp.className = 'efp-wl'; sp.textContent = ch; p.appendChild(sp);
      waveLetters.push({ el: sp, i: i, n: word.length, side: side });
    });
  });
  var track = $('.efp-track'), progress = $('.efp-progress'), box = $('.efp-box'), fadeUI = $$('.efp-fadeui'), heroSelo = $('.efp-hero-selo'), title = $('.efp-title');
  var heroLeft = false;
  function replayIntro() {
    /* reset do título: as letras entram de novo quando a pessoa volta ao topo */
    $$('.efp-li').forEach(function (n, j) {
      n.style.animation = 'none'; void n.offsetWidth;
      n.style.animation = ''; n.style.animationDelay = (j * 0.06).toFixed(2) + 's';
    });
    var si = root.querySelector('.efp-selo-in');
    if (si) { si.style.animation = 'none'; void si.offsetWidth; si.style.animation = ''; si.style.animationDelay = '.7s'; }
  }
  var dirty = true, boxRot = 0, boxTarget = 0, boxScale = 0.85, boxScaleT = 0.85;

  function pinnedR(r, vh) { var total = r.height - vh; return clamp(-r.top / (total > 0 ? total : 1), 0, 1); }
  /* medidas que só mudam no resize ficam em cache */
  var cache = { cardH: 0, trackW: 0 };
  function measure() {
    cache.cardH = superCards.length ? superCards[0].el.offsetHeight : 300;
    cache.trackW = track.scrollWidth;
  }
  function update() {
    var R0 = { split: splitH2.getBoundingClientRect(), contact: secContact.getBoundingClientRect(), gh2: galleryH2.getBoundingClientRect(), root: root.getBoundingClientRect(), hero: secHero.getBoundingClientRect(), origin: secOrigin.getBoundingClientRect(),
               supers: secSupers.getBoundingClientRect(), gallery: secGallery.getBoundingClientRect(), footer: footer.getBoundingClientRect() };
    if (!cache.cardH) measure();
    var vh = window.innerHeight, vw = document.documentElement.clientWidth;

    /* barra de progresso no menu */
    var rr = R0.root, totalPage = rr.height - vh;
    progress.style.transform = 'scaleX(' + clamp(-rr.top / (totalPage > 0 ? totalPage : 1), 0, 1).toFixed(4) + ')';

    /* hero: letras espalham e somem por completo */
    var hp = pinnedR(R0.hero, vh);
    var fade = clamp(1 - hp / 0.8, 0, 1);
    if (hp > 0.98) heroLeft = true;
    if (heroLeft && hp < 0.01) { heroLeft = false; replayIntro(); }
    title.style.visibility = fade <= 0 ? 'hidden' : 'visible';
    heroLetters.forEach(function (L) {
      var spread = (L.i - (L.len - 1) / 2) * hp * 90;
      var lift = L.dir * hp * (90 + ((L.k * 37) % 5) * 50);
      var rot = (L.k % 2 ? 1 : -1) * hp * (12 + (L.k % 3) * 9);
      L.el.style.transform = 'translate3d(' + spread.toFixed(1) + 'px,' + lift.toFixed(1) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + (1 + hp * 0.5).toFixed(3) + ')';
      L.el.style.opacity = fade.toFixed(3);
    });
    var ui = clamp(1 - hp * 3, 0, 1).toFixed(3);
    fadeUI.forEach(function (e) { e.style.opacity = ui; e.style.pointerEvents = ui < 0.1 ? 'none' : ''; });
    /* selo: sai se deslocando, girando e crescendo, como as letras */
    if (heroSelo) {
      heroSelo.style.transform = 'translate3d(' + (hp * vw * 0.18).toFixed(1) + 'px,' + (-hp * vh * 0.35).toFixed(1) + 'px,0) rotate(' + (hp * 140).toFixed(2) + 'deg) scale(' + (1 + hp * 0.7).toFixed(3) + ')';
      heroSelo.style.opacity = fade.toFixed(3);
    }

    /* origem: texto + alvo de rotação da caixa */
    var ro = R0.origin;
    var op = clamp((-ro.top + vh * 0.3) / (ro.height - vh * 0.6), 0, 1);
    applyReveal(originReveal, op * 1.1);
    boxTarget = -40 + op * 400;
    boxScaleT = 0.85 + op * 0.15;

    /* super poderes */
    var sp = pinnedR(R0.supers, vh), n = superCards.length, pos = sp * (n - 1 + 0.4) - 0.2;
    superCards.forEach(function (c, i) {
      var d = i - pos, a = clamp(1 - Math.abs(d) * 1.5, 0, 1);
      var ease = a * a * (3 - 2 * a);
      c.el.style.transform = 'translate(-50%,-50%) translate3d(0,' + (d * (cache.cardH * 0.92 + 20)).toFixed(1) + 'px,0) scale(' + (0.6 + ease * 0.5).toFixed(3) + ')';
      var a2 = clamp(a * 1.8, 0, 1);
      c.el.style.backgroundColor = 'rgba(' + Math.round(13 + 231 * a2) + ',' + Math.round(14 + 230 * a2) + ',' + Math.round(11 + 227 * a2) + ',' + (0.14 + 0.86 * a2).toFixed(3) + ')';
      c.el.style.boxShadow = '0 20px 50px rgba(0,0,0,' + (0.25 * a).toFixed(2) + ')';
      c.inner.style.opacity = clamp(a * 1.6, 0, 1).toFixed(3);
    });

    /* onda nas letras: das extremidades ao centro, saltando para fora da tela */
    var near = Math.round(clamp(pos, 0, n - 1)), frac = pos - near;
    var amp = clamp(1 - Math.abs(frac) * 1.5, 0, 1);
    var front = clamp((frac + 0.62) / 0.62, 0, 1);
    var stacked = vw <= 1024;
    waveLetters.forEach(function (L) {
      var t = L.n > 1 ? L.i / (L.n - 1) : 0;
      /* d = 0 na extremidade, 1 no centro (perto dos cards) */
      var d = stacked ? 1 - Math.abs(t - 0.5) * 2 : (L.side === 'start' ? t : 1 - t);
      var g = Math.exp(-Math.pow((d - front) / 0.28, 2)) * amp;
      L.el.style.transform = 'translate3d(0,' + (-g * 14).toFixed(2) + 'px,0) scale(' + (1 + g * 0.24).toFixed(4) + ')';
      L.el.style.textShadow = g > 0.02 ? '0 ' + (g * 14).toFixed(1) + 'px ' + (g * 26).toFixed(1) + 'px rgba(0,0,0,' + (g * 0.35).toFixed(3) + ')' : 'none';
    });

    /* ondas do fundo: expandem do centro conforme a rolagem (e recolhem ao voltar) */
    waves.forEach(function (w, i) {
      var t = clamp((sp - i * 0.14) / 0.3, 0, 1);
      t = 1 - Math.pow(1 - t, 3);
      w.style.transform = 'scale(' + t.toFixed(4) + ')';
    });

    /* galeria horizontal */
    var gp = pinnedR(R0.gallery, vh);
    var shift = Math.max(0, cache.trackW - vw);
    track.style.transform = 'translate3d(' + (-gp * shift).toFixed(1) + 'px,0,0)';
    /* o texto começa a aparecer assim que a área preta entra na tela e termina antes dos cards andarem */
    var gEnter = vw <= 760 ? clamp((vh - R0.gh2.top) / (vh * 0.75), 0, 1) : clamp((vh - R0.gallery.top) / (vh * 0.9), 0, 1);
    applyReveal(galleryReveal, clamp(gEnter * 0.85 + gp * 1.5, 0, 1.1));

    /* contato: "Ficou com dúvida?" entra pela esquerda e "Fale com a gente." pela direita */
    var cp = reduce ? 1 : clamp((vh - R0.contact.top) / (vh * 0.75), 0, 1), ce = 1 - Math.pow(1 - cp, 3);
    contactL1.style.transform = 'translate3d(' + (-(1 - ce) * vw * 0.6).toFixed(1) + 'px,0,0)'; contactL1.style.opacity = ce.toFixed(3);
    contactL2.style.transform = 'translate3d(' + ((1 - ce) * vw * 0.6).toFixed(1) + 'px,0,0)'; contactL2.style.opacity = ce.toFixed(3);

    /* "Toda a família em oferta" vem da esquerda; "Escolha os seus preferidos!" vem da direita */
    var sp2 = reduce ? 1 : clamp((vh - R0.split.top) / (vh * 0.6), 0, 1), se = 1 - Math.pow(1 - sp2, 3);
    splitL1.style.transform = 'translate3d(' + (-(1 - se) * vw * 0.6).toFixed(1) + 'px,0,0)'; splitL1.style.opacity = se.toFixed(3);
    splitL2.style.transform = 'translate3d(' + ((1 - se) * vw * 0.6).toFixed(1) + 'px,0,0)'; splitL2.style.opacity = se.toFixed(3);

    checkFooter(R0.footer.top);
  }

  function frame() {
    if (dirty) { dirty = false; update(); }
    /* caixa: rotação suavizada (interpolação a cada frame) */
    var diff = boxTarget - boxRot, ds = boxScaleT - boxScale;
    if (Math.abs(diff) > 0.01 || Math.abs(ds) > 0.0005) {
      boxRot += diff * 0.09; boxScale += ds * 0.09;
      if (box) box.style.transform = 'rotate(' + boxRot.toFixed(3) + 'deg) scale(' + boxScale.toFixed(4) + ')';
    }
    stepPhysics();
    requestAnimationFrame(frame);
  }
  window.addEventListener('scroll', function () { dirty = true; }, { passive: true });
  window.addEventListener('resize', function () { cache.cardH = 0; dirty = true; });

  /* ---------- RODAPÉ COM FÍSICA ---------- */
  var footer = $('.efp-physics'), bodies = [], simOn = false, rest = 0, drag = null, dragMoved = false;
  function checkFooter(top) {
    if (!simOn && top < window.innerHeight * 0.65) startSim();
    /* reset: saiu do rodapé (voltou para cima) -> remove as embalagens para caírem de novo */
    if (simOn && top > window.innerHeight * 0.95) resetSim();
  }
  function resetSim() {
    bodies.forEach(function (b) { if (b.el && b.el.parentNode) b.el.parentNode.removeChild(b.el); });
    bodies = []; simOn = false; rest = 0; drag = null;
  }
  function startSim() {
    simOn = true;
    var W = footer.clientWidth, base = Math.max(30, Math.min(78, W / (W < 760 ? 10 : 21)));
    var items = [];
    SELOS.forEach(function (e, k) { items.push({ kind: 'png', e: e, label: e.txt, href: '#efp-todas', r: base * (k % 3 === 0 ? 1.08 : 0.94) }); });
    items.push({ kind: 'selo', key: 'selo', label: 'Voltar ao topo', href: '#efp-topo', r: base * 1.15 });
    items.forEach(function (b, i) {
      var a = document.createElement('a');
      a.className = 'efp-body'; a.href = b.href; a.setAttribute('aria-label', b.label); a.draggable = false;
      a.style.width = a.style.height = (b.r * 2).toFixed(0) + 'px';
      if (b.kind === 'selo') {
        a.innerHTML = IMG.selo ? '<img src="' + esc(IMG.selo) + '" alt="" style="width:118%;height:118%;object-fit:contain">' : '';
      } else if (b.kind === 'png') {
        a.innerHTML = '<img src="' + esc(b.e.src) + '" alt="" style="width:112%;height:112%;object-fit:contain">';
      } else {
        a.style.background = '#B4E61D';
        a.innerHTML = b.kind === 'insta'
          ? '<svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" stroke="#0D0E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>'
          : '<svg width="42%" height="42%" viewBox="0 0 24 24" fill="none" stroke="#0D0E0B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.3A8.5 8.5 0 1 1 21 12z"/></svg>';
      }
      if (b.href.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
      footer.appendChild(a);
      b.el = a; b.x = W * (0.15 + 0.7 * ((i * 0.37) % 1)); b.y = -b.r - i * 120; b.vx = (i % 2 ? 1 : -1) * 2; b.vy = 0; b.a = 0;
      a.addEventListener('pointerdown', function (e) {
        var p = pt(e); drag = { b: b, dx: b.x - p.x, dy: b.y - p.y, sx: p.x, sy: p.y }; dragMoved = false; rest = 0;
        try { a.setPointerCapture(e.pointerId); } catch (err) {}
        e.preventDefault();
      });
      a.addEventListener('pointermove', function (e) {
        if (!drag || drag.b !== b) return;
        var p = pt(e), nx = p.x + drag.dx, ny = p.y + drag.dy;
        b.vx = (nx - b.x) * 0.6; b.vy = (ny - b.y) * 0.6; b.x = nx; b.y = ny;
        if (Math.abs(p.x - drag.sx) + Math.abs(p.y - drag.sy) > 6) dragMoved = true;
      });
      var endDrag = function () { if (drag && drag.b === b) drag = null; };
      a.addEventListener('pointerup', endDrag);
      a.addEventListener('pointercancel', endDrag);
      a.addEventListener('click', function (e) { if (dragMoved) { e.preventDefault(); dragMoved = false; } });
      bodies.push(b);
    });
  }
  function pt(e) { var r = footer.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function stepPhysics() {
    if (!simOn || (rest > 90 && !drag)) return;
    var W = footer.clientWidth, H = footer.clientHeight - 36, energy = 0;
    bodies.forEach(function (b) {
      if (drag && drag.b === b) return;
      b.vy += 0.7; b.vx *= 0.995; b.x += b.vx; b.y += b.vy; b.a += b.vx / b.r;
      if (b.y > H - b.r) { b.y = H - b.r; b.vy *= -0.32; b.vx *= 0.9; }
      if (b.x < b.r) { b.x = b.r; b.vx *= -0.5; }
      if (b.x > W - b.r) { b.x = W - b.r; b.vx *= -0.5; }
    });
    for (var it = 0; it < 4; it++) {
      for (var i = 0; i < bodies.length; i++) for (var j = i + 1; j < bodies.length; j++) {
        var a = bodies[i], c = bodies[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 0.01, min = a.r + c.r;
        if (d >= min) continue;
        var nx = dx / d, ny = dy / d, push = (min - d) / 2;
        var fa = drag && drag.b === a ? 0 : 1, fc = drag && drag.b === c ? 0 : 1;
        a.x -= nx * push * fa * (fc ? 1 : 2); a.y -= ny * push * fa * (fc ? 1 : 2);
        c.x += nx * push * fc * (fa ? 1 : 2); c.y += ny * push * fc * (fa ? 1 : 2);
        var rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) { var imp = -rv * 0.65; if (fa) { a.vx -= imp * nx; a.vy -= imp * ny; } if (fc) { c.vx += imp * nx; c.vy += imp * ny; } }
      }
    }
    bodies.forEach(function (b) {
      energy += Math.abs(b.vx) + Math.abs(b.vy);
      b.el.style.transform = 'translate3d(' + (b.x - b.r).toFixed(1) + 'px,' + (b.y - b.r).toFixed(1) + 'px,0) rotate(' + b.a.toFixed(3) + 'rad)';
    });
    rest = energy < 0.6 * bodies.length ? rest + 1 : 0;
  }

  $$('[data-wa]').forEach(function (a) { a.href = WHATSAPP; });
  newTabLinks();

  /* reação de clique: onda a partir do ponto tocado + rolagem suave até a seção */
  $$('[data-ripple]').forEach(function (b) {
    b.addEventListener('pointerdown', function (e) {
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2, sp = document.createElement('span');
      sp.className = 'efp-ripple'; sp.style.width = sp.style.height = d + 'px';
      sp.style.left = (e.clientX - r.left - d / 2) + 'px'; sp.style.top = (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(sp); setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 650);
    });
    var href = b.getAttribute('href');
    if (href && href.charAt(0) === '#' && href.length > 1) b.addEventListener('click', function (e) {
      var t = document.getElementById(href.slice(1)); if (!t) return;
      e.preventDefault(); setTimeout(function () { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 120);
    });
  });

  /* menu sanduíche */
  var burger = $('.efp-burger');
  function setMenu(on) { root.classList.toggle('efp-menu-on', on); burger.setAttribute('aria-expanded', on ? 'true' : 'false'); burger.setAttribute('aria-label', on ? 'Fechar menu' : 'Abrir menu'); }
  burger.addEventListener('click', function () { setMenu(!root.classList.contains('efp-menu-on')); });
  $$('.efp-menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* página "pronta": fonte carregada -> libera a animação das letras */
  var markReady = function () { root.classList.add('efp-ready'); cache.cardH = 0; dirty = true; };
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(markReady); setTimeout(markReady, 2500); } else { markReady(); }

  renderProduct();
  if (reduce) { boxRot = boxTarget; }
  requestAnimationFrame(frame);
})();
