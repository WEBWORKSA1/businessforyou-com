# BusinessForYou.com: Strategy, Research and Phase-Wise Build Prompt

Prepared November 12, 2026.

---

## 0. The verdict: what BusinessForYou.com should be

**Build an acquisition matchmaker and toolkit, not another listings marketplace.**

"Business for you" reads as *a business that is for sale, picked for you*. The literal play, a BizBuySell-style listings marketplace, is the wrong first move:

| Fact | Implication |
|---|---|
| Incumbent marketplaces already hold tens of thousands of listings (BizBuySell alone advertises 45,000+). | A new board starts at zero inventory. Buyers leave empty boards. |
| "business for sale" carries a very low CPC (Semrush shows about $0.38 for the head term on businessesforsale.com). | Browsing traffic monetizes poorly with AdSense. |
| Seller and valuation intent carries high CPCs: "how to sell my business quickly" ≈ $30.69, "value business" ≈ $15.21, "how to sell a business" ≈ $15.55, "valuing a company for sale" ≈ $9.53 (seodata.dev, US). | AdSense revenue concentrates on seller, valuation and financing pages. Build those first and best. |
| BizBuySell Q3 2026: 2,132 closed U.S. deals, median sale price $350,000, average cash-flow multiple 2.30x under $1M and 3.73x over $1M. | Every seller lead sits on a ~$350k transaction. Brokers' success fees on that are five figures; referral value per closed seller lead is large. |

**Positioning:** "The business for you is already open." Free tools that mirror how brokers and lenders evaluate deals, plain-English guides, a curated (not scraped) listings board, and opt-in introductions.

**Revenue stack (ranked by expected value):**
1. **Seller lead referrals** to brokers (referral share of success fee or pay-per-lead).
2. **Financing referrals** to SBA/acquisition lenders (disclosed referral fees).
3. **Franchise match leads** (franchise portals monetize on paid info requests).
4. **AdSense** on high-CPC valuation, financing and selling content.
5. Sponsorships (homepage, category, newsletter, contest prizes), featured listings, partner directory.
6. Supporter pledges.

**Illustrative month-12 model (assumptions, not forecasts):** 30k sessions × 2.2 pages = 66k pageviews. At an $8–$20 RPM, AdSense = ~$530–$1,320/month. At a 2–4% form conversion = 600–1,200 leads; if 25% are seller leads and 1% of those close through a referred broker at the $350k median with a 10% fee and a 20% referral share, each closed referral is worth ~$7,000. Two per month ≈ $14,000. **Lead monetization is the business; AdSense pays the running costs.**

---

## 1. Competitive research: 40 sites reviewed

