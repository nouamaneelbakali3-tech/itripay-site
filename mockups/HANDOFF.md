# ItriPay redesign — handoff

State on 2026-11-11, branch `redesign-c`. Phase A (prototypes) is finished and **direction C (Aurora)** was
chosen and revised four times. Nothing in `src/` has changed yet; the live site on `main` is still Payna.

- Prototype: `mockups/c/` — open `mockups/c/?lang=en|fr|ar` through the local server (`dart run tool/serve.dart`).
- The copy for all three languages: `mockups/c/content.js` (moves to `src/strings/{en,fr,ar}.json` in phase B).
- Screenshots of the last round: `mockups/shots/` (see the list at the end).

---

## 1. Brand and rules that do not change

- **Name:** ItriPay, everywhere. Written in Latin letters inside Arabic and French sentences too (same rule as the app).
- **Slogan / four values:** Connection · Speed · Security · Innovation.
- **Logo:** the four-point star, `assets/source/itripay-logo.png` (6250×6250, from the app repo). The site draws it
  as SVG, traced from the PNG (`BLADE` / `FACET` paths in `site.js`). Each point of the star is one value.
- **Contact email:** `contact@itripay.com` everywhere on the site (header form, footer, error messages).
  The app still uses `support@itripay.com` (`AppStrings.supportEmail`) — not changed, flag only.
  Not yet verified that `contact@` actually receives mail.
- **base_url:** stays `payna-ma.vercel.app` for now (`src/site.json`).
- **Setup stays:** `tool/build.dart`, strings in `src/strings/{en,fr,ar}.json`, three languages, Arabic fully RTL,
  Web3Forms form, Vercel deploys `main`.
- **Copy rules:** real content only. No testimonials, no invented numbers, no partner or bank logos.
  Never say ItriPay is licensed. It is pre-launch and looking for a licensed payment partner.
  (The existing rule also stands: never "certified", "bank-approved" or a card network name.)

## 2. Texts (EN / AR / FR)

Full copy for every section is in `mockups/c/content.js`. The texts decided in this round, verbatim:

**Hero headline**
- EN: Your phone is the terminal.
- AR: هاتفك هو جهاز الدفع.
- FR: Votre téléphone est le terminal.

**Hero text**
- EN: ItriPay is a SoftPOS payment solution: your phone becomes the payment terminal. It helps merchants and service providers accept digital payments more easily.
- AR: ItriPay حلّ دفع SoftPOS: يصبح هاتفك جهاز الدفع. يساعد التجّار ومقدّمي الخدمات على قبول المدفوعات الرقمية بسهولة أكبر.
- FR: ItriPay est une solution de paiement SoftPOS : votre téléphone devient le terminal de paiement. Elle aide les commerçants et les prestataires de services à accepter les paiements numériques plus facilement.

**Four values (chips and star points)**
- EN: Connection · Speed · Security · Innovation
- AR: اتصال · سرعة · أمان · ابتكار
- FR: Connexion · Rapidité · Sécurité · Innovation

**Problem — title / text**
- EN: Your customer has a card. You only take cash. / So the sale walks away. A card machine means a monthly fee and paperwork with the bank. And the paper credit book gets lost, along with the debts in it.
- AR: زبونك يحمل بطاقة، وأنت لا تقبل إلا النقود. / فتضيع عليك البيعة. وجهاز الدفع يعني اشتراكًا شهريًا وأوراقًا مع البنك. أما دفتر الديون الورقي فيضيع، ومعه ديونك.
- FR: Votre client a une carte. Vous n’acceptez que le cash. / Alors la vente s’en va. Un TPE, c’est un abonnement mensuel et des papiers avec la banque. Et le carnet papier se perd, avec les crédits dedans.
- The three problem cards below it are unchanged (the box on the counter, the paper carnet, the numbers nobody has).

**Who it is for — title and six cards** (icon + name; only Services has a second line)
- EN: Made for anyone who sells and wants to get paid. — Corner shops · Cafés and snacks · Market vendors · Taxis · Doctors and dentists · Services (Hairdressers, plumbers)
- AR: صُمّم لكل من يبيع ويريد أن يقبض. — بقالات الحيّ · المقاهي ومحلات الأكل الخفيف · باعة الأسواق · سيارات الأجرة · الأطباء وأطباء الأسنان · الخدمات (الحلاقون والسبّاكون)
- FR: Conçu pour tous ceux qui vendent et veulent être payés. — Épiceries de quartier · Cafés et snacks · Marchands du souk · Taxis · Médecins et dentistes · Services (Coiffeurs, plombiers)

