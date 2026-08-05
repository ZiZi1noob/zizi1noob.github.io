(function(){
  'use strict';
  var U = window.AppUtils;

  function basename(path){
    if (!path) return '';
    return String(path).replace(/\\/g, '/').split('/').pop();
  }

  
  // Choose the AI icon used in the "Generate with AI" dropdown entry.
  // Available names: plane, robot, brain, bolt, sparkle
  var AI_ICON_NAME = 'plane';

  function getAiIconSvg(name) {
    var svgs = {
      plane: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="data-source__ai-icon" aria-hidden="true"><defs><style>       .data-source__ai-icon { color: #fff; }       .ai-plane-shape { fill: currentColor; }       .ai-plane-trail { fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; opacity: 0.55; }       .ai-plane-spark { fill: currentColor; opacity: 0; }     </style></defs><g><path class="ai-plane-trail" d="M12 20 Q12 16 12 13"><animate attributeName="d" values="M12 20 Q12 16 12 13; M12 20 Q12 10 12 6; M12 20 Q12 16 12 13" dur="0.7s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animate attributeName="opacity" values="0.55;0.9;0.55" dur="0.7s" begin="indefinite" fill="remove" /></path><g><path class="ai-plane-shape" d="M4 11L20 6L14 22L11 14L4 11Z" /><animateTransform attributeName="transform" type="translate" values="0,0; 9,-16; 0,0" dur="0.7s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animateTransform attributeName="transform" type="rotate" values="0 12 12; -14 12 12; 0 12 12" dur="0.7s" additive="sum" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animateTransform attributeName="transform" type="scale" values="1;0.75;1" dur="0.7s" additive="sum" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /></g><circle class="ai-plane-spark" cx="10" cy="20" r="1.2"><animate attributeName="opacity" values="0;1;0" dur="0.7s" begin="indefinite" fill="remove" /><animateTransform attributeName="transform" type="translate" values="0,0; -3,9; 0,0" dur="0.7s" begin="indefinite" fill="remove" /></circle><circle class="ai-plane-spark" cx="14" cy="20" r="1"><animate attributeName="opacity" values="0;1;0" dur="0.7s" begin="indefinite" fill="remove" /><animateTransform attributeName="transform" type="translate" values="0,0; 3,10; 0,0" dur="0.7s" begin="indefinite" fill="remove" /></circle><circle class="ai-plane-spark" cx="12" cy="21.5" r="0.9"><animate attributeName="opacity" values="0;1;0" dur="0.7s" begin="indefinite" fill="remove" /><animateTransform attributeName="transform" type="translate" values="0,0; 0,12; 0,0" dur="0.7s" begin="indefinite" fill="remove" /></circle></g></svg>',
      robot: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="data-source__ai-icon" aria-hidden="true"><defs><style>       .data-source__ai-icon { color: #fff; }       .ai-bot-shape { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }       .ai-bot-eye { fill: currentColor; }       .ai-bot-scan { fill: none; stroke: currentColor; stroke-width: 1.2; stroke-linecap: round; opacity: 0.6; }     </style></defs><g><rect class="ai-bot-shape" x="5" y="7" width="14" height="12" rx="3" /><path class="ai-bot-shape" d="M9 4h6M12 4v3" /><circle class="ai-bot-eye" cx="9.5" cy="12" r="1.6"><animate attributeName="opacity" values="1;0.3;1" dur="0.6s" begin="indefinite" fill="remove" /><animate attributeName="r" values="1.6;2.3;1.6" dur="0.6s" begin="indefinite" fill="remove" /></circle><circle class="ai-bot-eye" cx="14.5" cy="12" r="1.6"><animate attributeName="opacity" values="1;0.3;1" dur="0.6s" begin="indefinite" fill="remove" /><animate attributeName="r" values="1.6;2.3;1.6" dur="0.6s" begin="indefinite" fill="remove" /></circle><line class="ai-bot-scan" x1="6" y1="16" x2="18" y2="16"><animate attributeName="y1" values="16;10;16" dur="0.7s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animate attributeName="y2" values="16;10;16" dur="0.7s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animate attributeName="opacity" values="0.6;1;0.6" dur="0.7s" begin="indefinite" fill="remove" /></line></g></svg>',
      brain: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="data-source__ai-icon" aria-hidden="true"><defs><style>       .data-source__ai-icon { color: #fff; }       .ai-brain-node { fill: currentColor; }       .ai-brain-link { fill: none; stroke: currentColor; stroke-width: 1.2; stroke-linecap: round; opacity: 0.5; }     </style></defs><g><path class="ai-brain-link" d="M12 6l-3 4M12 6l3 4M9 10l-2 5M15 10l2 5M9 15l3 3M15 15l-3 3" /><circle class="ai-brain-node" cx="12" cy="6" r="2"><animate attributeName="r" values="2;2.8;2" dur="0.7s" begin="indefinite" fill="remove" /><animate attributeName="opacity" values="1;0.6;1" dur="0.7s" begin="indefinite" fill="remove" /></circle><circle class="ai-brain-node" cx="9" cy="10" r="1.5"><animate attributeName="r" values="1.5;2.2;1.5" dur="0.7s" begin="indefinite" fill="remove" /><animate attributeName="opacity" values="1;0.6;1" dur="0.7s" begin="indefinite" fill="remove" /></circle><circle class="ai-brain-node" cx="15" cy="10" r="1.5"><animate attributeName="r" values="1.5;2.2;1.5" dur="0.7s" begin="indefinite" fill="remove" /><animate attributeName="opacity" values="1;0.6;1" dur="0.7s" begin="indefinite" fill="remove" /></circle><circle class="ai-brain-node" cx="7" cy="15" r="1.3"><animate attributeName="r" values="1.3;1.9;1.3" dur="0.7s" begin="indefinite" fill="remove" /><animate attributeName="opacity" values="1;0.6;1" dur="0.7s" begin="indefinite" fill="remove" /></circle><circle class="ai-brain-node" cx="17" cy="15" r="1.3"><animate attributeName="r" values="1.3;1.9;1.3" dur="0.7s" begin="indefinite" fill="remove" /><animate attributeName="opacity" values="1;0.6;1" dur="0.7s" begin="indefinite" fill="remove" /></circle><circle class="ai-brain-node" cx="12" cy="18" r="1.6"><animate attributeName="r" values="1.6;2.4;1.6" dur="0.7s" begin="indefinite" fill="remove" /><animate attributeName="opacity" values="1;0.6;1" dur="0.7s" begin="indefinite" fill="remove" /></circle></g></svg>',
      bolt: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="data-source__ai-icon" aria-hidden="true"><defs><style>       .data-source__ai-icon { color: #fff; }       .ai-bolt-shape { fill: currentColor; }     </style></defs><g><path class="ai-bolt-shape" d="M13 2L4 14h7l-2 8 10-12h-7l2-8z"><animateTransform attributeName="transform" type="scale" values="1;1.25;0.9;1" dur="0.6s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" /><animateTransform attributeName="transform" type="rotate" values="0 12 12; 10 12 12; -8 12 12; 0 12 12" dur="0.6s" additive="sum" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" /><animate attributeName="opacity" values="1;0.5;1;1" dur="0.6s" begin="indefinite" fill="remove" /></path></g></svg>',
      sparkle: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="data-source__ai-icon" aria-hidden="true"><defs><style>       .data-source__ai-icon { color: #fff; }       .ai-star-shape { fill: currentColor; }       .ai-star-ray { fill: currentColor; opacity: 0.7; }     </style></defs><g><path class="ai-star-shape" d="M12 2l1.8 5.5h5.7l-4.6 3.4 1.8 5.5-4.7-3.4-4.7 3.4 1.8-5.5-4.6-3.4h5.7z"><animateTransform attributeName="transform" type="rotate" values="0 12 12; 180 12 12; 360 12 12" dur="0.8s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animateTransform attributeName="transform" type="scale" values="1;1.3;0.9;1" dur="0.8s" additive="sum" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1" /></path><circle class="ai-star-ray" cx="12" cy="3" r="0.8"><animate attributeName="cy" values="3;0;3" dur="0.8s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="indefinite" fill="remove" /></circle><circle class="ai-star-ray" cx="21" cy="12" r="0.8"><animate attributeName="cx" values="21;24;21" dur="0.8s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="indefinite" fill="remove" /></circle><circle class="ai-star-ray" cx="12" cy="21" r="0.8"><animate attributeName="cy" values="21;24;21" dur="0.8s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="indefinite" fill="remove" /></circle><circle class="ai-star-ray" cx="3" cy="12" r="0.8"><animate attributeName="cx" values="3;0;3" dur="0.8s" begin="indefinite" fill="remove" calcMode="spline" keySplines="0.4 0 0.2 1; 0.4 0 0.2 1" /><animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="indefinite" fill="remove" /></circle></g></svg>'
    };
    return svgs[name] || svgs.plane;
  }

  function triggerAiIconAnimation(svg) {
    if (!svg) return;
    var anims = svg.querySelectorAll('animate, animateTransform, animateMotion');
    for (var i = 0; i < anims.length; i++) {
      try { anims[i].beginElement(); } catch (e) {}
    }
  }
window.AppHeader = {
    render: function(d){
      var mount = document.getElementById('headerMount');
      if (!mount) return;

      mount.innerHTML =
        '<header class="site-header">' +
          '<div class="wrap site-header__inner">' +
            '<a href="#about" class="site-header__logo" aria-label="Ziyang House"><span id="logoText"></span></a>' +
            '<nav class="site-header__nav" aria-label="Primary">' +
              '<button class="site-header__toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">≡</button>' +
              '<ul class="site-header__links" id="navLinks"></ul>' +
            '</nav>' +
          '</div>' +
        '</header>';

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
      if (window.DataSource && window.DataSource.profiles){
        this.renderDataSourceSelector(window.DataSource.profiles, window.DataSource.currentId);
      }
    },

    renderDataSourceSelector: function(profiles, currentId){
      profiles = profiles || [];
      var wrap = document.getElementById('dataSourceSelector');
      if (!wrap){
        var inner = document.querySelector('.site-header__inner');
        if (!inner) return;
        wrap = document.createElement('div');
        wrap.id = 'dataSourceSelector';
        wrap.className = 'data-source__wrap';
        inner.appendChild(wrap);
      }

      var current = profiles.find(function(p){ return p.id === currentId && p.valid; })
        || profiles.find(function(p){ return p.valid; });
      var currentFile = current
        ? (current.cache ? (current.label || 'Cache profile') : basename(current.file))
        : '...';

      function statusDot(status){
        if (status === true || status === 'ok'){
          return '<span class="data-source__status data-source__status--ok" aria-label="valid file" title="File profile"></span>';
        }
        if (status === 'cache'){
          return '<span class="data-source__status data-source__status--cache" aria-label="cache" title="Cached in browser"></span>';
        }
        return '<span class="data-source__status data-source__status--bad" aria-label="invalid" title="Format invalid"></span>';
      }

      var optionsHtml = profiles.map(function(p){
        var isCurrent = p.id === currentId;
        var fileName = p.cache ? (p.label || 'Cache profile') : basename(p.file);
        var siteName = p.site || 'Untitled';
        var cls = 'data-source__option';
        if (isCurrent) cls += ' is-active';
        if (!p.valid) cls += ' is-invalid';
        if (p.cache) cls += ' is-cache';
        var titleAttr = ' title="Site: ' + U.esc(siteName) + (!p.valid ? ' — ' + U.esc((p.errors || []).join('; ')) : '') + '"';
        var attrs = p.valid
          ? 'role="menuitem" data-source="' + U.esc(p.id) + '"'
          : 'role="menuitem" aria-disabled="true"';
        var deleteBtn = p.cache
          ? '<span class="data-source__delete" role="button" tabindex="0" data-delete="' + U.esc(p.id) + '" title="Delete from browser">×</span>'
          : '';
        var dotStatus = p.cache ? 'cache' : (p.valid ? 'ok' : 'bad');
        return '<button class="' + cls + '" type="button" ' + attrs + titleAttr + '>' +
                 '<div class="data-source__option-main">' +
                   statusDot(dotStatus) +
                   '<span class="data-source__option-file">' + U.esc(fileName) + '</span>' +
                 '</div>' +
                 '<div class="data-source__option-meta">' +
                   deleteBtn +
                 '</div>' +
               '</button>';
      }).join('');

      var titleAttr = current ? ' title="Current profile: ' + U.esc(currentFile) + '"' : '';
      var currentDotStatus = current ? (current.cache ? 'cache' : (current.valid ? 'ok' : 'bad')) : 'ok';
      var toggleCls = 'data-source__toggle';
      if (current && current.cache) toggleCls += ' is-cache';
      wrap.innerHTML =
        '<div class="data-source" id="dataSourceDropdown">' +
          '<button class="' + toggleCls + '" type="button" aria-expanded="false" aria-haspopup="true" id="dataSourceToggle"' + titleAttr + '>' +
            statusDot(currentDotStatus) +
            '<span class="data-source__label">Profile Data</span>' +
            '<span class="data-source__text">' + U.esc(currentFile) + '</span>' +
            '<span class="data-source__caret" aria-hidden="true">▾</span>' +
          '</button>' +
          '<div class="data-source__menu" role="menu" aria-hidden="true" id="dataSourceMenu">' +
            '<div class="data-source__group-title">Select profile data</div>' +
            optionsHtml +
            '<a class="data-source__ai" href="ai-tool.html" role="menuitem" id="dataSourceAiLink">' +
              getAiIconSvg(AI_ICON_NAME) +
              '<span>Generate with AI</span>' +
            '</a>' +
          '</div>' +
        '</div>';

      var toggle = document.getElementById('dataSourceToggle');
      var menu = document.getElementById('dataSourceMenu');
      var dropdown = document.getElementById('dataSourceDropdown');

      function close(){
        toggle.setAttribute('aria-expanded','false');
        menu.setAttribute('aria-hidden','true');
        dropdown.classList.remove('is-open');
      }

      function open(){
        toggle.setAttribute('aria-expanded','true');
        menu.setAttribute('aria-hidden','false');
        dropdown.classList.add('is-open');
      }

      toggle.addEventListener('click', function(e){
        e.stopPropagation();
        var navLinks = document.getElementById('navLinks');
        var navToggle = document.getElementById('navToggle');
        if (navLinks && navLinks.classList.contains('is-open')){
          navLinks.classList.remove('is-open');
          if (navToggle) navToggle.setAttribute('aria-expanded','false');
        }
        if (dropdown.classList.contains('is-open')) close(); else open();
      });

      menu.addEventListener('click', function(e){
        var deleteBtn = e.target.closest('[data-delete]');
        if (deleteBtn){
          e.stopPropagation();
          var id = deleteBtn.getAttribute('data-delete');
          if (window.DataSource && window.DataSource.deleteCacheProfile){
            window.DataSource.deleteCacheProfile(id);
          }
          return;
        }
        var opt = e.target.closest('[data-source]');
        if (!opt) return;
        var source = opt.getAttribute('data-source');
        if (window.DataSource && source !== window.DataSource.currentId){
          window.DataSource.switchTo(source);
        }
        close();
      });

      var aiLink = document.getElementById('dataSourceAiLink');
      if (aiLink){
        aiLink.addEventListener('click', function(e){
          e.preventDefault();
          triggerAiIconAnimation(aiLink.querySelector('svg'));
          var href = aiLink.getAttribute('href');
          setTimeout(function(){
            window.location.href = href;
          }, 700);
        });
      }
    },

    _closeDataSource: function(){
      var dropdown = document.getElementById('dataSourceDropdown');
      var toggle = document.getElementById('dataSourceToggle');
      var menu = document.getElementById('dataSourceMenu');
      if (toggle) toggle.setAttribute('aria-expanded','false');
      if (menu) menu.setAttribute('aria-hidden','true');
      if (dropdown) dropdown.classList.remove('is-open');
    },

    init: function(){
      document.addEventListener('click', function(e){
        var toggle = e.target.closest('#navToggle');
        if (toggle){
          var links = document.getElementById('navLinks');
          if (!links) return;
          var open = links.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          if (open) AppHeader._closeDataSource();
          return;
        }

        var a = e.target.closest('.site-header__link');
        if (a){
          var links = document.getElementById('navLinks');
          var t = document.getElementById('navToggle');
          if (links) links.classList.remove('is-open');
          if (t) t.setAttribute('aria-expanded','false');
          return;
        }

        var cta = e.target.closest('#headerCurrentCta');
        if (cta){
          var links = document.getElementById('navLinks');
          var t = document.getElementById('navToggle');
          if (links) links.classList.remove('is-open');
          if (t) t.setAttribute('aria-expanded','false');
          AppHeader.goToCurrentExperience();
          return;
        }

        var dropdown = document.getElementById('dataSourceDropdown');
        if (dropdown && !dropdown.contains(e.target)){
          AppHeader._closeDataSource();
        }
      });

      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape'){
          var links = document.getElementById('navLinks');
          var toggle = document.getElementById('navToggle');
          if (links && links.classList.contains('is-open')){
            links.classList.remove('is-open');
            if (toggle){
              toggle.setAttribute('aria-expanded','false');
              toggle.focus();
            }
          }
          AppHeader._closeDataSource();
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
