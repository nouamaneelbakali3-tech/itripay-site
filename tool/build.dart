// ============================================================================
// L'GÉNÉRATEUR: template wa7ed + tlata dyal l'strings -> tlata dyal l'pages.
//
//   dart run tool/build.dart
//
// Kayqra src/template.html w src/sent.html, src/site.json (l'config li
// ma-3endhach lougha: l'URL, l'email, l'clé dyal l'form) w
// src/strings/<lang>.json, w kaykteb <lang>/index.html w
// <lang>/sent/index.html l kol lougha. L'khroj kayt-commita: Vercel
// ma-kaybni walo, kaykhdem l'HTML b7al ma howa.
//
// ⚠ 3LACH GÉNÉRATEUR W MACHI TLATA DYAL L'MALAFAT B L'YED. Tlata dyal
// l'HTML mnqolin kaytferr9o: tbeddel section f l'anglais w tnsa
// l'3arabiya. Hna l'markup kayn f blasa wa7da w l'klam bark howa li
// kaytbeddel. W 3lach machi JS switcher: l'3arabiya khassha dir="rtl"
// f l'<html> mn l'awwel, machi mn be3d ma yt7emmel l'page, w Google
// khasso ychouf tlata dyal l'pages machi wa7da.
//
// L'QAWA3ID:
//   {{key}}        kayt-escapa (& < > ") — l'klam l'3adi.
//   {{key_html}}   kaydkhol b7al ma howa — ghir melli l'string fiha markup
//                  (b7al <br> f l'hero line). 9lil w m3roufin.
//   {{key_js}}     kaykhrej b7al JS string literal (jsonEncode): l'klam li
//                  kayqrah l'script dyal l'form. L'quotes ma-kaykessrouch walo.
//   Key na9sa f lougha = khata2, machi warning. L'page ma-tkhrejch
//   b {{hero_line}} mektouba fiha.
//   Key f l'JSON ma-kayst3emlhach ta template = warning: klam mayyet.
//   Key f site.json w f lougha b joj = khata2: ma-kaynch "li ghleb".
// ============================================================================

import 'dart:convert';
import 'dart:io';

const String siteConfig = 'src/site.json';
const Map<String, String> templates = {
  'src/template.html': 'index.html',
  'src/sent.html': 'sent/index.html',
};
const List<String> languages = ['en', 'fr', 'ar'];

/// L'qima li kayna f site.json 9bel ma yt7ett l'clé l'7a9i9iya. L'build
/// kaydouz (bach t9der tchouf l'site m7alliyan bla clé) walakin kay3eyyet
/// b sawt 3ali: form b had l'qima kayrje3 khata2 mn Web3Forms, machi email.
const String keyPlaceholder = 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY';

final RegExp placeholder = RegExp(r'\{\{([a-z0-9_]+)\}\}');

/// ⛔ L'KLAM LI MA-KAYDKHOLCH, F AY LOUGHA.
///
/// Tap-to-pay kaytwsef b7al l'produit. Ma-kaynch "certified", ma-kaynch
/// "bank-approved", ma-kaynch smiya dyal réseau dyal l'cartes — 7it l'NFC
/// f l'app UI bla PSP wraha (docs/boundaries.md §16 f l'app). Tarjama
/// t9der tdekhkhel l'claim mn l'jiha: "sans contact" mzyan, "agréé" la.
/// Had l'lista hna w machi f README bach l'build ytih, machi bach chi
/// wa7ed y9ra l'qa3ida.
///
/// ItriPay: l'site kay9oul b l'7arf belli ma-3endouch l'agrément w kayqelleb
/// 3la partenaire "agréé" / "مرخَّص", w kayhder 3la "l'bank" dyal l'TPE.
/// Donc "agréé" w "بنك" bou7dhom wellaw msmou7in; li mamnou3 howa l'claim:
/// "ItriPay est agréé", "nous sommes agréés", "we are licensed", "نحن مرخَّصون".
/// ("Nous ne sommes pas agréés" ma-kat-tchedch: "pas" bin l'joj.)
final List<RegExp> forbidden = [
  RegExp(r'certif', caseSensitive: false), // certified / certifié
  RegExp(r'bank[- ]?approved', caseSensitive: false),
  RegExp(r'approuvé|homologu|agréé par', caseSensitive: false),
  RegExp(r'\b(visa|mastercard|maestro|cmi)\b', caseSensitive: false),
  RegExp(r'(we are|itripay is) (a )?licensed', caseSensitive: false),
  RegExp(r'(sommes|est|êtes) agréé', caseSensitive: false),
  RegExp(r'معتمد|مصرف|فيزا|ماستر|(نحن|ItriPay) مرخَّص'),
];

