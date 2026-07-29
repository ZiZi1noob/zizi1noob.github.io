(function(){
  'use strict';
  var U = window.AppUtils;

  window.AppSkills = {
    render: function(d){
      var s = d.skills;
      var axes = s.axes || [];
      var N = axes.length;
      var isMobile = window.innerWidth < 640;
      var cx = isMobile ? 160 : 240, cy = isMobile ? 160 : 240, r = isMobile ? 95 : 165;
      var viewSize = isMobile ? 320 : 480;

      function labelRadius(name){
        var extra = isMobile ? 18 : 36;
        var len = name.length;
        if (isMobile && len > 6) extra -= (len - 6) * 3;
        if (isMobile && extra < 6) extra = 6;
        return r + extra;
      }

      var levels = 5;
      function rad(i){ return (Math.PI * 2 * i / N) - Math.PI / 2; }

      var grid = [];
      for (var lv = 1; lv <= levels; lv++){
        var pts = [];
        for (var i = 0; i < N; i++){
          var a = rad(i), p = lv / levels;
          pts.push((cx + r * p * Math.cos(a)) + ',' + (cy + r * p * Math.sin(a)));
        }
        grid.push('<polygon points="'+pts.join(' ')+'" fill="none" stroke="rgba(232,233,239,0.10)" stroke-width="1" stroke-dasharray="3,4"/>');
      }

      var axesSvg = [];
      for (var i = 0; i < N; i++){
        var a = rad(i);
        var col = U.esc(axes[i].color || 'var(--cyan)');
        axesSvg.push('<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+r*Math.cos(a))+'" y2="'+(cy+r*Math.sin(a))+'" stroke="'+col+'" stroke-width="1" stroke-opacity="0.25"/>');
      }

      var dpts = [];
      for (var i = 0; i < N; i++){
        var a = rad(i), p = axes[i].pct / 100;
        dpts.push((cx + r * p * Math.cos(a)) + ',' + (cy + r * p * Math.sin(a)));
      }
      var polyPoints = dpts.join(' ');
      var dataPoly = '<polygon class="radar-area" points="'+polyPoints+'" fill="rgba(34,211,238,0.10)" stroke="var(--cyan)" stroke-width="2" data-pts="'+polyPoints+'"/>';

      var dots = [], labels = [], hitAreas = [];
      for (var i = 0; i < N; i++){
        var a = rad(i), p = axes[i].pct / 100;
        var dx = cx + r * p * Math.cos(a), dy = cy + r * p * Math.sin(a);
        var lr = labelRadius(axes[i].name);
        var lx = cx + lr * Math.cos(a), ly = cy + lr * Math.sin(a);
        var anchor = Math.cos(a) > 0.35 ? 'end' : (Math.cos(a) < -0.35 ? 'start' : 'middle');
        var col = U.esc(axes[i].color || 'var(--cyan)');
        var itemsJson = JSON.stringify(axes[i].items || []).replace(/"/g, '&quot;');
        dots.push('<circle class="radar-dot" cx="'+dx+'" cy="'+dy+'" r="5" fill="var(--bg)" stroke="'+col+'" stroke-width="2.5" data-axis="'+i+'"/>');
        labels.push('<text class="radar-label" x="'+lx+'" y="'+ly+'" text-anchor="'+anchor+'" dominant-baseline="middle" fill="'+col+'" data-axis="'+i+'">'+U.esc(axes[i].name)+'</text>');
        hitAreas.push('<circle cx="'+dx+'" cy="'+dy+'" r="14" fill="transparent" stroke="none" style="cursor:pointer;" data-axis="'+i+'" data-name="'+U.esc(axes[i].name)+'" data-pct="'+axes[i].pct+'" data-color="'+col+'" data-items="'+itemsJson+'"/>');
      }

      var radarSvg = ''+
        '<div class="radar-wrap reveal">'+
          '<svg viewBox="0 0 '+viewSize+' '+viewSize+'" class="radar-svg" role="img" aria-label="Skill radar chart">'+
            '<defs><filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+
            '<g>'+grid.join('')+'</g>'+
            '<g>'+axesSvg.join('')+'</g>'+
            dataPoly+
            '<g>'+dots.join('')+'</g>'+
            '<g>'+labels.join('')+'</g>'+
            '<g>'+hitAreas.join('')+'</g>'+
          '</svg>'+
        '</div>';

      return ''+
      '<section class="skills-section tex-stripes" id="skills">'+
        '<div class="wrap">'+
          '<div class="section-head reveal">'+
            '<span class="kicker">'+U.esc(s.kicker)+'</span>'+
            '<h2>'+U.esc(s.title)+'</h2>'+
            '<p>'+U.esc(s.desc)+'</p>'+
          '</div>'+
          radarSvg+
          '<div class="skill-detail" id="skillDetail"></div>'+
        '</div>'+
      '</section>';
    },

    init: function(d){
      var radarWrap = document.querySelector('.radar-wrap');
      var radarTip = document.createElement('div');
      radarTip.className = 'radar-tip';
      if (radarWrap) radarWrap.appendChild(radarTip);

      function showRadarTip(el, axisName, pct, items, color){
        if (!radarTip) return;
        var html = '<strong style="color:'+U.esc(color)+'">'+U.esc(axisName)+' <span class="rt-pct mono">'+pct+'%</span></strong><ul>'+(items || []).map(function(it){ return '<li>'+U.esc(it)+'</li>'; }).join('')+'</ul>';
        radarTip.innerHTML = html;
        radarTip.style.visibility = 'hidden';
        radarTip.classList.add('show');
        var rect = el.getBoundingClientRect();
        var wrapRect = radarWrap.getBoundingClientRect();
        var tipW = radarTip.offsetWidth, tipH = radarTip.offsetHeight;
        var tipX = rect.left - wrapRect.left + rect.width/2 - tipW/2;
        var tipY = rect.top - wrapRect.top - tipH - 10;
        if (tipY < 0) tipY = rect.top - wrapRect.top + rect.height + 10;
        radarTip.style.left = Math.max(0, Math.min(tipX, wrapRect.width - tipW)) + 'px';
        radarTip.style.top = tipY + 'px';
        radarTip.style.visibility = 'visible';
      }
      function hideRadarTip(){
        if (radarTip) radarTip.classList.remove('show');
      }

      var hl = d.journey.highlights || [];

      function buildSkillDetail(axisName, pct, color, items){
        var detail = document.getElementById('skillDetail');
        if (!detail) return;
        var matches = [];
        d.journey.items.forEach(function(item){
          (item.projects || []).forEach(function(proj){
            var projSkills = proj.skills || [];
            var matchedSkills = [];
            items.forEach(function(sk){ if (projSkills.indexOf(sk) !== -1) matchedSkills.push(sk); });
            if (matchedSkills.length){
              matches.push({
                company: item.company, year: item.year, role: item.role,
                proj: proj.proj, desc: proj.desc, skills: matchedSkills
              });
            }
          });
        });
        var cards = matches.map(function(m){
          var descHtml = Array.isArray(m.desc)
            ? '<ul class="sd-bullets">' + m.desc.map(function(dd){ return '<li>'+U.richWithHL(dd, hl)+'</li>'; }).join('') + '</ul>'
            : '<p>'+U.richWithHL(m.desc, hl)+'</p>';
          var skillTags = m.skills.map(function(sk){ return '<span class="sd-tag">'+U.esc(sk)+'</span>'; }).join('');
          return ''+
          '<article class="sd-card">'+
            '<div class="sd-meta">'+U.esc(m.year)+' · '+U.rich(m.company)+'</div>'+
            '<h4>'+U.rich(m.proj)+'</h4>'+
            descHtml+
            '<div class="sd-tags">'+skillTags+'</div>'+
          '</article>';
        }).join('');
        var header = '<div class="sd-header"><span class="sd-dot" style="background:'+U.esc(color)+'"></span><strong>'+U.esc(axisName)+'</strong> <span class="sd-pct mono">'+pct+'%</span></div>';
        detail.innerHTML = header + (cards ? '<div class="sd-grid">'+cards+'</div>' : '<p class="sd-empty">No matching projects in timeline.</p>');
        detail.classList.add('show');
        detail.scrollIntoView({behavior: 'smooth', block: 'nearest'});
      }
      function clearSkillDetail(){
        var detail = document.getElementById('skillDetail');
        if (detail){ detail.classList.remove('show'); detail.innerHTML = ''; }
        document.querySelectorAll('.radar-dot, .radar-label').forEach(function(el){ el.classList.remove('active'); });
      }

      document.querySelectorAll('.radar-svg circle[data-axis]').forEach(function(hit){
        var axisIdx = hit.dataset.axis;
        hit.addEventListener('mouseenter', function(){
          showRadarTip(hit, hit.dataset.name, hit.dataset.pct, JSON.parse(hit.dataset.items || '[]'), hit.dataset.color);
          document.querySelectorAll('.radar-dot[data-axis="'+axisIdx+'"], .radar-label[data-axis="'+axisIdx+'"]').forEach(function(el){ el.classList.add('active'); });
        });
        hit.addEventListener('mouseleave', function(){
          hideRadarTip();
          document.querySelectorAll('.radar-dot[data-axis="'+axisIdx+'"], .radar-label[data-axis="'+axisIdx+'"]').forEach(function(el){ el.classList.remove('active'); });
        });
        hit.addEventListener('click', function(e){
          e.stopPropagation();
          buildSkillDetail(hit.dataset.name, hit.dataset.pct, hit.dataset.color, JSON.parse(hit.dataset.items || '[]'));
        });
      });
      document.addEventListener('click', function(e){
        if (!e.target.closest('.radar-svg') && !e.target.closest('#skillDetail')){
          clearSkillDetail();
        }
      });
    }
  };
})();
