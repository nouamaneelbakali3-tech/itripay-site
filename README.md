# payna-site

The Payna marketing site. Static HTML and CSS, three languages, deployed
on Vercel with no build step.

    dart run tool/build.dart     # src/template.html + src/strings/*.json -> en/ fr/ ar/
    dart run tool/serve.dart     # http://localhost:8080/  (local preview)
    dart run tool/make_logo.dart # regenerate the mark and favicons from assets/source/

Dart comes with Flutter; nothing else is needed. `dart pub get` once for
the `image` package the logo tool uses.

## Layout

| Path | What |
|---|---|
| `src/template.html` | The one page, with `{{key}}` placeholders |
| `src/strings/{en,fr,ar}.json` | The words. Every key must exist in all three |
| `en/ fr/ ar/` | **Generated.** Edit the template or the strings, then rebuild. Committed so Vercel serves them as-is |
| `site.css` | All styling. Colour tokens at the top, each with the app file it came from |
| `assets/` | Mark, watermark, favicons — generated from `assets/source/` |
| `tool/` | The three scripts above |
| `vercel.json` | `/` → `/en/`, clean URLs, cache headers |

## Brand

Colours are the app's, not guesses. `#0D48BE` is the logo blue (brand
surfaces: hero, pricing). `#2563EB` is the app's UI blue (every button,
so buttons here match future screenshots). `#F97316` is the Credit
screen's orange. See the top of `site.css` for provenance.

## The mark

`assets/source/ic_launcher_foreground_xxxhdpi.png` is the largest
surviving derivative of the lost 2000×2000 logo: a 233×181 manta on a
432 canvas. It is used **small only** — header ≤ 110px, favicons, and
the 8% hero watermark. It is not a hero mark and must not be upscaled
into one. When the original is found, drop it in `assets/source/`,
update `tool/make_logo.dart` to read it, and the hero can change.

## Screenshots, later

Every feature section has a `.media-box`: a 9:19.5 box (the Galaxy A17's
aspect), max 320px wide. It holds a typographic object today. A screenshot
goes in the same box — `<img>` in a device frame — with no change to the
grid or the copy.

## Copy rule

Tap-to-pay is described as the product. Never "certified", never
"bank-approved", never a card network name — in any of the three
languages.