| # | Site | Type | What we took from it |
|---|---|---|---|
| 1 | BizBuySell | Main Street marketplace | Insight Report data, price/cash-flow card fields, learning center structure (site blocked automated fetch; reviewed via public report pages) |
| 2 | BizQuest | Main Street marketplace | Listing fields: asking price, cash flow (SDE), EBITDA, revenue, inventory, FF&E, real estate, years, seller motivation, listing ID |
| 3 | Flippa | Online-business marketplace | Free valuation CTA, P&L builder, LOI builder, deal room, category tiles, closed-deals proof |
| 4 | Empire Flippers | Online-business broker | Gated financials, hero stats, video testimonials, valuation tool |
| 5 | Acquire.com | Startup marketplace | Free SaaS valuation, LOI/APA builder, deal alerts, verified buyer funds |
| 6 | BusinessesForSale.com | Global marketplace | Country picker, sector + location search, services directory |
| 7 | DealStream | Deal network | Category tiles with counts, quarterly survey content |
| 8 | LoopNet | CRE + business marketplace | Natural-language search, broker search, popular-city shortcuts |
| 9 | BusinessBroker.net | Marketplace | "Value My Biz", financing pre-qual form fields, request-info basket |
| 10 | BizBen | Regional marketplace | Wanted-to-buy posts, status tags (In Escrow), county landing pages |
| 11 | Website Closers | Broker | Multi-step valuation intake, 24-hour valuation promise, case studies |
| 12 | FE International | M&A advisor | Repeated "free valuation" CTAs, industry pages, reports |
| 13 | Quiet Light | Online broker | 3-step process, readiness checklist opt-in |
| 14 | Motion Invest | Content-site marketplace | Verified buyers/sellers positioning |
| 15 | Investors Club | Marketplace | Manual review, budget/country browse, 0% success fee model |
| 16 | Sunbelt Network | Brokerage network | Email alerts, 9-step selling process, FAQ blocks |
| 17 | Transworld | Brokerage franchise | Buy/Sell/Find a location IA, buying-process education |
| 18 | Murphy Business | Brokerage | Status + price + cash flow cards, success gallery |
| 19 | IBBA | Association | Find-a-broker search, CBI credential, glossary |
| 20 | Axial | Lower-mid-market network | Audience-segmented paths, closed-deal showcase |
| 21 | Franchise Gator | Franchise portal | Request-info form fields, investment filters, Top 100 |
| 22 | Franchise Direct | Franchise portal | FDD research hub, investment tiers, mega-menu |
| 23 | SMERGERS | Global SME marketplace | Investor match score, run-rate metrics, CIM builder |
| 24 | GlobalBX | Marketplace | (Fetch failed; reviewed by reputation) |
| 25 | BusinessMart | Marketplace | Loan calculator, vendor quote requests, $20.99/mo listings |
| 26 | Microns | Micro-startup marketplace | Budget browse, newsletter states, wall of love |
| 27 | SideProjectors | Side-project marketplace | Project submission fields, hire-a-maker |
| 28 | ExitAdviser | Calculators | 30+ calculators, DSCR/APR tool cards, data-source attribution |
| 29 | Kumo | Deal aggregator | Daily deal alerts, AI summaries, saved searches |
| 30 | Rightbiz (UK) | Marketplace | Agent packages, scale claims |
| 31 | Daltons Business (UK) | Marketplace | Freehold/leasehold price, favourites, alerts |
| 32 | SEEK Business (AU) | Marketplace | Franchise new/resale tags, info-pack CTA |
| 33 | BizNexus | Deal platform | Acquirer/owner/advisor split, ExitPrep |
| 34 | Latonas | Online broker | Value calculators by model, filter sidebar |
| 35 | Digital Exits | Holding company | Portfolio cards |
| 36 | Guidant Financial | Acquisition finance | Pre-qualify form, ROBS/SBA explainers, calculators |
| 37 | Business Exits | Broker | Free SDE calculator, M&A glossary |
| 38 | VR Business Brokers | Brokerage | "We'll call you" form fields, appointment setting |
| 39 | Searchfunder | Community | Deals/jobs feed, low-price membership tiers |
| 40 | SBA.gov / IFA / SCORE / Synergy BB | Government, associations, broker | 7(a) facts ($5M max, change of ownership eligible), FDD guidance, free mentoring model, NDA-gated listings |

**Patterns that convert across the set:** (1) a free valuation as the primary seller CTA; (2) multi-step forms with progress bars; (3) gated detail behind an NDA or inquiry; (4) price + cash flow + multiple on every card; (5) hard trust numbers and source attributions; (6) separate paths for buyers, owners and advisers; (7) calculators as SEO magnets; (8) email alerts for buyers.

---

## 2. Phase-wise build prompt (copy each phase into your AI builder)

### Phase 1: Foundation

