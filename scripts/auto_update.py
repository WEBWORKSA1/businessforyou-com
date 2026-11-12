#!/usr/bin/env python3
"""Daily automation for BusinessForYou.com (runs in GitHub Actions, stdlib only).

1. Pulls headlines from public Google News RSS searches on business sales,
   acquisition financing and franchising, and writes data/news.json
   (titles, links, source names and dates only).
2. Bumps <lastmod> in sitemap.xml for the pages whose content changes daily.

If every feed fails, the existing news file is left untouched.
"""
import datetime as dt
import email.utils
import json
import pathlib
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parent.parent
NEWS = ROOT / "data" / "news.json"
SITEMAP = ROOT / "sitemap.xml"
MAX_ITEMS = 40
MAX_AGE_DAYS = 45

QUERIES = [
    '"business for sale" OR "small business acquisition" OR "buying a business"',
    'BizBuySell OR "business broker" OR "business brokers"',
    '"SBA 7(a)" OR "SBA loan" acquisition small business',
    '"franchise resale" OR "franchise sales" OR franchising small business',
    '"search fund" OR "lower middle market" acquisition',
]


def feed_url(q):
    return "https://news.google.com/rss/search?" + urllib.parse.urlencode(
        {"q": q + " when:30d", "hl": "en-US", "gl": "US", "ceid": "US:en"}
    )


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (BusinessForYou.com news bot)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def parse(xml_bytes):
    out = []
    root = ET.fromstring(xml_bytes)
    for it in root.iter("item"):
        title = (it.findtext("title") or "").strip()
        link = (it.findtext("link") or "").strip()
        src_el = it.find("source")
        source = (src_el.text or "").strip() if src_el is not None and src_el.text else ""
        pub = it.findtext("pubDate") or ""
        try:
            date = email.utils.parsedate_to_datetime(pub).astimezone(dt.timezone.utc)
        except Exception:
            date = None
        if source and title.endswith(" - " + source):
            title = title[: -(len(source) + 3)].strip()
        if title and link.startswith("http"):
            out.append({"title": title, "link": link, "source": source, "date": date})
    return out


def norm(t):
    return re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()


def update_news():
    items, ok = [], 0
    for q in QUERIES:
        try:
            items.extend(parse(fetch(feed_url(q))))
            ok += 1
        except Exception as e:  # keep going on partial failure
            print("feed failed:", q, e)
    if not ok or not items:
        print("No feeds available; keeping existing news.json")
        return False
    now = dt.datetime.now(dt.timezone.utc)
    cutoff = now - dt.timedelta(days=MAX_AGE_DAYS)
    seen, clean = set(), []
    for it in sorted(items, key=lambda x: x["date"] or cutoff, reverse=True):
        key = norm(it["title"])[:90]
        if key in seen or (it["date"] and it["date"] < cutoff):
            continue
        seen.add(key)
        clean.append({
            "title": it["title"],
            "link": it["link"],
            "source": it["source"],
            "date": it["date"].strftime("%Y-%m-%dT%H:%M:%SZ") if it["date"] else "",
        })
        if len(clean) >= MAX_ITEMS:
            break
    NEWS.write_text(json.dumps({"updated": now.strftime("%Y-%m-%dT%H:%M:%SZ"), "items": clean}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(clean)} headlines from {ok} feeds")
    return True


def update_sitemap():
    if not SITEMAP.exists():
        return
    today = dt.date.today().isoformat()
    xml = SITEMAP.read_text(encoding="utf-8")
    for loc in ("https://businessforyou.com/</loc>", "news.html</loc>", "businesses-for-sale.html</loc>"):
        xml = re.sub(re.escape(loc) + r"<lastmod>[^<]*</lastmod>", loc + "<lastmod>" + today + "</lastmod>", xml)
    SITEMAP.write_text(xml, encoding="utf-8")


if __name__ == "__main__":
    if update_news():
        update_sitemap()
