# itripay-site

The ItriPay marketing site. Static HTML, CSS and one small script, three
languages (English, French, Arabic in full RTL), deployed on Vercel with
no build step.

    dart run tool/build.dart      # src/ -> en/ fr/ ar/ (index + sent page)
    dart run tool/serve.dart      # http://localhost:8080/  (local preview)
    dart run tool/make_logo.dart  # favicons, og image, marks from assets/source/itripay-logo.png
    dart run tool/make_fonts.dart # assets/source/fonts/*.ttf -> assets/fonts/*.woff

Dart comes with Flutter; nothing else is needed. `dart pub get` once for
the `image` package the logo tool uses.

## Layout

| Path | What |
|---|---|
| `src/template.html` | The page, with `{{key}}` placeholders |
| `src/sent.html` | The page Web3Forms redirects to after a form sent without JavaScript |
| `src/strings/{en,fr,ar}.json` | The words. Every key must exist in all three |
| `src/site.json` | What does not change with the language: base URL, contact email, form endpoint and key |
| `en/ fr/ ar/` | **Generated.** Edit `src/`, then rebuild. Committed so Vercel serves them as-is |
| `site.css` | All styling. Colour tokens at the top |
| `site.js` | Behaviour only (motion, the star, the waitlist threads, the live form). The page reads complete without it |
| `assets/` | Favicons, og image, marks, fonts — generated from `assets/source/` |
| `assets/source/` | The logo and the app's TTF fonts. Not deployed |
| `mockups/` | The redesign prototypes and `mockups/HANDOFF.md` (every design decision). Not deployed |
| `tool/` | The four scripts above |
| `vercel.json` | `/` → `/en/`, clean URLs, cache headers |
| `.vercelignore` | Allowlist of what is deployed: `en/ fr/ ar/ assets/ index.html site.css site.js vercel.json` |

## Brand

- **Name:** ItriPay, in Latin letters in every language. Itri (ⵉⵜⵔⵉ) is the Tamazight word for star.
- **Four values:** Connection · Speed · Security · Innovation — one per point of the star.
- **Logo:** `assets/source/itripay-logo.png` (6250×6250, from the app repo). The site draws the star
  as SVG, traced from that PNG (the `ip-blade` path in the templates and `assets/favicon.svg`).
- **Colours:** built from the logo blue `#0D48BE`, one step lighter (`#1452CC`) for buttons and links.
  The orange is the app's Credit orange, the gold is Premium. All text pairs pass WCAG AA; the table is in
  `mockups/HANDOFF.md` §4.
- **Fonts:** the app's own (Poppins 800/900, DM Sans 700/900, Cairo 400–800), self-hosted. WOFF, not
  WOFF2: there is no Brotli encoder on the build machine. See the top of `tool/make_fonts.dart`.
- **Contact:** `contact@itripay.com` everywhere on the site.

## Copy rules

Real content only: no testimonials, no invented numbers, no partner or bank logos. ItriPay is
pre-launch and looking for a licensed payment partner; the site never says ItriPay is licensed,
"certified" or "bank-approved", and never names a card network. `tool/build.dart` refuses to build
if a string breaks this (the `forbidden` list).

## Waitlist and contact form

Web3Forms, free plan. One form, two modes: **Join the waitlist** (name, email, optional message)
and **Contact us** (message required). The form POSTs to `https://api.web3forms.com/submit` with
the access key from `src/site.json`. **The access key is public by design** — Web3Forms' own FAQ:
"Access key is public. No need to confuse it with secret API key… Think of it as an alias to your
email." It can only send mail *to* the address it was created for.

- Sender name "ItriPay website". Subject "ItriPay website — waitlist" or "— new message" (translated
  in FR/AR); the field `intent` (`waitlist` / `contact`) is in every email.
- Without JavaScript: plain POST, the browser checks name and email, and Web3Forms redirects to
  `/{lang}/sent/` (the free plan allows same-domain redirects only, so it is built from `base_url`).
  An error without JS lands on Web3Forms' own error page — that path is not ours to style.
- With JavaScript: `fetch` with `Accept: application/json`, stays on the page, shows one of the
  states inline: sending, invalid, rejected, unknown, or success. "Unknown" (timeout, network) says
  *we could not confirm* — a missing answer is not a failure.
- The email address stays visible next to the form and in the footer in every state.

**Observed, 2026-09-17**, under the site's previous name: a real POST with the placeholder key gave
`400 {"success": false, "message": "Invalid form_id/access_key format. Must be a valid UUID."}`, and
two real submissions with the live key (one English, one Arabic, RTL) gave
`200 {"success": true, …, "message": "Form submitted successfully!"}` with the Arabic text
byte-identical in `data`. The script keys success off `response.ok && json.success`.

**Observed, 2026-11-12**, as ItriPay: two real submissions from the local build of `redesign-c` (bd7f514), with
`test@example.com` as the address, both answered
`200 {"success": true, …, "message": "Form submitted successfully!"}`:

- `/en/`, waitlist: `subject` "ItriPay website — waitlist", `from_name` "ItriPay website", `intent` "waitlist".
- `/ar/`, contact: `subject` "موقع ItriPay — رسالة جديدة", `from_name` "ItriPay website", `intent` "contact",
  Arabic name and message returned byte-identical in `data`.

Whether they reached the inbox is checked there, not here: Web3Forms answering success means it accepted them.

The key in `src/site.json` is the live one. The build warns if it is ever put back to the placeholder.