> Build a static, framework-free website for **BusinessForYou.com** that deploys to GitHub Pages from the `main` branch root. Use relative links only (it must work under `/businessforyou-com/` and at the apex domain). Create `assets/css/style.css`, `assets/js/site.js`, `data/`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `ads.txt` (`google.com, pub-6620975821265271, DIRECT, f08c47fec0942fa0`), `manifest.webmanifest`, an SVG favicon and a `404.html` that injects a `<base>` for nested paths.
>
> Design system: ledger green `#0F3B2F`, brass `#C2961E`, paper `#F4F6F3`, ink `#18231E`, sage `#DCE6DF`, stamp red `#B02A37`. Archivo (variable width, expanded for display) for UI and headlines; Source Serif 4 for long-form reading. Signature motifs: a hanging "OPEN" sign deal matcher in the hero, hang-tag listing cards with a punched hole, a ruled ledger table for market data. Left-aligned layouts, no all-caps eyebrows, no decorative numbering except real sequences.
>
> Every page: (a) a top bar reading "Contact, if you are interested in this website/domain name/Sponsorship/Advertisement/Partnership" linking to `https://web.works/contact`; (b) the AdSense tag `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6620975821265271" crossorigin="anonymous"></script>` and `<meta name="google-adsense-account" content="ca-pub-6620975821265271">` in `<head>`; (c) sticky header nav (Buy, Sell, Value, Finance, Franchises, Guides, Videos, Get matched); (d) footer with newsletter, link columns, legal links and the trademark/copyright link; (e) unique title, meta description, canonical (`https://businessforyou.com/...`), Open Graph and JSON-LD.

### Phase 2: Lead-generation engine

