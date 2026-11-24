(function(){

  function num(v){
    var s = String(v).replace(/[۰-۹]/g, function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d);})
                     .replace(/[٠-٩]/g, function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d);})
                     .replace(/[٫,،]/g, function(c){return c==='٫' ? '.' : '';});
    var n = parseFloat(s); return isNaN(n) || n < 0 ? 0 : n;
  }
  function fmt(n, d){ return n.toLocaleString('fa-IR', {maximumFractionDigits: d == null ? 0 : d}); }
  function $(id){ return document.getElementById(id); }
  var TM = ' تومان';
  function setChips(box, cb){
    box.addEventListener('click', function(e){
      var b = e.target.closest('.chip'); if (!b) return;
      box.querySelectorAll('.chip').forEach(function(c){ c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
      b.classList.add('on'); b.setAttribute('aria-pressed', 'true'); cb(b.getAttribute('data-v'));
    });
  }

  /* ---------- پنجره ---------- */
  function calcWindow(){
    var w = num($('w').value)/100, h = num($('h').value)/100;
    var n = parseInt($('wtype').value, 10), qty = Math.max(1, num($('wqty').value));
    var area = w*h;
    var prof = 2*(w+h) + (n > 0 ? 2*w + 2*n*h : 0);   // قاب + هر لنگه (تقریبی)
    var cProf = prof * num($('pProfile').value);
    var cGlass = area * num($('wglass').value === 'double' ? $('pDouble').value : $('pSingle').value);
    var cHard = n * num($('pHard').value), cLabor = area * num($('pLabor').value);
    var total = (cProf + cGlass + cHard + cLabor) * qty;
    $('oArea').textContent = fmt(area*qty, 2) + ' متر مربع';
    $('oProf').textContent = fmt(prof*qty, 1) + ' متر';
    $('oGlass').textContent = fmt(area*qty, 2) + ' متر مربع';
    $('cProf').textContent = fmt(cProf*qty) + TM;
    $('cGlass').textContent = fmt(cGlass*qty) + TM;
    $('cHard').textContent = fmt(cHard*qty) + TM;
    $('cLabor').textContent = fmt(cLabor*qty) + TM;
    $('oTotal').textContent = fmt(total) + TM;
    var msg = 'سلام، قیمت پنجره UPVC می‌خواستم:\nابعاد: ' + num($('w').value) + ' × ' + num($('h').value) +
              ' سانتی‌متر\nنوع: ' + $('wtype').options[$('wtype').selectedIndex].text +
              '\nشیشه: ' + $('wglass').options[$('wglass').selectedIndex].text + '\nتعداد: ' + qty;
    $('wa').href = 'https://wa.me/989905392049?text=' + encodeURIComponent(msg);
  }

  /* ---------- فلز ---------- */
  var rho = 7.85;
  setChips($('matChips'), function(v){ rho = parseFloat(v); calcMetal(); });
  var SHAPES = {
    rod:   {D:1, A:0, B:0, T:0, W:0, lD:'قطر (میلی‌متر)'},
    sheet: {D:0, A:0, B:0, T:1, W:1},
    rect:  {D:0, A:1, B:1, T:1, W:0, lA:'ضلع اول (میلی‌متر)', lB:'ضلع دوم (میلی‌متر)'},
    angle: {D:0, A:1, B:1, T:1, W:0, lA:'بال اول (میلی‌متر)', lB:'بال دوم (میلی‌متر)'},
    pipe:  {D:1, A:0, B:0, T:1, W:0, lD:'قطر بیرونی (میلی‌متر)'}
  };
  function show(id, on){ $(id).hidden = !on; }
  function calcMetal(){
    var s = $('shape').value, cfg = SHAPES[s];
    show('fD', cfg.D); show('fA', cfg.A); show('fB', cfg.B); show('fT', cfg.T); show('fW', cfg.W);
    if (cfg.lD) $('lD').textContent = cfg.lD;
    if (cfg.lA) $('lA').textContent = cfg.lA;
    if (cfg.lB) $('lB').textContent = cfg.lB;
    $('lLen').textContent = s === 'sheet' ? 'طول ورق (متر)' : 'طول هر شاخه (متر)';
    var d = num($('d').value), a = num($('a').value), b = num($('b').value), t = num($('t').value);
    var len = num($('len').value), sw = num($('sw').value), q = Math.max(1, num($('mq').value));
    var perM = 0, one = 0;
    if (s === 'sheet') { one = t * sw * len * rho; perM = len > 0 ? one / len : 0; }
    else {
      var area = 0;
      if (s === 'rod') area = Math.PI * d * d / 4;
      if (s === 'rect') area = Math.max(0, 2*t*(a + b - 2*t));
      if (s === 'angle') area = Math.max(0, t*(a + b - t));
      if (s === 'pipe') area = Math.max(0, Math.PI * t * (d - t));
      perM = area * rho / 1000; one = perM * len;
    }
    $('mPer').textContent = fmt(perM, 3) + ' کیلوگرم';
    $('mOne').textContent = fmt(one, 2) + ' کیلوگرم';
    $('mTot').textContent = fmt(one * q, 2) + ' کیلوگرم';
  }

  
  function all(){ calcWindow(); calcMetal(); }
  document.querySelectorAll('.win input, .win select').forEach(function(el){
    el.addEventListener('input', all); el.addEventListener('change', all);
  });
  all();

})();
