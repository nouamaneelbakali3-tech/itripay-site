// ============================================================================
// L'MARK DYAL PAYNA, MN L'LAUNCHER FOREGROUND — L'ISTI3MAL L'SGHIR BARK.
//
//   dart run tool/make_logo.dart
//
// Kayqra assets/source/ic_launcher_foreground_xxxhdpi.png w kaykhrej:
//
//   assets/mark-white.png      l'manta byda 3la alpha, m9etta3a 3la l'bbox
//   assets/mark-blue.png       nfs l'chakl, m3emmer b #0D48BE (l'header 3la byed)
//   assets/watermark.png       nfs mark-white.png (l'opacity kaydiro CSS)
//   assets/favicon-16.png      mrebbe3 azraq + l'manta byda
//   assets/favicon-32.png
//   assets/apple-touch-icon.png  180x180
//
// ⚠ 3LACH HADI MACHI L'LOGO L'7A9I9I. L'masdar assets/icon/logo.png.png
// (2000x2000) dya3. Li b9a howa l'khroj dyal tool/make_launcher_icon.dart
// f l'app: canvas 432 fih manta dyal 233x181 px. Had l'7ajm kafi l header
// 7tta l 110px CSS (220px 3la 2x) w l favicons. MA-KAFICH l hero mark:
// f 600px l'ajni7a kaydou3o w l'khatt l'dakhli kaywelli mkhellet.
// L'watermark kaydouz 7it b 8% opacity l'3in ma-katchoufch l'blur.
//
// ⚠ L'THRESHOLD. L'fill dyal l'manta f l'masdar machi 255: 240-254
// mkhellta (l'noise dyal l'masdar l'asli dez mn l'keying). 11 951 pixel
// f 240-255, ~470 pixel dyal l'7afa t7t 240. Donc: alpha >= 240 -> 255.
// L'7afa kat-b9a b l'ramp dyalha, l'fill kaywelli sabt.
//
// ⚠ MA-KAY-UPSCALICH 3EMMERO. Kol khroj <= 233px 3ard.
// ============================================================================

import 'dart:io';

import 'package:image/image.dart' as img;

const String source = 'assets/source/ic_launcher_foreground_xxxhdpi.png';
const String out = 'assets';

const int brandR = 0x0D, brandG = 0x48, brandB = 0xBE;

/// Pixels f had l'alpha wla fo9 menno homa l'fill: kaywelliw 255.
const int fillThreshold = 240;

void main() {
  final src = img.decodePng(File(source).readAsBytesSync());
  if (src == null) {
    stderr.writeln('ma-9dertch n9ra $source');
    exit(1);
  }

  // ── 1. Threshold + byed khalis ──
  // L'RGB f l'masdar 254 machi 255; l'chakl howa l'alpha. Kan-7etto
  // l'lawn 3la byed khalis w kan-khelliw ghir l'alpha ychedd l'chakl.
  final keyed = img.Image(width: src.width, height: src.height, numChannels: 4);
  for (final p in src) {
    var a = p.a.toInt();
    if (a >= fillThreshold) a = 255;
    keyed.setPixelRgba(p.x, p.y, 255, 255, 255, a);
  }

  // ── 2. Crop 3la l'bbox dyal l'mark (+4px padding) ──
  var minX = keyed.width, minY = keyed.height, maxX = -1, maxY = -1;
  for (final p in keyed) {
    if (p.a > 0) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }
  const pad = 4;
  final mark = img.copyCrop(
    keyed,
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + 1 + 2 * pad,
    height: maxY - minY + 1 + 2 * pad,
  );
  stdout.writeln('mark: ${mark.width}x${mark.height} '
      '(bbox ${maxX - minX + 1}x${maxY - minY + 1} + ${pad}px)');

  _write('mark-white.png', mark);
  _write('watermark.png', mark);

  // ── 3. Azraq 3la byed: nfs l'alpha, lawn akhor ──
  final blue = img.Image(width: mark.width, height: mark.height, numChannels: 4);
  for (final p in mark) {
    blue.setPixelRgba(p.x, p.y, brandR, brandG, brandB, p.a.toInt());
  }
  _write('mark-blue.png', blue);

  // ── 4. Favicons: mrebbe3 azraq, l'manta f l'wast b 70% dyal l'3ard ──
  // Nfs l'tarkiba dyal l'launcher (azraq + byed). B 16px l'manta
  // b7al l'launcher f l'drawer: kat-9ra b7al chakl, machi b7al tafasil.
  for (final size in [16, 32, 180]) {
    final icon = img.Image(width: size, height: size, numChannels: 4);
    img.fill(icon, color: img.ColorRgba8(brandR, brandG, brandB, 255));
    final targetW = (size * 0.72).round();
    final scaled = img.copyResize(
      mark,
      width: targetW,
      interpolation: img.Interpolation.cubic,
    );
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
