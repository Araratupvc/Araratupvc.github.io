(function(){
  var grid = document.getElementById('agrid'); if (!grid) return;
  var cards = [].slice.call(grid.querySelectorAll('.acard'));
  var q = document.getElementById('aq'), chips = [].slice.call(document.querySelectorAll('.fchip'));
  var cnt = document.getElementById('acount'), more = document.getElementById('amore'), empty = document.getElementById('aempty');
  var cat = 'all', term = '', STEP = 18, limit = STEP;
  function norm(s){
    return String(s).toLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u200f\u064b-\u065f]/g, '')
      .replace(/[٠-٩]/g, function(d){ return d.charCodeAt(0) - 1632; }).replace(/[۰-۹]/g, function(d){ return d.charCodeAt(0) - 1776; })
      .replace(/\s+/g, ' ').trim();
  }
  cards.forEach(function(c){ c._q = norm(c.getAttribute('data-q')); });
  function fa(n){ return n.toLocaleString('fa-IR'); }
  function apply(reset){
    if (reset) limit = STEP;
    var tokens = norm(term).split(' ').filter(Boolean), total = 0, shown = 0;
    cards.forEach(function(c){
      var ok = (cat === 'all' || c.getAttribute('data-cat') === cat) && tokens.every(function(t){ return c._q.indexOf(t) !== -1; });
      if (ok) { total++; var vis = total <= limit; c.hidden = !vis; if (vis) shown++; } else { c.hidden = true; }
    });
    cnt.textContent = total ? ('نمایش ' + fa(shown) + ' از ' + fa(total) + ' مقاله') : '';
    more.hidden = total <= limit;
    empty.hidden = total > 0;
  }
  chips.forEach(function(b){
    b.addEventListener('click', function(){
      chips.forEach(function(x){ x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-pressed', 'true');
      cat = b.getAttribute('data-cat');
      if (history.replaceState) history.replaceState(null, '', cat === 'all' ? location.pathname : '#cat-' + cat);
      apply(true);
    });
  });
  var t = null;
  q.addEventListener('input', function(){ clearTimeout(t); t = setTimeout(function(){ term = q.value; apply(true); }, 120); });
  more.addEventListener('click', function(){ limit += STEP; apply(false); });
  var m = /#cat-([a-z]+)/.exec(location.hash);
  if (m) { var b = chips.filter(function(x){ return x.getAttribute('data-cat') === m[1]; })[0]; if (b) b.click(); else apply(true); }
  else apply(true);
})();