void main() {
  final config = _readJson(siteConfig);
  final tpls = templates.map((src, _) => MapEntry(src, File(src).readAsStringSync()));
  final used = <String>{};
  for (final tpl in tpls.values) {
    used.addAll(placeholder.allMatches(tpl).map((m) => m.group(1)!));
  }

  if (config['form_access_key'] == keyPlaceholder) {
    stderr.writeln('');
    stderr.writeln('⚠⚠ src/site.json: form_access_key mazal "$keyPlaceholder".');
    stderr.writeln('   L\'site kaytbna, walakin l\'form ma-ghadi ywsel l ta email.');
    stderr.writeln('   7ett l\'clé dyal Web3Forms 9bel ay push.');
    stderr.writeln('');
  }

  var failed = false;
  for (final lang in languages) {
    final path = 'src/strings/$lang.json';
    final langStrings = _readJson(path);

    final overlap = langStrings.keys.toSet().intersection(config.keys.toSet());
    if (overlap.isNotEmpty) {
      stderr.writeln('$path: keys kaynin 7tta f $siteConfig: ${overlap.join(', ')}');
      failed = true;
      continue;
    }
    final strings = {...config, ...langStrings, ..._derived(lang, langStrings)};

    for (final entry in langStrings.entries) {
      for (final rule in forbidden) {
        final hit = rule.firstMatch(entry.value);
        if (hit != null) {
          stderr.writeln('$path: "${entry.key}" fiha klam mamnou3: '
              '"${hit.group(0)}" — chouf `forbidden` f tool/build.dart');
          failed = true;
        }
      }
    }
    if (failed) continue;

    final missing = used.difference(strings.keys.toSet());
    if (missing.isNotEmpty) {
      stderr.writeln('$path: na9sin ${missing.length} key(s): '
          '${(missing.toList()..sort()).join(', ')}');
      failed = true;
      continue;
    }
    final dead = strings.keys.toSet().difference(used)
      ..removeAll(_derived(lang, langStrings).keys)
      ..remove('hero_title'); // kaytqra mn _derived
    if (dead.isNotEmpty) {
      stdout.writeln('$path: ma-mst3emlinch (klam mayyet): '
          '${(dead.toList()..sort()).join(', ')}');
    }

    for (final entry in tpls.entries) {
      final html = entry.value.replaceAllMapped(placeholder, (m) {
        final key = m.group(1)!;
        final value = strings[key]!;
        if (key.endsWith('_html')) return value;
        if (key.endsWith('_js')) return jsonEncode(value);
        return _escape(value);
      });
      final out = File('$lang/${templates[entry.key]}');
      out.parent.createSync(recursive: true);
      out.writeAsStringSync(html);
      stdout.writeln('-> ${out.path} (${html.length} chars)');
    }
  }
  if (failed) exit(1);
  _writeSeoFiles(config['base_url']!);
}

/// sitemap.xml w robots.txt, mn base_url bach ma-yfreqouch 3la l'domaine.
/// L'sitemap fih ghir l'pages dyal l'loughat (b l'hreflang dyalhom, b7al
/// l'<link rel="alternate"> f l'template). L'pages dyal /sent/ machi fih:
/// 3endhom <meta name="robots" content="noindex"> w X-Robots-Tag f
/// vercel.json. Ma-kat-tsedch f robots.txt: crawler msdoud ma-kaychoufch
/// l'noindex.
void _writeSeoFiles(String base) {
  final alternates = [
    for (final l in languages) '    <xhtml:link rel="alternate" hreflang="$l" href="$base/$l/"/>',
    '    <xhtml:link rel="alternate" hreflang="x-default" href="$base/en/"/>',
  ].join('\n');
  final urls = languages.map((l) => '  <url>\n    <loc>$base/$l/</loc>\n$alternates\n  </url>').join('\n');
  final sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
      '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n$urls\n</urlset>\n';
  File('sitemap.xml').writeAsStringSync(sitemap);
  File('robots.txt').writeAsStringSync('User-agent: *\nAllow: /\n\nSitemap: $base/sitemap.xml\n');
  stdout.writeln('-> sitemap.xml, robots.txt ($base)');
}

/// L'keys li kaybnihom l'build, machi l'tarjama:
///   current_<l>_html  ' aria-current="page"' f l'lougha dyal l'page, wla ''.
///   hero_headline_html  l'hero_title, kol kelma f <span> dyalha (bach
///                       ttle3 kelma b kelma), "\n" = ster jdid.
///   hero_title_text     nfs l'3onwan f ster wa7ed (l'aria-label w <title>).
Map<String, String> _derived(String lang, Map<String, String> s) {
  final out = <String, String>{
    for (final l in languages) 'current_${l}_html': l == lang ? ' aria-current="page"' : '',
  };
  final title = s['hero_title'];
  if (title != null) {
    var w = 0;
    out['hero_headline_html'] = title.split('\n').map((line) {
      final words = line.split(' ').map((word) =>
          '<span class="w"><i style="--w:${w++}">${_escape(word)}</i></span>');
      return '<span class="ln">${words.join(' ')}</span>';
    }).join(' ');
    out['hero_title_text'] = title.replaceAll('\n', ' ');
  }
  return out;
}

Map<String, String> _readJson(String path) =>
    (jsonDecode(File(path).readAsStringSync()) as Map)
        .map((k, v) => MapEntry(k as String, v as String));

String _escape(String s) => s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
