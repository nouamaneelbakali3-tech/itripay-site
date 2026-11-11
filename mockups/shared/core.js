/* ItriPay prototypes — shared engine. No libraries. ~9 KB.
   ?lang=en|fr|ar   language
   ?shot=1          static mode for full-page captures (no motion, fixed hero height) */
(function () {
  'use strict';
  var qs = new URLSearchParams(location.search);
  var lang = ['en', 'fr', 'ar'].indexOf(qs.get('lang')) >= 0 ? qs.get('lang') : 'en';
  var shot = qs.has('shot');
  var T = window.ITRI[lang], D = window.ITRI_DIR, root = document.documentElement;
  root.lang = lang; root.dir = T.dir;
  if (shot) root.classList.add('shot');
  var reduce = shot || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) root.classList.add('motion');
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- the star, traced from assets/source/itripay-logo.png ---------- */
  var BLADE = 'M0 -588 L119 -221 Q132 -171 94 -138 L34 -91 Q14 -76 22 -46 L-297 -298 L-176 -252 Q-116 -231 -98 -286 Z';
  var FACET = 'M0 -588 V-232 Q0 -176 -52 -172 Q-70 -171 -88 -181 L-297 -298 L-176 -252 Q-116 -231 -98 -286 Z';
  function star(cls, interactive) {
    var b = [0, 1, 2, 3].map(function (i) {
      var a = interactive ? ' class="blade vtrig" data-v="' + i + '" role="button" tabindex="0" aria-label="' + T.values[i].name + '"' : ' class="blade" data-v="' + i + '"';
      return '<g transform="rotate(' + i * 90 + ')"><g' + a + '><path class="b-fill" d="' + BLADE + '"/><path class="b-facet" d="' + FACET + '"/><path class="b-line" d="' + BLADE + '" pathLength="1"/></g></g>';
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
    device: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10M12 16v4M7 9h4M7 12h7"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18h3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    back: '<path d="M21 5H9l-6 7 6 7h12zM17 9l-5 6M12 9l5 6"/>'
  };
  function icon(n, cls) { return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + '</svg>'; }

  /* ---------- phone with four app screens (HTML recreations of the app's screens) ---------- */
  function phone() {
    var a = T.app, amt = '<b>120.00</b> <i>' + a.cur + '</i>';
    var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map(function (k) { return '<span>' + k + '</span>'; }).join('') + '<span>' + icon('back') + '</span>';
    var rows = a.c.map(function (c) { return '<li><span><b>' + c[0] + '</b><small>' + c[1] + '</small></span><em>' + c[2] + '</em></li>'; }).join('');
    var bar = '<div class="a-bar"><span class="a-dot"></span>' + a.shop + '</div>';
    return '<div class="phone" aria-hidden="true"><div class="phone-in"><div class="phone-cam"></div><div class="phone-screen">' +
      '<div class="screen s-nfc" data-v="0">' + bar + '<div class="a-amt">' + amt + '</div><div class="a-rings"><i></i><i></i><i></i>' + icon('tap') + '</div><p class="a-hint">' + a.nfc + '</p></div>' +
      '<div class="screen s-key" data-v="1">' + bar + '<div class="a-lab">' + a.amount + '</div><div class="a-amt">' + amt + '</div><div class="a-keys">' + keys + '</div><div class="a-btn">' + a.pay + '</div></div>' +
      '<div class="screen s-rec" data-v="2">' + bar + '<div class="a-ok">' + icon('check') + '</div><div class="a-paid">' + a.paid + '</div><div class="a-amt">' + amt + '</div><dl><div><dt>' + a.date + '</dt><dd>' + a.dateV + '</dd></div><div><dt>' + a.method + '</dt><dd>' + a.methodV + '</dd></div><div><dt>' + a.ref + '</dt><dd>IP-0417</dd></div></dl><p class="a-hint">' + a.thanks + '</p></div>' +
      '<div class="screen s-led" data-v="3">' + bar + '<div class="a-tot"><span>' + a.credit + ' · ' + a.total + '</span><b>842.50 <i>' + a.cur + '</i></b></div><ul>' + rows + '</ul><div class="a-sms">' + icon('check') + a.sms + '</div></div>' +
      '</div></div></div>';
  }

  function slogan(cls) {
    return '<ul class="slogan ' + (cls || '') + '">' + T.values.map(function (v, i) {
      return '<li><button type="button" class="vtrig sl" data-v="' + i + '">' + v.name + '</button></li>';
    }).join('') + '</ul>';
  }
  function head(o, extra) {
    return '<header class="sec-head rv"><p class="eyebrow">' + o.eyebrow + '</p><h2>' + o.title + '</h2>' + (o.sub ? '<p class="lede">' + o.sub + '</p>' : '') + (extra || '') + '</header>';
  }
  function cards(items, cls) {
    return '<ul class="' + cls + '">' + items.map(function (it, i) {
      return '<li class="card rv" style="--i:' + i + '"><span class="ico">' + icon(it[0]) + '</span><h3>' + it[1] + '</h3><p>' + it[2] + '</p></li>';
    }).join('') + '</ul>';
  }
  function btn(label, href, kind) { return '<a class="btn ' + (kind || 'btn-primary') + '" href="' + href + '"><span>' + label + '</span>' + icon('arrow', 'ar') + '</a>'; }
  var H = { T: T, star: star, glyph: glyph, phone: phone, icon: icon, slogan: slogan, btn: btn, head: head };

  /* ---------- page ---------- */
  var langs = [['en', 'EN'], ['fr', 'FR'], ['ar', 'ع']].map(function (l) {
    return '<a href="?lang=' + l[0] + '"' + (l[0] === lang ? ' aria-current="true"' : '') + ' lang="' + l[0] + '">' + l[1] + '</a>';
  }).join('');
  var nav = ['how', 'features', 'pricing', 'faq'].map(function (k) { return '<a href="#' + k + '">' + T.nav[k] + '</a>'; }).join('');
  var P = T.pricing, J = T.join;

  $('#app').innerHTML =
    '<a class="skip" href="#main">' + T.skip + '</a>' +
    '<header class="site-head"><div class="wrap">' +
      '<div class="brand"><button type="button" class="logo-spin" aria-label="' + T.spinLabel + '">' + star('draw') + '</button><a href="#top" class="wordmark">ItriPay</a></div>' +
      '<nav class="nav" aria-label="Main">' + nav + '</nav>' +
      '<div class="head-end"><div class="lang" role="group" aria-label="' + T.langLabel + '">' + langs + '</div><a class="btn btn-sm" href="#join">' + T.cta + '</a></div>' +
    '</div></header>' +
    '<main id="main">' +
    '<section class="hero" id="top"><canvas class="sky" aria-hidden="true"></canvas>' + D.hero(H) + '</section>' +
    '<section class="values" id="values">' + D.values(H) + '</section>' +
    '<section class="sec problem" id="problem"><div class="wrap">' + head(T.problem) + cards(T.problem.items, 'grid-3') + '</div></section>' +
    '<section class="sec how" id="how"><div class="wrap">' + head(T.how) + '<ol class="steps">' + T.how.steps.map(function (s, i) {
      return '<li class="rv" style="--i:' + i + '"><span class="step-n">' + (i + 1) + '</span><h3>' + s[0] + '</h3><p>' + s[1] + '</p></li>';
    }).join('') + '</ol></div></section>' +
    '<section class="sec features" id="features"><div class="wrap">' + head(T.features) + cards(T.features.items, 'grid-feat') + '</div></section>' +
    '<section class="sec who" id="who"><div class="wrap">' + head(T.who) + cards(T.who.items, 'grid-4') + '</div></section>' +
    '<section class="sec pricing" id="pricing"><div class="wrap"><div class="price-card rv">' +
      '<div class="price-main"><p class="eyebrow">' + P.eyebrow + '</p><h2>' + P.title + '</h2>' +
        '<p class="price"><b>49</b><span>' + P.cur + ' <small>' + P.per + '</small></span></p>' +
        '<p class="nodevice">' + icon('phone') + '<span><b>' + P.nodevice + '</b> ' + P.nodeviceSub + '</span></p>' +
        '<p class="rule">' + P.rule + '</p><p class="rule-how">' + P.how + '</p>' + btn(T.cta, '#join') + '</div>' +
      '<div class="price-inc"><h3>' + P.incTitle + '</h3><ul>' + P.inc.map(function (x) { return '<li>' + icon('check') + '<span>' + x + '</span></li>'; }).join('') + '</ul></div>' +
    '</div></div></section>' +
    '<section class="sec partners" id="partners"><div class="wrap"><div class="partners-in rv"><div><p class="eyebrow">' + T.partners.eyebrow + '</p><h2>' + T.partners.title + '</h2><p class="lede">' + T.partners.body + '</p>' + btn(T.partners.cta, '#join', 'btn-light') + '</div>' +
      '<ul class="plist">' + T.partners.points.map(function (x, i) { return '<li>' + glyph(i) + '<span>' + x + '</span></li>'; }).join('') + '</ul></div></div></section>' +
    '<section class="sec name" id="name"><div class="wrap"><div class="name-in rv"><div class="name-star">' + star() + '<span class="tifinagh" lang="zgh" aria-hidden="true">ⵉⵜⵔⵉ</span></div><div><p class="eyebrow">' + T.name.eyebrow + '</p><h2>' + T.name.title + '</h2><p class="lede">' + T.name.body + '</p><p class="name-foot">' + T.name.foot + '</p>' + slogan('on-light') + '</div></div></div></section>' +
    '<section class="sec faq" id="faq"><div class="wrap">' + head(T.faq) + '<div class="faq-list">' + T.faq.items.map(function (q, i) {
      return '<details class="rv" style="--i:' + i + '"' + (shot && i === 0 ? ' open' : '') + '><summary><span>' + q[0] + '</span>' + icon('plus') + '</summary><p>' + q[1] + '</p></details>';
    }).join('') + '</div></div></section>' +
    '<section class="sec join" id="join"><div class="wrap"><div class="join-in"><div class="join-text rv"><p class="eyebrow">' + J.eyebrow + '</p><h2>' + J.title + '</h2><p class="lede">' + J.body + '</p><p class="alt">' + J.alt + ' <a href="mailto:support@itripay.com">support@itripay.com</a></p></div>' +
      '<form class="form rv" novalidate><fieldset class="seg"><legend class="sr">' + J.segLabel + '</legend>' +
        '<label><input type="radio" name="intent" value="0" checked><span>' + J.seg[0] + '</span></label><label><input type="radio" name="intent" value="1"><span>' + J.seg[1] + '</span></label></fieldset>' +
        '<label for="f-name">' + J.fName + '</label><input id="f-name" name="name" autocomplete="name" required>' +
        '<label for="f-email">' + J.fEmail + '</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" dir="ltr" required>' +
        '<label for="f-msg">' + J.fMsg + ' <small data-opt>(' + J.optional + ')</small></label><textarea id="f-msg" name="message" rows="4"></textarea>' +
        '<button class="btn btn-primary" type="submit"><span data-send>' + J.send[0] + '</span>' + icon('arrow', 'ar') + '</button><p class="form-status" role="status" aria-live="polite"></p></form>' +
    '</div></div></section>' +
    '</main>' +
    '<footer class="site-foot"><div class="wrap"><div class="foot-top"><div class="brand">' + star() + '<span class="wordmark">ItriPay</span></div><p class="foot-tag">' + T.footer.tag + '</p>' + slogan('foot-slogan') + '</div>' +
      '<div class="foot-bot"><nav aria-label="Footer">' + nav + '</nav><p>' + T.footer.contact + ': <a href="mailto:support@itripay.com">support@itripay.com</a></p><div class="lang" role="group" aria-label="' + T.langLabel + '">' + langs + '</div><p class="copy">' + T.footer.note + '</p></div></div></footer>';

  /* ---------- the four values: one state, many listeners ---------- */
  var auto = null;
  function setValue(i) {
    $$('[data-v]').forEach(function (el) { el.classList.toggle('on', +el.dataset.v === i); });
    $$('[data-vtext]').forEach(function (el) { el.textContent = T.values[i][el.dataset.vtext]; });
    $$('[data-vnum]').forEach(function (el) { el.textContent = '0' + (i + 1); });
    document.body.dataset.value = i;
  }
  function userValue(i) { if (auto) { clearInterval(auto); auto = null; } setValue(i); }
  function trig(e) { var t = e.target.closest && e.target.closest('.vtrig'); return t ? +t.dataset.v : -1; }
  document.addEventListener('pointerover', function (e) { if (e.pointerType === 'mouse') { var i = trig(e); if (i >= 0) userValue(i); } });
  document.addEventListener('focusin', function (e) { var i = trig(e); if (i >= 0) userValue(i); });
  document.addEventListener('click', function (e) {
    var i = trig(e); if (i < 0) return; userValue(i);
    var s = e.target.closest('svg.star'); if (s) spin(s);
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('blade')) { e.preventDefault(); userValue(+e.target.dataset.v); spin(e.target.closest('svg.star')); }
  });
  setValue(0);
  if (!reduce) { var n = 0; auto = setInterval(function () { n = (n + 1) % 4; setValue(n); }, 3200); }
  window.ITRI_setValue = userValue;

  /* ---------- spin ---------- */
  function spin(el) {
    if (reduce || !el) return;
    el._r = (el._r || 0) + 360; el.style.transition = 'transform .9s cubic-bezier(.2,.8,.2,1)'; el.style.transform = 'rotate(' + el._r + 'deg)';
  }
  $('.logo-spin').addEventListener('click', function () { spin($('.logo-spin svg')); });

  /* ---------- header state ---------- */
  var headEl = $('.site-head'), heroEl = $('.hero');
  if (!shot && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { headEl.classList.toggle('scrolled', !en[0].isIntersecting); }, { rootMargin: '-72px 0px 0px 0px' }).observe(heroEl);
  }

  /* ---------- reveal on scroll ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  }

  /* ---------- tilt (mouse only) + card light ---------- */
  if (fine && !reduce) {
    $$('[data-tiltzone]').forEach(function (zone) {
      var r, tx = 0, ty = 0, raf = 0, ph = $$('.phone', zone);
      function apply() { raf = 0; ph.forEach(function (p) { p.style.setProperty('--ry', (tx * 16).toFixed(2) + 'deg'); p.style.setProperty('--rx', (-ty * 12).toFixed(2) + 'deg'); }); zone.style.setProperty('--px', tx.toFixed(3)); zone.style.setProperty('--py', ty.toFixed(3)); }
      zone.addEventListener('pointerenter', function () { r = zone.getBoundingClientRect(); });
      zone.addEventListener('pointermove', function (e) { if (!r) r = zone.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; if (!raf) raf = requestAnimationFrame(apply); });
      zone.addEventListener('pointerleave', function () { tx = ty = 0; r = null; if (!raf) raf = requestAnimationFrame(apply); });
    });
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.card'); if (!c) return;
      var b = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - b.left) + 'px'); c.style.setProperty('--my', (e.clientY - b.top) + 'px');
    }, { passive: true });
  }

  /* ---------- starfield: one small canvas, 30fps, paused off-screen ---------- */
  (function () {
    var c = $('canvas.sky'); if (!c) return;
    var ctx = c.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = 0, h = 0, stars = [], run = false, last = 0, sh = null, nextSh = 4000;
    var seed = 7; function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    function size() {
      var nw = heroEl.clientWidth, nh = heroEl.clientHeight; if (nw === w && Math.abs(nh - h) < 120) return;
      w = nw; h = nh; c.width = w * dpr; c.height = h * dpr; seed = 7;
      var n = Math.min(170, Math.round(w * h / 8500)); stars = [];
      for (var i = 0; i < n; i++) stars.push({ x: rnd() * w, y: rnd() * h, r: rnd() * 1.1 + 0.35, p: rnd() * 6.28, s: rnd() * 1.2 + 0.4, a: rnd() * 0.55 + 0.3 });
      draw(0);
    }
    function draw(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#fff';
      for (var i = 0; i < stars.length; i++) { var s = stars[i]; ctx.globalAlpha = s.a * (reduce ? 1 : 0.6 + 0.4 * Math.sin(s.p + t * 0.0012 * s.s)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill(); }
      if (sh) {
        var k = (t - sh.t) / 800; if (k >= 1) { sh = null; } else {
          var x = sh.x + k * sh.d, y = sh.y + k * sh.d * 0.45, g = ctx.createLinearGradient(x, y, x - 110, y - 50);
          g.addColorStop(0, 'rgba(255,255,255,' + (0.9 * (1 - k)) + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 110, y - 50); ctx.stroke();
        }
      } else if (t > nextSh) { sh = { t: t, x: rnd() * w * 0.6, y: rnd() * h * 0.35, d: 260 + rnd() * 200 }; nextSh = t + 6000 + rnd() * 6000; }
    }
    function loop(t) { if (!run) return; if (t - last > 33) { last = t; draw(t); } requestAnimationFrame(loop); }
    function set(on) { on = on && !reduce && !document.hidden; if (on && !run) { run = true; requestAnimationFrame(loop); } else if (!on) run = false; }
    size();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { set(en[0].isIntersecting); }).observe(heroEl); else set(true);
    document.addEventListener('visibilitychange', function () { set(!document.hidden); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
  })();

  /* ---------- form (prototype: validates, never sends) ---------- */
  var form = $('.form'), status = $('.form-status');
  form.addEventListener('change', function (e) {
    if (e.target.name !== 'intent') return; var k = +e.target.value;
    $('[data-send]').textContent = J.send[k]; $('[data-opt]').hidden = k === 1; status.textContent = '';
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var k = +form.intent.value, ok = form.name.value.trim() && form.email.checkValidity() && form.email.value;
    status.className = 'form-status ' + (ok ? 'ok' : 'bad');
    if (!ok) { status.textContent = J.invalid; (form.name.value.trim() ? form.email : form.name).focus(); return; }
    if (k === 1 && !form.message.value.trim()) { status.className = 'form-status bad'; status.textContent = J.invalidMsg; form.message.focus(); return; }
    status.textContent = J.proto;
  });

  if (D.after) D.after(H, { reduce: reduce, shot: shot, fine: fine, $: $, $$: $$, setValue: userValue });

  if (shot) (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
    setTimeout(function () { root.setAttribute('data-h', Math.ceil(document.body.getBoundingClientRect().height)); }, 300);
  });
})();
