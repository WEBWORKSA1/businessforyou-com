/* BusinessForYou.com core script. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  /* ---------- Configuration ---------- */
  var CFG = window.BFY_CONFIG = {
    site: 'BusinessForYou.com',
    // Encoded inbox (never written as plain text anywhere on the site).
    k: [116, 118, 106, 53, 115, 112, 104, 116, 110, 71, 56, 104, 122, 114, 121, 118, 126, 105, 108, 126],
    // After FormSubmit activation, paste the random alias string here to drop the address entirely.
    alias: '',
    endpoint: 'https://formsubmit.co/ajax/',
    adClient: 'ca-pub-6620975821265271',
    // Optional manual AdSense unit IDs. Empty = slot renders nothing (Auto ads still run).
    adSlots: { display: '', inArticle: '', sidebar: '' },
    // Optional payment links (Stripe / PayPal / Ko-fi). Empty = pledge form only.
    payLinks: { oneTime: '', monthly: '' }
  };
  function addr() { return CFG.k.slice().reverse().map(function (c) { return String.fromCharCode(c - 7); }).join(''); }
  function target() { return CFG.endpoint + (CFG.alias || addr()); }

  /* ---------- Helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n, short) {
    if (n == null || isNaN(n)) return '—';
    if (short && Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(n >= 1e7 ? 0 : 2).replace(/\.00$/, '') + 'M';
    if (short && Math.abs(n) >= 1e3) return '$' + Math.round(n / 1e3) + 'k';
    return '$' + Math.round(n).toLocaleString('en-US');
  }
  function getJSON(url) { return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }
  window.BFY = { $: $, $$: $$, esc: esc, money: money, getJSON: getJSON };

  /* ---------- Navigation ---------- */
  var page = (location.pathname.split('/').pop() || 'index.html');
  $$('.nav a').forEach(function (a) { if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page'); });
  var mb = $('.menu-btn'), nav = $('#nav');
  if (mb && nav) mb.addEventListener('click', function () { var o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* ---------- Hidden-address mail links ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-mail]');
    if (!a) return;
    e.preventDefault();
    location.href = 'mailto:' + addr() + '?subject=' + encodeURIComponent(a.getAttribute('data-mail') || 'BusinessForYou.com inquiry');
  });

  /* ---------- Copy link ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copy]');
    if (!b) return;
    var t = b.textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(function () { b.textContent = 'Link copied'; setTimeout(function () { b.textContent = t; }, 1800); }).catch(function () { prompt('Copy this link:', location.href); });
  });

  /* ---------- Cookie notice ---------- */
  try {
    if (!localStorage.getItem('bfy_cookie')) {
      var ck = document.createElement('div');
      ck.className = 'cookie show'; ck.setAttribute('role', 'region'); ck.setAttribute('aria-label', 'Cookie notice');
      ck.innerHTML = '<p>We use cookies to run ads, measure traffic and remember your tool settings. Read our <a href="privacy-policy.html">privacy policy</a>.</p><div class="btn-row"><button class="btn btn-dark btn-sm" data-ck="ok">Accept</button><button class="btn btn-line btn-sm" data-ck="min">Essential only</button></div>';
      document.body.appendChild(ck);
      ck.addEventListener('click', function (e) {
        var v = e.target.getAttribute('data-ck'); if (!v) return;
        try { localStorage.setItem('bfy_cookie', v); } catch (x) {}
        if (v === 'min') { (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1; }
        ck.remove();
      });
    } else if (localStorage.getItem('bfy_cookie') === 'min') {
      (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
    }
  } catch (x) {}

  /* ---------- Manual ad slots (only when IDs are configured) ---------- */
  $$('.ad-wrap[data-ad]').forEach(function (w) {
    var slot = CFG.adSlots[w.getAttribute('data-ad')];
    if (!slot) return;
    w.innerHTML = '<span class="ad-label">Advertisement</span><ins class="adsbygoogle" style="display:block" data-ad-client="' + CFG.adClient + '" data-ad-slot="' + slot + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (x) {}
  });

  /* ---------- Lead-form engine ---------- */
  var IND = ['Food & restaurant', 'Retail', 'Services (B2B)', 'Health & wellness', 'Home services & trades', 'Automotive', 'Online & ecommerce', 'SaaS & software', 'Manufacturing', 'Wholesale & distribution', 'Education & childcare', 'Transport & logistics', 'Hospitality & travel', 'Beauty & personal care', 'Other'];
  var COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'United Arab Emirates', 'Sri Lanka', 'Other'];
  var CASH = ['Under $25k', '$25k–$50k', '$50k–$100k', '$100k–$250k', '$250k–$500k', '$500k–$1M', '$1M+'];
  var PRICE = ['Under $100k', '$100k–$250k', '$250k–$500k', '$500k–$1M', '$1M–$3M', '$3M–$5M', '$5M+'];
  var REV = ['Under $250k', '$250k–$500k', '$500k–$1M', '$1M–$3M', '$3M–$10M', '$10M+'];
  var SDE = ['Under $50k', '$50k–$100k', '$100k–$250k', '$250k–$500k', '$500k–$1M', '$1M+'];
  var CONTACT = [
    { n: 'name', l: 'Full name', t: 'text', r: 1, ac: 'name' },
    { n: 'email', l: 'Email', t: 'email', r: 1, ac: 'email', w: 1 },
    { n: 'phone', l: 'Phone (optional)', t: 'tel', ac: 'tel', w: 1 }
  ];
  var FLOWS = {
    buy: {
      title: 'Get matched with businesses for sale', sub: 'Tell us what you want to own. We send matching opportunities and introductions to brokers and lenders who fit your deal. Free for buyers.',
      subject: 'Buyer match request', btn: 'Send my buyer profile',
      done: 'Your buyer profile is in. Expect your first matches by email within two business days.',
      steps: [
        { name: 'What you want to own', fields: [
          { n: 'industries', l: 'Industries you would consider', t: 'chips', o: IND, r: 1 },
          { n: 'business_type', l: 'Business type', t: 'radio', o: ['Main Street (local)', 'Online', 'Franchise', 'Any'], r: 1 }] },
        { name: 'Budget and location', fields: [
          { n: 'cash_available', l: 'Cash you can invest', t: 'select', o: CASH, r: 1, w: 1 },
          { n: 'price_range', l: 'Target purchase price', t: 'select', o: PRICE, r: 1, w: 1 },
          { n: 'country', l: 'Country', t: 'select', o: COUNTRIES, r: 1, w: 1 },
          { n: 'region', l: 'City, state or region', t: 'text', p: 'e.g. Austin, TX', w: 1 }] },
        { name: 'Your plan', fields: [
          { n: 'timeline', l: 'When do you want to close?', t: 'radio', o: ['Within 3 months', '3–6 months', '6–12 months', 'Just exploring'], r: 1 },
          { n: 'financing', l: 'How will you pay?', t: 'radio', o: ['SBA or bank loan', 'Cash', 'Seller financing', 'Investors', 'Not sure yet'], r: 1 },
          { n: 'experience', l: 'Relevant experience (optional)', t: 'textarea', p: 'Industries you have worked in, management experience, licences you hold' }] },
        { name: 'Where to send matches', fields: CONTACT }
      ]
    },
    sell: {
      title: 'Get a free, confidential valuation', sub: 'Share a few numbers. We reply with a value range and, if you want one, an introduction to a vetted broker or buyer. Your business name is never published.',
      subject: 'Seller valuation request', btn: 'Request my valuation',
      done: 'Thanks. Your request is confidential. We will reply with a value range within two business days.',
      steps: [
        { name: 'Your business', fields: [
          { n: 'industry', l: 'Industry', t: 'select', o: IND, r: 1, w: 1 },
          { n: 'years', l: 'Years in business', t: 'select', o: ['Under 2', '2–5', '5–10', '10–20', '20+'], r: 1, w: 1 },
          { n: 'country', l: 'Country', t: 'select', o: COUNTRIES, r: 1, w: 1 },
          { n: 'region', l: 'City, state or region', t: 'text', r: 1, w: 1 },
          { n: 'employees', l: 'Employees', t: 'select', o: ['Just me', '1–5', '6–20', '21–50', '51+'], w: 1 },
          { n: 'real_estate', l: 'Real estate included?', t: 'select', o: ['No, leased', 'Yes, owned', 'Optional'], w: 1 }] },
        { name: 'The numbers', fields: [
          { n: 'revenue', l: 'Annual revenue', t: 'select', o: REV, r: 1, w: 1 },
          { n: 'sde', l: 'Owner cash flow (SDE)', t: 'select', o: SDE, r: 1, w: 1, h: 'Profit plus your salary, perks and one-off costs.' },
          { n: 'asking', l: 'Price you have in mind (optional)', t: 'text', p: 'e.g. $450,000' }] },
        { name: 'Your timing', fields: [
          { n: 'timeline', l: 'When would you like to sell?', t: 'radio', o: ['Now', 'Within 6 months', '6–12 months', '1–3 years', 'Just curious'], r: 1 },
          { n: 'reason', l: 'Main reason for selling', t: 'select', o: ['Retirement', 'New venture', 'Burnout or health', 'Partner change', 'Relocation', 'Unsolicited offer', 'Other'] },
          { n: 'help', l: 'Help you want', t: 'chips', o: ['Value range only', 'Broker introduction', 'List on BusinessForYou', 'Direct buyer introductions', 'Exit planning'] }] },
        { name: 'Where to send your valuation', fields: CONTACT }
      ]
    },
    finance: {
      title: 'Check your acquisition financing', sub: 'See what lenders are likely to need for your deal. We connect you with SBA and acquisition lenders that fit your profile. No credit check.',
      subject: 'Financing pre-qualification', btn: 'Check my options',
      done: 'Got it. A financing specialist will follow up with options for your deal within two business days.',
      steps: [
        { name: 'The deal', fields: [
          { n: 'price_range', l: 'Purchase price', t: 'select', o: PRICE, r: 1, w: 1 },
          { n: 'cash_available', l: 'Cash for down payment', t: 'select', o: CASH, r: 1, w: 1 },
          { n: 'target', l: 'Do you have a business in mind?', t: 'radio', o: ['Yes, under LOI', 'Yes, talking to seller', 'Still searching'], r: 1 },
          { n: 'industry', l: 'Industry', t: 'select', o: IND, w: 1 },
          { n: 'country', l: 'Country', t: 'select', o: COUNTRIES, r: 1, w: 1 }] },
        { name: 'About you', fields: [
          { n: 'credit', l: 'Credit score range', t: 'select', o: ['760+', '700–759', '660–699', '620–659', 'Below 620', 'Not sure'], r: 1, w: 1 },
          { n: 'retirement', l: 'Retirement funds you could use', t: 'select', o: ['None', 'Under $50k', '$50k–$150k', '$150k–$500k', '$500k+'], w: 1 },
          { n: 'experience', l: 'Management or industry experience', t: 'radio', o: ['5+ years', '2–5 years', 'Under 2 years', 'None yet'], r: 1 }] },
        { name: 'Contact', fields: CONTACT }
      ]
    },
    franchise: {
      title: 'Find a franchise that fits', sub: 'Tell us your budget and interests. We send franchise and franchise-resale opportunities that match, with the questions to ask each franchisor.',
      subject: 'Franchise match request', btn: 'Send my franchise matches',
      done: 'Thanks. Your franchise matches will arrive by email within two business days.',
      steps: [
        { name: 'Interests', fields: [
          { n: 'industries', l: 'Industries', t: 'chips', o: ['Food & beverage', 'Fitness', 'Home services', 'Senior care', 'Kids & education', 'Beauty', 'Automotive', 'Retail', 'B2B services', 'Pet services', 'Cleaning', 'Hospitality'], r: 1 },
          { n: 'model', l: 'Model', t: 'radio', o: ['New unit', 'Franchise resale', 'Either'], r: 1 },
          { n: 'involvement', l: 'Involvement', t: 'radio', o: ['Owner-operator', 'Semi-absentee', 'Multi-unit investor'], r: 1 }] },
        { name: 'Budget and area', fields: [
          { n: 'liquid', l: 'Liquid cash available', t: 'select', o: CASH, r: 1, w: 1 },
          { n: 'total', l: 'Total investment range', t: 'select', o: ['Under $100k', '$100k–$250k', '$250k–$500k', '$500k–$1M', '$1M+'], r: 1, w: 1 },
          { n: 'country', l: 'Country', t: 'select', o: COUNTRIES, r: 1, w: 1 },
          { n: 'region', l: 'Territory you want', t: 'text', p: 'City or region', w: 1 },
          { n: 'timeline', l: 'Timeline', t: 'select', o: ['Within 3 months', '3–6 months', '6–12 months', 'Exploring'] }] },
        { name: 'Contact', fields: CONTACT }
      ]
    },
    listing: {
      title: 'Submit your business for sale', sub: 'Listing on BusinessForYou.com is free while we grow. We review every submission and publish verified listings without your business name unless you ask us to.',
      subject: 'New listing submission', btn: 'Submit my listing',
      done: 'Submission received. We review new listings within three business days and email you before anything goes live.',
      steps: [
        { name: 'The basics', fields: [
          { n: 'headline', l: 'Listing headline', t: 'text', r: 1, p: 'e.g. Profitable HVAC service company with 12 trucks' },
          { n: 'industry', l: 'Industry', t: 'select', o: IND, r: 1, w: 1 },
          { n: 'type', l: 'Type', t: 'select', o: ['Main Street', 'Online', 'Franchise resale', 'Real estate included'], r: 1, w: 1 },
          { n: 'country', l: 'Country', t: 'select', o: COUNTRIES, r: 1, w: 1 },
          { n: 'region', l: 'City, state or region', t: 'text', r: 1, w: 1 }] },
        { name: 'Financials', fields: [
          { n: 'asking', l: 'Asking price (USD)', t: 'number', r: 1, w: 1 },
          { n: 'revenue', l: 'Annual revenue (USD)', t: 'number', r: 1, w: 1 },
          { n: 'cash_flow', l: 'Cash flow / SDE (USD)', t: 'number', r: 1, w: 1 },
          { n: 'established', l: 'Year established', t: 'number', w: 1 },
          { n: 'description', l: 'Description', t: 'textarea', r: 1, p: 'What the business does, customers, staff, why it is for sale, growth opportunities' },
          { n: 'confidential', l: 'Confidentiality', t: 'radio', o: ['Hide business name', 'Name can be shown'], r: 1 }] },
        { name: 'Contact', fields: CONTACT }
      ]
    },
    inquiry: {
      title: 'Request listing details', sub: 'We pass your request to the seller or broker. Serious buyers usually get a non-disclosure agreement and financials next.',
      subject: 'Listing inquiry', btn: 'Request details', done: 'Request sent. The seller or broker will reply by email.',
      steps: [{ name: 'Your request', fields: [
        { n: 'funds', l: 'Funds available to invest', t: 'select', o: CASH, r: 1, w: 1 },
        { n: 'financing', l: 'Financing plan', t: 'select', o: ['SBA or bank loan', 'Cash', 'Seller financing', 'Investors', 'Not sure yet'], w: 1 },
        { n: 'message', l: 'Message', t: 'textarea', p: 'Your background and what you would like to know' }].concat(CONTACT) }]
    },
    contact: {
      title: 'Send us a message', sub: 'We reply within two business days.', subject: 'Contact form', btn: 'Send message', done: 'Message sent. We will reply within two business days.',
      steps: [{ name: 'Message', fields: [
        { n: 'name', l: 'Full name', t: 'text', r: 1, ac: 'name', w: 1 }, { n: 'email', l: 'Email', t: 'email', r: 1, ac: 'email', w: 1 },
        { n: 'topic', l: 'Topic', t: 'select', o: ['Buying a business', 'Selling a business', 'Financing', 'Listing question', 'Advertising or sponsorship', 'Partnership', 'Press', 'Website or domain inquiry', 'Something else'], r: 1 },
        { n: 'message', l: 'Message', t: 'textarea', r: 1 }] }]
    },
    donate: {
      title: 'Pledge your support', sub: 'Choose an amount and what it should fund. We email you a secure payment link and a receipt.',
      subject: 'Support pledge', btn: 'Pledge support',
      done: 'Thank you. We will email your secure payment link within one business day.',
      steps: [
        { name: 'Your support', fields: [
          { n: 'amount', l: 'Amount (USD)', t: 'radio', o: ['$5', '$25', '$100', '$500', 'Custom'], r: 1 },
          { n: 'custom_amount', l: 'Custom amount (optional)', t: 'number', w: 1 },
          { n: 'frequency', l: 'Frequency', t: 'select', o: ['One-time', 'Monthly'], r: 1, w: 1 },
          { n: 'purpose', l: 'Put it toward', t: 'radio', o: ['Where it is needed most', 'Operations & hosting', 'Promotions & marketing', 'Hiring talent', 'Contests & prizes'], r: 1 }] },
        { name: 'About you', fields: CONTACT.concat([
          { n: 'recognition', l: 'Recognition', t: 'radio', o: ['List my name as a supporter', 'Keep me anonymous'], r: 1 },
          { n: 'message', l: 'Message (optional)', t: 'textarea' }]) }
      ]
    },
    contest: {
      title: 'Enter this month’s contest', sub: 'Free to enter. Read the official rules below before you submit.', subject: 'Contest entry', btn: 'Submit my entry',
      done: 'Entry received. Winners are announced on the contests page and notified by email.',
      steps: [
        { name: 'Your entry', fields: [
          { n: 'contest', l: 'Contest', t: 'select', o: ['Business Pitch Spotlight (owners)', 'My First Acquisition Plan (buyers)', 'Best Small-Business Turnaround Story', 'Creator Challenge (video or article)'], r: 1 },
          { n: 'entry_title', l: 'Entry title', t: 'text', r: 1 },
          { n: 'entry', l: 'Your entry (up to 500 words)', t: 'textarea', r: 1 },
          { n: 'link', l: 'Link (optional)', t: 'url', p: 'https://' }] },
        { name: 'About you', fields: CONTACT.concat([
          { n: 'country', l: 'Country', t: 'select', o: COUNTRIES, r: 1 },
          { n: 'rules', l: 'I am 18 or older and accept the official rules', t: 'check', r: 1 }]) }
      ]
    },
    careers: {
      title: 'Apply to join the team', sub: 'Remote, flexible and project-based to start. Tell us how you would help buyers and owners.', subject: 'Job application', btn: 'Send application',
      done: 'Application received. If there is a fit, we will contact you within a week.',
      steps: [
        { name: 'Role', fields: [
          { n: 'role', l: 'Role', t: 'select', o: ['Deal researcher', 'M&A content writer', 'Video creator & editor', 'Partnerships & ad sales', 'Community ambassador', 'Front-end developer', 'Open application'], r: 1 },
          { n: 'availability', l: 'Availability', t: 'select', o: ['Under 10 h/week', '10–20 h/week', '20–40 h/week', 'Full time'], r: 1, w: 1 },
          { n: 'country', l: 'Country', t: 'select', o: COUNTRIES, r: 1, w: 1 },
          { n: 'portfolio', l: 'Portfolio, LinkedIn or work samples', t: 'url', p: 'https://' },
          { n: 'note', l: 'Why you, in a few lines', t: 'textarea', r: 1 }] },
        { name: 'Contact', fields: CONTACT }
      ]
    },
    advertise: {
      title: 'Advertise, sponsor or partner', sub: 'Reach buyers, sellers and advisors at the moment they make decisions. Tell us your goal and we send a media kit and rates.', subject: 'Advertising / partnership inquiry', btn: 'Request media kit',
      done: 'Thanks. The media kit and rates are on their way to your inbox.',
      steps: [
        { name: 'Your goal', fields: [
          { n: 'interest', l: 'Interested in', t: 'chips', o: ['Homepage sponsorship', 'Category sponsorship', 'Featured listings', 'Newsletter sponsorship', 'Partner directory (brokers, lenders, advisors)', 'Contest prize sponsorship', 'Lead partnership', 'Buy this website or domain'], r: 1 },
          { n: 'company', l: 'Company', t: 'text', r: 1, w: 1 },
          { n: 'website', l: 'Website', t: 'url', p: 'https://', w: 1 },
          { n: 'budget', l: 'Monthly budget', t: 'select', o: ['Under $500', '$500–$2,000', '$2,000–$10,000', '$10,000+', 'Not sure'], w: 1 },
          { n: 'start', l: 'Start date', t: 'select', o: ['This month', 'Next month', 'This quarter', 'Later'], w: 1 },
          { n: 'goals', l: 'What does success look like?', t: 'textarea' }] },
        { name: 'Contact', fields: CONTACT }
      ]
    },
    newsletter: { subject: 'Newsletter signup', inline: true }
  };
  window.BFY.FLOWS = FLOWS;

  var uid = 0;
  function fieldHTML(f, fid, pre) {
    var id = fid + '-' + f.n, req = f.r ? ' required' : '', v = pre[f.n], lab = esc(f.l) + (f.r ? '' : '');
    var h = '<div class="field' + (f.w ? ' w' : '') + '" data-f="' + f.n + '">';
    if (f.t === 'chips' || f.t === 'radio') {
      var type = f.t === 'chips' ? 'checkbox' : 'radio';
      var vals = Array.isArray(v) ? v : (v ? [v] : []);
      h += '<fieldset style="border:0;padding:0;margin:0"><legend class="lbl">' + lab + '</legend><div class="chips">';
      f.o.forEach(function (o) {
        h += '<label class="chip"><input type="' + type + '" name="' + f.n + '" value="' + esc(o) + '"' + (vals.indexOf(o) > -1 ? ' checked' : '') + '><span>' + esc(o) + '</span></label>';
      });
      h += '</div></fieldset>';
    } else if (f.t === 'check') {
      h += '<label class="consent"><input type="checkbox" name="' + f.n + '" value="yes"' + req + '> <span>' + lab + ' (<a href="contests.html#rules" target="_blank">official rules</a>)</span></label>';
    } else {
      h += '<label for="' + id + '">' + lab + '</label>';
      if (f.t === 'select') {
        h += '<select id="' + id + '" name="' + f.n + '"' + req + '><option value="">Choose…</option>';
        f.o.forEach(function (o) { h += '<option' + (v === o ? ' selected' : '') + '>' + esc(o) + '</option>'; });
        h += '</select>';
      } else if (f.t === 'textarea') {
        h += '<textarea id="' + id + '" name="' + f.n + '"' + req + (f.p ? ' placeholder="' + esc(f.p) + '"' : '') + '>' + esc(v || '') + '</textarea>';
      } else {
        h += '<input id="' + id + '" type="' + f.t + '" name="' + f.n + '"' + req + (f.ac ? ' autocomplete="' + f.ac + '"' : '') + (f.p ? ' placeholder="' + esc(f.p) + '"' : '') + (f.t === 'number' ? ' min="0" inputmode="numeric"' : '') + (v ? ' value="' + esc(v) + '"' : '') + '>';
      }
    }
    if (f.h) h += '<div class="hint">' + esc(f.h) + '</div>';
    return h + '</div>';
  }

  function render(host, key, pre, opts) {
    var flow = FLOWS[key]; if (!flow) return;
    pre = pre || {}; opts = opts || {};
    var fid = 'lf' + (++uid), step = 0, n = flow.steps.length;
    var heading = opts.compact ? 'h3' : 'h2';
    var html = '<form class="lf" novalidate data-flow="' + key + '" id="' + fid + '">';
    if (!opts.noHead) html += '<div class="lf-head"><' + heading + '>' + esc(opts.title || flow.title) + '</' + heading + '><p>' + esc(opts.sub || flow.sub) + '</p></div>';
    if (n > 1) { html += '<div class="lf-progress" aria-hidden="true">'; for (var i = 0; i < n; i++) html += '<span></span>'; html += '</div>'; }
    flow.steps.forEach(function (s, i) {
      html += '<div class="lf-step" data-step="' + i + '"' + (i ? ' hidden' : '') + '>';
      if (n > 1) html += '<div class="lf-stepname">Step ' + (i + 1) + ' of ' + n + ': ' + esc(s.name) + '</div>';
      var buf = [];
      s.fields.forEach(function (f) { buf.push(f); });
      // pair half-width fields into rows
      for (var j = 0; j < buf.length; j++) {
        if (buf[j].w && buf[j + 1] && buf[j + 1].w) { html += '<div class="row2">' + fieldHTML(buf[j], fid, pre) + fieldHTML(buf[j + 1], fid, pre) + '</div>'; j++; }
        else html += fieldHTML(buf[j], fid, pre);
      }
      if (i === n - 1) {
        html += '<label class="consent"><input type="checkbox" name="consent" value="yes" required> <span>I agree to be contacted about this request and accept the <a href="privacy-policy.html" target="_blank">privacy policy</a>.</span></label>';
        html += '<input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">';
      }
      html += '<div class="lf-nav">' + (i ? '<button type="button" class="btn btn-line" data-back>Back</button>' : '<span></span>');
      html += i === n - 1 ? '<button type="submit" class="btn btn-brass">' + esc(flow.btn) + '</button>' : '<button type="button" class="btn btn-dark" data-next>Continue</button>';
      html += '</div></div>';
    });
    html += '<div class="lf-msg" role="status" aria-live="polite"></div>';
    html += '<div class="lf-trust"><span>Free, no obligation</span><span>Your details are never sold</span><span>Reply within 2 business days</span></div>';
    html += '</form>';
    host.innerHTML = html;
    var form = $('#' + fid, host);
    var bars = $$('.lf-progress span', form);
    function show(i) {
      $$('.lf-step', form).forEach(function (s, k) { s.hidden = k !== i; });
      bars.forEach(function (b, k) { b.classList.toggle('on', k <= i); });
      step = i;
      if (opts.focus !== false && i > 0) { var first = $('.lf-step[data-step="' + i + '"] input, .lf-step[data-step="' + i + '"] select, .lf-step[data-step="' + i + '"] textarea', form); if (first) first.focus(); }
    }
    function valid(i) {
      var ok = true, s = $('.lf-step[data-step="' + i + '"]', form);
      $$('.field', s).forEach(function (fd) { fd.classList.remove('err'); var m = $('.errmsg', fd); if (m) m.remove(); });
      flow.steps[i].fields.forEach(function (f) {
        if (!f.r) return;
        var fd = $('[data-f="' + f.n + '"]', s), bad = false;
        if (f.t === 'chips' || f.t === 'radio' || f.t === 'check') bad = !$$('input[name="' + f.n + '"]:checked', s).length;
        else { var el = $('[name="' + f.n + '"]', s); bad = !el.value.trim() || (f.t === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())); }
        if (bad) { ok = false; fd.classList.add('err'); fd.insertAdjacentHTML('beforeend', '<div class="errmsg">' + (f.t === 'email' ? 'Enter a valid email address.' : 'This field is required.') + '</div>'); }
      });
      if (i === n - 1) { var c = $('[name="consent"]', s); if (!c.checked) { ok = false; $('.lf-msg', form).className = 'lf-msg bad'; $('.lf-msg', form).textContent = 'Tick the consent box to continue.'; } }
      if (!ok) { var e1 = $('.err input, .err select, .err textarea', s); if (e1) e1.focus(); }
      return ok;
    }
    form.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-next')) { if (valid(step)) show(step + 1); }
      if (e.target.hasAttribute('data-back')) show(step - 1);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('.lf-msg', form); msg.className = 'lf-msg'; msg.textContent = '';
      if (!valid(step)) return;
      if ($('[name="_honey"]', form).value) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { if (k === '_honey' || k === 'consent') return; data[k] = data[k] ? data[k] + ', ' + v : v; });
      Object.keys(pre).forEach(function (k) { if (!(k in data) && pre[k] !== '' && !Array.isArray(pre[k])) data[k] = pre[k]; });
      var btn = $('button[type=submit]', form); btn.disabled = true; btn.textContent = 'Sending…';
      send(key, flow, data).then(function () {
        var extra = '';
        if (key === 'donate' && CFG.payLinks.oneTime) extra = '<p><a class="btn btn-brass" href="' + esc(data.frequency === 'Monthly' && CFG.payLinks.monthly ? CFG.payLinks.monthly : CFG.payLinks.oneTime) + '" target="_blank" rel="noopener">Complete payment securely</a></p>';
        form.innerHTML = '<div class="lf-done"><h3>Sent</h3><p>' + esc(flow.done) + '</p>' + extra + '<p class="muted">While you wait: <a href="business-valuation-calculator.html">value a business</a>, <a href="business-acquisition-financing.html">run the loan numbers</a> or <a href="guides.html">read the guides</a>.</p></div>';
        try { window.gtag && gtag('event', 'generate_lead', { form: key }); } catch (x) {}
      }).catch(function () {
        btn.disabled = false; btn.textContent = flow.btn;
        msg.className = 'lf-msg bad';
        msg.innerHTML = 'We could not send that just now. Check your connection and try again, or <a href="#" data-mail="' + esc(flow.subject) + '">email us instead</a>.';
      });
    });
    show(0);
    return form;
  }

  function send(key, flow, data) {
    var payload = {
      _subject: '[BusinessForYou] ' + flow.subject + (data.name ? ' from ' + data.name : ''),
      _template: 'table', _captcha: 'false', form: key, page: location.href,
      referrer: document.referrer || 'direct', submitted_at: new Date().toISOString()
    };
    Object.keys(data).forEach(function (k) { payload[k] = data[k]; });
    if (data.email) payload._replyto = data.email;
    return fetch(target(), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error('http'); if (String(j.success) === 'false' && !/activat/i.test(j.message || '')) throw new Error('fs'); return j; }); });
  }
  window.BFY.send = send;

  // Inline embeds: <div data-form="sell"></div>
  $$('[data-form]').forEach(function (host) {
    var key = host.getAttribute('data-form');
    if (key === 'newsletter') return newsletter(host);
    var pre = {}; try { pre = JSON.parse(host.getAttribute('data-prefill') || '{}'); } catch (x) {}
    render(host, key, pre, { compact: host.hasAttribute('data-compact'), noHead: host.hasAttribute('data-nohead'), focus: false });
  });

  // Modal forms: <button data-open="buy" data-prefill='{"x":"y"}'>
  var dlg;
  function openForm(key, pre, opts) {
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'modal'; dlg.setAttribute('aria-label', 'Form');
      dlg.innerHTML = '<div class="modal-in"><button class="modal-x" type="button" aria-label="Close">×</button><div class="modal-body"></div></div>';
      document.body.appendChild(dlg);
      $('.modal-x', dlg).addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    }
    render($('.modal-body', dlg), key, pre || {}, opts || {});
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  window.BFY.openForm = openForm;
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-open]');
    if (!b) return;
    e.preventDefault();
    var pre = {}; try { pre = JSON.parse(b.getAttribute('data-prefill') || '{}'); } catch (x) {}
    openForm(b.getAttribute('data-open'), pre);
  });
  // Deep link: get-matched.html#sell opens the right tab; any page with ?form=buy opens a modal
  var q = new URLSearchParams(location.search).get('form');
  if (q && FLOWS[q] && !FLOWS[q].inline) openForm(q);

  function newsletter(host) {
    host.innerHTML = '<form class="inline-news" novalidate><label class="vh" for="nl' + (++uid) + '">Email address</label><input id="nl' + uid + '" type="email" name="email" placeholder="Your email" autocomplete="email" required><input class="hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn btn-brass btn-sm" type="submit">Get weekly deals</button></form><div class="lf-msg" role="status" aria-live="polite"></div>';
    var f = $('form', host), m = $('.lf-msg', host);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = f.email.value.trim();
      if (f._honey.value) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { m.className = 'lf-msg bad'; m.textContent = 'Enter a valid email address.'; return; }
      m.className = 'lf-msg'; m.textContent = 'Subscribing…';
      send('newsletter', FLOWS.newsletter, { email: em, list: 'Weekly deals & guides' }).then(function () { f.remove(); m.textContent = 'You are subscribed. Watch your inbox on Monday.'; })
        .catch(function () { m.className = 'lf-msg bad'; m.textContent = 'That did not go through. Please try again.'; });
    });
  }

  /* ---------- Tabs (get-matched hub) ---------- */
  $$('[data-tabs]').forEach(function (wrap) {
    var btns = $$('[role=tab]', wrap);
    function act(id) {
      btns.forEach(function (b) {
        var on = b.getAttribute('aria-controls') === id;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        var p = document.getElementById(b.getAttribute('aria-controls')); if (p) p.hidden = !on;
      });
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { act(b.getAttribute('aria-controls')); history.replaceState(null, '', '#' + b.getAttribute('aria-controls').replace('tab-', '')); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
        var nb = btns[(i + d + btns.length) % btns.length]; nb.focus(); nb.click();
      });
    });
    var h = location.hash.replace('#', '');
    act(h && document.getElementById('tab-' + h) ? 'tab-' + h : btns[0].getAttribute('aria-controls'));
  });

  /* ---------- Hero deal matcher ---------- */
  var mt = $('#matcher');
  if (mt) {
    var cash = $('#m-cash', mt), cashOut = $('#m-cash-out', mt), out = $('.match-out', mt);
    var steps = [10000, 25000, 50000, 75000, 100000, 150000, 200000, 250000, 350000, 500000, 750000, 1000000];
    function cv() { return steps[+cash.value]; }
    function bucket(v, arr, edges) { for (var i = 0; i < edges.length; i++) if (v < edges[i]) return arr[i]; return arr[arr.length - 1]; }
    function upd() { cashOut.textContent = money(cv()) + (cv() >= 1000000 ? '+' : ''); }
    cash.addEventListener('input', upd); upd();
    mt.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = cv(), hi = Math.min(c / 0.10, 5000000 + c), lo = c / 0.30;
      var sdeLo = lo / 2.7, sdeHi = hi / 2.7;
      var loan = hi - c, r = 0.105 / 12, nPay = 120, pay = loan * r / (1 - Math.pow(1 + r, -nPay));
      $('#mo-price', mt).textContent = money(lo, 1) + ' – ' + money(hi, 1);
      $('#mo-sde', mt).textContent = money(sdeLo, 1) + ' – ' + money(sdeHi, 1);
      $('#mo-pay', mt).textContent = money(pay) + '/mo';
      out.classList.add('show');
      var ind = $('#m-ind', mt).value, typ = $('#m-type', mt).value;
      var pre = {
        cash_available: bucket(c, CASH, [25000, 50000, 100000, 250000, 500000, 1000000]),
        price_range: bucket(hi, PRICE, [100000, 250000, 500000, 1000000, 3000000, 5000000]),
        industries: ind ? [ind] : [], business_type: typ || 'Any'
      };
      $('#mo-go', mt).setAttribute('data-prefill', JSON.stringify(pre));
      $('#mo-browse', mt).href = 'businesses-for-sale.html?max=' + Math.round(hi) + (ind ? '&cat=' + encodeURIComponent(ind) : '');
    });
  }

  /* ---------- Videos (lite YouTube embeds) ---------- */
  var vHosts = $$('[data-videos]');
  if (vHosts.length) getJSON('data/videos.json').then(function (vids) {
    vHosts.forEach(function (host) {
      var topic = host.getAttribute('data-topic'), lim = +host.getAttribute('data-limit') || 999;
      function draw(t) {
        var list = vids.filter(function (v) { return !t || t === 'all' || v.topic === t; }).slice(0, lim);
        host.innerHTML = list.map(function (v) {
          return '<article class="vid"><div class="vid-frame"><button type="button" data-yt="' + esc(v.id) + '" aria-label="Play video: ' + esc(v.title) + '"><img loading="lazy" src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt=""></button></div><div class="vid-body"><h3>' + esc(v.title) + '</h3><p>' + esc(v.topicLabel || v.topic) + (v.channel ? ' — ' + esc(v.channel) : '') + ' <a href="https://www.youtube.com/watch?v=' + esc(v.id) + '" target="_blank" rel="noopener">Watch on YouTube</a></p></div></article>';
        }).join('');
      }
      draw(topic);
      var fc = host.previousElementSibling && host.previousElementSibling.matches('.filter-chips') ? host.previousElementSibling : null;
      if (fc) fc.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        $$('button', fc).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        draw(b.getAttribute('data-t'));
      });
    });
  }).catch(function () { vHosts.forEach(function (h) { h.innerHTML = '<p class="muted">Videos are loading slowly. <a href="videos.html">Open the video library</a>.</p>'; }); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-yt]'); if (!b) return;
    var id = b.getAttribute('data-yt');
    b.parentNode.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  });

  /* ---------- News (auto-updated by GitHub Actions) ---------- */
  var nHosts = $$('[data-news]');
  if (nHosts.length) getJSON('data/news.json').then(function (d) {
    nHosts.forEach(function (host) {
      var lim = +host.getAttribute('data-limit') || 50;
      var items = (d.items || []).slice(0, lim);
      if (!items.length) { host.outerHTML = '<p class="muted">Headlines refresh every morning.</p>'; return; }
      host.innerHTML = items.map(function (it) {
        var dt = it.date ? new Date(it.date) : null;
        return '<li><a href="' + esc(it.link) + '" target="_blank" rel="noopener nofollow">' + esc(it.title) + '</a><small>' + esc(it.source || '') + (dt && !isNaN(dt) ? ', ' + dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '') + '</small></li>';
      }).join('');
      var up = host.getAttribute('data-updated-el'); if (up && d.updated && $(up)) $(up).textContent = new Date(d.updated).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    });
  }).catch(function () {});

  /* ---------- Tip of the day ---------- */
  var tipEl = $('[data-tip]');
  if (tipEl) getJSON('data/tips.json').then(function (tips) {
    var d = new Date(), start = new Date(d.getFullYear(), 0, 0), day = Math.floor((d - start) / 864e5);
    tipEl.textContent = tips[day % tips.length];
  }).catch(function () {});

  /* ---------- Guide table of contents ---------- */
  var toc = $('[data-toc]');
  if (toc) {
    var hs = $$('.prose h2');
    toc.innerHTML = hs.map(function (h, i) {
      if (!h.id) h.id = 's' + (i + 1) + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      return '<li><a href="#' + h.id + '">' + esc(h.textContent) + '</a></li>';
    }).join('');
  }
})();
