(function(){
  'use strict';
  var U = window.AppUtils;

  window.AppHeader = {
    render: function(d){
      var lt = document.getElementById('logoText');
      if (lt) lt.textContent = d.site;
      document.title = d.site + ' · Portfolio';

      var navLinks = document.getElementById('navLinks');
      var linksHtml = d.nav.map(function(n){
        return '<li class="site-header__item"><a class="site-header__link" href="'+U.esc(n.href)+'">'+U.esc(n.label)+'</a></li>';
      }).join('');

      var ctaHtml = '';
      if (d.current_proj && d.current_proj.title){
        ctaHtml =
          '<li class="site-header__item site-header__item--cta">' +
            '<button class="site-header__cta" id="headerCurrentCta" type="button" aria-label="Jump to current experience: '+U.esc(d.current_proj.title)+'">' +
              '<span class="site-header__cta-dot" aria-hidden="true"></span>' +
              '<span class="site-header__cta-label">Building</span>' +
            '</button>' +
          '</li>';
      }

      navLinks.innerHTML = linksHtml + ctaHtml;
    },

    init: function(){
      var toggle = document.getElementById('navToggle');
      var links  = document.getElementById('navLinks');
      if (!toggle || !links) return;

      toggle.addEventListener('click', function(){
        var open = links.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      links.addEventListener('click', function(e){
        var a = e.target.closest('.site-header__link');
        if (a){
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded','false');
        }
        var cta = e.target.closest('#headerCurrentCta');
        if (cta){
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded','false');
          AppHeader.goToCurrentExperience();
        }
      });

      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && links.classList.contains('is-open')){
          links.classList.remove('is-open');
          toggle.setAttribute('aria-expanded','false');
          toggle.focus();
        }
      });
    },

    goToCurrentExperience: function(){
      var journeySection = document.getElementById('journey');
      if (!journeySection) return;

      if (window.AppJourney && window.AppJourney.switchTab){
        window.AppJourney.switchTab('current');
      }

      journeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
})();
