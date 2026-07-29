(function(){
  'use strict';

  window.AppUtils = {
    esc: function(s){
      return String(s == null ? '' : s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;');
    },

    rich: function(s){
      var str = String(s == null ? '' : s);
      var links = [];
      var safe = str.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, function(m){
        links.push(m);
        return '\x00A'+(links.length-1)+'\x00';
      });
      safe = safe.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      safe = safe.replace(/\x00A(\d+)\x00/g, function(_, idx){
        return links[parseInt(idx)];
      });
      return safe;
    },

    richWithHL: function(s, highlights){
      var str = String(s == null ? '' : s);
      if (highlights && highlights.length){
        var sorted = highlights.slice().sort(function(a,b){ return b.length - a.length; });
        sorted.forEach(function(h){
          var escaped = h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          var re = new RegExp('\\b(' + escaped + ')\\b', 'gi');
          str = str.replace(re, '<span class="hl">$1</span>');
        });
      }
      var links = [];
      var safe = str.replace(/<(a|span)\b[^>]*>[\s\S]*?<\/\1>/gi, function(m){
        links.push(m);
        return '\x00T'+(links.length-1)+'\x00';
      });
      safe = safe.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      safe = safe.replace(/\x00T(\d+)\x00/g, function(_, idx){
        return links[parseInt(idx)];
      });
      return safe;
    }
  };
})();
