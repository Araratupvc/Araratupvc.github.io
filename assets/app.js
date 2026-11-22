(function(){
  function faDigits(s){ return String(s).replace(/[0-9]/g, function(d){ return '۰۱۲۳۴۵۶۷۸۹'[d]; }); }

  /* شماره‌ها با جاوااسکریپت ساخته می‌شوند تا ربات‌های ساده نتوانند آسان جمعشان کنند */
  document.querySelectorAll('.phones').forEach(function(box){
    var area = box.getAttribute('data-p'), list = (box.getAttribute('data-n') || '').split(',');
    box.textContent = '';
    list.forEach(function(n){
      var a = document.createElement('a');
      a.href = 'tel:+98' + area + n;
      a.textContent = faDigits('0' + area + '-' + n);
      box.appendChild(a);
    });
  });
  document.querySelectorAll('[data-wa]').forEach(function(a){
    a.href = 'https://wa.me/' + a.getAttribute('data-wa');
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* نمایش مدارک */
  document.querySelectorAll('a.doc').forEach(function(a){
    a.addEventListener('click', function(e){
      e.preventDefault();
      var lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      var img = document.createElement('img'); img.src = a.href; img.alt = a.getAttribute('data-alt') || '';
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn3d white sm'; b.textContent = 'بستن';
      lb.appendChild(img); lb.appendChild(b);
      function close(){ document.body.removeChild(lb); document.removeEventListener('keydown', esc); }
      function esc(ev){ if (ev.key === 'Escape') close(); }
      lb.addEventListener('click', close); document.addEventListener('keydown', esc);
      document.body.appendChild(lb); b.focus();
    });
  });

  /* ساعت کوچک بنر */
  var ck = document.getElementById('ckS');
  if (ck) {
    var g = document.getElementById('ckMarks'), ns = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < 12; i++) {
      var big = i % 3 === 0, r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', big ? 96 : 98.2); r.setAttribute('y', big ? 16 : 17);
      r.setAttribute('width', big ? 8 : 3.6); r.setAttribute('height', big ? 10 : 9); r.setAttribute('rx', 1);
      r.setAttribute('fill', big ? '#e6dfd8' : '#9d8d90');
      r.setAttribute('transform', 'rotate(' + (i * 30) + ' 100 100)');
      g.appendChild(r);
    }
    var tick = function(){
      var d = new Date(), s = d.getSeconds(), m = d.getMinutes(), h = d.getHours() % 12;
      document.getElementById('ckS').setAttribute('transform', 'rotate(' + (s * 6) + ' 100 100)');
      document.getElementById('ckM').setAttribute('transform', 'rotate(' + (m * 6 + s * 0.1) + ' 100 100)');
      document.getElementById('ckH').setAttribute('transform', 'rotate(' + (h * 30 + m * 0.5) + ' 100 100)');
    };
    tick(); setInterval(tick, 1000);
  }
})();
