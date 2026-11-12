// What Safari's collapsing toolbars do to scroll-triggered animations on an iPhone: while you scroll, the
// viewport height changes (664 <-> 750 on an iPhone 13), so an element near a visibility threshold keeps
// crossing it. This puts the carnet and the Premium price near their thresholds and toggles the height
// every 400 ms for 7 s. Passes when the carnet gets through its loop (SMS, then a debt paid) without being reset,
// and the Premium price, sitting at the very edge, still reads 49 (never 0).
//   node mockups/iphone-toolbar.mjs [base=http://localhost:8080]
import { createRequire } from 'node:module';
const require = createRequire(process.env.PLAYWRIGHT_FROM || import.meta.url);
const { webkit, devices } = require('playwright');
const base = process.argv[2] || 'http://localhost:8080';
const wait = ms => new Promise(r => setTimeout(r, ms));

const browser = await webkit.launch();
const context = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'no-preference' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto(`${base}/en/`, { waitUntil: 'load' });
await wait(1200);

async function jiggle(sel, visible) {
  // scroll so that `visible` px of the element show at the bottom of the short (toolbars shown) viewport
  await page.setViewportSize({ width: 390, height: 664 });
  await page.evaluate(([s, v]) => { const r = document.querySelector(s).getBoundingClientRect(); window.scrollBy({ top: r.top - (innerHeight - v), behavior: 'instant' }); }, [sel, visible]);
  for (let i = 0; i < 18; i++) { await page.setViewportSize({ width: 390, height: i % 2 ? 664 : 750 }); await wait(400); }
  await page.setViewportSize({ width: 390, height: 664 });
}

// timeline of the carnet's states (sms shown, row paid, back to the start), ms after the jiggle starts
await page.evaluate(() => {
  window.__t = []; const c = document.querySelector('.carnet');
  new MutationObserver(() => window.__t.push([Math.round(performance.now() - (window.__t0 || 0)), c.classList.contains('sms') ? 'sms' : '-', c.querySelector('li.paid') ? 'paid' : '-', document.querySelector('.carnet [data-total]').textContent]))
    .observe(c, { subtree: true, attributes: true, attributeFilter: ['class'] });
});
await page.evaluate(() => { window.__t0 = performance.now(); });
await jiggle('.carnet', 150);
const timeline = await page.evaluate(() => window.__t.filter((x, i, a) => !i || x.slice(1, 3).join() !== a[i - 1].slice(1, 3).join()));
const firstReset = timeline.findIndex((x, i) => i > 0 && x[1] === '-' && timeline[i - 1][1] === 'sms');
console.log(JSON.stringify({ carnetTimeline: timeline, carnetGotToPaidBeforeAnyReset: timeline.some((x, i) => x[2] === 'paid' && (firstReset < 0 || i < firstReset)) }));

await jiggle('[data-count]', 40);
const price = await page.textContent('[data-count]');
console.log(JSON.stringify({ premiumPriceNearTheEdge: price, errors }));
await browser.close();
