// ============================================================================
// L'MARK DYAL PAYNA, MN L'MASDAR L'ASLI.
//
//   dart run tool/make_logo.dart
//
// Kayqra assets/source/logo.png.png (2000x2000, joj lwan: #0D48BE w byed,
// bla alpha — nfs l'malaf li kaykhrej menno l'launcher f l'app) w kaykhrej:
//
//   assets/mark-white.png        l'manta byda 3la alpha, 480px 3ard (l'header, l'footer)
//   assets/mark-blue.png         nfs l'chakl m3emmer b #0D48BE (l'header 3la byed)
//   assets/watermark.png         l'manta byda, 1200px 3ard (l'hero, 8% opacity)
//   assets/favicon-16.png        mrebbe3 azraq + l'manta byda — nfs l'tarkiba
//   assets/favicon-32.png        dyal l'launcher
//   assets/apple-touch-icon.png  180x180
//
// L'KEYING: nfs l'fikra dyal tool/make_launcher_icon.dart f l'app. L'sura
// joj lwan bark b antialiasing binathom, donc alpha = ch7al l'pixel 9rib
// mn l'byed 3la l'canal l'a7mar (0x0D -> 0, 0xFF -> 255). Ma-kaynch
// takhmin, w l'7afa kat-b9a n9iya bla fringe zer9a.
//
// ⚠ L'ISTI3MAL. L'plan l'mwafe9 3lih: header <= 110px, favicons,
// watermark. L'hero howa khatt w lawn, machi mark kbir. Ila tbeddel
// hadchi, kaytbeddel f l'template w l'CSS, machi hna.
//
// ⚠ MA-KAY-UPSCALICH 3EMMERO. L'masdar 1293px dyal 3ard l'manta; akbar
// khroj 1200.
// ============================================================================

import 'dart:io';

import 'package:image/image.dart' as img;

const String source = 'assets/source/logo.png.png';
const String out = 'assets';

const int brandR = 0x0D, brandG = 0x48, brandB = 0xBE;

void main() {
  final src = img.decodePng(File(source).readAsBytesSync());
  if (src == null) {
    stderr.writeln('ma-9dertch n9ra $source');
    exit(1);
  }
  final bg = src.getPixel(0, 0);
  if (bg.r.toInt() != brandR || bg.g.toInt() != brandG || bg.b.toInt() != brandB) {
    stderr.writeln('l\'pixel (0,0) machi #0D48BE: '
        '${bg.r.toInt()},${bg.g.toInt()},${bg.b.toInt()} — machi l\'masdar l\'mtwe9e3');
    exit(1);
  }
  stdout.writeln('masdar: ${src.width}x${src.height}');

  // ── 1. Azraq -> alpha, l'lawn byed khalis ──
  final keyed = img.Image(width: src.width, height: src.height, numChannels: 4);
  for (final p in src) {
    final a = ((p.r.toInt() - brandR) * 255 / (255 - brandR)).round().clamp(0, 255);
    keyed.setPixelRgba(p.x, p.y, 255, 255, 255, a);
  }

  // ── 2. Crop 3la l'bbox (+2% padding) ──
  var minX = keyed.width, minY = keyed.height, maxX = -1, maxY = -1;
  for (final p in keyed) {
    if (p.a > 0) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  final pad = ((maxX - minX) * 0.02).round();
  final mark = img.copyCrop(
    keyed,
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + 1 + 2 * pad,
    height: maxY - minY + 1 + 2 * pad,
  );
  stdout.writeln('mark: ${mark.width}x${mark.height} '
      '(bbox ${maxX - minX + 1}x${maxY - minY + 1} + ${pad}px)');

  img.Image down(img.Image im, int w) =>
      img.copyResize(im, width: w, interpolation: img.Interpolation.cubic);

  _write('mark-white.png', down(mark, 480));
  _write('watermark.png', down(mark, 1200));

  // ── 3. Azraq 3la byed: nfs l'alpha, lawn akhor ──
  final blue = img.Image(width: mark.width, height: mark.height, numChannels: 4);
  for (final p in mark) {
    blue.setPixelRgba(p.x, p.y, brandR, brandG, brandB, p.a.toInt());
  }
  _write('mark-blue.png', down(blue, 480));

  // ── 4. Favicons: mrebbe3 azraq, l'manta 72% dyal l'3ard ──
  // Nfs l'tarkiba dyal l'launcher. B 16px l'manta kat-9ra b7al chakl.
  for (final size in [16, 32, 180]) {
    final icon = img.Image(width: size, height: size, numChannels: 4);
    img.fill(icon, color: img.ColorRgba8(brandR, brandG, brandB, 255));
    final scaled = down(mark, (size * 0.72).round());
    img.compositeImage(
      icon,
      scaled,
      dstX: (size - scaled.width) ~/ 2,
      dstY: (size - scaled.height) ~/ 2,
    );
    _write(size == 180 ? 'apple-touch-icon.png' : 'favicon-$size.png', icon);
  }
}

void _write(String name, img.Image im) {
  final f = File('$out/$name');
  f.writeAsBytesSync(img.encodePng(im));
  stdout.writeln('  -> ${f.path} ${im.width}x${im.height}');
}
