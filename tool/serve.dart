// ============================================================================
// SERVEUR LOCAL, BACH TCHOUF L'SITE 9BEL MA YKHREJ.
//
//   dart run tool/serve.dart          -> http://localhost:8080/
//   dart run tool/serve.dart 3000
//
// Kaykhdem b7al Vercel f li mohimm: `/` -> `/en/`, w dossier ->
// index.html dyalo. Bla cache, bach kol refresh yjib l'akhir build.
//
// 3lach machi `python -m http.server`: ma-kaynch Python 3la had
// l'machine, w Dart deja kayn (Flutter). Machi 7aja mohimma: 50 ster
// dyal dart:io.
// ============================================================================

import 'dart:io';

const Map<String, String> types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

Future<void> main(List<String> args) async {
  final port = args.isEmpty ? 8080 : int.parse(args.first);
  final server = await HttpServer.bind(InternetAddress.loopbackIPv4, port);
  stdout.writeln('payna-site -> http://localhost:$port/');

  await for (final req in server) {
    final res = req.response;
    res.headers.set('cache-control', 'no-store');
    var path = Uri.decodeComponent(req.uri.path);

    if (path == '/') {
      res.statusCode = HttpStatus.found;
      res.headers.set('location', '/en/');
      await res.close();
      continue;
    }
    if (path.contains('..')) {
      res.statusCode = HttpStatus.forbidden;
      await res.close();
      continue;
    }
    if (path.endsWith('/')) path = '${path}index.html';

    final file = File('.$path');
    if (!file.existsSync()) {
      // Dossier bla slash: /fr -> /fr/ (b7al trailingSlash f Vercel)
      if (Directory('.$path').existsSync()) {
        res.statusCode = HttpStatus.found;
        res.headers.set('location', '$path/');
      } else {
        res.statusCode = HttpStatus.notFound;
        res.write('404 $path');
      }
      await res.close();
      continue;
    }

    final dot = path.lastIndexOf('.');
    final ext = dot < 0 ? '' : path.substring(dot);
    res.headers.set('content-type', types[ext] ?? 'application/octet-stream');
    await res.addStream(file.openRead());
    await res.close();
  }
}
