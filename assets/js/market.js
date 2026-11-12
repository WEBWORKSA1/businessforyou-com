/* BusinessForYou.com listings board. Requires site.js (window.BFY). */
(function () {
  'use strict';
  var B = window.BFY || {};
  var $ = B.$, $$ = B.$$, esc = B.esc, money = B.money;
  var board = $('#results'), preview = $('[data-listings-preview]');
  if (!board && !preview) return;

  function mult(l) { return l.cashflow > 0 ? (l.price / l.cashflow) : null; }
  function card(l) {
    var m = mult(l);
    var badge = l.status === 'verified' ? '<span class="badge badge-ok">Verified</span>' : '<span class="badge badge-ex">Example listing</span>';
    return '<article class="tag">' +
      '<div class="tag-type">' + esc(l.type) + ' · ' + esc(l.category) + '</div>' +
      '<h3>' + esc(l.title) + '</h3>' +
      '<div class="price">' + money(l.price) + '</div>' +
      '<div class="meta"><span>Cash flow<b>' + money(l.cashflow) + '</b></span><span>Revenue<b>' + money(l.revenue) + '</b></span>' +
      '<span>Multiple<b>' + (m ? m.toFixed(2) + 'x' : '—') + '</b></span><span>Established<b>' + esc(l.established || '—') + '</b></span></div>' +
      '<div class="loc">' + esc(l.region) + ', ' + esc(l.country) + '</div>' +
      '<div>' + badge + '</div>' +
      '<button class="btn btn-line btn-sm" type="button" data-lid="' + esc(l.id) + '">View details</button>' +
      '</article>';
  }

  var all = [];
  B.getJSON('data/listings.json').then(function (d) {
    all = (d.listings || d).slice();
    if (preview) {
      var n = +preview.getAttribute('data-limit') || 3;
      preview.innerHTML = all.slice(0, n).map(card).join('');
    }
    if (board) initBoard();
  }).catch(function () {
    var t = board || preview;
    if (t) t.innerHTML = '<p class="muted">Listings could not load. Refresh the page or <a href="get-matched.html">get matched by email</a>.</p>';
  });

  function initBoard() {
    var f = $('#filters'), cnt = $('#count'), sortSel = $('#sort');
    var cats = {}, ctry = {};
    all.forEach(function (l) { cats[l.category] = 1; ctry[l.country] = 1; });
    var cs = f.elements.cat, co = f.elements.country;
    Object.keys(cats).sort().forEach(function (c) { cs.insertAdjacentHTML('beforeend', '<option>' + esc(c) + '</option>'); });
    Object.keys(ctry).sort().forEach(function (c) { co.insertAdjacentHTML('beforeend', '<option>' + esc(c) + '</option>'); });
    var p = new URLSearchParams(location.search);
    ['q', 'cat', 'type', 'country', 'max'].forEach(function (k) { if (p.get(k) && f.elements[k]) f.elements[k].value = p.get(k); });
    if (p.get('max') && f.elements.max && !f.elements.max.value) {
      // choose the closest bracket
      var mx = +p.get('max'), opts = $$('option', f.elements.max).map(function (o) { return +o.value; }).filter(Boolean);
      var pick = opts.filter(function (v) { return v >= mx; })[0]; if (pick) f.elements.max.value = String(pick);
    }
    function apply() {
      var q = f.elements.q.value.trim().toLowerCase(), cat = f.elements.cat.value, typ = f.elements.type.value, c = f.elements.country.value, max = +f.elements.max.value || Infinity;
      var list = all.filter(function (l) {
        if (cat && l.category !== cat) return false;
        if (typ && l.type !== typ) return false;
        if (c && l.country !== c) return false;
        if (l.price > max) return false;
        if (q && (l.title + ' ' + l.description + ' ' + l.region + ' ' + l.category).toLowerCase().indexOf(q) === -1) return false;
        return true;
      });
      var s = sortSel.value;
      list.sort(function (a, b) {
        if (s === 'price-asc') return a.price - b.price;
        if (s === 'price-desc') return b.price - a.price;
        if (s === 'cf-desc') return b.cashflow - a.cashflow;
        if (s === 'mult-asc') return (mult(a) || 99) - (mult(b) || 99);
        return (b.added || '').localeCompare(a.added || '');
      });
      cnt.textContent = list.length + (list.length === 1 ? ' business' : ' businesses');
      board.innerHTML = list.length ? list.map(card).join('') :
        '<div class="card" style="grid-column:1/-1"><h3>No businesses match those filters yet</h3><p>Widen the price or category, or tell us what you want and we will email matching deals as they come in.</p><button class="btn btn-brass" data-open="buy">Get matched by email</button></div>';
    }
    f.addEventListener('input', apply); f.addEventListener('change', apply);
    f.addEventListener('submit', function (e) { e.preventDefault(); apply(); });
    sortSel.addEventListener('change', apply);
    var rs = $('#f-reset'); if (rs) rs.addEventListener('click', function () { f.reset(); history.replaceState(null, '', location.pathname); apply(); });
    apply();
    var id = p.get('id'); if (id) openDetail(id);
  }

  var dd;
  function openDetail(id) {
    var l = all.filter(function (x) { return x.id === id; })[0]; if (!l) return;
    if (!dd) {
      dd = document.createElement('dialog'); dd.className = 'modal'; dd.setAttribute('aria-label', 'Listing details');
      dd.innerHTML = '<div class="modal-in"><button class="modal-x" type="button" aria-label="Close">×</button><div class="dd-body"></div></div>';
      document.body.appendChild(dd);
      $('.modal-x', dd).addEventListener('click', function () { dd.close(); });
      dd.addEventListener('click', function (e) { if (e.target === dd) dd.close(); });
    }
    var m = mult(l);
    $('.dd-body', dd).innerHTML =
      '<p class="tag-type">' + esc(l.type) + ' · ' + esc(l.category) + ' · ID ' + esc(l.id) + '</p>' +
      '<h2>' + esc(l.title) + '</h2>' +
      (l.status === 'verified' ? '' : '<div class="note">This is an example listing. It shows how verified listings are presented and is not an offer of a real business. <a href="sell-your-business.html">List a real business free</a>.</div>') +
      '<div class="detail-metrics">' +
      '<div>Asking price<b>' + money(l.price) + '</b></div><div>Cash flow (SDE)<b>' + money(l.cashflow) + '</b></div><div>Revenue<b>' + money(l.revenue) + '</b></div>' +
      '<div>Multiple<b>' + (m ? m.toFixed(2) + 'x' : '—') + '</b></div><div>Established<b>' + esc(l.established || '—') + '</b></div><div>Employees<b>' + esc(l.employees || '—') + '</b></div></div>' +
      '<p>' + esc(l.description) + '</p>' +
      (l.highlights && l.highlights.length ? '<h3>Highlights</h3><ul class="check">' + l.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="mt2"><b>Location:</b> ' + esc(l.region) + ', ' + esc(l.country) + '<br><b>Reason for sale:</b> ' + esc(l.reason || 'Disclosed after NDA') + '<br><b>Financing:</b> ' + esc(l.financing || 'Ask the seller') + '</p>' +
      '<div class="btn-row mt2"><button class="btn btn-brass" type="button" data-inq="' + esc(l.id) + '">Request details</button><a class="btn btn-line" href="business-acquisition-financing.html">Run the loan numbers</a></div>';
    if (dd.showModal) dd.showModal(); else dd.setAttribute('open', '');
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lid]');
    if (b) { if (board) openDetail(b.getAttribute('data-lid')); else location.href = 'businesses-for-sale.html?id=' + encodeURIComponent(b.getAttribute('data-lid')); return; }
    var q = e.target.closest && e.target.closest('[data-inq]');
    if (q) {
      var l = all.filter(function (x) { return x.id === q.getAttribute('data-inq'); })[0];
      if (dd) dd.close();
      B.openForm('inquiry', { listing_id: l.id, listing_title: l.title, listing_status: l.status }, { title: 'Request details: ' + l.title });
    }
  });
})();
