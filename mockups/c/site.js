/* ItriPay — direction C (Aurora), revision 2. No libraries.
   ?lang=en|fr|ar   language
   ?shot=1          static mode for full-page captures (no motion, fixed hero height) */
(function () {
  'use strict';
  var EMAIL = 'contact@itripay.com';
  var qs = new URLSearchParams(location.search);
  var lang = ['en', 'fr', 'ar'].indexOf(qs.get('lang')) >= 0 ? qs.get('lang') : 'en';
  var shot = qs.has('shot');
  var T = window.ITRI[lang], root = document.documentElement;
  root.lang = lang; root.dir = T.dir;
  if (shot) root.classList.add('shot');
  var reduce = shot || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) root.classList.add('motion');
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- the star, traced from assets/source/itripay-logo.png ---------- */
  var BLADE = 'M0 -588 L119 -221 Q132 -171 94 -138 L34 -91 Q14 -76 22 -46 L-297 -298 L-176 -252 Q-116 -231 -98 -286 Z';
  var FACET = 'M0 -588 V-232 Q0 -176 -52 -172 Q-70 -171 -88 -181 L-297 -298 L-176 -252 Q-116 -231 -98 -286 Z';
  function star(cls, interactive) {
    var b = [0, 1, 2, 3].map(function (i) {
      var a = interactive ? ' class="blade vtrig" data-v="' + i + '" role="button" tabindex="0" aria-label="' + T.values[i].name + '"' : ' class="blade" data-v="' + i + '"';
      return '<g transform="rotate(' + i * 90 + ')"><g' + a + '><path class="b-fill" d="' + BLADE + '"/><path class="b-facet" d="' + FACET + '"/><path class="b-line" d="' + BLADE + '" pathLength="1"/>' + '</g></g>';
    }).join('');
    return '<svg class="star ' + (cls || '') + '" viewBox="-640 -640 1280 1280"' + (interactive ? ' role="group" aria-label="' + T.starLabel + '"' : ' aria-hidden="true"') + '>' + b + '</svg>';
  }
  function glyph(i) { return '<span class="vglyph" data-own="' + i + '">' + star() + '</span>'; }

  /* ---------- icons (one 24px stroke family) ---------- */
  var IC = {
    tap: '<path d="M7 8.5a5 5 0 0 1 0 7M10.5 6a9 9 0 0 1 0 12M14 3.5a13 13 0 0 1 0 17"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5M9 7h7M9 11h5"/>',
    chart: '<path d="M5 20V11M11 20V4M17 20v-6M2.5 20h19"/>',
    receipt: '<path d="M5 3v18l2.5-1.5L10 21l2-1.5 2 1.5 2.5-1.5L19 21V3l-2.5 1.5L14 3l-2 1.5L10 3 7.5 4.5z"/><path d="M9 9h6M9 13h6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    shop: '<path d="M3 9l1.5-5h15L21 9M4.5 10.5V20h15v-9.5M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M10 20v-5h4v5"/>',
    cup: '<path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M7 3v3M11 3v3M15 3v3"/>',
    basket: '<path d="M3 10h18l-1.6 9a2 2 0 0 1-2 1.6H6.6a2 2 0 0 1-2-1.6zM8 10l3-6M16 10l-3-6M9 14v3M15 14v3"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8l12 10M8.5 16l12-10"/>',
    taxi: '<path d="M5 17H3.5v-4.2l1.8-4.6A2 2 0 0 1 7.2 7h9.6a2 2 0 0 1 1.9 1.2l1.8 4.6V17H19M5 17v2M19 17v2M5 17h14M3.5 12.5h17"/><circle cx="7.5" cy="14.8" r=".9"/><circle cx="16.5" cy="14.8" r=".9"/><path d="M10 7V4.5h4V7"/>',
    doctor: '<path d="M6 3v6a4 4 0 0 0 8 0V3M6 3H4.5M14 3h1.5M10 13v2.5a4.5 4.5 0 0 0 9 0V13"/><circle cx="19" cy="11" r="2"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5.2 5.2l-8.8 8.8a2.1 2.1 0 0 1-3-3l8.8-8.8a4 4 0 0 0-2.2-2.2zM14.5 6.5l1.8 1.8M17 4l-2.5 2.5"/>',
    device: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10M12 16v4M7 9h4M7 12h7"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18h3"/>',
    sms: '<path d="M4 5h16v11H9.5L4 20z"/><path d="M8 9h8M8 12h5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  function icon(n, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + '</svg>'; }

  function slogan(cls) {
    return '<ul class="slogan ' + (cls || '') + '">' + T.values.map(function (v, i) {
      return '<li><button type="button" class="vtrig sl" data-v="' + i + '">' + v.name + '</button></li>';
    }).join('') + '</ul>';
  }
  function head(o) {
    return '<header class="sec-head rv"><p class="eyebrow">' + o.eyebrow + '</p><h2>' + o.title + '</h2>' + (o.sub ? '<p class="lede">' + o.sub + '</p>' : '') + '</header>';
  }
  function cards(items, cls) {
    return '<ul class="' + cls + '">' + items.map(function (it, i) {
      return '<li class="card rv" style="--i:' + i + '"><span class="ico">' + icon(it[0]) + '</span><h3>' + it[1] + '</h3>' + (it[2] ? '<p>' + it[2] + '</p>' : '') + '</li>';
    }).join('') + '</ul>';
  }
  function btn(label, href, kind, attr) { return '<a class="btn ' + (kind || 'btn-primary') + '" href="' + href + '"' + (attr || '') + '><span>' + label + '</span>' + icon('arrow', 'ar') + '</a>'; }
  /* every "Join the waitlist" button is the same component: data-wait turns the threads on */
  function waitBtn(kind, attr) { return btn(T.cta, '#join', kind, ' data-wait' + (attr || '')); }

  /* headline: one span per word so it can rise word by word on load */
  var hw = 0;
  var headline = T.hero.title.split('<br>').map(function (line) {
    return '<span class="ln">' + line.split(' ').map(function (w) { return '<span class="w"><i style="--w:' + (hw++) + '">' + w + '</i></span>'; }).join(' ') + '</span>';
  }).join(' ');

  /* ---------- page ---------- */
  var langs = [['en', 'EN'], ['fr', 'FR'], ['ar', 'ع']].map(function (l) {
    return '<a href="?lang=' + l[0] + '"' + (l[0] === lang ? ' aria-current="true"' : '') + ' lang="' + l[0] + '">' + l[1] + '</a>';
  }).join('');
  var nav = ['how', 'features', 'credit', 'pricing', 'faq'].map(function (k) { return '<a href="#' + k + '">' + T.nav[k] + '</a>'; }).join('');
  var P = T.pricing, J = T.join, C = T.credit, A = T.app;
  var mail = '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>';

  var hero =
    '<section class="hero" id="top"><canvas class="sky" aria-hidden="true"></canvas><div class="aurora" aria-hidden="true"></div>' +
    '<div class="wrap hero-c">' +
      '<div class="hero-text">' +
        '<h1 class="headline" aria-label="' + T.hero.title.replace('<br>', ' ') + '"><span aria-hidden="true">' + headline + '</span></h1>' +
        '<p class="hero-sub up" style="--i:3">' + T.hero.sub + '</p>' +
        '<div class="hero-cta up" style="--i:4">' + waitBtn() + btn(T.cta2, '#how', 'btn-ghost') + '</div>' +
        '<div class="pills up" style="--i:5">' + T.values.map(function (v, i) {
          return '<button type="button" class="vtrig pill" data-v="' + i + '">' + glyph(i) + '<span>' + v.name + '</span></button>';
        }).join('') + '</div>' +
      '</div>' +
      '<div class="stage up" style="--i:1">' +
        '<div class="bigstar"><div class="rot">' + star('draw', true) + '</div></div>' +
        '<p class="vcap"><b data-vtext="name"></b><span data-vtext="line"></span></p>' +
      '</div>' +
    '</div></section>';

  var carnet =
    '<div class="carnet rv" aria-hidden="true"><div class="cn-rings"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
      '<div class="cn-head"><span>' + A.credit + ' · ' + A.total + '</span><b><span data-total>842.50</span> <i>' + A.cur + '</i></b></div>' +
      '<ul>' + A.c.map(function (c, i) {
        return '<li style="--i:' + i + '"><span class="cn-av">' + c[0].charAt(0) + '</span><span class="cn-who"><b>' + c[0] + '</b><small data-note="' + c[1] + '">' + c[1] + '</small></span><em data-bal="' + c[2] + '">' + c[2] + '</em></li>';
      }).join('') + '</ul>' +
      '<div class="cn-sms">' + icon('sms') + '<span>' + A.sms + '</span></div>' +
    '</div>';

  $('#app').innerHTML =
    '<a class="skip" href="#main">' + T.skip + '</a><div id="top-mark" aria-hidden="true"></div>' +
    '<header class="site-head"><div class="wrap">' +
      '<div class="brand"><button type="button" class="logo-spin" aria-label="' + T.spinLabel + '">' + star('draw') + '</button><a href="#top" class="wordmark">ItriPay</a></div>' +
      '<nav class="nav" aria-label="Main">' + nav + '</nav>' +
      '<div class="head-end"><div class="lang" role="group" aria-label="' + T.langLabel + '">' + langs + '</div>' + waitBtn('btn-sm') + '</div>' +
    '</div></header>' +
    '<main id="main">' + hero +
    '<section class="sec problem first" id="problem"><div class="wrap">' + head(T.problem) + cards(T.problem.items, 'grid-3') + '</div></section>' +
    '<section class="sec how" id="how"><div class="wrap">' + head(T.how) + '<ol class="steps">' + T.how.steps.map(function (s, i) {
      return '<li class="rv" style="--i:' + i + '"><span class="step-n">' + (i + 1) + '</span><h3>' + s[0] + '</h3><p>' + s[1] + '</p></li>';
    }).join('') + '</ol></div></section>' +
    '<section class="sec features" id="features"><div class="wrap">' + head(T.features) + cards(T.features.items, 'grid-feat') + '</div></section>' +
    '<section class="sec credit" id="credit"><div class="wrap"><div class="credit-in">' +
      '<div class="credit-text rv"><p class="eyebrow">' + C.eyebrow + '</p><h2>' + C.title + '</h2><p class="lede">' + C.body + '</p>' +
        '<ul class="cpoints">' + C.points.map(function (p) { return '<li>' + icon(p[0]) + '<span>' + p[1] + '</span></li>'; }).join('') + '</ul></div>' +
      carnet +
    '</div></div></section>' +
    '<section class="sec who" id="who"><div class="wrap">' + head(T.who) + cards(T.who.items, 'grid-who') + '</div></section>' +
    '<section class="sec premium" id="pricing"><div class="wrap"><div class="prem-card rv"><div class="shimmer" aria-hidden="true"></div>' +
      '<div class="price-main"><p class="eyebrow">' + glyph(0) + P.eyebrow + '</p><h2>' + P.title + '</h2>' +
        '<p class="price"><b data-count="49">49</b><span>' + P.cur + ' <small>' + P.per + '</small></span></p>' +
        '<p class="nodevice">' + icon('phone') + '<span><b>' + P.nodevice + '</b> ' + P.nodeviceSub + '</span></p>' +
        '<p class="rule">' + P.rule + '</p><p class="rule-how">' + P.how + '</p>' + waitBtn('btn-gold', ' data-thread="242,205,115"') + '</div>' +
      '<div class="price-inc"><h3>' + P.incTitle + '</h3><ul>' + P.inc.map(function (x) { return '<li>' + icon('check') + '<span>' + x + '</span></li>'; }).join('') + '</ul></div>' +
    '</div></div></section>' +
    '<section class="sec partners" id="partners"><div class="wrap"><div class="partners-in rv"><div><p class="eyebrow">' + T.partners.eyebrow + '</p><h2>' + T.partners.title + '</h2><p class="lede">' + T.partners.body + '</p>' + btn(T.partners.cta, '#join', 'btn-light') + '</div>' +
      '<ul class="plist">' + T.partners.points.map(function (x, i) { return '<li>' + glyph(i) + '<span>' + x + '</span></li>'; }).join('') + '</ul></div></div></section>' +
    '<section class="sec name" id="name"><div class="wrap"><div class="name-in rv"><div class="name-star">' + star() + '<span class="tifinagh" lang="zgh" aria-hidden="true">ⵉⵜⵔⵉ</span></div><div><p class="eyebrow">' + T.name.eyebrow + '</p><h2>' + T.name.title + '</h2><p class="lede">' + T.name.body + '</p><p class="name-foot">' + T.name.foot + '</p>' + slogan('on-light') + '</div></div></div></section>' +
    '<section class="sec faq" id="faq"><div class="wrap">' + head(T.faq) + '<div class="faq-list">' + T.faq.items.map(function (q, i) {
      return '<details class="rv" style="--i:' + i + '"' + (shot && i === 0 ? ' open' : '') + '><summary><span>' + q[0] + '</span>' + icon('plus') + '</summary><p>' + q[1] + '</p></details>';
    }).join('') + '</div></div></section>' +
    '<section class="sec join" id="join"><div class="wrap"><div class="join-in"><div class="join-text rv"><p class="eyebrow">' + J.eyebrow + '</p><h2>' + J.title + '</h2><p class="lede">' + J.body + '</p><p class="alt">' + J.alt + ' ' + mail + '</p></div>' +
      '<form class="form rv" novalidate><fieldset class="seg"><legend class="sr">' + J.segLabel + '</legend>' +
        '<label><input type="radio" name="intent" value="0" checked><span>' + J.seg[0] + '</span></label><label><input type="radio" name="intent" value="1"><span>' + J.seg[1] + '</span></label></fieldset>' +
        '<label for="f-name">' + J.fName + '</label><input id="f-name" name="name" autocomplete="name" required>' +
        '<label for="f-email">' + J.fEmail + '</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" dir="ltr" required>' +
        '<label for="f-msg">' + J.fMsg + ' <small data-opt>(' + J.optional + ')</small></label><textarea id="f-msg" name="message" rows="4"></textarea>' +
        '<button class="btn btn-primary" type="submit" data-wait><span data-send>' + J.send[0] + '</span>' + icon('arrow', 'ar') + '</button><p class="form-status" role="status" aria-live="polite"></p></form>' +
    '</div></div></section>' +
    '</main>' +
    '<footer class="site-foot"><div class="wrap"><div class="foot-top"><div class="brand">' + star() + '<span class="wordmark">ItriPay</span></div><p class="foot-tag">' + T.footer.tag + '</p>' + slogan('foot-slogan') + '</div>' +
      '<div class="foot-bot"><nav aria-label="Footer">' + nav + '</nav><p>' + T.footer.contact + ': ' + mail + '</p><div class="lang" role="group" aria-label="' + T.langLabel + '">' + langs + '</div><p class="copy">' + T.footer.note + '</p></div></div></footer>';

  var heroEl = $('.hero');

  /* ---------- the four values ----------
     The star picks the next point by itself every few seconds (the newly lit point plays a small "press").
     A click, tap, hover or keyboard focus on any point or chip selects that value and holds the automatic
     cycle for a few seconds; then it carries on from there. */
  var curV = 0, holdUntil = 0, CYCLE = 3400, HOLD = 6000;
  function setValue(i) {
    curV = i;
    $$('[data-v]').forEach(function (el) { el.classList.toggle('on', +el.dataset.v === i); });
    $$('[data-vtext]').forEach(function (el) { el.textContent = T.values[i][el.dataset.vtext]; });
  }
  function userValue(i) { holdUntil = Date.now() + HOLD; setValue(i); }
  function trig(e) { var t = e.target.closest && e.target.closest('.vtrig'); return t ? +t.dataset.v : -1; }
  document.addEventListener('pointerover', function (e) { if (e.pointerType === 'mouse') { var i = trig(e); if (i >= 0) userValue(i); } });
  document.addEventListener('focusin', function (e) { var i = trig(e); if (i >= 0) userValue(i); });
  document.addEventListener('click', function (e) {
    var i = trig(e); if (i < 0) return; userValue(i);
    var s = e.target.closest('svg.star'); if (s) spinOnce(s);
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('blade')) { e.preventDefault(); userValue(+e.target.dataset.v); spinOnce(e.target.closest('svg.star')); }
  });
  setValue(0);
  if (!reduce) setInterval(function () { if (document.hidden || Date.now() < holdUntil) return; setValue((curV + 1) % 4); }, CYCLE);

  function spinOnce(el) {
    if (reduce || !el) return;
    el._r = (el._r || 0) + 360; el.style.transition = 'transform .9s cubic-bezier(.2,.8,.2,1)'; el.style.transform = 'rotate(' + el._r + 'deg)';
  }

  /* ---------- header star: a spinner. Hover = spin up and hold; leave = coast to a stop; tap = one push ---------- */
  (function () {
    var b = $('.logo-spin'), sv = $('svg', b); if (reduce) return;
    var ang = 0, vel = 0, target = 0, run = false, last = 0, TOP = 460;
    function frame(t) {
      var dt = Math.min(0.05, (t - last) / 1000); last = t;
      vel += (target - vel) * Math.min(1, dt * (target > vel ? 5 : 1.5));   /* quick to start, slow to let go */
      ang += vel * dt; sv.style.transform = 'rotate(' + ang.toFixed(2) + 'deg)';
      if (target === 0 && vel < 40) {            /* nearly stopped: settle on the next upright position */
        run = false; ang = Math.ceil(ang / 90) * 90;
        sv.style.transition = 'transform .7s cubic-bezier(.2,.7,.2,1)'; sv.style.transform = 'rotate(' + ang + 'deg)';
        return;
      }
      requestAnimationFrame(frame);
    }
    function go() { if (run) return; run = true; sv.style.transition = 'none'; last = performance.now(); requestAnimationFrame(frame); }
    b.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { target = TOP; go(); } });
    b.addEventListener('pointerleave', function () { target = 0; });
    b.addEventListener('click', function () { vel = Math.max(vel, 1100); go(); });
  })();

  /* ---------- header: transparent only at the very top, opaque as soon as the page moves ---------- */
  var headEl = $('.site-head');
  if (!shot && hasIO) new IntersectionObserver(function (en) { headEl.classList.toggle('scrolled', !en[0].isIntersecting); }).observe($('#top-mark'));

  /* ---------- reveal on scroll ---------- */
  if (!reduce && hasIO) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  }

  /* ---------- cards: a light follows the cursor across the card under it (mouse only) ---------- */
  if (fine && !reduce) {
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.card'); if (!c) return;
      var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- starfield: one small canvas, 30fps, paused off-screen ---------- */
  (function () {
    var c = $('canvas.sky'), ctx = c.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = 0, h = 0, stars = [], run = false, last = 0, sh = null, nextSh = 1400;
    var seed = 7; function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    function size() {
      var nw = heroEl.clientWidth, nh = heroEl.clientHeight; if (nw === w && Math.abs(nh - h) < 120) return;
      w = nw; h = nh; c.width = w * dpr; c.height = h * dpr; seed = 7;
      var n = Math.min(190, Math.round(w * h / 7000)); stars = [];
      for (var i = 0; i < n; i++) stars.push({ x: rnd() * w, y: rnd() * h, r: rnd() * 1.2 + 0.35, p: rnd() * 6.28, s: rnd() * 1.2 + 0.4, a: rnd() * 0.55 + 0.35 });
      draw(0);
    }
    function trail(x, y, len, k) {
      var g = ctx.createLinearGradient(x, y, x - len, y - len * 0.42);
      g.addColorStop(0, 'rgba(255,255,255,' + k + ')'); g.addColorStop(0.3, 'rgba(190,215,255,' + (k * 0.5) + ')'); g.addColorStop(1, 'rgba(190,215,255,0)');
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - len, y - len * 0.42); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,' + k + ')'; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.2832); ctx.fill();
    }
    function draw(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#fff';
      for (var i = 0; i < stars.length; i++) { var s = stars[i]; ctx.globalAlpha = s.a * (reduce ? 1 : 0.55 + 0.45 * Math.sin(s.p + t * 0.0012 * s.s)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill(); }
      if (shot) { trail(w * 0.36, h * 0.2, 190, 0.9); return; }
      if (sh) {
        var k = (t - sh.t) / 1100; if (k >= 1) sh = null; else trail(sh.x + k * sh.d, sh.y + k * sh.d * 0.42, 90 + 150 * Math.sin(k * 3.1416), Math.sin(k * 3.1416));
      } else if (t > nextSh) { sh = { t: t, x: rnd() * w * 0.55, y: rnd() * h * 0.4, d: 320 + rnd() * 260 }; nextSh = t + 3200 + rnd() * 3600; }
    }
    function loop(t) { if (!run) return; if (t - last > 33) { last = t; draw(t); } requestAnimationFrame(loop); }
    function set(on) { on = on && !reduce && !document.hidden; if (on && !run) { run = true; requestAnimationFrame(loop); } else if (!on) run = false; }
    size();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    if (hasIO) new IntersectionObserver(function (en) { set(en[0].isIntersecting); }).observe(heroEl); else set(true);
    document.addEventListener('visibilitychange', function () { set(!document.hidden); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
  })();

  /* ---------- waitlist threads: one component for every [data-wait] button ----------
     Mouse only. When the cursor comes within REACH of a waitlist button, a few roots grow from the button's edge
     toward it: curved, thick at the base, hair-thin at the tip, with small side branches. They trail the cursor
     with a little delay and sway. Closer cursor = longer and brighter, and the button leans toward it. When the
     cursor lands on the button they are drawn back in with a soft glow; when it leaves they retract.
     Drawing layer: ONE fixed, full-screen canvas above everything (header included) that never takes clicks.
     It is created when the effect starts, cleared in full every frame and removed as soon as the effect is idle.
     Every frame re-reads every button's position, so it keeps working while the page scrolls.
     Colour follows the background: white on blue, blue on light sections, gold in Premium.
     Touch: CSS gives the button a soft pulse instead. prefers-reduced-motion: nothing at all. */
  (function () {
    if (!fine || reduce) return;
    var REACH = 150, MAXLEN = 92, N = 6, OFF = -1e5;
    var LK = [0.6, 0.88, 1, 0.94, 0.76, 0.52];          /* each root's share of the full length */
    var LAG = [0.10, 0.17, 0.24, 0.19, 0.13, 0.09];     /* how quickly each tip follows */
    var mx = OFF, my = OFF, fx = OFF, fy = OFF, cur = null, cv = null, ctx = null, col = '255,255,255', light = false;
    var p = 0, run = false, queued = false, tips = [], lx = 0, ly = 0, absorbed = false, W = 0, H = 0, dpr = 1;

    function gap(r) { var dx = Math.max(r.left - mx, 0, mx - r.right), dy = Math.max(r.top - my, 0, my - r.bottom); return Math.sqrt(dx * dx + dy * dy); }
    function nearest() {
      var best = null, bd = REACH, bs = $$('[data-wait]');
      for (var i = 0; i < bs.length; i++) {
        var r = bs[i].getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight) continue;
        if (bs[i] === cur) r = { left: r.left - lx, top: r.top - ly, right: r.right - lx, bottom: r.bottom - ly };   /* without our own lean */
        var d = gap(r); if (d < bd) { bd = d; best = bs[i]; }
      }
      return best ? { b: best, d: bd } : null;
    }
    function colour(b) {
      if (b.dataset.thread) { light = false; return b.dataset.thread; }                 /* gold, set on the Premium button */
      if (b.closest('.hero') || b.closest('.site-head')) { light = false; return '255,255,255'; }  /* the header is always blue */
      light = true; return '20,82,204';                                                  /* --blue, on light sections */
    }
    function size() {
      var w = innerWidth, h = innerHeight, d = Math.min(window.devicePixelRatio || 1, 2);
      if (w === W && h === H && d === dpr) return;
      W = w; H = h; dpr = d; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    }
    function mount() {
      cv = document.createElement('canvas'); cv.className = 'threads'; cv.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cv); ctx = cv.getContext('2d'); W = H = 0; size();
    }
    function attach(b) {
      cur = b; col = colour(b); b.classList.add('pulled'); b.style.setProperty('--glow', 'rgb(' + col + ')');
      tips = []; fx = mx; fy = my; p = 0; lx = ly = 0; absorbed = false;
    }
    function detach() { if (cur) { cur.style.transform = ''; cur.classList.remove('pulled'); } cur = null; p = 0; lx = ly = 0; }
    function unmount() {
      detach();
      if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
      cv = ctx = null; run = false;
    }

    function root(bx, by, tx, ty, k, t, a0) {
      var dx = tx - bx, dy = ty - by, L = Math.sqrt(dx * dx + dy * dy); if (L < 2) return;
      var ux = dx / L, uy = dy / L, nx = -uy, ny = ux, o = k - (N - 1) / 2;
      var s1 = Math.sin(t * 0.0031 + k * 1.7) * L * 0.17 + o * L * 0.05;
      var s2 = Math.sin(t * 0.0023 + k * 2.9 + 1) * L * 0.13 - o * L * 0.03;
      var c1x = bx + ux * L * 0.33 + nx * s1, c1y = by + uy * L * 0.33 + ny * s1;
      var c2x = bx + ux * L * 0.70 + nx * s2, c2y = by + uy * L * 0.70 + ny * s2;
      var M = 14, xs = [], ys = [], i, q, m;
      for (i = 0; i <= M; i++) {
        q = i / M; m = 1 - q;
        xs.push(m * m * m * bx + 3 * m * m * q * c1x + 3 * m * q * q * c2x + q * q * q * tx);
        ys.push(m * m * m * by + 3 * m * m * q * c1y + 3 * m * q * q * c2y + q * q * q * ty);
      }
      /* a tapered ribbon: thick where it leaves the button, a hair at the tip */
      var w0 = (1.3 + 1.5 * LK[k]) * (0.55 + 0.45 * p) + (light ? 0.3 : 0), L1 = [], R1 = [];
      for (i = 0; i <= M; i++) {
        var j0 = Math.max(0, i - 1), j1 = Math.min(M, i + 1), ex = xs[j1] - xs[j0], ey = ys[j1] - ys[j0], el = Math.sqrt(ex * ex + ey * ey) || 1;
        var w = w0 * Math.pow(1 - i / M, 1.5) + (light ? 0.35 : 0.22), px = -ey / el * w, py = ex / el * w;
        L1.push([xs[i] + px, ys[i] + py]); R1.push([xs[i] - px, ys[i] - py]);
      }
      var g = ctx.createLinearGradient(bx, by, tx, ty);
      g.addColorStop(0, 'rgba(' + col + ',' + a0 + ')'); g.addColorStop(1, 'rgba(' + col + ',' + (a0 * 0.55) + ')');
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(L1[0][0], L1[0][1]);
      for (i = 1; i <= M; i++) ctx.lineTo(L1[i][0], L1[i][1]);
      for (i = M; i >= 0; i--) ctx.lineTo(R1[i][0], R1[i][1]);
      ctx.closePath(); ctx.fill();
      /* small side branches, curling away from the stem */
      if (L > 24) {
        ctx.strokeStyle = 'rgba(' + col + ',' + (a0 * 0.65) + ')'; ctx.lineWidth = light ? 1.1 : 0.9;
        [5, 9].forEach(function (ix, n) {
          var ex2 = xs[ix + 1] - xs[ix - 1], ey2 = ys[ix + 1] - ys[ix - 1], ang = Math.atan2(ey2, ex2) + ((k + n) % 2 ? 1 : -1) * (0.75 + 0.2 * Math.sin(t * 0.002 + k + n));
          var bl = Math.min(17, L * (n ? 0.16 : 0.24)), hx = xs[ix] + Math.cos(ang) * bl, hy = ys[ix] + Math.sin(ang) * bl;
          ctx.beginPath(); ctx.moveTo(xs[ix], ys[ix]); ctx.quadraticCurveTo(xs[ix] + ex2 * 0.9, ys[ix] + ey2 * 0.9, hx, hy); ctx.stroke();
        });
      }
      ctx.fillStyle = 'rgba(' + col + ',' + a0 + ')'; ctx.beginPath(); ctx.arc(tx, ty, 0.9 + 0.7 * p, 0, 6.2832); ctx.fill();
    }

    function frame(t) {
      if (!cv) return;
      size();
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);   /* the whole layer, every frame */
      var n = nearest();
      /* switch to a nearer button only once the current threads have pulled back in */
      if (n && n.b !== cur && (!cur || p < 0.05)) { detach(); if (n.d > 0) attach(n.b); }
      if (!cur) { if (!n) { unmount(); return; } requestAnimationFrame(frame); return; }
      var r = cur.getBoundingClientRect();
      if (!r.width || !cur.hasAttribute('data-wait')) { unmount(); return; }
      var left = r.left - lx, top = r.top - ly, wdt = r.width, hgt = r.height;          /* the resting box, without the lean */
      var d = gap({ left: left, top: top, right: left + wdt, bottom: top + hgt });
      var mine = n && n.b === cur, touching = mine && d === 0;
      var target = (mine && !touching) ? Math.max(0, 1 - d / REACH) : 0;               /* 0 far … 1 at the edge */
      if (touching && !absorbed && p > 0.1) { absorbed = true; cur.classList.remove('absorb'); void cur.offsetWidth; cur.classList.add('absorb'); }
      if (!touching) absorbed = false;
      p += (target - p) * (target > p ? 0.085 : touching ? 0.3 : 0.13);
      if (target === 0 && p < 0.006) {
        detach();
        if (n && n.d > 0) { requestAnimationFrame(frame); return; }
        unmount(); return;
      }
      fx += (mx - fx) * 0.17; fy += (my - fy) * 0.17;                                   /* the cursor, a moment ago */

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(' + col + ',' + ((light ? 0.25 : 0.6) * p) + ')'; ctx.shadowBlur = light ? 3 : 7;
      var cx = left + wdt / 2, cy = top + hgt / 2, rad = hgt / 2, ax = left + rad, bxm = left + wdt - rad;
      var vx = fx - cx, vy = fy - cy, vl = Math.sqrt(vx * vx + vy * vy) || 1; vx /= vl; vy /= vl;
      var ease = p * (2 - p), a0 = Math.min(1, (light ? 0.35 : 0.2) + 0.95 * p);
      for (var k = 0; k < N; k++) {
        var o = k - (N - 1) / 2, qx = fx - vy * o * 26, qy = fy + vx * o * 26;
        var sx = Math.max(ax, Math.min(bxm, qx)), ex = qx - sx, ey = qy - cy, el = Math.sqrt(ex * ex + ey * ey) || 1;
        var bx = sx + ex / el * rad, by = cy + ey / el * rad;                           /* where this root leaves the pill */
        var tx = fx - bx, ty = fy - by, tl = Math.sqrt(tx * tx + ty * ty) || 1;
        var len = Math.min(tl, MAXLEN * LK[k]) * ease;
        var gx = bx + tx / tl * len, gy = by + ty / tl * len;
        if (!tips[k]) tips[k] = [bx, by];
        var lag = touching ? 0.34 : LAG[k];
        tips[k][0] += (gx - tips[k][0]) * lag; tips[k][1] += (gy - tips[k][1]) * lag;
        root(bx, by, tips[k][0], tips[k][1], k, t, a0);
      }
      /* the button leans toward the cursor */
      lx = vx * 5.5 * p; ly = vy * 4 * p;
      cur.style.transform = 'translate(' + lx.toFixed(2) + 'px,' + ly.toFixed(2) + 'px) rotate(' + (vx * 1.1 * p).toFixed(2) + 'deg)';
      requestAnimationFrame(frame);
    }

    /* start the loop when the cursor moves, or when the page scrolls a button toward a cursor that is standing still */
    function wake() {
      if (run || queued || mx === OFF) return; queued = true;
      requestAnimationFrame(function (t) {
        queued = false; if (run) return;
        var n = nearest(); if (!n || n.d === 0) return;
        run = true; mount(); frame(t);
      });
    }
    document.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; mx = e.clientX; my = e.clientY; wake(); }, { passive: true });
    window.addEventListener('scroll', wake, { passive: true });
    function away() { mx = my = OFF; }
    document.documentElement.addEventListener('mouseleave', away);
    window.addEventListener('blur', away);
    window.addEventListener('pagehide', unmount);
    document.addEventListener('visibilitychange', function () { if (document.hidden) unmount(); });
  })();

  /* ---------- Premium: the 49 counts up once when it scrolls into view ---------- */
  (function () {
    var el = $('[data-count]'); if (reduce || !hasIO) return;
    var to = +el.dataset.count; el.textContent = '0';
    var o = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; o.disconnect();
      var t0 = 0, D = 1200;
      requestAnimationFrame(function step(t) {
        if (!t0) t0 = t; var k = Math.min(1, (t - t0) / D);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    o.observe(el);
  })();

  /* ---------- credit carnet: a short loop — a reminder goes out, a debt is paid, the total drops ---------- */
  (function () {
    var cn = $('.carnet'), rows = $$('li', cn), tot = $('[data-total]', cn);
    if (reduce || !hasIO) { cn.classList.add('static'); return; }
    var timers = [], vis = false;
    function later(f, ms) { timers.push(setTimeout(f, ms)); }
    function count(from, to) {
      var t0 = 0; requestAnimationFrame(function s(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 700); tot.textContent = (from + (to - from) * k).toFixed(2); if (k < 1 && vis) requestAnimationFrame(s); });
    }
    function reset() {
      cn.classList.remove('sms'); rows.forEach(function (r) { r.classList.remove('nudge', 'paid'); var em = $('em', r), sm = $('small', r); em.textContent = em.dataset.bal; sm.textContent = sm.dataset.note; });
      tot.textContent = '842.50';
    }
    function play() {
      reset();
      later(function () { rows[2].classList.add('nudge'); cn.classList.add('sms'); }, 1600);
      later(function () { rows[2].classList.remove('nudge'); }, 3400);
      later(function () { rows[0].classList.add('paid'); $('em', rows[0]).textContent = '0.00'; $('small', rows[0]).textContent = A.paid; count(842.5, 756.5); }, 4200);
      later(function () { if (vis) play(); }, 8200);
    }
    new IntersectionObserver(function (en) {
      vis = en[0].isIntersecting; timers.forEach(clearTimeout); timers = [];
      if (vis) play();
    }, { threshold: 0.35 }).observe(cn);
  })();

  /* ---------- form (prototype: validates, never sends) ---------- */
  var form = $('.form'), status = $('.form-status'), submit = $('button[type=submit]', form);
  form.addEventListener('change', function (e) {
    if (e.target.name !== 'intent') return; var k = +e.target.value;
    $('[data-send]').textContent = J.send[k]; $('[data-opt]').hidden = k === 1; status.textContent = '';
    if (k === 0) submit.setAttribute('data-wait', ''); else submit.removeAttribute('data-wait');
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var k = +form.intent.value, ok = form.name.value.trim() && form.email.checkValidity() && form.email.value;
    status.className = 'form-status ' + (ok ? 'ok' : 'bad');
    if (!ok) { status.textContent = J.invalid; (form.name.value.trim() ? form.email : form.name).focus(); return; }
    if (k === 1 && !form.message.value.trim()) { status.className = 'form-status bad'; status.textContent = J.invalidMsg; form.message.focus(); return; }
    status.textContent = J.proto;
  });

  if (shot) (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
    setTimeout(function () { root.setAttribute('data-h', Math.ceil(document.body.getBoundingClientRect().height)); }, 300);
  });
})();
