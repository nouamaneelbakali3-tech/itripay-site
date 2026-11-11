/* Direction A · Polaris — centred, calm, engineered. Star, phone and legend on one horizon. */
window.ITRI_DIR = {
  hero: function (h) {
    var T = h.T;
    var legend = T.values.map(function (v, i) {
      return '<li><button type="button" class="vtrig lg" data-v="' + i + '">' + h.glyph(i) + '<span><b>' + v.name + '</b><small>' + v.line + '</small></span></button></li>';
    }).join('');
    return '<div class="wrap hero-a" data-tiltzone>' +
      '<div class="hero-text">' +
        '<p class="eyebrow up" style="--i:0">' + T.hero.eyebrow + '</p>' +
        '<h1 class="up" style="--i:1">' + T.hero.title + '</h1>' +
        '<p class="hero-sub up" style="--i:2">' + T.hero.sub + '</p>' +
        '<div class="hero-cta up" style="--i:3">' + h.btn(T.cta, '#join') + h.btn(T.cta2, '#how', 'btn-ghost') + '</div>' +
        '<p class="hero-note up" style="--i:4"><i class="pulse"></i>' + T.hero.note + '</p>' +
      '</div>' +
      '<div class="stage up" style="--i:5">' +
        '<div class="compass"><div class="halo"></div>' + h.star('draw', true) + '</div>' +
        h.phone() +
        '<ul class="legend">' + legend + '</ul>' +
      '</div>' +
    '</div><div class="horizon" aria-hidden="true"></div>';
  },
  values: function (h) {
    var T = h.T;
    return '<div class="wrap">' + h.head(T.valuesHead) + '<div class="vcross">' +
      '<div class="vstar rv">' + h.star('', true) + '</div>' +
      T.values.map(function (v, i) {
        return '<article class="vcard card vtrig rv c' + i + '" data-v="' + i + '" tabindex="0" style="--i:' + i + '"><div class="vtop">' + h.glyph(i) + '<span class="vnum">0' + (i + 1) + '</span></div><h3>' + v.name + '</h3><p class="vline">' + v.line + '</p><p>' + v.body + '</p></article>';
      }).join('') +
    '</div></div>';
  }
};
