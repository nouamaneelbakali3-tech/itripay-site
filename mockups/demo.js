/* Capture harness for the thread effect (loaded only by c/demo.html, never by the site itself).
   Moves a pretend cursor toward a waitlist button with real pointer events, so headless Edge can
   photograph the effect. Query:
     btn=0..3     which waitlist button (0 header, 1 hero, 2 Premium, 3 form)
     dist=NN      final gap between the cursor and the button's edge, in px ("on" = on the button)
     then=away    afterwards move the cursor far away, to prove nothing is left on screen
   The cursor comes up from below-right and stops straight under the button, so "dist" is the true gap. */
(function () {
  var q = new URLSearchParams(location.search);
  /* scrollto=<section id>  scroll so that section sits under the header (for the scrolled-header shots) */
  if (q.has('scrollto')) {
    document.documentElement.style.scrollBehavior = 'auto';
    window.addEventListener('load', function () { setTimeout(function () {
      var s = document.getElementById(q.get('scrollto'));
      window.scrollTo({ top: s.getBoundingClientRect().top + scrollY - 40, behavior: 'instant' });
    }, 1500); });
  }
  if (!q.has('btn')) return;
  var cur = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  cur.setAttribute('viewBox', '0 0 22 22'); cur.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:22px;z-index:999;pointer-events:none;display:none';
  cur.innerHTML = '<path d="M2 2l6.5 17 2.6-7 7-2.6z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>';
  document.documentElement.style.scrollBehavior = 'auto';
  /* measure only after the web fonts are in: they change the hero's line breaks, and so the button's position */
  /* (fonts.ready alone resolves at once if nothing has asked for a font yet, so ask for each one explicitly) */
  var fontsIn = document.fonts && document.fonts.load
    ? Promise.all(['400 17px Cairo', '700 17px Cairo', '700 16px "DM Sans"', '800 60px Poppins'].map(function (f) { return document.fonts.load(f); })).then(function () { return document.fonts.ready; })
    : Promise.resolve();
  fontsIn.then(function () { setTimeout(start, 2600); }, function () { setTimeout(start, 2600); });
  function start() {
    document.body.appendChild(cur);
    var b = document.querySelectorAll('[data-wait]')[+q.get('btn')];
    /* bring the button into view without scrolling: headless Edge photographs the page from the top whatever
       the scroll position, while fixed layers (the threads, this cursor) follow the scroll. Shifting the content
       keeps every layer in the same coordinates. */
    var r0 = b.getBoundingClientRect();
    if (q.has('scroll')) {
      /* scroll=1: really scroll the page so the button sits mid-screen (the in-app browser photographs scrolled pages correctly) */
      window.scrollTo({ top: Math.round(r0.top + scrollY - innerHeight / 2 + r0.height / 2), behavior: 'instant' });
    } else if (!q.has('noshift') && (r0.top < 90 || r0.bottom > innerHeight - 60)) {
      var app = document.getElementById('app');
      app.style.transform = 'translateY(' + Math.round(innerHeight / 2 - (r0.top + r0.height / 2)) + 'px)';
    }
    setTimeout(function () {
      var r = b.getBoundingClientRect(), dist = q.get('dist'), on = dist === 'on';
      var tx = r.left + r.width * 0.72, ty = on ? r.top + r.height / 2 : r.bottom + +dist;
      var sx = tx + 140, sy = ty + 230, steps = 18, i = 0;
      document.documentElement.setAttribute('data-crop', [Math.round(r.left + r.width / 2 - 260), Math.round(r.top + r.height / 2 - 90), 560, 300].join(','));
      function at(x, y) {
        document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: x, clientY: y }));
        cur.style.display = 'block'; cur.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      }
      var t = setInterval(function () {
        i++; at(sx + (tx - sx) * i / steps, sy + (ty - sy) * i / steps);
        if (i < steps) return; clearInterval(t);
        setTimeout(function () {
          var rb = b.getBoundingClientRect();
          document.documentElement.setAttribute('data-debug', [scrollX, scrollY, document.scrollingElement.scrollTop, Math.round(rb.top), Math.round(rb.bottom), Math.round(tx), Math.round(ty), innerWidth, innerHeight].join(','));
        }, 800);
        if (q.get('then') === 'away') setTimeout(function () { at(sx + 400, sy + 300); cur.style.display = 'none'; }, 1200);
      }, 40);
    }, 400);
  }
})();
