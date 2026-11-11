/* Direction B · Constellation — editorial. The star is the hero; the four words sit on its four points. */
window.ITRI_DIR = {
  hero: function (h) {
    var T = h.T;
    var labs = T.values.map(function (v, i) {
      return '<button type="button" class="vtrig clab c' + i + '" data-v="' + i + '">' + v.name + '</button>';
    }).join('');
    return '<div class="wrap hero-b">' +
      '<p class="eyebrow up" style="--i:0"><span lang="zgh" class="tfn">ⵉⵜⵔⵉ</span> · ' + T.hero.eyebrow + '</p>' +
      '<div class="constel up" style="--i:1"><div class="ring" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="halo"></div>' + h.star('draw', true) + labs + '</div>' +
      '<p class="vcap up" style="--i:2" aria-live="polite"><span data-vtext="line"></span></p>' +
      '<h1 class="up" style="--i:3">' + T.hero.title + '</h1>' +
      '<p class="hero-sub up" style="--i:4">' + T.hero.sub + '</p>' +
      '<div class="hero-cta up" style="--i:5">' + h.btn(T.cta, '#join') + h.btn(T.cta2, '#how', 'btn-ghost') + '</div>' +
      '<p class="hero-note up" style="--i:6"><i class="pulse"></i>' + T.hero.note + '</p>' +
    '</div>';
  },
  values: function (h) {
    var T = h.T;
    var words = T.values.map(function (v, i) {
      return '<button type="button" class="vtrig bw" data-v="' + i + '">' + v.name + '</button>';
    }).join('<span class="bar" aria-hidden="true"></span>');
    return '<div class="wrap">' +
      '<p class="eyebrow rv">' + T.valuesHead.eyebrow + '</p>' +
      '<div class="bigslogan rv">' + words + '</div>' +
      '<div class="vpanel rv" data-tiltzone>' +
        '<div class="vp-star">' + h.star('', true) + '</div>' +
        '<div class="vp-text" aria-live="polite"><span class="vp-num" data-vnum>01</span><h3 data-vtext="line"></h3><p data-vtext="body"></p></div>' +
        h.phone() +
      '</div></div>';
  }
};
