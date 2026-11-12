/* ItriPay — site.js. Behaviour only: the markup and every word are in the HTML (tool/build.dart writes
   them per language), so the page reads complete without JavaScript and this file only adds motion and
   the live form. No libraries. Each part checks its own elements, because the sent page uses a few of them.
   prefers-reduced-motion: no motion at all (no .motion class, no canvas loops, no threads). */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) root.classList.add('motion');
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var heroEl = $('.hero');

  /* ---------- the four values ----------
     The star picks the next point by itself every few seconds (the newly lit point plays a small "press").
     A click, tap, hover or keyboard focus on any point or chip selects that value and holds the automatic
     cycle for a few seconds; then it carries on from there. The caption's words come from the hero star's
     points (data-name / data-line). */
  (function () {
    var points = $$('.stage .blade[data-v]');
    if (points.length !== 4) return;
    var curV = 0, holdUntil = 0, CYCLE = 3400, HOLD = 6000;
    function setValue(i) {
      curV = i;
      $$('.vtrig[data-v]').forEach(function (el) { el.classList.toggle('on', +el.dataset.v === i); });
      $$('[data-vtext]').forEach(function (el) { el.textContent = points[i].dataset[el.dataset.vtext]; });
    }
    function userValue(i) { holdUntil = Date.now() + HOLD; setValue(i); }
    function trig(e) { var t = e.target.closest && e.target.closest('.vtrig'); return t ? +t.dataset.v : -1; }
    document.addEventListener('pointerover', function (e) { if (e.pointerType === 'mouse') { var i = trig(e); if (i >= 0) userValue(i); } });
    document.addEventListener('focusin', function (e) { var i = trig(e); if (i >= 0) userValue(i); });
    document.addEventListener('click', function (e) {
      var i = trig(e); if (i < 0) return; userValue(i);
      var s = e.target.closest('svg.star'); if (s && s.getAttribute('role') === 'group') spinOnce(s);
    });
    document.addEventListener('keydown', function (e) {
      var b = e.target.closest && e.target.closest('.blade.vtrig');
      if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); userValue(+b.dataset.v); spinOnce(b.closest('svg.star')); }
    });
    if (!reduce) setInterval(function () { if (document.hidden || Date.now() < holdUntil) return; setValue((curV + 1) % 4); }, CYCLE);
  })();

  function spinOnce(el) {
    if (reduce || !el) return;
    el._r = (el._r || 0) + 360; el.style.transition = 'transform .9s cubic-bezier(.2,.8,.2,1)'; el.style.transform = 'rotate(' + el._r + 'deg)';
  }

  /* ---------- header star: a spinner. Hover = spin up and hold; leave = coast to a stop; tap = one push ---------- */
  (function () {
    var b = $('.logo-spin'); if (!b || reduce) return;
    var sv = $('svg', b), ang = 0, vel = 0, target = 0, run = false, last = 0, TOP = 460;
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

  /* ---------- header: a soft shadow once the page has moved ---------- */
  (function () {
    var head = $('.site-head'), mark = $('#top-mark');
    if (head && mark && hasIO) new IntersectionObserver(function (en) { head.classList.toggle('scrolled', !en[0].isIntersecting); }).observe(mark);
  })();

  /* ---------- reveal on scroll ---------- */
  if (!reduce && hasIO) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- cards: a light follows the cursor across the card under it (mouse only) ---------- */
  if (fine && !reduce) {
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.card'); if (!c) return;
      var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- starfield: one small canvas, 30fps, paused off-screen and in background tabs ---------- */
  (function () {
    var c = $('canvas.sky'); if (!c || !heroEl || !c.getContext) return;
    var ctx = c.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5), w = 0, h = 0, stars = [], run = false, last = 0, sh = null, nextSh = 1400;
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
      if (sh) {
        var k = (t - sh.t) / 1100; if (k >= 1) sh = null; else trail(sh.x + k * sh.d, sh.y + k * sh.d * 0.42, 90 + 150 * Math.sin(k * 3.1416), Math.sin(k * 3.1416));
      } else if (t > nextSh) { sh = { t: t, x: rnd() * w * 0.55, y: rnd() * h * 0.4, d: 320 + rnd() * 260 }; nextSh = t + 3200 + rnd() * 3600; }
    }
    function loop(t) { if (!run) return; if (t - last > 33) { last = t; draw(t); } requestAnimationFrame(loop); }
    function set(on) { on = on && !reduce && !document.hidden; if (on && !run) { run = true; requestAnimationFrame(loop); } else if (!on) run = false; }
    size();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    var visible = true;
    if (hasIO) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; set(visible); }).observe(heroEl); else set(true);
    document.addEventListener('visibilitychange', function () { set(visible && !document.hidden); });
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
    if (!fine || reduce || !$('[data-wait]')) return;
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
    var el = $('[data-count]'); if (!el || reduce || !hasIO) return;
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

  /* ---------- credit carnet: a short loop — a reminder goes out, a debt is paid, the total drops ----------
     Without JS (or with reduced motion) the carnet stays still with the SMS note showing (.static). */
  (function () {
    var cn = $('.carnet'); if (!cn || reduce || !hasIO) return;
    var rows = $$('li', cn), tot = $('[data-total]', cn), paid = cn.dataset.paid;
    cn.classList.remove('static');
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
      later(function () { rows[0].classList.add('paid'); $('em', rows[0]).textContent = '0.00'; $('small', rows[0]).textContent = paid; count(842.5, 756.5); }, 4200);
      later(function () { if (vis) play(); }, 8200);
    }
    new IntersectionObserver(function (en) {
      vis = en[0].isIntersecting; timers.forEach(clearTimeout); timers = [];
      if (vis) play();
    }, { threshold: 0.35 }).observe(cn);
  })();

  /* ---------- the form: waitlist or contact, sent to Web3Forms ----------
     Progressive enhancement. Without JS it is a plain POST (the browser checks name and email) and
     Web3Forms redirects to /<lang>/sent/. With JS: fetch with Accept: application/json, stay on the page,
     and show one of the states inline: sending, invalid, rejected, unknown, or the success panel.
     ⚠ A missing answer is not an answer. A timeout or network error does not mean "not sent": it means
     "we could not confirm", and the message says so and gives the address. Only a JSON reply with
     success:false is a real refusal. */
  (function () {
    var form = $('#join-form'); if (!form) return;
    var D = form.dataset, status = $('.form-status', form), submit = $('button[type=submit]', form);
    var subject = form.elements.subject, sendLabel = $('[data-send]', form), opt = $('[data-opt]', form);
    form.noValidate = true;   /* we show our own messages; without JS the browser validates */

    function mode() { var r = $('input[name=intent]:checked', form); return r ? r.value : 'waitlist'; }
    function applyMode() {
      var m = mode();
      sendLabel.textContent = m === 'contact' ? D.sendContact : D.sendWaitlist;
      subject.value = m === 'contact' ? D.subjectContact : D.subjectWaitlist;
      opt.hidden = m === 'contact';
      form.elements.message.required = m === 'contact';
      if (m === 'waitlist') submit.setAttribute('data-wait', ''); else submit.removeAttribute('data-wait');
      show('', '');
    }
    function show(kind, text) { status.className = 'form-status' + (kind ? ' ' + kind : ''); status.textContent = text; }
    form.addEventListener('change', function (e) { if (e.target.name === 'intent') applyMode(); });
    applyMode();

    /* "Talk to us about partnering" opens the form in contact mode */
    $$('[data-mode]').forEach(function (a) {
      a.addEventListener('click', function () {
        var r = $('input[name=intent][value="' + a.dataset.mode + '"]', form);
        if (r && !r.checked) { r.checked = true; applyMode(); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = mode(), name = form.elements.name, email = form.elements.email, msg = form.elements.message;
      if (!name.value.trim() || !email.value.trim() || !email.checkValidity()) {
        show('bad', D.invalid); (name.value.trim() ? email : name).focus(); return;
      }
      if (m === 'contact' && !msg.value.trim()) { show('bad', D.invalidMsg); msg.focus(); return; }
      if (!window.fetch || !window.FormData) { form.submit(); return; }

      var body = {};
      new FormData(form).forEach(function (v, k) { if (k !== 'redirect') body[k] = v; });   /* with JS: a JSON answer, no redirect */
      submit.disabled = true; show('wait', D.sending);
      var controller = window.AbortController ? new AbortController() : null;
      var timer = controller && setTimeout(function () { controller.abort(); }, 15000);

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
        signal: controller ? controller.signal : undefined
      }).then(function (res) {
        return res.json().then(function (json) { return { ok: res.ok, json: json }; },
                               function () { return { ok: res.ok, json: null }; });
      }).then(function (r) {
        if (r.ok && r.json && r.json.success) {
          show('', ''); form.hidden = true;
          var done = $('[data-done="' + m + '"]'); done.hidden = false; done.focus();
        } else if (r.json && r.json.success === false) {
          show('bad', D.rejected); submit.disabled = false;      /* the server said no */
        } else {
          show('bad', D.unknown); submit.disabled = false;       /* an answer we cannot read */
        }
      }).catch(function () {
        show('bad', D.unknown); submit.disabled = false;         /* timeout, network, CORS: we do not know */
      }).then(function () { if (timer) clearTimeout(timer); });
    });
  })();
})();
