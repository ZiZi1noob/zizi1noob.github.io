(function(){
  'use strict';

  var MODELS = {
    openai: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
    ],
    openrouter: [
      { value: 'openai/gpt-4o', label: 'OpenAI GPT-4o' },
      { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
      { value: 'meta-llama/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
      { value: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' }
    ]
  };

  var SYSTEM_PROMPT = [
    'You are a helpful assistant that turns a resume into a structured JSON file for a personal portfolio website.',
    '',
    'Return ONLY valid JSON. Do not include markdown code fences, explanations, or extra text.',
    '',
    'Use this exact structure (values are examples):',
    '{',
    '  "version": "release1",',
    '  "site": "Ziyang ZHAN",',
    '  "nav": [',
    '    {"label": "About", "href": "#about"},',
    '    {"label": "Journey", "href": "#journey"},',
    '    {"label": "Skills", "href": "#skills"},',
    '    {"label": "Contact", "href": "#contact"}',
    '  ],',
    '  "about": {',
    '    "kicker": "// ABOUT",',
    '    "title": "About Me",',
    '    "paragraphs": ["Ziyang there, a full-stack engineer...", "Outside of code, I'm just a gamer..."],',
    '    "stats": [',
    '      {"num": "10+", "label": "Shipped"},',
    '      {"num": "3+", "label": "Years"},',
    '      {"num": "24/7", "label": "Coffee Powered"},',
    '      {"num": "∞", "label": "Still Stuck on Black Wukong"}',
    '    ]',
    '  },',
    '  "current_proj": {',
    '    "kicker": "// NOW BUILDING",',
    '    "title": "Resume-to-Web",',
    '    "desc": "Zero-code, full-personality...",',
    '    "startDate": "2026-07-19",',
    '    "github_repo": "https://github.com/username/repo",',
    '    "phases": [',
    '      {"name": "Phase name", "status": "completed", "progress": 100, "date": "2026-07-26", "desc": "..."},',
    '      {"name": "Phase name", "status": "in-progress: collect resume data", "progress": 60, "date": "TBD", "desc": "..."},',
    '      {"name": "Phase name", "status": "planned", "progress": 0, "date": "TBD", "desc": "..."}',
    '    ]',
    '  },',
    '  "skills": {',
    '    "kicker": "// SKILLS",',
    '    "title": "My Skill Stack",',
    '    "desc": "Hover or click a radar axis to see related projects.",',
    '    "axes": [',
    '      {"name": "Frontend", "pct": 85, "color": "#FF2E88", "items": ["Flutter", "React", "PySide6", "HTML", "CSS", "JS", "D3.js"]},',
    '      {"name": "Backend", "pct": 88, "color": "#22D3EE", "items": ["Node.js", "Go", "MongoDB", "SQL", "FastAPI", "RESTful", "WebSocket"]},',
    '      {"name": "Cloud", "pct": 74, "color": "#A78BFA", "items": ["AWS", "Azure", "Docker"]},',
    '      {"name": "ML/AI", "pct": 90, "color": "#BEF264", "items": ["Python", "PyTorch", "Federated Learning", "Playwright / RPA"]},',
    '      {"name": "Language", "pct": 92, "color": "#FB923C", "items": ["Proficient English", "Native Mandarin", "Entry-level Cantonese"]}',
    '    ]',
    '  },',
    '  "contact": {',
    '    "title": "Wanna make something sweet? ☕",',
    '    "desc": "Got a project, a role, or just want to say hi? Drop me a line...",',
    '    "email": "you@example.com",',
    '    "linkedin": "https://www.linkedin.com/in/username/",',
    '    "resume": "assets/Your Resume.pdf",',
    '    "github": "https://username.github.io/"',
    '  },',
    '  "footer": {',
    '    "slogan": "\\"Less is more.\\"",',
    '    "bottom": "BUILT WITH ♥ & PURE HTML/CSS/JS"',
    '  },',
    '  "journey": {',
    '    "kicker": "// JOURNEY",',
    '    "title": "Journey",',
    '    "highlights": ["PySide6", "Playwright", "VLM", "PyTorch", "FastAPI", "image data generator", "Flutter", "MVVM architecture", "WebSocket", "Node.js", "RESTful APIs", "MongoDB", "JavaScript", "Federated Learning", "CNN", "Bi-LSTM", "D3.js", "24/7 scraping engine", "10T", "AWS", "Chrome Extension", "NER", "RESTful API"],',
    '    "items": [',
    '      {',
    '        "year": "2023.11 — Now",',
    '        "role": "Full Stack Engineer",',
    '        "place": "Hong Kong SAR",',
    '        "company": "<a href=\\"https://www.company.com\\" target=\\"_blank\\" rel=\\"noopener\\">Company Name</a>",',
    '        "desc": "",',
    '        "projects": [',
    '          {',
    '            "proj": "Project Name",',
    '            "skills": ["PySide6", "Playwright / RPA", "VLM / LLM Fine-tuning"],',
    '            "desc": [',
    '              "Bullet point describing what you did.",',
    '              "Another bullet point with impact or metrics."',
    '            ]',
    '          }',
    '        ]',
    '      }',
    '    ]',
    '  }',
    '}',
    '',
    'Guidelines:',
    '- Infer name, location, email, LinkedIn, GitHub and resume filename from the resume text.',
    '- For "site" use the person\'s name plus "House" or just their name.',
    '- Create 4-6 skill axes that match the person\'s actual skills. Use these exact hex colors: #FF2E88, #22D3EE, #A78BFA, #BEF264, #FB923C, #7CFF4F.',
    '- Generate 2-4 journey items (experiences) with realistic year ranges going backwards.',
    '- For each journey item include 1-3 projects. Each project has "proj" name, "skills" array, and "desc" array of bullet strings.',
    '- If a company has a known URL, wrap it in an HTML anchor tag like: <a href="https://www.company.com" target="_blank" rel="noopener">Company Name</a>. Otherwise plain text.',
    '- current_proj can be the most recent main project or a portfolio website project. Include 3-5 phases with status "completed", "in-progress: ...", or "planned".',
    '- Keep all text concise, professional, and portfolio-ready.',
    '- Ensure the JSON keys and structure match EXACTLY.'
  ].join('\n');

  function $(id){ return document.getElementById(id); }

  function populateModels(){
    var provider = $('aiProvider').value;
    var select = $('aiModel');
    select.innerHTML = '';
    MODELS[provider].forEach(function(m){
      var opt = document.createElement('option');
      opt.value = m.value;
      opt.textContent = m.label;
      select.appendChild(opt);
    });
  }

  function setStatus(msg, type){
    var el = $('aiStatus');
    el.textContent = msg;
    el.className = 'ai-tool-status' + (type ? ' ai-tool-status--' + type : '');
  }

  function extractJson(text){
    text = text.trim();
    if (text.indexOf('```') === 0) {
      text = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(text);
  }

  function callOpenAI(token, model, resume){
    return fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: 'Here is the resume:\n\n' + resume }
        ],
        temperature: 0.7
      })
    });
  }

  function callOpenRouter(token, model, resume){
    return fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Ziyang Portfolio AI Tool'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: 'Here is the resume:\n\n' + resume }
        ],
        temperature: 0.7
      })
    });
  }

  function generate(){
    var provider = $('aiProvider').value;
    var model = $('aiModel').value;
    var token = $('aiToken').value.trim();
    var resume = $('aiResume').value.trim();

    if (!token){
      setStatus('Please enter your API token.', 'error');
      $('aiToken').focus();
      return;
    }
    if (!resume){
      setStatus('Please paste your resume or drop a file.', 'error');
      $('aiResume').focus();
      return;
    }

    setStatus('Generating, please wait...', 'busy');
    $('aiGenerate').disabled = true;

    var call = provider === 'openai' ? callOpenAI : callOpenRouter;

    call(token, model, resume)
      .then(function(r){
        if (!r.ok){
          return r.text().then(function(t){ throw new Error('HTTP ' + r.status + ': ' + t); });
        }
        return r.json();
      })
      .then(function(data){
        var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (!content) throw new Error('Empty response from AI.');
        var json = extractJson(content);
        var pretty = JSON.stringify(json, null, 2);
        $('aiResult').value = pretty;
        $('aiOutputWrap').style.display = 'block';
        setStatus('Done! Review and download your data.json.', 'success');
        $('aiOutputWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(function(err){
        setStatus('Error: ' + err.message, 'error');
      })
      .finally(function(){
        $('aiGenerate').disabled = false;
      });
  }

  function download(){
    var text = $('aiResult').value;
    if (!text) return;
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function readTextFile(file){
    return new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.onload = function(e){ resolve(e.target.result); };
      reader.onerror = function(){ reject(new Error('Could not read file.')); };
      reader.readAsText(file);
    });
  }

  function handleFile(file){
    if (!file) return;
    var name = file.name.toLowerCase();
    var dropzone = $('aiDropzone');

    dropzone.classList.remove('is-dragover');
    dropzone.classList.add('is-dropped');
    setTimeout(function(){ dropzone.classList.remove('is-dropped'); }, 400);

    if (name.endsWith('.txt') || name.endsWith('.md')){
      setStatus('Reading ' + file.name + '...', 'busy');
      readTextFile(file)
        .then(function(text){
          $('aiResume').value = text;
          setStatus('File loaded. Ready to generate.', 'success');
        })
        .catch(function(err){ setStatus(err.message, 'error'); });
    } else if (name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx')){
      setStatus('PDF / Word files can\'t be read directly — please open and paste the text below.', 'error');
    } else {
      setStatus('Unsupported file type. Please paste the text instead.', 'error');
    }
  }

  function initDropzone(){
    var dropzone = $('aiDropzone');
    var fileInput = $('aiFile');
    if (!dropzone || !fileInput) return;

    fileInput.addEventListener('change', function(e){
      handleFile(e.target.files[0]);
    });

    dropzone.addEventListener('click', function(e){
      if (e.target !== fileInput) fileInput.click();
    });

    var dragCounter = 0;

    ['dragenter','dragover','dragleave','drop'].forEach(function(evt){
      dropzone.addEventListener(evt, function(e){
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    dropzone.addEventListener('dragenter', function(){
      dragCounter++;
      dropzone.classList.add('is-dragover');
    }, false);

    dropzone.addEventListener('dragleave', function(){
      dragCounter--;
      if (dragCounter <= 0){
        dragCounter = 0;
        dropzone.classList.remove('is-dragover');
      }
    }, false);

    dropzone.addEventListener('drop', function(e){
      dragCounter = 0;
      dropzone.classList.remove('is-dragover');
      handleFile(e.dataTransfer.files[0]);
    }, false);
  }

  function initNav(){
    var toggle = $('navToggle');
    var links = $('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  populateModels();
  $('aiProvider').addEventListener('change', populateModels);
  $('aiGenerate').addEventListener('click', generate);
  $('aiDownload').addEventListener('click', download);
  initDropzone();
  initNav();
})();
