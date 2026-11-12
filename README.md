# BusinessForYou.com

Find, value, finance and sell small businesses. A static, AdSense-ready acquisition hub: buyer matching, confidential seller valuations, acquisition-financing pre-qualification, a curated business-for-sale board, franchise matching, free calculators, guides, a YouTube video library and an auto-updating news feed.

Live (GitHub Pages, `main` branch, root): `https://webworksa1.github.io/businessforyou-com/`
Production domain: `https://businessforyou.com/`

## Stack

- Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no server.
- Hosted free on GitHub Pages from `main` / root.
- Forms post through FormSubmit (AJAX). The destination address is never written in the HTML; it is assembled at runtime from an encoded value in `assets/js/site.js` (`BFY_CONFIG`).
- Daily automation with GitHub Actions (`scripts/auto_update.py`, workflow in `docs/auto-update.yml`): refreshes `data/news.json` from public news feeds and updates `sitemap.xml` dates. The deal tip of the day and contest dates rotate automatically in the browser.

## Structure

```
index.html                         Home: deal matcher, market snapshot, listings, tools, guides, videos
get-matched.html                   Lead-generation hub (buy / sell / finance / franchise)
businesses-for-sale.html           Filterable listings board (data/listings.json)
sell-your-business.html            Confidential seller intake
business-valuation-calculator.html SDE x multiple valuation tool
business-acquisition-financing.html Loan, DSCR and payback calculators + pre-qualification
due-diligence-checklist.html       Interactive checklist (saved in the browser)
franchises.html                    Franchise and franchise-resale matching
business-ideas-to-buy.html         20 business types: what to check before buying
guides.html + 11 guide pages       Evergreen buying/selling content
videos.html                        YouTube library (lite embeds)
news.html                          Auto-updated acquisition headlines
donate.html contests.html careers.html advertise.html
about.html contact.html privacy-policy.html terms.html disclaimer.html 404.html
assets/css/style.css  assets/js/site.js  assets/js/tools.js  assets/js/market.js
data/*.json  ads.txt  robots.txt  sitemap.xml
docs/BUILD-PROMPT.md               Strategy, 40-site research and phase-wise build prompt
docs/auto-update.yml               Workflow to install under .github/workflows/
scripts/auto_update.py             Daily news + sitemap refresh (stdlib Python)
```

## Go-live checklist

1. GitHub Pages: Settings > Pages > Deploy from a branch > `main` / `(root)`.
2. Daily automation: Add file > Create new file > name it `.github/workflows/auto-update.yml` > paste the contents of `docs/auto-update.yml` > Commit. (GitHub blocks integrations from writing workflow files, so this one paste has to come from your account.) Then Actions > Daily auto-update > Run workflow once.
3. Custom domain: add `businessforyou.com` in Settings > Pages (creates `CNAME`). At the registrar set apex A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `www` CNAME to `webworksa1.github.io`. Tick "Enforce HTTPS" once the certificate is issued.
4. FormSubmit: the first submission sends an activation email to the site inbox. Click "Activate". FormSubmit then shows a random alias string; paste it into `BFY_CONFIG.alias` in `assets/js/site.js` so the address is no longer needed at all.
5. AdSense: add `businessforyou.com` as a site in AdSense, confirm `ads.txt` resolves at `https://businessforyou.com/ads.txt`, enable Auto ads, and turn on Google's consent message (Privacy & messaging) for EEA/UK visitors.
6. Optional manual ad units: put slot IDs in `BFY_CONFIG.adSlots`; empty slots render nothing.
7. Optional payment links: put Stripe/PayPal/Ko-fi URLs in `BFY_CONFIG.payLinks`; until then donation buttons open the pledge form.

## Editing content

- Listings: edit `data/listings.json`. Set `"status": "verified"` for real, reviewed listings; `"example"` entries are labelled as examples on the site.
- Videos: edit `data/videos.json` (YouTube IDs + topic).
- Tips: edit `data/tips.json`.

## Legal

Original text, code and design © BusinessForYou.com. All third-party names and marks belong to their owners and are used for identification only. See `disclaimer.html#trademarks`.
