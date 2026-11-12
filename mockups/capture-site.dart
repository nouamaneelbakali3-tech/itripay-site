// Section screenshots and behaviour checks of the built site (en/ fr/ ar/), through headless Edge's
// DevTools protocol. Real page, real animations, exact viewport sizes (also phone widths, which plain
// `--screenshot` cannot do).
//
//   1. powershell -File mockups\edge-cdp.ps1        (starts headless Edge on port 9333)
//   2. dart run mockups/capture-site.dart shots      -> mockups/shots/site/<lang>-<size>-<nn>-<section>.jpg
//      dart run mockups/capture-site.dart checks     -> prints the behaviour checks as JSON lines
//      dart run mockups/capture-site.dart perf       -> load speed under throttled mobile conditions
//
// The server must be running (dart run tool/serve.dart).
import 'dart:async';
import 'dart:convert';
import 'dart:io';

const base = 'http://localhost:8080';
const port = 9333;
const sizes = {'desktop': [1440, 900], 'mobile': [390, 844]};
const sections = ['#top', '#problem', '#how', '#features', '#credit', '#who', '#pricing', '#partners', '#name', '#faq', '#join', '.site-foot'];

class Cdp {
  final WebSocket ws;
  int _id = 0;
  final _pending = <int, Completer<Map>>{};
  final events = StreamController<Map>.broadcast();
  Cdp(this.ws) {
    ws.listen((m) {
      final j = jsonDecode(m as String) as Map;
      if (j['id'] != null) {
        final c = _pending.remove(j['id']);
        if (j['error'] != null) { c?.completeError(j['error']); } else { c?.complete((j['result'] ?? {}) as Map); }
      } else {
        events.add(j);
      }
    });
  }
  Future<Map> send(String method, [Map? params]) {
    final id = ++_id;
    final c = Completer<Map>();
    _pending[id] = c;
    ws.add(jsonEncode({'id': id, 'method': method, 'params': params ?? {}}));
    return c.future.timeout(const Duration(seconds: 60));
  }
  Future<dynamic> js(String expr) async {
    final r = await send('Runtime.evaluate', {'expression': expr, 'awaitPromise': true, 'returnByValue': true});
    if (r['exceptionDetails'] != null) throw Exception('JS: ${jsonEncode(r['exceptionDetails'])}');
    return (r['result'] as Map)['value'];
  }
}

Future<Cdp> openPage() async {
  final http = HttpClient();
  final req = await http.openUrl('PUT', Uri.parse('http://127.0.0.1:$port/json/new?about:blank'));
  final res = await req.close();
  final info = jsonDecode(await res.transform(utf8.decoder).join()) as Map;
  final cdp = Cdp(await WebSocket.connect(info['webSocketDebuggerUrl'] as String));
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  return cdp;
}

Future<void> sizeTo(Cdp c, int w, int h, {bool reduce = false}) async {
  final mobile = w < 600;
  await c.send('Emulation.setDeviceMetricsOverride', {'width': w, 'height': h, 'deviceScaleFactor': 1, 'mobile': mobile});
  await c.send('Emulation.setTouchEmulationEnabled', {'enabled': mobile});
  await c.send('Emulation.setEmulatedMedia', {
    'features': [
      {'name': 'prefers-reduced-motion', 'value': reduce ? 'reduce' : 'no-preference'},
    ]
  });
}

Future<void> load(Cdp c, String url) async {
  final loaded = c.events.stream.firstWhere((e) => e['method'] == 'Page.loadEventFired');
  await c.send('Page.navigate', {'url': url});
  await loaded.timeout(const Duration(seconds: 30));
  await c.js('document.fonts.ready.then(() => new Promise(r => setTimeout(r, 2600)))');
}

