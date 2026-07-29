(function(){
  'use strict';
  var U = window.AppUtils;

  window.AppContact = {
    render: function(d){
      var c = d.contact;
      return ''+
      '<section class="contact-section" id="contact">'+
        '<div class="wrap">'+
          '<div class="contact-section__box tex-noise reveal">'+
            '<div class="mario-wrap" id="marioWrap">'+
              '<img class="mario" id="mario" src="assets/contact-mario.svg" width="45" height="60" alt="Pixel Mario" aria-hidden="true">'+
              '<div class="mario-bubble" id="marioBubble" aria-hidden="true"></div>'+
              '<img class="mushroom" id="mushroom" src="assets/contact-mushroom.svg" width="40" height="40" alt="" aria-hidden="true">'+
            '</div>'+
            '<h2>'+U.esc(c.title)+'</h2>'+
            '<p>'+U.rich(c.desc)+'</p>'+
            '<div class="contact-cards">'+
              '<a href="mailto:'+U.esc(c.email)+'" class="ctc-card ctc--email">'+
                '<img class="ctc-icon" src="assets/contact-email.svg" width="28" height="28" alt="" aria-hidden="true">'+
                '<span class="ctc-label">Email</span>'+
                '<span class="ctc-val">'+U.esc(c.email)+'</span>'+
              '</a>'+
              '<a href="'+U.esc(c.linkedin)+'" target="_blank" rel="noopener" class="ctc-card ctc--linkedin">'+
                '<img class="ctc-icon" src="assets/contact-linkedin.svg" width="28" height="28" alt="" aria-hidden="true">'+
                '<span class="ctc-label">LinkedIn</span>'+
                '<span class="ctc-val">Let\'s connect</span>'+
              '</a>'+
              '<a href="'+U.esc(c.resume)+'" target="_blank" download class="ctc-card ctc--resume">'+
                '<img class="ctc-icon" src="assets/contact-resume.svg" width="28" height="28" alt="" aria-hidden="true">'+
                '<span class="ctc-label">Resume</span>'+
                '<span class="ctc-val">Download Resume</span>'+
              '</a>'+
              '<a href="'+U.esc(c.github)+'" target="_blank" rel="noopener" class="ctc-card ctc--github">'+
                '<img class="ctc-icon" src="assets/contact-github.svg" width="28" height="28" alt="" aria-hidden="true">'+
                '<span class="ctc-label">GitHub</span>'+
                '<span class="ctc-val">zizi1noob.github.io</span>'+
              '</a>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</section>';
    },

    init: function(d){
      var _marioWrap = document.getElementById('marioWrap');
      var _mario = document.getElementById('mario');
      var _mushroom = document.getElementById('mushroom');
      var _bubble = document.getElementById('marioBubble');
      var _box = document.querySelector('.contact-section__box');
      var _cards = document.querySelectorAll('.ctc-card');
      if (!_marioWrap || !_mario || !_mushroom || !_box || !_cards.length) return;

      var _cardsWrap = document.querySelector('.contact-cards');

      function alignToCard(card){
        var br = _box.getBoundingClientRect();
        var cr = card.getBoundingClientRect();
        var wrapW = _marioWrap.offsetWidth || 45;
        var left = cr.left + cr.width / 2 - br.left - wrapW / 2;
        var bottom = br.bottom - cr.bottom + 8;
        _marioWrap.style.left = left + 'px';
        _marioWrap.style.bottom = bottom + 'px';
        _marioWrap.classList.add('is-visible');
      }
      function resetAlign(){
        _marioWrap.classList.remove('is-visible');
        hideBubble();
      }

      var BUBBLE_TEXTS = {
        email:    ['Sending...', 'You\'ve got mail!', 'Ping!', 'Email incoming'],
        linkedin: ['Connecting...', 'Let\'s network!', 'Linking...', 'Hello there'],
        resume:   ['Downloading...', 'Hiring?', 'Resume ready', 'Grab it!'],
        github:   ['Coding...', 'Star me!', 'Repo time', 'To the code'],
        default:  ['Loading...', 'Bonk!', 'Jump!', 'Here we go!', 'Wait for it...']
      };
      function randomText(card){
        var key = 'default';
        if (card.classList.contains('ctc--email')) key = 'email';
        else if (card.classList.contains('ctc--linkedin')) key = 'linkedin';
        else if (card.classList.contains('ctc--resume')) key = 'resume';
        else if (card.classList.contains('ctc--github')) key = 'github';
        var arr = BUBBLE_TEXTS[key];
        return arr[Math.floor(Math.random() * arr.length)];
      }
      function showBubble(card){
        if (!_bubble) return;
        _bubble.textContent = randomText(card);
        _bubble.classList.add('show');
      }
      function hideBubble(){
        if (!_bubble) return;
        _bubble.classList.remove('show');
      }

      function bonk(card){
        alignToCard(card);
        _mario.style.setProperty('--jump', '-70px');
        _mario.classList.remove('jump');
        void _mario.offsetWidth;
        _mario.classList.add('jump');
        setTimeout(function(){
          _mushroom.classList.remove('go');
          void _mushroom.offsetWidth;
          _mushroom.classList.add('go');
        }, 350);
      }

      function openCardLink(card){
        var href = card.dataset.href;
        if (!href) return;
        if (card.dataset.download !== undefined){
          var a = document.createElement('a');
          a.href = href;
          a.setAttribute('download', card.dataset.download);
          if (card.dataset.rel) a.rel = card.dataset.rel;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else if (card.dataset.target === '_blank'){
          var win = window.open(href, '_blank');
          if (win) win.opener = null;
        } else {
          window.location.href = href;
        }
      }

      _cards.forEach(function(card){
        card.dataset.href = card.href;
        if (card.target) card.dataset.target = card.target;
        if (card.rel) card.dataset.rel = card.rel;
        if (card.hasAttribute('download')){
          card.dataset.download = card.getAttribute('download') || '';
        }
        card.removeAttribute('href');
        card.removeAttribute('target');
        card.removeAttribute('download');
        card.removeAttribute('rel');
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');

        card.addEventListener('mouseenter', function(){ alignToCard(card); });
        card.addEventListener('focus', function(){ alignToCard(card); });
        card.addEventListener('click', function(e){
          e.preventDefault();
          e.stopImmediatePropagation();
          if (card.dataset.busy) return;
          card.dataset.busy = '1';
          showBubble(card);
          bonk(card);
          setTimeout(function(){
            openCardLink(card);
            card.dataset.busy = '';
          }, 900);
          setTimeout(function(){ hideBubble(); }, 1500);
        }, true);
      });
      if (_cardsWrap) _cardsWrap.addEventListener('mouseleave', resetAlign);
      _mushroom.addEventListener('animationend', function(){ _mushroom.classList.remove('go'); });
    }
  };
})();
