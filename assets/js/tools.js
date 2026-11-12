/* BusinessForYou.com calculators. Requires site.js (window.BFY). */
(function () {
  'use strict';
  var B = window.BFY || {};
  var $ = B.$, $$ = B.$$, money = B.money;
  function num(el) { if (!el) return 0; var v = parseFloat(String(el.value).replace(/[^0-9.\-]/g, '')); return isNaN(v) ? 0 : v; }
  function save(key, form) { try { var o = {}; $$('input,select', form).forEach(function (e) { o[e.name] = e.value; }); localStorage.setItem(key, JSON.stringify(o)); } catch (x) {} }
  function load(key, form) { try { var o = JSON.parse(localStorage.getItem(key) || 'null'); if (!o) return; $$('input,select', form).forEach(function (e) { if (o[e.name] != null && o[e.name] !== '') e.value = o[e.name]; }); } catch (x) {} }

  /* ---------- Business valuation (SDE x multiple) ---------- */
  var vf = $('#valc');
  if (vf) {
    var IND_ADJ = { restaurant: -0.35, retail: -0.15, services: 0, home: 0.15, health: 0.35, auto: 0, online: 0.3, saas: 0.8, manufacturing: 0.4, wholesale: 0.2, education: 0.15, transport: -0.05, hospitality: -0.1, beauty: -0.2, other: 0 };
    var ADJ = {
      years: { lt2: -0.5, y2: -0.15, y5: 0, y10: 0.2 },
      topcust: { hi: -0.5, mid: -0.2, low: 0 },
      recurring: { most: 0.35, some: 0.1, none: 0 },
      owner: { all: -0.45, key: -0.15, mgr: 0.25 },
      trend: { down: -0.45, flat: 0, up: 0.3 },
      books: { cpa: 0.15, tax: 0, messy: -0.4 }
    };
    function baseMult(sde) { return sde < 100000 ? 2.0 : sde < 250000 ? 2.4 : sde < 500000 ? 2.8 : sde < 1000000 ? 3.2 : 3.7; }
    function calcV() {
      var g = function (n) { return vf.elements[n]; };
      var sde = num(g('profit')) + num(g('owner_pay')) + num(g('interest')) + num(g('da')) + num(g('oneoff')) + num(g('perks'));
      var m = baseMult(sde) + (IND_ADJ[g('industry').value] || 0);
      ['years', 'topcust', 'recurring', 'owner', 'trend', 'books'].forEach(function (k) { m += (ADJ[k][g(k).value] || 0); });
      m = Math.max(0.8, Math.min(6, m));
      var extra = num(g('inventory')) + num(g('realestate'));
      var mid = sde * m + extra, lo = sde * Math.max(0.6, m - 0.35) + extra, hi = sde * (m + 0.35) + extra;
      var rev = num(g('revenue'));
      $('#v-mid').textContent = sde > 0 ? money(mid) : '$0';
      $('#v-lo').textContent = money(lo, 1); $('#v-hi').textContent = money(hi, 1);
      $('#v-sde').textContent = money(sde);
      $('#v-mult').textContent = m.toFixed(2) + 'x';
      $('#v-revm').textContent = rev > 0 ? (mid / rev).toFixed(2) + 'x' : '—';
      $('#v-margin').textContent = rev > 0 ? Math.round(sde / rev * 100) + '%' : '—';
      var mk = $('#v-mark'); if (mk) mk.style.left = '50%';
      var vd = $('#v-verdict');
      var notes = [];
      if (g('owner').value === 'all') notes.push('heavy owner dependence');
      if (g('topcust').value === 'hi') notes.push('customer concentration');
      if (g('books').value === 'messy') notes.push('unverifiable books');
      if (g('trend').value === 'down') notes.push('declining sales');
      if (notes.length) { vd.className = 'verdict mid'; vd.textContent = 'Biggest value drag: ' + notes.join(', ') + '. Fixing these before a sale can add a full turn of SDE or more.'; }
      else { vd.className = 'verdict good'; vd.textContent = 'No major red flags in your answers. Clean documentation keeps this multiple intact through due diligence.'; }
      var go = $('#v-go'); if (go) go.setAttribute('data-prefill', JSON.stringify({ asking: sde > 0 ? money(mid) : '', notes: 'Calculator SDE ' + money(sde) + ', multiple ' + m.toFixed(2) + 'x' }));
      save('bfy_val', vf);
    }
    load('bfy_val', vf);
    vf.addEventListener('input', calcV); vf.addEventListener('change', calcV);
    vf.addEventListener('submit', function (e) { e.preventDefault(); calcV(); });
    calcV();
  }

  /* ---------- Acquisition loan, DSCR and payback ---------- */
  var lf = $('#loanc');
  if (lf) {
    function pmt(principal, ratePct, years) {
      if (principal <= 0 || years <= 0) return 0;
      var r = ratePct / 100 / 12, n = years * 12;
      return r === 0 ? principal / n : principal * r / (1 - Math.pow(1 + r, -n));
    }
    function calcL() {
      var g = function (n) { return lf.elements[n]; };
      var price = num(g('price')), downPct = num(g('down')), notePct = num(g('note')), rate = num(g('rate')), term = num(g('term'));
      var noteRate = num(g('note_rate')), noteTerm = num(g('note_term')), sde = num(g('sde')), salary = num(g('salary'));
      var closingPct = num(g('closing')), wc = num(g('wc'));
      var down = price * downPct / 100, note = price * notePct / 100, loan = Math.max(0, price - down - note);
      var mBank = pmt(loan, rate, term), mNote = pmt(note, noteRate, noteTerm);
      var ads = (mBank + mNote) * 12;
      var cash = down + price * closingPct / 100 + wc;
      var dscr = ads > 0 ? (sde - salary) / ads : 0;
      var after = sde - ads, afterSal = sde - ads - salary;
      $('#l-loan').textContent = money(loan);
      $('#l-bank').textContent = money(mBank) + '/mo';
      $('#l-note').textContent = note > 0 ? money(mNote) + '/mo' : '—';
      $('#l-ads').textContent = money(ads);
      $('#l-cash').textContent = money(cash);
      $('#l-after').textContent = money(after);
      $('#l-dscr').textContent = ads > 0 ? dscr.toFixed(2) + 'x' : '—';
      $('#l-payback').textContent = afterSal > 0 ? (cash / afterSal).toFixed(1) + ' years' : 'Not recovered';
      $('#l-coc').textContent = cash > 0 ? Math.round(afterSal / cash * 100) + '%' : '—';
      $('#l-mult').textContent = sde > 0 ? (price / sde).toFixed(2) + 'x SDE' : '—';
      var v = $('#l-verdict');
      if (!ads) { v.className = 'verdict mid'; v.textContent = 'Enter a price and financing terms.'; }
      else if (dscr >= 1.5) { v.className = 'verdict good'; v.textContent = 'Strong coverage. Cash flow covers debt ' + dscr.toFixed(2) + ' times after a market salary, comfortably above the 1.25x many acquisition lenders look for.'; }
      else if (dscr >= 1.25) { v.className = 'verdict mid'; v.textContent = 'Workable but thin. Coverage clears the common 1.25x lender benchmark with little cushion for a bad quarter. Consider a larger seller note or a lower price.'; }
      else { v.className = 'verdict bad'; v.textContent = 'Too tight. At ' + dscr.toFixed(2) + 'x the business may not carry this debt after paying a manager. Renegotiate price, extend terms or add equity.'; }
      var go = $('#l-go'); if (go) go.setAttribute('data-prefill', JSON.stringify({ deal_price: money(price), deal_dscr: dscr.toFixed(2) }));
      save('bfy_loan', lf);
    }
    load('bfy_loan', lf);
    lf.addEventListener('input', calcL); lf.addEventListener('change', calcL);
    lf.addEventListener('submit', function (e) { e.preventDefault(); calcL(); });
    calcL();
  }

  /* ---------- Due-diligence checklist ---------- */
  var cl = $('#ddlist');
  if (cl) {
    var KEY = 'bfy_dd', state = {};
    try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (x) {}
    var boxes = $$('input[type=checkbox][data-id]', cl);
    boxes.forEach(function (b) { b.checked = !!state[b.getAttribute('data-id')]; });
    function upd() {
      var done = 0;
      boxes.forEach(function (b) { if (b.checked) done++; state[b.getAttribute('data-id')] = b.checked; });
      $$('.cl-group', cl).forEach(function (gp) {
        var bx = $$('input[type=checkbox]', gp), d = bx.filter(function (b) { return b.checked; }).length;
        var c = $('.cl-count', gp); if (c) c.textContent = d + ' / ' + bx.length;
      });
      var pct = boxes.length ? Math.round(done / boxes.length * 100) : 0;
      $('#dd-bar').style.width = pct + '%';
      $('#dd-pct').textContent = done + ' of ' + boxes.length + ' checked (' + pct + '%)';
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (x) {}
    }
    cl.addEventListener('change', upd);
    var rs = $('#dd-reset'); if (rs) rs.addEventListener('click', function () { boxes.forEach(function (b) { b.checked = false; }); upd(); });
    var pr = $('#dd-print'); if (pr) pr.addEventListener('click', function () { $$('.cl-group', cl).forEach(function (d) { d.open = true; }); window.print(); });
    var ex = $('#dd-open'); if (ex) ex.addEventListener('click', function () { var all = $$('.cl-group', cl), anyClosed = all.some(function (d) { return !d.open; }); all.forEach(function (d) { d.open = anyClosed; }); ex.textContent = anyClosed ? 'Collapse all' : 'Expand all'; });
    upd();
  }
})();