Future<void> shots() async {
  final out = Directory('mockups/shots/site')..createSync(recursive: true);
  final c = await openPage();
  for (final lang in ['en', 'ar']) {
    for (final s in sizes.entries) {
      await sizeTo(c, s.value[0], s.value[1]);
      await load(c, '$base/$lang/');
      for (var i = 0; i < sections.length; i++) {
        final sel = sections[i];
        // Scroll so the section starts just under the fixed header, let its reveal run, then capture the
        // header plus the whole section (beyond the viewport if it is taller than one screen).
        final box = await c.js('''(async () => {
          const el = document.querySelector('$sel');
          const top = el.getBoundingClientRect().top + scrollY;
          const y = Math.max(0, top - (top > 0 ? 72 : 0));
          scrollTo({top: y, behavior: 'instant'});
          await new Promise(r => setTimeout(r, 300));
          // everything this section reveals, as the visitor would see it once it has settled
          el.querySelectorAll('.rv').forEach(e => e.classList.add('in'));
          await new Promise(r => setTimeout(r, 1500));
          return {y: scrollY, h: el.getBoundingClientRect().bottom};
        })()''') as Map;
        final y = (box['y'] as num).toDouble();
        final h = (box['h'] as num).toDouble().clamp(200, 6000);
        final shot = await c.send('Page.captureScreenshot', {
          'format': 'jpeg', 'quality': 82, 'captureBeyondViewport': h > s.value[1],   // beyond-viewport mode shifts an RTL page sideways at the very bottom, so only when needed
          'clip': {'x': 0, 'y': y, 'width': s.value[0], 'height': h, 'scale': 1},
        });
        final name = '$lang-${s.key}-${(i + 1).toString().padLeft(2, '0')}-${sel.replaceAll(RegExp(r'[#.]'), '')}.jpg';
        File('${out.path}/$name').writeAsBytesSync(base64Decode(shot['data'] as String));
        stdout.writeln(name);
      }
    }
  }
  await c.ws.close();
}

/// The behaviour checks. Each prints one JSON line.
Future<void> checks() async {
  final c = await openPage();
  void report(String name, Object? v) => stdout.writeln(jsonEncode({'check': name, 'result': v}));
  final errors = <String>[];
  c.events.stream.listen((e) {
    if (e['method'] == 'Runtime.exceptionThrown') errors.add(jsonEncode(e['params']));
    if (e['method'] == 'Runtime.consoleAPICalled' && (e['params'] as Map)['type'] == 'error') errors.add(jsonEncode(e['params']));
  });

  // ── Desktop, motion on: threads on every waitlist button, with the cursor moving and standing still ──
  for (final lang in ['en', 'fr', 'ar']) {
    await sizeTo(c, 1440, 900);
    await load(c, '$base/$lang/');
    final buttons = await c.js("document.querySelectorAll('[data-wait]').length");
    final results = [];
    for (var b = 0; b < (buttons as int); b++) {
      // bring the button to the middle of the screen, then move the mouse to 70px left/above it
      final r = await c.js('''(async () => {
        const btn = document.querySelectorAll('[data-wait]')[$b];
        if (!btn.closest('.site-head')) btn.scrollIntoView({block: 'center', behavior: 'instant'});
        await new Promise(r => setTimeout(r, 900));
        const r = btn.getBoundingClientRect();
        return {x: r.left, y: r.top, sy: scrollY, w: r.width, h: r.height, label: btn.textContent.trim(), where: btn.closest('.site-head') ? 'header' : btn.closest('.hero') ? 'hero' : btn.closest('.premium') ? 'premium' : 'form'};
      })()''') as Map;
      final x = (r['x'] as num) + (r['w'] as num) / 2, y = (r['y'] as num) + (r['h'] as num) + 70;
      for (var k = 0; k < 12; k++) {
        await c.send('Input.dispatchMouseEvent', {'type': 'mouseMoved', 'x': x + 40 - k * 3, 'y': y - k * 2});
        await Future.delayed(const Duration(milliseconds: 40));
      }
      await Future.delayed(const Duration(milliseconds: 500));
      final s = await c.js('''(() => {
        const cv = document.querySelector('canvas.threads');
        const btn = document.querySelectorAll('[data-wait]')[$b];
        let ink = 0;
        if (cv) { const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 20) ink++; }
        return {canvas: !!cv, inkPixels: ink, pulled: btn.classList.contains('pulled'), lean: btn.style.transform};
      })()''');
      if (lang != 'fr') {
        final shot = await c.send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85, 'clip': {'x': (x - 260).clamp(0, 1440 - 520), 'y': (y - 190).clamp(0, 900 - 300) + (r['sy'] as num), 'width': 520, 'height': 300, 'scale': 1}});
        File('mockups/shots/site/threads-$lang-${r['where']}.jpg').writeAsBytesSync(base64Decode(shot['data'] as String));
      }
      // cursor away -> threads retract, canvas removed
      await c.send('Input.dispatchMouseEvent', {'type': 'mouseMoved', 'x': 720, 'y': 130});
      await Future.delayed(const Duration(milliseconds: 1200));
      final gone = await c.js("!document.querySelector('canvas.threads')");
      results.add({'button': r['where'], 'label': r['label'], ...(s as Map), 'removedAfterLeaving': gone});
    }
    report('$lang threads (mouse moving)', results);

    // The cursor stands still and the page scrolls a waitlist button under it (wheel scroll, no mouse move).
    final still = await c.js('''(async () => {
      scrollTo({top: 0, behavior: 'instant'}); await new Promise(r => setTimeout(r, 400));
      const btn = document.querySelector('.premium [data-wait]');
      const top = btn.getBoundingClientRect().top + scrollY;
      scrollTo({top: top - 820 - 260, behavior: 'instant'}); await new Promise(r => setTimeout(r, 600));   // button 260px below the cursor, out of reach
      const r = btn.getBoundingClientRect();
      return {x: r.left + r.width / 2, y: r.top};
    })()''') as Map;
    final sx = (still['x'] as num).toDouble(), sy = 820.0;
    await c.send('Input.dispatchMouseEvent', {'type': 'mouseMoved', 'x': sx, 'y': sy});
    await Future.delayed(const Duration(milliseconds: 1500));
    final before = await c.js("!!document.querySelector('canvas.threads')");
    await c.send('Input.dispatchMouseEvent', {'type': 'mouseWheel', 'x': sx, 'y': sy, 'deltaX': 0, 'deltaY': 240});
    await Future.delayed(const Duration(milliseconds: 900));
    final after = await c.js("({canvas: !!document.querySelector('canvas.threads'), pulled: !!document.querySelector('.premium [data-wait].pulled')})");
    report('$lang threads (cursor still, page scrolled)', {'canvasBeforeScroll': before, 'afterWheel': after});

    // Scrolling: header shadow, reveals, count-up, carnet loop
    final sc = await c.js('''(async () => {
      const w = ms => new Promise(r => setTimeout(r, ms));
      scrollTo({top: 0, behavior: 'instant'}); await w(500);
      const top = document.querySelector('.site-head').classList.contains('scrolled');
      const steps = [];
      for (let y = 0; y < document.body.scrollHeight; y += 450) { scrollTo({top: y, behavior: 'instant'}); await w(120); }
      await w(800);
      const hidden = [...document.querySelectorAll('.rv')].filter(e => !e.classList.contains('in')).length;
      document.querySelector('#pricing').scrollIntoView({block: 'center', behavior: 'instant'}); await w(1600);
      const count = document.querySelector('[data-count]').textContent;
      document.querySelector('.carnet').scrollIntoView({block: 'center', behavior: 'instant'}); await w(5200);
      const cn = document.querySelector('.carnet');
      return {headerScrolledAtTop: top, headerScrolledLater: document.querySelector('.site-head').classList.contains('scrolled'),
              rvTotal: document.querySelectorAll('.rv').length, rvStillHidden: hidden, priceAfterCount: count,
              carnetSms: cn.classList.contains('sms'), carnetPaidRow: cn.querySelector('li.paid em')?.textContent, carnetTotal: cn.querySelector('[data-total]').textContent};
    })()''');
    report('$lang scrolling', sc);

    // Star: auto cycle and a click on a point
    final star = await c.js('''(async () => {
      const w = ms => new Promise(r => setTimeout(r, ms));
      scrollTo({top: 0, behavior: 'instant'}); await w(300);
      const cap = () => document.querySelector('.vcap b').textContent;
      const a = cap(); await w(3600); const b = cap();
      document.querySelector('.stage .blade[data-v="3"]').dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await w(100);
      return {first: a, after3_6s: b, afterClickOnPoint4: cap(), pillOn: document.querySelector('.pill.on span:last-child').textContent};
    })()''');
    report('$lang star', star);
  }

  // ── Mobile sizes: no horizontal overflow, hero fits the first screen ──
  for (final lang in ['en', 'fr', 'ar']) {
    for (final s in [[360, 640], [390, 844], [412, 915], [768, 1024], [1366, 768], [1920, 1080]]) {
      await sizeTo(c, s[0], s[1]);
      await load(c, '$base/$lang/');
      final m = await c.js('''(() => {
        const vis = sel => { const r = document.querySelector(sel).getBoundingClientRect(); return r.bottom <= innerHeight + 0.5 && r.top >= 0; };
        return {overflowX: document.documentElement.scrollWidth - innerWidth,
                heroFits: vis('.hero-cta') && vis('.pills') && vis('.vcap') && vis('.headline'),
                sheetBelowFold: document.querySelector('#problem').getBoundingClientRect().top >= innerHeight - 1};
      })()''');
      report('$lang ${s[0]}x${s[1]}', m);
    }
  }

  // ── prefers-reduced-motion: no motion class, no canvases running, everything visible and still ──
  for (final lang in ['en', 'ar']) {
    await sizeTo(c, 1440, 900, reduce: true);
    await load(c, '$base/$lang/');
    await c.send('Input.dispatchMouseEvent', {'type': 'mouseMoved', 'x': 300, 'y': 400});
    final r = await c.js('''(async () => {
      const w = ms => new Promise(r => setTimeout(r, ms));
      const b = document.querySelector('.hero [data-wait]').getBoundingClientRect();
      const cap1 = document.querySelector('.vcap b').textContent; await w(3800);
      document.querySelector('#pricing').scrollIntoView({behavior: 'instant'}); await w(1500);
      return {motionClass: document.documentElement.classList.contains('motion'),
              runningAnimations: document.getAnimations().filter(a => a.playState === 'running').length,
              starCycled: cap1 !== document.querySelector('.vcap b').textContent,
              price: document.querySelector('[data-count]').textContent,
              carnetStatic: document.querySelector('.carnet').classList.contains('static'),
              hiddenRv: [...document.querySelectorAll('.rv')].filter(e => getComputedStyle(e).opacity !== '1').length,
              threadsCanvas: !!document.querySelector('canvas.threads')};
    })()''');
    report('$lang reduced motion', r);
  }

  // ── The form, with fetch replaced by a fake (nothing is sent to Web3Forms) ──
  for (final lang in ['en', 'ar']) {
    await sizeTo(c, 1440, 900);
    await load(c, '$base/$lang/');
    final f = await c.js('''(async () => {
      const w = ms => new Promise(r => setTimeout(r, ms));
      const form = document.querySelector('#join-form'), st = form.querySelector('.form-status');
      const out = {action: form.action, method: form.method,
        hidden: Object.fromEntries([...form.querySelectorAll('input[type=hidden]')].map(i => [i.name, i.value]))};
      let sent = null, reply = {status: 200, body: {success: true}};
      window.fetch = (url, opt) => { sent = {url, headers: opt.headers, body: JSON.parse(opt.body)}; return Promise.resolve(new Response(JSON.stringify(reply.body), {status: reply.status})); };
      form.querySelector('button[type=submit]').click(); await w(50);
      out.emptySubmit = st.textContent;
      form.name.value = 'Test'; form.email.value = 'not-an-email'; form.querySelector('button[type=submit]').click(); await w(50);
      out.badEmail = st.textContent;
      form.email.value = 'test@example.com';
      form.querySelector('input[value=contact]').click(); await w(50);
      out.contactButton = form.querySelector('[data-send]').textContent;
      form.querySelector('button[type=submit]').click(); await w(50);
      out.contactNoMessage = st.textContent;
      form.message.value = 'Hello';
      reply = {status: 400, body: {success: false, message: 'nope'}};
      form.querySelector('button[type=submit]').click(); await w(100);
      out.rejected = st.textContent;
      window.fetch = () => Promise.reject(new TypeError('network'));
      form.querySelector('button[type=submit]').click(); await w(100);
      out.network = st.textContent;
      reply = {status: 200, body: {success: true}};
      window.fetch = (url, opt) => { sent = {url, headers: opt.headers, body: JSON.parse(opt.body)}; return Promise.resolve(new Response(JSON.stringify(reply.body), {status: 200})); };
      form.querySelector('button[type=submit]').click(); await w(100);
      out.contactSent = sent; out.contactDone = getComputedStyle(document.querySelector('[data-done=contact]')).display !== 'none' && getComputedStyle(form).display === 'none';   // what is on screen, not just the attribute
      out.doneText = document.querySelector('[data-done=contact] h3').textContent;
      return out;
    })()''');
    report('$lang form', f);
  }

  // ── No JavaScript: the form posts by itself (fields, names, required) and the sent pages render ──
  await c.send('Emulation.setScriptExecutionDisabled', {'value': true});
  for (final lang in ['en', 'fr', 'ar']) {
    await sizeTo(c, 1440, 900);
    final loaded = c.events.stream.firstWhere((e) => e['method'] == 'Page.loadEventFired');
    await c.send('Page.navigate', {'url': '$base/$lang/'});
    await loaded;
    // Runtime.evaluate still works with page scripts disabled
    final n = await c.js('''(() => { const f = document.querySelector('#join-form');
      return {noValidate: f.noValidate, required: [...f.querySelectorAll('[required]')].map(e => e.name),
              fields: [...new FormData(f).keys()], heroText: getComputedStyle(document.querySelector('.hero-sub')).opacity,
              rvVisible: [...document.querySelectorAll('.rv')].every(e => getComputedStyle(e).opacity === '1'),
              vcap: document.querySelector('.vcap').textContent.trim().slice(0, 40)}; })()''');
    report('$lang no-JS page', n);
  }
  await c.send('Emulation.setScriptExecutionDisabled', {'value': false});
  for (final lang in ['en', 'fr', 'ar']) {
    for (final s in [[1440, 900], [390, 844]]) {
      await sizeTo(c, s[0], s[1]);
      await load(c, '$base/$lang/sent/');
      final shot = await c.send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 82});
      File('mockups/shots/site/$lang-${s[0] > 600 ? 'desktop' : 'mobile'}-sent.jpg').writeAsBytesSync(base64Decode(shot['data'] as String));
      final t = await c.js("({title: document.title, h1: document.querySelector('h1').textContent, back: document.querySelector('.sent-c .btn').getAttribute('href'), overflowX: document.documentElement.scrollWidth - innerWidth})");
      report('$lang sent page ${s[0]}', t);
    }
  }
  report('console errors and exceptions', errors);
  await c.ws.close();
}

