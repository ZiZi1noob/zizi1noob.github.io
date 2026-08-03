(function(){
  'use strict';

  function fillBars(scope){
    scope.querySelectorAll('.bar-fill').forEach(function(b){
      b.style.width = b.getAttribute('data-width');
    });
  }

  function initSharedInteractions(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = document.querySelectorAll('.reveal');
    var bars = document.querySelectorAll('.bar-fill');

    if (reduce || !('IntersectionObserver' in window)){
      reveals.forEach(function(el){ el.classList.add('in-view'); });
      bars.forEach(function(b){ b.style.width = b.getAttribute('data-width'); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            entry.target.classList.add('in-view');
            fillBars(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function(el){ io.observe(el); });
    }
  }

  function initFloatTop(){
    var WEAPONS = [
      { name: 'axe', src: 'assets/weapon-axe.svg' },
      { name: 'sword', src: 'assets/weapon-sword.svg' },
      { name: 'blade', src: 'assets/weapon-blade.svg' },
      { name: 'spear', src: 'assets/weapon-spear.svg' },
      { name: 'staff', src: 'assets/weapon-staff.svg' },
    ];
    WEAPONS.forEach(function(w){ var _i = new Image(); _i.src = w.src; });

    var SPARK_COLORS = ['#00E5FF','#FF1493','#FFCB2E','#7CFF4F','#B388FF','#FB923C'];

    var _ftBadge = document.getElementById('floatTop');
    if (!_ftBadge) return;
    var _ftImg = _ftBadge.querySelector('img');
    var _ftIdx  = 0;

    function explode(el){
      var N = 28;
      for (var i = 0; i < N; i++){
        var p = document.createElement('span');
        p.className = 'spark';
        var ang  = Math.random() * Math.PI * 2;
        var dist = 14 + Math.random() * 28;
        var size = 3 + Math.floor(Math.random() * 4);
        p.style.setProperty('--tx', (Math.cos(ang) * dist).toFixed(1) + 'px');
        p.style.setProperty('--ty', (Math.sin(ang) * dist).toFixed(1) + 'px');
        p.style.setProperty('--sz', size + 'px');
        p.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
        p.style.animationDelay = (Math.random() * 0.06).toFixed(3) + 's';
        p.style.animationDuration = (0.4 + Math.random() * 0.3).toFixed(2) + 's';
        el.appendChild(p);
        p.addEventListener('animationend', function(){ p.remove(); });
      }
      var ring = document.createElement('span');
      ring.className = 'spark-ring';
      el.appendChild(ring);
      ring.addEventListener('animationend', function(){ ring.remove(); });
    }

    _ftBadge.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
      _ftIdx = (_ftIdx + 1) % WEAPONS.length;
      var w = WEAPONS[_ftIdx];
      _ftImg.src = w.src;
      _ftImg.alt = w.name;
      _ftBadge.setAttribute('aria-label', 'Back to top · ' + w.name);

      _ftImg.classList.remove('swing');
      void _ftImg.offsetWidth;
      _ftImg.classList.add('swing');
      _ftImg.addEventListener('animationend', function(){ _ftImg.classList.remove('swing'); }, { once: true });

      explode(_ftBadge);

      document.body.classList.remove('shake');
      void document.body.offsetWidth;
      document.body.classList.add('shake');
      document.body.addEventListener('animationend', function(){
        document.body.classList.remove('shake');
      }, { once: true });

      _ftBadge.classList.remove('flash');
      void _ftBadge.offsetWidth;
      _ftBadge.classList.add('flash');
      _ftBadge.addEventListener('animationend', function(){
        _ftBadge.classList.remove('flash');
      }, { once: true });
    });
  }

  function showError(msg){
    var b = document.getElementById('errorBanner');
    b.classList.add('show');
    b.innerHTML =
      '<img class="err-ico" src="assets/err-icon.svg" width="44" height="44" alt="" aria-hidden="true">'+
      '<div class="err-body">'+msg+'</div>'+
      '<img class="err-float err-float--1" src="assets/err-star.svg" width="22" height="22" alt="" aria-hidden="true">'+
      '<img class="err-float err-float--2" src="assets/err-dot.svg" width="14" height="14" alt="" aria-hidden="true">';
  }

  window.AppBoot = {
    boot: function(d){
      var ss = document.querySelector('link[href="style.css"]');
      if (ss && d.version) ss.href = 'style.css?v=' + d.version;

      AppHeader.render(d);
      document.getElementById('aboutMount').innerHTML = AppAbout.render(d);
      document.getElementById('timelineMount').innerHTML = AppJourney.render(d);
      document.getElementById('skillsMount').innerHTML = AppSkills.render(d);
      document.getElementById('contactMount').innerHTML = AppContact.render(d);
      document.getElementById('footerMount').innerHTML = AppFooter.render(d);

      AppHeader.init();
      AppJourney.init(d);
      AppSkills.init(d);
      AppContact.init(d);
      initSharedInteractions();
      initFloatTop();
    },

    fetchData: function(){
      fetch('./assets/data.json', { cache: 'no-store' })
        .then(function(r){
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function(d){ AppBoot.boot(d); })
        .catch(function(err){
          showError(' Could not load <code>assets/data.json</code> — the site needs this file to render. ');
        });
    }
  };

  AppBoot.fetchData();
})();
