(function(){
  'use strict';
  var U = window.AppUtils;

  window.AppFooter = {
    render: function(d){
      var f = d.footer;
      return ''+
      '<div class="wrap">'+
        '<div class="site-footer__center">'+
          '<a href="#about" class="site-footer__name">'+U.esc(d.site)+'</a>'+
          '<p class="site-footer__slogan mono">'+U.rich(f.slogan)+'</p>'+
          '<p class="site-footer__built">'+U.esc(f.bottom)+'</p>'+
        '</div>'+
      '</div>';
    }
  };
})();