/// Load speed under Lighthouse's mobile conditions (150 ms RTT, 1.6 Mbps down, 750 kbps up, CPU 4x slower),
/// no cache: first contentful paint, largest contentful paint, load event, and the bytes on the wire.
/// Over the local server, so it measures the page, not Vercel (which also compresses HTML/CSS/JS).
Future<void> perf() async {
  final c = await openPage();
  await c.send('Network.enable');
  await c.send('Network.setCacheDisabled', {'cacheDisabled': true});
  var bytes = 0;
  final files = <String, int>{};
  final urls = <String, String>{};
  c.events.stream.listen((e) {
    final p = e['params'] as Map?;
    if (e['method'] == 'Network.responseReceived') urls[p!['requestId'] as String] = ((p['response'] as Map)['url'] as String).replaceFirst(base, '');
    if (e['method'] == 'Network.loadingFinished') {
      final n = (p!['encodedDataLength'] as num).toInt();
      bytes += n;
      files[urls[p['requestId']] ?? '?'] = n;
    }
  });
  for (final lang in ['en', 'fr', 'ar']) {
    for (final s in [[412, 915], [1440, 900]]) {
      await sizeTo(c, s[0], s[1]);
      await c.send('Network.emulateNetworkConditions', {'offline': false, 'latency': 150, 'downloadThroughput': 1.6e6 / 8, 'uploadThroughput': 750e3 / 8});
      await c.send('Emulation.setCPUThrottlingRate', {'rate': 4});
      bytes = 0;
      files.clear();
      await load(c, '$base/$lang/');
      final m = await c.js('''new Promise(res => {
        let lcp = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) lcp = e.startTime; }).observe({type: 'largest-contentful-paint', buffered: true});
        setTimeout(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const fcp = performance.getEntriesByName('first-contentful-paint')[0];
          res({fcp: Math.round(fcp ? fcp.startTime : -1), lcp: Math.round(lcp), domContentLoaded: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd)});
        }, 300);
      })''');
      stdout.writeln(jsonEncode({'page': '/$lang/', 'size': '${s[0]}x${s[1]}', ...(m as Map), 'kbOnWire': (bytes / 1024).round(), 'files': files}));
    }
  }
  await c.send('Emulation.setCPUThrottlingRate', {'rate': 1});
  await c.send('Network.emulateNetworkConditions', {'offline': false, 'latency': 0, 'downloadThroughput': -1, 'uploadThroughput': -1});
  await c.ws.close();
}

Future<void> main(List<String> args) async {
  if (args.contains('perf')) await perf();
  if (args.contains('shots')) await shots();
  if (args.contains('checks')) await checks();
  exit(0);
}
