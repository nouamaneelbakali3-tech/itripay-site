// iPhone (Safari) behaviour checks of the built site in Playwright WebKit.
//
//   (from a folder with playwright installed)
//   node mockups/iphone-check.mjs [base=http://localhost:8080] [out=mockups/shots/iphone]
//
// iPhone 13 emulation: 390x664 viewport, touch, isMobile, Safari user agent, Reduce Motion OFF.
// Checks, per language: the hero star turns and cycles its points by itself; the carnet loop and the Premium
// count-up and shimmer run when scrolled into view; the same after a tap on the star (sticky :hover on iOS);
// and that prefers-reduced-motion still stops everything. Writes screenshots and a short video.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire(process.env.PLAYWRIGHT_FROM || import.meta.url);
const { webkit, devices } = require('playwright');

const base = process.argv[2] || 'http://localhost:8080';
const out = process.argv[3] || 'mockups/shots/iphone';
mkdirSync(out, { recursive: true });
const iphone = devices['iPhone 13'];
const wait = ms => new Promise(r => setTimeout(r, ms));
const log = (name, v) => console.log(JSON.stringify({ check: name, result: v }));

/** angle of the hero star's rotating wrapper, in degrees */
const angle = () => {
  const m = getComputedStyle(document.querySelector('.hero .rot')).transform;
  if (!m || m === 'none') return 0;
  const [a, b] = m.slice(7, -1).split(',').map(Number);
  return Math.round(Math.atan2(b, a) * 1800 / Math.PI) / 10;
};

async function run(lang, { reduce = false, video = false } = {}) {
  const browser = await webkit.launch();
  const context = await browser.newContext({
    ...iphone, reducedMotion: reduce ? 'reduce' : 'no-preference',
    ...(video ? { recordVideo: { dir: out, size: { width: 390, height: 664 } } } : {}),
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`${base}/${lang}/`, { waitUntil: 'load' });
  await wait(1500);
  const tag = `${lang}${reduce ? '-reduced' : ''}`;

  // 1. the hero star, untouched: angle and caption over ~7.5 s
  const a0 = await page.evaluate(angle), c0 = await page.textContent('.vcap b');
  const anim = await page.evaluate(() => { const s = getComputedStyle(document.querySelector('.hero .rot')); return { name: s.animationName, state: s.animationPlayState, motion: document.documentElement.classList.contains('motion') }; });
  await page.screenshot({ path: `${out}/${tag}-1-hero.png` });
  await wait(7500);
  const a1 = await page.evaluate(angle), c1 = await page.textContent('.vcap b');
  log(`${tag} hero star, untouched`, { ...anim, angleBefore: a0, angleAfter7_5s: a1, turned: a1 !== a0, captionBefore: c0, captionAfter: c1, cycled: c0 !== c1 });

  // 2. the same after tapping a point of the star (iOS keeps :hover on the last tapped element)
  if (!reduce) {
    // a finger tap at the point's centre (the star turns, so Playwright's element tap never sees it "stable")
    const p = await page.evaluate(() => { const r = document.querySelector('.stage .blade[data-v="2"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await page.touchscreen.tap(p.x, p.y);
    const t0 = await page.evaluate(angle), cap0 = await page.textContent('.vcap b');
    await wait(10500);   // 6 s hold after a tap, then the cycle should carry on
    const t1 = await page.evaluate(angle), cap1 = await page.textContent('.vcap b');
    log(`${tag} hero star, after a tap on a point`, { captionAtTap: cap0, captionAfter10_5s: cap1, cycledAfterHold: cap0 !== cap1, angleAtTap: t0, angleAfter: t1, turned: t1 !== t0,
      playState: await page.evaluate(() => getComputedStyle(document.querySelector('.hero .rot')).animationPlayState) });
    await page.screenshot({ path: `${out}/${tag}-2-hero-after-tap.png` });
  }

  // 3. scroll with the finger (touch scrolling, not scrollTo) down to the carnet, then Premium
  async function swipeTo(sel) {
    for (let i = 0; i < 60; i++) {
      const r = await page.evaluate(s => { const b = document.querySelector(s).getBoundingClientRect(); return { top: b.top, bottom: b.bottom, h: innerHeight }; }, sel);
      if (r.top < r.h * 0.25 && r.bottom > 0) break;
      // mobile WebKit has neither wheel nor touch-drag in Playwright: scroll in finger-sized steps instead
      await page.evaluate(d => window.scrollBy({ top: d, behavior: 'instant' }), Math.min(400, Math.max(80, r.top - r.h * 0.2)));
      await wait(120);
    }
  }
  await swipeTo('.carnet');
  await wait(5600);
  const cn = await page.evaluate(() => { const c = document.querySelector('.carnet'); return { static: c.classList.contains('static'), smsShown: c.classList.contains('sms'), paidRow: !!c.querySelector('li.paid'), total: c.querySelector('[data-total]').textContent, revealed: c.classList.contains('in') }; });
  log(`${tag} carnet, 5.6 s after scrolling to it`, cn);
  await page.screenshot({ path: `${out}/${tag}-3-carnet.png` });

  await swipeTo('.prem-card');
  await wait(2200);
  const pr = await page.evaluate(() => { const s = getComputedStyle(document.querySelector('.shimmer'), '::before'); return { price: document.querySelector('[data-count]').textContent, shimmerAnimation: s.animationName, revealed: document.querySelector('.prem-card').classList.contains('in') }; });
  log(`${tag} premium, 2.2 s after scrolling to it`, pr);
  await page.screenshot({ path: `${out}/${tag}-4-premium.png` });

  log(`${tag} errors`, errors);
  await context.close();
  await browser.close();
}

for (const lang of (process.env.LANGS || 'en,ar').split(',')) await run(lang, { video: lang === 'en' && !!process.env.VIDEO });
await run('en', { reduce: true });
