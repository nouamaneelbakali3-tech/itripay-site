// ============================================================================
// L'NEJMA DYAL ITRIPAY, MN L'MASDAR L'ASLI.
//
//   dart run tool/make_logo.dart
//
// Kayqra assets/source/itripay-logo.png (6250x6250, mn repo dyal l'app:
// nejma byda b rb3 rious w l'facets rmadiyin, 3la #0D48BE ghamlin bla
// alpha) w kaykhrej:
//
//   assets/favicon-16.png        l'icon kima f l'app: mrebbe3 azraq w
//   assets/favicon-32.png        l'nejma, b l'facets dyalha
//   assets/apple-touch-icon.png  180x180 (iOS kaydewwer l'zwaya b rasso)
//   assets/icon-512.png          512x512
//   assets/og.png                1200x630, l'tsswira dyal l'partage (WhatsApp...)
//   assets/mark-white.png        l'nejma 3la alpha, 480px (l'mails, docs)
//   assets/mark-blue.png         nfs l'chakl b #0D48BE, l'byed
//
// assets/favicon.svg machi mn hna: howa l'nejma l'vectorielle (nfs l'paths
// dyal l'site, BLADE/FACET f src/template.html), mektoub b l'yed.
//
// L'site nafso kayrsem l'nejma b SVG, machi b had l'PNGs.
//
// L'KEYING (l'mark-white / mark-blue): l'lard #0D48BE w l'nejma byda wla
// rmadiya (R kbir). Alpha mn l'canal l'a7mar: 0x0D -> 0, w kolchi li fo9
// 65% -> 255 (dakhel l'nejma 3amer, ghir l'7afa li fiha antialiasing).
// L'lawn kayt-7ssab b unpremultiply, donc l'facets kayb9aw rmadiyin.
// ============================================================================

import 'dart:io';

import 'package:image/image.dart' as img;

const String source = 'assets/source/itripay-logo.png';
const String out = 'assets';

const int bgR = 0x0D, bgG = 0x48, bgB = 0xBE;

void main() {
  final full = img.decodePng(File(source).readAsBytesSync());
  if (full == null) {
    stderr.writeln('ma-9dertch n9ra $source');
    exit(1);
  }
  final bg = full.getPixel(0, 0);
  if (bg.r.toInt() != bgR || bg.g.toInt() != bgG || bg.b.toInt() != bgB) {
    stderr.writeln('l\'pixel (0,0) machi #0D48BE: '
        '${bg.r.toInt()},${bg.g.toInt()},${bg.b.toInt()} — machi l\'masdar l\'mtwe9e3');
    exit(1);
  }
  stdout.writeln('masdar: ${full.width}x${full.height}');

  // ── 1. L'bbox dyal l'nejma (R b3id mn l'lard) ──
  var minX = full.width, minY = full.height, maxX = -1, maxY = -1;
  for (final p in full) {
    if (p.r > bgR + 60) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  final cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  final starSize = (maxX - minX + 1) > (maxY - minY + 1) ? maxX - minX + 1 : maxY - minY + 1;
  stdout.writeln('nejma: ${maxX - minX + 1}x${maxY - minY + 1} f ($minX,$minY)');

  img.Image down(img.Image im, int w, [int? h]) => img.copyResize(im,
      width: w, height: h ?? w, interpolation: img.Interpolation.average);

  /// Mrebbe3 mn l'masdar, l'nejma fih [fill] dyal l'3ard, l'centre f l'wst.
  /// Ila kharj l'mrebbe3 mn l'tsswira, l'ba9i kayt3emmer b l'lard (flat).
  img.Image framed(double fill, int size) {
    final side = (starSize / fill).round();
    final sq = img.Image(width: side, height: side, numChannels: 3);
    img.fill(sq, color: img.ColorRgb8(bgR, bgG, bgB));
    final x0 = (cx - side / 2).round(), y0 = (cy - side / 2).round();
    final sx = x0 < 0 ? 0 : x0, sy = y0 < 0 ? 0 : y0;
    final ex = (x0 + side) > full.width ? full.width : x0 + side;
    final ey = (y0 + side) > full.height ? full.height : y0 + side;
    img.compositeImage(sq, img.copyCrop(full, x: sx, y: sy, width: ex - sx, height: ey - sy),
        dstX: sx - x0, dstY: sy - y0);
    return down(sq, size);
  }

  // ── 2. L'icons: b7al l'launcher, l'nejma kbira f 16/32 bach tban ──
  _write('favicon-16.png', framed(0.90, 16));
  _write('favicon-32.png', framed(0.86, 32));
  _write('apple-touch-icon.png', framed(0.70, 180));
  _write('icon-512.png', framed(0.70, 512));

  // ── 3. og.png: 1200x630, l'nejma f l'wst ──
  final og = img.Image(width: 1200, height: 630, numChannels: 3);
  img.fill(og, color: img.ColorRgb8(bgR, bgG, bgB));
  img.compositeImage(og, framed(0.66, 630), dstX: (1200 - 630) ~/ 2, dstY: 0);
  _write('og.png', og);

  // ── 4. L'mark 3la alpha ──
  final pad = (starSize * 0.02).round();
  final crop = img.copyCrop(full,
      x: minX - pad, y: minY - pad, width: maxX - minX + 1 + 2 * pad, height: maxY - minY + 1 + 2 * pad);
  final small = down(crop, 960, (crop.height * 960 / crop.width).round()); // 2x l'khroj, 3la l'sor3a
  final white = img.Image(width: small.width, height: small.height, numChannels: 4);
  final blue = img.Image(width: small.width, height: small.height, numChannels: 4);
  for (final p in small) {
    final raw = (p.r - bgR) / (255 - bgR);
    final a = (raw / 0.65).clamp(0.0, 1.0);
    if (a == 0) continue;
    int un(num c, int b) => ((c - (1 - a) * b) / a).round().clamp(0, 255);
    final ai = (a * 255).round();
    white.setPixelRgba(p.x, p.y, un(p.r, bgR), un(p.g, bgG), un(p.b, bgB), ai);
    blue.setPixelRgba(p.x, p.y, bgR, bgG, bgB, ai);
  }
  _write('mark-white.png', down(white, 480, (white.height * 480 / white.width).round()));
  _write('mark-blue.png', down(blue, 480, (blue.height * 480 / blue.width).round()));
}

void _write(String name, img.Image im) {
  final f = File('$out/$name');
  f.writeAsBytesSync(img.encodePng(im, level: 9));
  stdout.writeln('  -> ${f.path} ${im.width}x${im.height} ${(f.lengthSync() / 1024).toStringAsFixed(1)} KB');
}
