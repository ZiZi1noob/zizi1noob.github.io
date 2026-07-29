(function(){
  'use strict';
  var U = window.AppUtils;

  window.AppAbout = {
    render: function(d){
      var a = d.about;
      var paras = a.paragraphs.map(function(p){ return '<p>'+U.rich(p)+'</p>'; }).join('');
      var stats = a.stats.map(function(s){
        return '<div class="about-stat"><div class="about-stat__num">'+U.esc(s.num)+'</div><div class="about-stat__label">'+U.esc(s.label)+'</div></div>';
      }).join('');
      return ''+
      '<section class="about-section" id="about">'+
        '<div class="wrap about-section__grid">'+
          '<div class="about-section__portrait reveal"><img class="about-section__photo" src="assets/photo.jpeg" alt="'+U.esc(a.title)+' — Ziyang ZHAN" width="240" height="240"></div>'+
          '<div class="reveal" style="--d:.1s">'+
            '<span class="kicker">'+U.esc(a.kicker)+'</span>'+
            '<h2>'+U.esc(a.title)+'</h2>'+
            paras+
            '<div class="about-section__stats">'+stats+'</div>'+
          '</div>'+
        '</div>'+
      '</section>';
    }
  };
})();
