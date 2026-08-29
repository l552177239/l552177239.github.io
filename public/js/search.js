define([], function(){
  var DATA_URL = '/search.xml';
  var entries = null;
  var loaded = false;
  var $input, $results, $clear, $bar;

  function getText(entry, tag){
    var el = entry.querySelector(tag);
    return el ? el.textContent : '';
  }

  function parse(xml){
    var arr = [];
    var list = xml.querySelectorAll('entry');
    Array.prototype.forEach.call(list, function(entry){
      var tags = Array.prototype.map.call(entry.querySelectorAll('tag'), function(t){ return t.textContent; }).join(' ');
      arr.push({
        title: getText(entry, 'title'),
        url: getText(entry, 'url'),
        content: getText(entry, 'content').replace(/<[^>]+>/g, ''),
        tags: tags
      });
    });
    return arr;
  }

  function load(cb){
    if(loaded){ cb(); return; }
    fetch(DATA_URL).then(function(r){ return r.text(); }).then(function(txt){
      var doc = new DOMParser().parseFromString(txt, 'application/xml');
      entries = parse(doc);
      loaded = true;
      cb();
    }).catch(function(e){ console.warn('[pixie-search] search.xml 加载失败', e); });
  }

  function escapeReg(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function escapeHtml(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function doSearch(q){
    if(!q || !q.trim()){ $results.innerHTML = ''; $results.classList.remove('show'); return; }
    var kws = q.trim().toLowerCase().split(/\s+/);
    var matches = [];
    for(var i=0; i<entries.length; i++){
      var e = entries[i];
      var hay = (e.title + ' ' + e.content + ' ' + e.tags).toLowerCase();
      var hit = true;
      for(var j=0; j<kws.length; j++){ if(hay.indexOf(kws[j]) === -1){ hit = false; break; } }
      if(!hit) continue;
      var snippet = '';
      for(var k=0; k<kws.length; k++){
        var pos = e.content.toLowerCase().indexOf(kws[k]);
        if(pos >= 0){ snippet = e.content.slice(Math.max(0, pos-30), pos+80); break; }
      }
      matches.push({e: e, snippet: snippet});
      if(matches.length >= 8) break;
    }
    render(matches, q.trim());
  }

  function render(matches, q){
    if(!matches.length){
      $results.innerHTML = '<div class="search-empty">未找到相关文章</div>';
      $results.classList.add('show');
      return;
    }
    var qreg = new RegExp('(' + escapeReg(q) + ')', 'ig');
    var html = matches.map(function(m){
      var title = escapeHtml(m.e.title).replace(qreg, '<mark>$1</mark>');
      var snip = m.snippet ? escapeHtml(m.snippet).replace(qreg, '<mark>$1</mark>') + '…' : '';
      var tagHtml = m.e.tags ? '<span class="search-tag">' + escapeHtml(m.e.tags.split(' ').slice(0,3).join(' / ')) + '</span>' : '';
      return '<a class="search-item" href="' + m.e.url + '">' +
               '<span class="search-item-title">' + title + '</span>' +
               (snip ? '<span class="search-item-snippet">' + snip + '</span>' : '') +
               tagHtml +
             '</a>';
    }).join('');
    $results.innerHTML = html;
    $results.classList.add('show');
  }

  var debounceTimer;
  function init(){
    $bar = document.getElementById('search-bar');
    $input = document.getElementById('search-input');
    $results = document.getElementById('search-results');
    $clear = document.getElementById('search-clear');
    if(!$input || !$results) return;

    $input.addEventListener('input', function(){
      var v = $input.value;
      if($clear) $clear.style.display = v ? 'block' : 'none';
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function(){
        load(function(){ doSearch(v); });
      }, 150);
    });

    $input.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){ reset(); }
    });

    if($clear){
      $clear.addEventListener('click', function(){ reset(); $input.focus(); });
    }

    document.addEventListener('click', function(e){
      if($bar && !$bar.contains(e.target)){ $results.classList.remove('show'); }
    });
  }

  function reset(){
    $input.value = '';
    $results.innerHTML = '';
    $results.classList.remove('show');
    if($clear) $clear.style.display = 'none';
  }

  return { init: init };
});