**Credit carnet (orange section)**
- EN: The carnet, without the carnet. · AR: الدفتر، من غير دفتر. · FR: Le carnet, sans le carnet.

**Premium (gold section)** — eyebrow "ItriPay Premium" in every language
- EN: All features, no limits. · AR: كل الميزات، بلا قيود. · FR: Toutes les fonctionnalités, sans limites.
- 49 MAD / month, no extra device. Free if revenue stays under 500 MAD in 30 days; above that, 49 MAD is deducted automatically.

**Partners**
- EN: We are looking for a licensed payment partner. (AR/FR in `content.js`.) States plainly that ItriPay is not licensed.

## 3. Page order

Header → Hero → Problem → How it works (3 steps) → Features → **Credit carnet (orange)** → Who it is for →
**Premium (gold)** → Partners → The name (Itri means star, ⵉⵜⵔⵉ) → FAQ → Waitlist and contact form → Footer.

Removed during the revisions: the section explaining each point of the star, the phone mockup in the hero,
the "Pre-launch…" badge in the hero, the ring around the star, all glow/haze behind the star, the cursor glow.

## 4. Colours

Built from the logo blue `#0D48BE`, then made one small step lighter. All text pairs are WCAG AA or better.

| Token | Value | Use / contrast |
|---|---|---|
| `--blue` | `#1452CC` | buttons, links, accents. White on it 6.8:1; on `--paper` 6.2:1 |
| `--blue-d` | `#0E40AA` | button hover. White 9.0:1 |
| `--sky-grad` | `168deg, #1A63E6 0%, #1452CC 30%, #0D389A 62%, #061A55 100%` | hero and header. White on the lightest stop 5.3:1 |
| `--sky-txt` | `#E8EFFF` | light text on the sky. 4.6:1 even on the lightest stop |
| `--ink` / `--body` | `#0A1433` / `#46526F` | headings / body text on light sections |
| `--paper` / `--tint` | `#F1F5FE` / `#E4ECFD` | light sections / soft fills |
| `--orange` / `--orange-ink` | `#F97316` / `#2B1203` | credit section and its text (the app's Credit orange) |
| `--orange-d` / `--cream` | `#C2410C` / `#FFF4E8` | carnet balances / carnet panels |
| `--gold` | `#F2CD73` | Premium accents, on coal `#0E0C08`→`#1A160D` |
| `--ivory` / `--sand` | `#F6EFDD` / `#CFC4A6` | Premium headings / text |
| gold button | `#FFE08A`→`#E3B341`, text `#1C1400` | Premium waitlist button |

The Partners eyebrow is white (the old light blue failed AA on the lighter sky).

## 5. Fonts

The app's own fonts, copied from `itripay_test/assets/fonts` into `mockups/c/fonts/` and **self-hosted** (no Google Fonts):
- **Poppins** 800/900 — headings and the wordmark (the app only ships these weights).
- **DM Sans** 700/900 — buttons, labels, figures.
- **Cairo** 400–800 — body text, and everything in Arabic.
- To do in phase B: convert the TTFs to WOFF2 (more than half the weight). Tifinagh (ⵉⵜⵔⵉ) has no
  self-hosted font and falls back to the device font.

## 6. Header

- Always blue, always solid: it paints the top strip of the hero's own gradient (same gradient, same size,
  anchored at the top of the screen), so there is no seam at the top and it stays the same blue over white sections.
- White logo, white links, white language switch. Never turns white.
- Once the page scrolls it gains a soft shadow (`.scrolled`, toggled by an IntersectionObserver).
- Header logo star: spins continuously while the mouse is over it, coasts to a stop and settles upright when
  the mouse leaves; a tap gives it one push.

## 7. Hero rules

- Fills **exactly** the first screen: headline, text, both buttons, four value chips and the star are all visible
  without scrolling, and the white curved section below appears only on scroll.
  Implementation: the hero is `100svh + 44px` and the white sheet tucks 44px under it (`--hero-h`, `--sheet`).
  Checked at 1366×768, 1536×864, 1920×1080, 390×844 and 360×640 (EN and AR).
- Type and star size scale with screen height as well as width.
- Logo-blue night sky with a subtle starfield and an occasional shooting star (one small canvas, 30 fps,
  paused off-screen and in background tabs).
- The star is crisp: no glow, haze, halo, ring or blur behind or on it. One faint light pool sits in the far lower corner, away from the star.
- Headline rises word by word on load.

