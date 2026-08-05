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
      // Force reload so each weapon's built-in SVG/SMIL animation replays.
      _ftImg.src = w.src + '?t=' + Date.now();
      _ftImg.alt = w.name;
      _ftBadge.setAttribute('aria-label', 'Back to top · ' + w.name);

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
      '<div class="err-body">'+
        msg+
        '<div class="err-actions">'+
          '<a class="btn btn--small" href="ai-tool.html">Try AI generation</a>'+
        '</div>'+
      '</div>'+
      '<img class="err-float err-float--1" src="assets/err-star.svg" width="22" height="22" alt="" aria-hidden="true">'+
      '<img class="err-float err-float--2" src="assets/err-dot.svg" width="14" height="14" alt="" aria-hidden="true">';
  }

  function basename(path){
    if (!path) return '';
    return String(path).replace(/\\/g, '/').split('/').pop();
  }

  function fileToId(file){
    var name = basename(file);
    return name.replace(/\.json$/i, '');
  }

  function prettyNameFromFile(label){
    var name = basename(label).replace(/\.json$/i, '').replace(/[-_]/g, ' ').trim();
    if (!name) return 'Profile';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function resolveFile(file){
    if (!file) return null;
    if (/^(https?:)?\/\//i.test(file)) return file;
    return './' + String(file).replace(/^\.?\/?/, '');
  }

  function fetchJSON(file){
    var url = resolveFile(file);
    return fetch(url, { cache: 'no-store' })
      .then(function(r){
        if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
        return r.json();
      });
  }

  /*
    Minimal format checker for portfolio JSON files.
    Required fields: about (object).
    The "site" display name is optional; when omitted the UI derives it
    from the source filename (e.g. cache-mock.json -> Cache mock).
  */
  function validateProfile(data){
    var errors = [];
    if (!data || typeof data !== 'object' || Array.isArray(data)){
      errors.push('JSON must be an object');
      return { valid: false, errors: errors };
    }
    if (!data.about || typeof data.about !== 'object'){
      errors.push('missing "about" section');
    }
    return { valid: errors.length === 0, errors: errors };
  }

  function joinPath(dir, file){
    dir = String(dir || '').replace(/\/$/, '');
    file = String(file || '').replace(/^\//, '');
    if (!dir) return file;
    return dir + '/' + file;
  }

  /*
    Profiles are managed centrally by assets/profiles.json.
    It declares a directory and a list of files; each file is resolved
    relative to that directory. Invalid profiles are shown in the selector
    with a warning and cannot be selected.
  */
  var DataSource = {
    STORAGE_KEY: 'last_profile_id',
    CACHE_STORAGE_KEY: 'cache_profiles',
    MANIFEST: 'assets/profiles.json',
    profiles: [], // { id, file, site, data, valid, errors, cache }
    cacheProfiles: [],
    currentId: null,

    getLastSource: function(){
      try { return sessionStorage.getItem(this.STORAGE_KEY); }
      catch(e) { return null; }
    },

    setLastSource: function(id){
      try { sessionStorage.setItem(this.STORAGE_KEY, id); }
      catch(e) { /* ignore */ }
    },

    loadCacheProfiles: function(){
      var self = this;
      var list = [];
      try {
        var raw = localStorage.getItem(self.CACHE_STORAGE_KEY);
        if (raw) list = JSON.parse(raw);
      } catch(e) { list = []; }
      if (!Array.isArray(list)) list = [];
      self.cacheProfiles = list.map(function(item, idx){
        var data = item.data || null;
        var check = data ? validateProfile(data) : { valid: false, errors: ['missing data'] };
        var label = item.label || 'Cache profile';
        return {
          id: item.id || ('cache-' + Date.now() + '-' + idx),
          file: '',
          cache: true,
          site: (data && data.site) || prettyNameFromFile(label),
          label: label,
          data: data,
          valid: check.valid,
          errors: check.errors
        };
      });
    },

    saveCacheProfiles: function(){
      try {
        var list = this.cacheProfiles.map(function(p){
          return { id: p.id, label: p.label, data: p.data };
        });
        localStorage.setItem(this.CACHE_STORAGE_KEY, JSON.stringify(list));
      } catch(e) { /* ignore */ }
    },

    addCacheProfile: function(data, label){
      var self = this;
      var check = validateProfile(data);
      if (!check.valid){
        return { success: false, errors: check.errors };
      }
      var id = 'cache-' + Date.now();
      var rawLabel = label || 'Cache profile';
      var fileLabel = /[\\/]/.test(rawLabel) ? basename(rawLabel) : rawLabel;
      var profile = {
        id: id,
        file: '',
        cache: true,
        site: (data && data.site) || prettyNameFromFile(fileLabel),
        label: fileLabel,
        data: data,
        valid: true,
        errors: []
      };
      self.cacheProfiles.push(profile);
      self.saveCacheProfiles();
      self.profiles = self.profiles.filter(function(p){ return !p.cache; }).concat(self.cacheProfiles);
      return { success: true, id: id, profile: profile };
    },

    deleteCacheProfile: function(id){
      var self = this;
      var idx = self.cacheProfiles.findIndex(function(p){ return p.id === id; });
      if (idx === -1) return false;
      self.cacheProfiles.splice(idx, 1);
      self.saveCacheProfiles();
      self.profiles = self.profiles.filter(function(p){ return !p.cache; }).concat(self.cacheProfiles);
      if (self.currentId === id){
        var fallback = self.profiles.find(function(p){ return p.valid; });
        if (fallback) self.switchTo(fallback.id);
      } else {
        if (window.AppHeader && window.AppHeader.renderDataSourceSelector){
          window.AppHeader.renderDataSourceSelector(self.profiles, self.currentId);
        }
      }
      return true;
    },

    clearMounts: function(){
      ['aboutMount','timelineMount','skillsMount','contactMount','footerMount'].forEach(function(id){
        var el = document.getElementById(id);
        if (el) el.innerHTML = '';
      });
    },

    loadManifest: function(){
      var self = this;
      return fetchJSON(self.MANIFEST)
        .then(function(manifest){
          if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)){
            throw new Error('profiles.json must be an object');
          }
          var directory = manifest.directory || 'assets';
          var list = Array.isArray(manifest.profiles) ? manifest.profiles : [];
          return list.map(function(p){
            var file = joinPath(directory, p.file);
            return {
              id: fileToId(file),
              file: file
            };
          }).filter(function(p){ return !!p.file; });
        });
    },

    loadProfileData: function(profile){
      return fetchJSON(profile.file)
        .then(function(data){
          var check = validateProfile(data);
          return {
            id: profile.id,
            file: profile.file,
            cache: false,
            site: (data && data.site) || prettyNameFromFile(profile.file),
            data: data,
            valid: check.valid,
            errors: check.errors
          };
        })
        .catch(function(err){
          return {
            id: profile.id,
            file: profile.file,
            cache: false,
            site: prettyNameFromFile(profile.file),
            data: null,
            valid: false,
            errors: [err.message || 'failed to load file']
          };
        });
    },

    init: function(){
      var self = this;
      return self.loadManifest().then(function(candidates){
        return Promise.all(candidates.map(function(p){ return self.loadProfileData(p); }));
      }).then(function(results){
        self.loadCacheProfiles();
        var mockPromise = Promise.resolve();
        if (!self.cacheProfiles.length){
          mockPromise = fetchJSON('assets/cache-mock.json')
            .then(function(data){
              self.addCacheProfile(data, 'assets/cache-mock.json');
            })
            .catch(function(){ /* no mock available */ });
        }
        return mockPromise.then(function(){
          self.profiles = results.concat(self.cacheProfiles);
          var validProfiles = self.profiles.filter(function(p){ return p.valid; });
          if (!validProfiles.length){
            showError(' No valid portfolio data found. Check <code>assets/profiles.json</code> and the configured profile-data directory. ');
            return Promise.reject(new Error('No valid profiles'));
          }

          var last = self.getLastSource();
          self.currentId = (last && validProfiles.find(function(p){ return p.id === last; }))
            ? last
            : validProfiles[0].id;

          return self.load(self.currentId);
        });
      });
    },

    load: function(id){
      var self = this;
      var profile = self.profiles.find(function(p){ return p.id === id && p.valid; })
        || self.profiles.find(function(p){ return p.valid; });
      if (!profile){
        showError(' No valid portfolio data found. ');
        return Promise.reject(new Error('No valid profiles'));
      }

      self.currentId = profile.id;
      self.setLastSource(profile.id);

      var banner = document.getElementById('errorBanner');
      if (banner) banner.classList.remove('show');

      AppBoot.boot(profile.data);

      if (window.AppHeader && window.AppHeader.renderDataSourceSelector){
        window.AppHeader.renderDataSourceSelector(self.profiles, self.currentId);
      }
    },

    switchTo: function(id){
      var profile = this.profiles.find(function(p){ return p.id === id; });
      if (!profile || !profile.valid) return;
      if (id === this.currentId) return;
      this.clearMounts();
      this.load(id);
    },

    basename: basename
  };

  window.DataSource = DataSource;

  window.AppBoot = {
    boot: function(d){
      var ss = document.querySelector('link[href="style.css"]');
      if (ss && d.version) ss.href = 'style.css?v=' + d.version;

      function mount(id, html){
        var el = document.getElementById(id);
        if (el) el.innerHTML = html;
      }

      AppHeader.render(d);
      mount('aboutMount', AppAbout.render(d));
      mount('timelineMount', AppJourney.render(d));
      mount('skillsMount', AppSkills.render(d));
      mount('contactMount', AppContact.render(d));
      mount('footerMount', AppFooter.render(d));

      AppHeader.init();
      AppJourney.init(d);
      AppSkills.init(d);
      AppContact.init(d);
      initSharedInteractions();
      initFloatTop();
    },

    fetchData: function(){
      DataSource.init();
    }
  };

  AppBoot.fetchData();
})();
