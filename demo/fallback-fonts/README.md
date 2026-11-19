# Fallback fonts, served from /demo/ itself

Flutter's web engine fetches fonts for glyphs the app's own fonts lack
from `fonts.gstatic.com` by default. The public demo makes no
third-party requests, so `flutter_bootstrap.js` sets
`fontFallbackBaseUrl` to this folder, and the files keep the engine's
paths exactly.

Downloaded 2026-11-19 from `https://fonts.gstatic.com/s/<path>`,
the two files the demo was observed to request (Chrome, all four
languages):

| Path | Font | Licence | Why |
|---|---|---|---|
| `roboto/v32/KFOmCnqEu92Fr1Me4GZLCzYlKw.woff2` | Roboto | Apache 2.0 / SIL OFL 1.1 | engine default fallback, loaded at start |
| `notosanstifinagh/v20/I_uzMoCduATTei9eI8dawkHIwvmhCvbn77nEcXfs4Q.woff2` | Noto Sans Tifinagh | SIL OFL 1.1 | Amazigh text |

A glyph outside these and the bundled fonts (Cairo, Poppins, DM Sans,
Material Icons) now shows as a box instead of reaching Google. If a
new language or symbol needs one, add its file here at the path the
engine asks for.