## 8. Star behaviour

- Draws itself on load (stroke, then fill).
- Turns slowly by itself.
- Every 3.4 s it selects the next point by itself, with a small "press" on that point, and the caption under it
  shows that value (Connection → Speed → Security → Innovation).
- A click or tap on any point, or on any chip, selects that value and pauses the cycle for 6 s; then it carries on from there.
- Hover and keyboard focus also select. Each point is a focusable button with the value's name.

## 9. Waitlist thread effect (one shared component for every waitlist button)

- When the mouse comes within 150 px of a waitlist button, six fine roots grow from the button's edge toward the
  cursor: curved, thick at the base, hair-thin at the tip, two small branches each. They trail the cursor with a
  slight delay and sway. Far = nothing; closer = longer and brighter; the button leans slightly toward the cursor.
- Cursor on the button: the threads are drawn back in with a soft glow. Cursor leaves: they retract.
- Colours follow the background: **white** on the blue hero and header, **blue** (`#1452CC`) on light sections,
  **gold** in Premium. Slightly thicker and more opaque on light backgrounds.
- Drawn on **one fixed full-screen canvas above everything (z-index 70, above the header)** that never takes clicks,
  is cleared in full every frame and is removed as soon as the effect is idle. Every frame re-reads every
  button's position, so it works after scrolling; a scroll that brings a button to a still cursor also starts it.
- Touch devices: a soft pulse on the button instead. `prefers-reduced-motion`: no effect at all.

## 10. Other effects (all respect `prefers-reduced-motion`)

- Sections reveal on scroll; cards lift and light up under the cursor.
- Premium: the 49 counts up once when it scrolls into view; a shimmer sweeps across the gold card.
- Credit: an animated carnet loop (an SMS reminder goes out, a debt is paid, the total drops).
- Everything uses transform/opacity, no libraries, one small canvas each for sky and threads.

## 11. Form

Web3Forms as today, two modes in one form: **Join the waitlist** (name, email, optional message) and
**Contact us** (message required). The prototype validates and shows a "prototype: nothing was sent" note;
phase B wires it to the real Web3Forms endpoint with the existing access key and the four inline states.

---

## What is left

1. **Build C into `src/`** — `src/template.html`, all strings into `src/strings/{en,fr,ar}.json` (every key in all
   three), `site.css`, the script, the fonts (WOFF2), then `dart run tool/build.dart`. Rename Payna → ItriPay
   everywhere (meta, titles, `sent/` pages, README, form subject, favicons and marks regenerated from
   `itripay-logo.png` via `tool/make_logo.dart`). Keep base_url `payna-ma.vercel.app`.
2. **A real scroll test** — in a normal browser window, scroll the whole page with the mouse standing still and
   moving: threads on every waitlist button, header shadow, reveals, count-up, carnet loop. (In this session the
   preview pane was hidden, so it never fired native scroll events; that path was only checked by firing the event by hand.)
3. **A phone test** — on a real, cheap Android phone: hero fits the first screen with the browser bars showing,
   smoothness of the sky and star, the soft pulse on waitlist buttons, Arabic layout.
4. Also open: verify `contact@itripay.com` receives mail; the app still says `support@`.

## Files in `mockups/`

| Path | What |
|---|---|
| `c/index.html`, `c/site.js`, `c/site.css`, `c/content.js`, `c/fonts/` | **The chosen prototype** |
| `c/demo.html`, `demo.js` | Capture harness: drives a pretend cursor (`?btn=0..3&dist=NN`), `?scrollto=<id>`, `?still=1`, `?timers=1` |
| `capture-demo.ps1` | Hero screenshots with headless Edge (PowerShell only: since Edge 157.0.4341.46, headless Edge from Git Bash exits at once) |
| `crop.dart`, `frame.html` | Helpers for the captures (crop; phone-width frame) |
| `a/`, `b/`, `shared/`, `index.html`, `capture.sh` | Phase A: the three directions and the chooser. A and B were not chosen. `capture.sh` no longer works (see above) |
| `shots/` | Screenshots. Latest round: `hero-*`, `section-problem-*`, `section-who-*`, `threads-*`, `header-scrolled-*`. The `a-*`, `b-*`, `c-desktop-*`, `c-mobile-*` full-page shots are from earlier rounds |

Screenshot limits worth knowing: headless Edge runs the page at a smaller viewport than it photographs, so
anything far down the page or scrolled is taken in the in-app browser instead (smaller images). Headless Edge
157 also does not play CSS animations, hence `?still=1` in the harness.
