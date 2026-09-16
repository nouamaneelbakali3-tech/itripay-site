// ============================================================================
// L'GÉNÉRATEUR: template wa7ed + tlata dyal l'strings -> tlata dyal l'pages.
//
//   dart run tool/build.dart
//
// Kayqra src/template.html w src/strings/<lang>.json, w kaykteb
// <lang>/index.html l kol lougha. L'khroj kayt-commita: Vercel
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
//   Key na9sa f lougha = khata2, machi warning. L'page ma-tkhrejch
//   b {{hero_line}} mektouba fiha.
//   Key f l'JSON ma-kayst3emlhach l'template = warning: klam mayyet.
// ============================================================================

import 'dart:convert';
import 'dart:io';

const String template = 'src/template.html';
const List<String> languages = ['en', 'fr', 'ar'];

final RegExp placeholder = RegExp(r'\{\{([a-z0-9_]+)\}\}');

void main() {
  final tpl = File(template).readAsStringSync();
  final used = placeholder.allMatches(tpl).map((m) => m.group(1)!).toSet();

  var failed = false;
  for (final lang in languages) {
    final path = 'src/strings/$lang.json';
    final strings = (jsonDecode(File(path).readAsStringSync()) as Map)
        .map((k, v) => MapEntry(k as String, v as String));

    final missing = used.difference(strings.keys.toSet());
    if (missing.isNotEmpty) {
      stderr.writeln('$path: na9sin ${missing.length} key(s): '
          '${(missing.toList()..sort()).join(', ')}');
      failed = true;
      continue;
    }
    final dead = strings.keys.toSet().difference(used);
    if (dead.isNotEmpty) {
      stdout.writeln('$path: ma-mst3emlinch (klam mayyet): '
          '${(dead.toList()..sort()).join(', ')}');
    }

    final html = tpl.replaceAllMapped(placeholder, (m) {
      final key = m.group(1)!;
      final value = strings[key]!;
      return key.endsWith('_html') ? value : _escape(value);
    });

    final out = File('$lang/index.html');
    out.parent.createSync(recursive: true);
    out.writeAsStringSync(html);
    stdout.writeln('-> ${out.path} (${html.length} chars)');
  }
  if (failed) exit(1);
}

String _escape(String s) => s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
