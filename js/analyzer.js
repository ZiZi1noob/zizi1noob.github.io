(function(){
  'use strict';
  var U = window.AppUtils;

  var SCHEMA_HINT =
    'Return ONLY JSON with keys: site, nav[], about{kicker,title,paragraphs[],stats[]}, ' +
    'skills{kicker,title,desc,axes[{name,pct,color,items[]}]}, ' +
    'journey{kicker,title,highlights[],items[{year,role,place,company,projects[{proj,skills[],desc[]}]}]}, ' +
    'current_proj{title,desc,startDate,github_repo,phases[{name,status,progress,date,desc}]}, ' +
    'contact{title,desc,email,linkedin,resume,github}, footer{slogan,bottom}. ' +
    'No explanation, no markdown fences.';

  window.AppAnalyzer = {
    schemaHint: SCHEMA_HINT,

    callAI: function(opts){
      var messages = [
        { role: 'system', content: 'You are a resume-to-JSON converter. ' + SCHEMA_HINT },
        { role: 'user', content: opts.resumeText }
      ];
      return fetch(opts.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + opts.apiKey },
        body: JSON.stringify({ model: opts.model, messages: messages, temperature: 0.2 })
      })
      .then(function(r){ return r.json(); })
      .then(function(data){
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
        var text = (data.choices && data.choices[0] && data.choices[0].message.content)
                || data.content || '';
        text = text.replace(/^```(?:json)?|```$/g, '').trim();
        return JSON.parse(text);
      });
    },

    validate: function(d){
      var need = ['site','nav','about','skills','journey','current_proj','contact','footer'];
      var missing = need.filter(function(k){ return d[k] == null; });
      if (missing.length) throw new Error('Missing: ' + missing.join(', '));
      return true;
    },

    showPanel: function(onGenerate){
      var b = document.getElementById('errorBanner');
      b.classList.add('show');
      b.innerHTML =
        '<div class="analyzer">' +
          '<h3 class="analyzer__title">Analyze your resume</h3>' +
          '<p class="analyzer__desc">No <code>assets/data.json</code> found. Paste your resume and generate one.</p>' +
          '<textarea class="analyzer__input" id="rzText" placeholder="Paste your resume text here…" rows="10"></textarea>' +
          '<input class="analyzer__input analyzer__input--key" id="rzKey" type="password" placeholder="OpenAI / OpenRouter API key (BYO)">' +
          '<div class="analyzer__row">' +
            '<select class="analyzer__select" id="rzProvider">' +
              '<option value="openrouter">OpenRouter</option>' +
              '<option value="openai">OpenAI</option>' +
            '</select>' +
            '<select class="analyzer__select" id="rzModel">' +
              '<option value="openai/gpt-4o-mini">openai/gpt-4o-mini</option>' +
              '<option value="openai/gpt-4o">openai/gpt-4o</option>' +
            '</select>' +
          '</div>' +
          '<button class="btn analyzer__btn" id="rzGo" type="button">Generate my site</button>' +
          '<button class="btn analyzer__btn analyzer__btn--secondary" id="rzDl" type="button" hidden>Download data.json</button>' +
          '<pre class="analyzer__error" id="rzError" hidden></pre>' +
          '<pre class="analyzer__raw" id="rzRaw" hidden></pre>' +
        '</div>';

      var rzGo = document.getElementById('rzGo');
      var rzDl = document.getElementById('rzDl');
      var rzError = document.getElementById('rzError');
      var rzRaw = document.getElementById('rzRaw');
      var rzText = document.getElementById('rzText');
      var rzKey = document.getElementById('rzKey');
      var rzProvider = document.getElementById('rzProvider');
      var rzModel = document.getElementById('rzModel');

      var generatedData = null;

      function setError(msg, raw){
        rzError.hidden = false;
        rzError.textContent = msg;
        if (raw != null){ rzRaw.hidden = false; rzRaw.textContent = raw; }
      }
      function clearError(){
        rzError.hidden = true; rzRaw.hidden = true;
      }

      rzGo.addEventListener('click', function(){
        clearError();
        var provider = rzProvider.value;
        var baseUrl = provider === 'openai'
          ? 'https://api.openai.com/v1/chat/completions'
          : 'https://openrouter.ai/api/v1/chat/completions';
        AppAnalyzer.callAI({
          apiKey: rzKey.value.trim(),
          baseUrl: baseUrl,
          model: rzModel.value,
          resumeText: rzText.value.trim()
        }).then(function(json){
          AppAnalyzer.validate(json);
          generatedData = json;
          rzDl.hidden = false;
          if (onGenerate) onGenerate(json);
        }).catch(function(e){
          setError(e.message || String(e), e.stack);
        });
      });

      rzDl.addEventListener('click', function(){
        if (!generatedData) return;
        var blob = new Blob([JSON.stringify(generatedData, null, 2)], {type:'application/json'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };
})();
