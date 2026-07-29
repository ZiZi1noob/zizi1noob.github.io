(function(){
  'use strict';
  var U = window.AppUtils;

  window.AppJourney = {
    render: function(d){
      var t = d.journey;
      var cp = d.current_proj;
      var overall = Math.round(cp.phases.reduce(function(sum, ph){ return sum + (ph.progress || 0); }, 0) / cp.phases.length);
      var hl = t.highlights || [];

      var items = t.items.map(function(it, i){
        var delay = (i*0.08).toFixed(2);
        var itemSkills = [];
        var projectsHtml = '';
        if (it.projects && it.projects.length){
          projectsHtml = '<div class="journey__subs">' + it.projects.map(function(sub){
            var subSkills = (sub.skills || []);
            itemSkills = itemSkills.concat(subSkills);
            var subSkillsAttr = subSkills.join(',');
            var descHtml = Array.isArray(sub.desc)
              ? '<ul class="journey__bullets">' + sub.desc.map(function(dd){ return '<li>'+U.richWithHL(dd, hl)+'</li>'; }).join('') + '</ul>'
              : '<p>'+U.richWithHL(sub.desc, hl)+'</p>';
            return ''+
            '<div class="journey__sub" data-skills="'+U.esc(subSkillsAttr)+'">'+
              '<span class="journey__sub-dot" aria-hidden="true"></span>'+
              '<div>'+
                '<h4>'+U.rich(sub.proj)+'</h4>'+
                descHtml+
              '</div>'+
            '</div>';
          }).join('') + '</div>';
        }
        var uniqueItemSkills = itemSkills.filter(function(s, idx, arr){ return arr.indexOf(s) === idx; }).join(',');
        return ''+
        '<div class="journey__item reveal" data-skills="'+U.esc(uniqueItemSkills)+'" style="--d:'+delay+'s">'+
          '<span class="journey__dot" aria-hidden="true"></span>'+
          '<div class="journey__card">'+
            '<span class="journey__year">'+U.esc(it.year)+'</span>'+
            '<h3>'+U.rich(it.role)+'</h3>'+
            (it.place ? '<div class="journey__place">'+U.rich(it.place)+'</div>' : '')+
            '<div class="journey__company">'+U.rich(it.company)+'</div>'+
            '<p>'+U.richWithHL(it.desc, hl)+'</p>'+
            projectsHtml+
          '</div>'+
        '</div>';
      }).join('');

      var tabs =
        '<button class="journey__tab active" data-tab="timeline" role="tab" aria-selected="true">Journey</button>'+
        '<button class="journey__tab journey__tab--live" data-tab="current" role="tab" aria-selected="false">Building</button>';

      var phases = cp.phases.map(function(ph, i){
        var delay = (i*0.06).toFixed(2);
        var hereBadge = ph.status === 'in-progress' ? '<span class="phase-here">You are here</span>' : '';
        return ''+
        '<div class="phase-item reveal status-'+U.esc(ph.status)+'" style="--d:'+delay+'s">'+
          '<span class="phase-dot" aria-hidden="true"></span>'+
          '<div class="phase-card">'+
            '<div class="phase-head">'+
              '<h4>'+U.esc(ph.name)+'</h4>'+
              '<span class="phase-status">'+U.esc(ph.status)+'</span>'+
              '<span class="phase-date mono">'+U.esc(ph.date)+'</span>'+
            '</div>'+
            '<p>'+U.esc(ph.desc)+'</p>'+
            '<div class="bar"><div class="bar-fill c'+((i%5)+1)+'" data-width="'+U.esc(ph.progress)+'%"></div></div>'+
            '<span class="phase-pct mono">'+U.esc(ph.progress)+'%</span>'+
            hereBadge+
          '</div>'+
        '</div>';
      }).join('');

      var githubRepoLink = cp.github_repo ? '<a class="overall-github" href="'+U.esc(cp.github_repo)+'" target="_blank" rel="noopener" aria-label="View on GitHub"><img src="assets/contact-github.svg" alt="GitHub" width="18" height="18"></a>' : '';

      var currentPanel = ''+
      '<div class="current-intro reveal">'+
        '<h3>'+U.esc(cp.title)+'</h3>'+
        '<p>'+U.esc(cp.desc)+'</p>'+
        '<div class="current-meta">'+
          '<span class="mono">Started: '+U.esc(cp.startDate)+'</span>'+
          '<span class="mono">Overall: '+U.esc(overall)+'%</span>'+
          githubRepoLink+
        '</div>'+
        '<div class="bar overall-bar"><div class="bar-fill c1" data-width="'+U.esc(overall)+'%"></div></div>'+
      '</div>'+
      '<div class="phase-timeline">'+
        '<div class="phase-line" aria-hidden="true"></div>'+
        '<div class="phase-item phase-item--start reveal">'+
          '<span class="phase-dot" aria-hidden="true"></span>'+
          '<div class="phase-card">'+
            '<span class="phase-date mono">'+U.esc(cp.startDate)+'</span>'+
            '<h4>Project started</h4>'+
          '</div>'+
        '</div>'+
        phases+
      '</div>';

      return ''+
      '<section class="journey-section tex-dots" id="journey">'+
        '<div class="wrap">'+
          '<div class="section-head reveal" style="text-align:center;">'+
            '<span class="kicker">'+U.esc(t.kicker)+'</span>'+
            '<h2>'+U.esc(t.title)+'</h2>'+
          '</div>'+
          '<div class="journey__tabs" role="tablist">'+tabs+'</div>'+
          '<div class="journey__panel active" id="tab-panel-timeline">'+
            '<div class="journey__timeline">'+items+'</div>'+
          '</div>'+
          '<div class="journey__panel" id="tab-panel-current">'+currentPanel+'</div>'+
        '</div>'+
      '</section>';
    },

    switchTab: function(id){
      document.querySelectorAll('.journey__tab').forEach(function(b){
        var active = b.dataset.tab === id;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      document.querySelectorAll('.journey__panel').forEach(function(p){
        var active = p.id === 'tab-panel-' + id;
        p.classList.toggle('active', active);
        if (active){
          p.querySelectorAll('.bar-fill').forEach(function(b){ b.style.width = b.getAttribute('data-width'); });
        }
      });
    },

    init: function(d){
      var self = this;
      document.querySelectorAll('.journey__tab').forEach(function(btn){
        btn.addEventListener('click', function(){ self.switchTab(btn.dataset.tab); });
      });
    }
  };
})();
