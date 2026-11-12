// ============================================================================
// L'FONTS DYAL L'APP, MN TTF L WOFF.
//
//   dart run tool/make_fonts.dart
//
// Kayqra assets/source/fonts/*.ttf (nfs l'malafat dyal itripay_test/
// assets/fonts) w kaykteb assets/fonts/<smiya>.woff.
//
// WOFF 1.0 (w3.org/TR/WOFF): kol table dyal l'font kat-tcompressa b zlib
// bou7dha, w l'header kay3ti l'offsets. Ma-kaytbeddel ta glyph: l'font
// li kaybanha l'navigateur hiya nfsha b l'byte (l'checksums kayb9aw).
//
// ⚠ 3LACH WOFF W MACHI WOFF2. WOFF2 kay7taj Brotli, w ma-kaynch encoder
// dyal Brotli f had l'machine (la Python, la Node, la .NET Core, w Dart
// 3endo ghir zlib). WOFF kaydir ~40% 9al mn TTF bla ta tool men berra.
// Ila tzad fonttools ("pip install fonttools brotli"), WOFF2 + subset
// kay9ddrou ynz9sou l'nouss l'akhor; l'CSS kaytbeddel ghir l'extension.
// ============================================================================

import 'dart:io';
import 'dart:typed_data';

const String sourceDir = 'assets/source/fonts';
const String outDir = 'assets/fonts';

/// Ghir l'weights li kayst3emlhom site.css.
const List<String> fonts = [
  'Cairo-Regular', 'Cairo-SemiBold', 'Cairo-Bold', 'Cairo-ExtraBold',
  'Poppins-ExtraBold', 'Poppins-Black',
  'DMSans-Bold', 'DMSans-Black',
];

void main() {
  Directory(outDir).createSync(recursive: true);
  var inTotal = 0, outTotal = 0;
  for (final name in fonts) {
    final ttf = File('$sourceDir/$name.ttf').readAsBytesSync();
    final woff = toWoff(ttf);
    File('$outDir/$name.woff').writeAsBytesSync(woff);
    inTotal += ttf.length;
    outTotal += woff.length;
    stdout.writeln('  -> $outDir/$name.woff  ${_kb(ttf.length)} -> ${_kb(woff.length)}');
  }
  stdout.writeln('total ${_kb(inTotal)} -> ${_kb(outTotal)}');
}

String _kb(int n) => '${(n / 1024).toStringAsFixed(1)} KB';

Uint8List toWoff(Uint8List sfnt) {
  final src = ByteData.sublistView(sfnt);
  final flavor = src.getUint32(0);
  final numTables = src.getUint16(4);

  final tables = <({int tag, int checksum, Uint8List data, Uint8List packed})>[];
  for (var i = 0; i < numTables; i++) {
    final rec = 12 + 16 * i;
    final offset = src.getUint32(rec + 8), length = src.getUint32(rec + 12);
    final data = Uint8List.sublistView(sfnt, offset, offset + length);
    final z = Uint8List.fromList(ZLibCodec(level: 9).encode(data));
    // L'spec: ila l'compression ma-9ssratch, l'table kat-t7ett kima hiya.
    tables.add((tag: src.getUint32(rec), checksum: src.getUint32(rec + 4),
        data: data, packed: z.length < data.length ? z : data));
  }
  tables.sort((a, b) => a.tag.compareTo(b.tag));

  int pad4(int n) => (n + 3) & ~3;
  final headerSize = 44 + 20 * numTables;
  var size = headerSize;
  var sfntSize = 12 + 16 * numTables;
  for (final t in tables) {
    size = pad4(size) + t.packed.length;
    sfntSize += pad4(t.data.length);
  }
  size = pad4(size);

  final out = ByteData(size);
  out.setUint32(0, 0x774F4646); // 'wOFF'
  out.setUint32(4, flavor);
  out.setUint32(8, size);
  out.setUint16(12, numTables);
  out.setUint16(14, 0);
  out.setUint32(16, sfntSize);
  out.setUint16(20, 1); // majorVersion
  out.setUint16(22, 0);
  // metaOffset, metaLength, metaOrigLength, privOffset, privLength = 0

  final bytes = out.buffer.asUint8List();
  var pos = headerSize;
  for (var i = 0; i < tables.length; i++) {
    final t = tables[i];
    pos = pad4(pos);
    final dir = 44 + 20 * i;
    out.setUint32(dir, t.tag);
    out.setUint32(dir + 4, pos);
    out.setUint32(dir + 8, t.packed.length);
    out.setUint32(dir + 12, t.data.length);
    out.setUint32(dir + 16, t.checksum);
    bytes.setRange(pos, pos + t.packed.length, t.packed);
    pos += t.packed.length;
  }
  return bytes;
}