> In `site.js`, build a reusable multi-step form engine rendered from flow definitions: `buy`, `sell`, `finance`, `franchise`, `listing`, `inquiry`, `contact`, `donate`, `contest`, `careers`, `advertise`, `newsletter`. Features: progress bar, per-step validation, chips/radios/selects, half-width field pairing, prefill via `data-prefill` JSON, honeypot, consent checkbox, success state with next-step links, modal mode via `data-open="flow"`, deep links (`?form=sell`, `get-matched.html#sell`).
>
> Submit with `fetch` as JSON to FormSubmit's AJAX endpoint. **The inbox address must never appear in HTML or plain-text JS**: store it as an offset, reversed char-code array and assemble it at runtime; support a FormSubmit alias string that replaces it after activation. `data-mail` links build `mailto:` at click time only.
>
> Build `get-matched.html` as the dedicated lead hub with accessible tabs (buy / sell / finance / franchise / list), a "what happens next" sequence, and a "why this is free" disclosure. Embed the most relevant flow on every money page (sell form on home, listings, ideas, valuation, guides' sidebars).

### Phase 3: Listings board

> `data/listings.json` + `assets/js/market.js`: filter by keyword, industry, type, country and max price; sort by newest, price, cash flow, lowest multiple; hang-tag cards showing price, cash flow, revenue, multiple, established, location and a status badge (**Example listing** vs **Verified**); detail dialog with metrics, highlights, reason, financing, and a "Request details" button that opens the `inquiry` flow prefilled with the listing ID. Never present example data as real: badge it and explain it on the board and in the detail view.

### Phase 4: Tools

> `assets/js/tools.js`:
> 1. **Valuation calculator**: SDE build-up (profit + owner pay + perks + interest + D&A + one-offs), base multiple by SDE band (2.0x / 2.4x / 2.8x / 3.2x / 3.7x calibrated to BizBuySell averages), industry adjustment, six risk adjusters, inventory and real estate added separately, low/mid/high range, value drag explanation, "get an expert opinion" lead CTA.
> 2. **Acquisition loan calculator**: price, down %, seller note %, rates and terms, closing %, working capital, SDE and replacement salary → bank and note payments, annual debt service, DSCR with verdict bands (≥1.5, ≥1.25, <1.25), cash needed, cash-on-cash and payback; finance lead CTA.
> 3. **Due diligence checklist**: 61 static, crawlable items in 7 groups, saved to localStorage, progress bar, expand/collapse, print.
> 4. **Hero deal matcher**: cash slider → target price range, SDE to look for, estimated payment; hands off to the buyer flow with prefilled buckets.

### Phase 5: Content for AdSense approval and SEO

> Write original, people-first content (no spun or copied text): 11 guides (buy, value, sell, SBA loans, seller financing, LOI, online businesses, franchise resales, red flags, prepare for sale, brokers), 20-business "ideas to buy" field guide, franchises page with FDD items, guides hub. Each guide: breadcrumbs, byline, auto table of contents, sidebar lead CTA, related links, Article JSON-LD, topic-matched videos. Cite every statistic to its source.

### Phase 6: Video and live content

> `data/videos.json` with verified YouTube IDs by topic; lite embeds (thumbnail first, `youtube-nocookie.com` iframe on click), topic filter chips, "Watch on YouTube" links. `data/news.json` rendered on home and `news.html`; `data/tips.json` rotated by day of year.

### Phase 7: Community and revenue pages

> `donate.html` (tiers $5/$25/$100/$500, allocation bars, pledge form, optional payment links in config, not-tax-deductible notice), `contests.html` (four monthly skill contests, judging weights, entry form, full official rules: no purchase necessary, eligibility, entry period, judging, prizes, notification, licence, privacy, general), `careers.html` (six remote roles, paid trial, application form), `advertise.html` (seven packages, standards, media-kit form, website/domain acquisition link).

### Phase 8: Compliance

> `privacy-policy.html` (forms, cookies, Google AdSense third-party vendor disclosure with Ads Settings and aboutads.info opt-outs, YouTube, hosting, rights under GDPR/UK GDPR/CCPA/PIPEDA/Quebec/India DPDP, retention, children), `terms.html`, `disclaimer.html` with an anchored **trademark and copyright disclosure** (independent site, third-party marks for identification only, descriptive use of "Business For You", no third-party logos, embedded works, notice procedure), `about.html` with funding transparency and editorial standards, `contact.html`. Cookie notice with "Essential only" → non-personalised ads.

### Phase 9: Automation, deployment and launch

> `scripts/auto_update.py` (stdlib) pulls Google News RSS searches, de-duplicates, keeps 40 headlines under 45 days old, writes `data/news.json`, and bumps sitemap dates. `.github/workflows/auto-update.yml` runs it daily and commits with `contents: write` (free on public repos). Deploy: Settings > Pages > Deploy from branch > `main` / root. Point `businessforyou.com` DNS to GitHub Pages, enforce HTTPS, confirm `ads.txt`, submit the sitemap in Search Console, then apply for AdSense.

---

## 3. AdSense approval checklist

- [x] 30+ indexable pages, 11 long-form original guides, tools with explanatory copy
- [x] Privacy policy with Google advertising disclosure; terms; disclaimer; about; contact
- [x] Clear navigation, no broken links, no "coming soon" or placeholder pages
- [x] Example data explicitly labelled; no copied content; videos via official embeds
- [x] `ads.txt` at the root; AdSense account meta tag and script on every page
- [ ] Custom domain live over HTTPS (AdSense approves domains, not `github.io` paths)
- [ ] Google CMP enabled in AdSense for EEA/UK traffic
- [ ] Sitemap submitted in Search Console; a few weeks of organic indexing before applying

## 4. Growth after launch

1. Recruit 10 broker partners and 3 SBA lenders before pushing traffic; leads without buyers are wasted.
2. Publish "valuation multiple by industry" and "how to buy a [business type]" pages from the ideas guide (one strong page each, not thin variants).
3. Weekly newsletter: three opportunities, one guide, one market number.
4. Replace example listings with verified submissions as they arrive; keep the board honest.
5. Add Search Console, then A/B test hero matcher copy and the sell form's first step.

## 5. Trademark and copyright notes

- Avoid any logo, colour scheme or name styling resembling BizBuySell, Flippa or other marketplaces.
- Mention third-party brands only to cite data or orient readers (nominative fair use).
- Before investing in a logo, run a trademark search for "Business For You" in your target countries (USPTO, CIPO, UKIPO, EUIPO). The site uses the phrase descriptively and disclaims marks owned by others.
