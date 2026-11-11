// Crop a capture in place.
//   dart run mockups/crop.dart <png> <width>          keep the left <width> pixels
//   dart run mockups/crop.dart <png> <x> <y> <w> <h>  keep that rectangle
import 'dart:io';
import 'package:image/image.dart' as img;

void main(List<String> a) {
  final src = img.decodePng(File(a[0]).readAsBytesSync())!;
  final n = a.skip(1).map(int.parse).toList();
  var x = 0, y = 0, w = n[0], h = src.height;
  if (n.length == 4) { x = n[0]; y = n[1]; w = n[2]; h = n[3]; }
  x = x.clamp(0, src.width - 1); y = y.clamp(0, src.height - 1);
  if (x + w > src.width) w = src.width - x;
  if (y + h > src.height) h = src.height - y;
  if (x == 0 && y == 0 && w == src.width && h == src.height) return;
  File(a[0]).writeAsBytesSync(img.encodePng(img.copyCrop(src, x: x, y: y, width: w, height: h), level: 6));
}
