#!/usr/bin/env python3
"""
Roll the scraped drug database forward to a new mouacher (price bulletin).

The mouacher says WHICH drugs exist and what they cost; the MOPH website is the
only source for the clinical fields (ATC, ingredients, route, B/G).

Two properties of the MOPH site drive the design:

  * The number in /en/Drugs/view/{n} is a ROW ORDINAL, not a stable id. Between
    two bulletins 98.6% of them pointed at a different drug (one insertion near
    the top shifts every later row). So nothing may be keyed on it -- the stable
    key is the MoPH code.

  * Some detail pages render the code with a decision suffix ("11432/388").
    That is the same drug as mouacher code 11432, so codes are normalised by
    dropping the suffix before matching.

Algorithm:
  1. Scrape the LIST view from the UNFILTERED index. The letter:A-Z walk the
     old scraper used silently skipped every brand name starting with a digit
     ("0.9% SODIUM CHLORIDE") or Greek alpha ("a PACLITAXEL").
  2. Group old rows and listed rows by their descriptive key
     (atc, name, b_g, ingredients, dosage, form) -- every part of it is visible
     in the list view, so it can be compared without opening a detail page.
     Fetch a detail page only for listed rows whose key we have never seen, or
     whose key now has more rows than we hold. Everything else we already have.
  3. Re-point id/url at the current ordinals by pairing equal-sized key groups
     in order (relative order is preserved by the shift).
  4. Keep exactly the codes the mouacher lists, refresh the bulletin-owned
     fields from it, and backfill anything the site left blank.

Outputs (label defaults to "september"):
  drugs_full_september.csv   merged database, mouacher codes only
  added_september.csv        codes new to the database this cycle
  removed_september.csv      codes we held that the mouacher dropped
  unmatched_september.csv    mouacher codes with no MOPH detail page found

Usage:
    python3 update_from_mouacher.py --mouacher september_mouacher.csv \
        --old drugs_full.csv --label september
"""
import argparse, collections, csv, os, re, sys
import requests

from scrape_moph_drugs import get, parse_list_page, max_page_for_letter, INDEX

# Scrape schema (drugs_full.csv), unchanged.
COLS = ["id", "atc", "b_g", "ingredients", "code", "registration_nb", "name",
        "dosage", "presentation", "form", "route", "agent", "laboratory",
        "country", "price", "pharmacist_margin", "stratum",
        "responsible_party_name", "responsible_party_country", "exch_date",
        "subsidy_pct", "url"]

# Fields the bulletin owns: always overwritten from the mouacher.
MOUACHER_WINS = ["price", "stratum", "pharmacist_margin", "exch_date"]

# Fields taken from the mouacher only when the scrape left them blank.
MOUACHER_BACKFILL = ["registration_nb", "name", "dosage", "presentation", "form",
                     "agent", "laboratory", "country",
                     "responsible_party_name", "responsible_party_country"]

# Descriptive key, comparable between a list row and a stored row.
KEY_FIELDS = ["atc", "name", "b_g", "ingredients", "dosage", "form"]

CODE_SUFFIX = re.compile(r"/\d+\s*$")


def norm_code(v):
    """'11432/388' and '11432.0' both normalise to '11432'."""
    s = (str(v) if v is not None else "").strip()
    if s.endswith(".0"):
        s = s[:-2]
    return CODE_SUFFIX.sub("", s).strip()


def norm(s):
    return re.sub(r"\s+", " ", (s or "").upper().strip())


def row_key(r):
    return tuple(norm(r.get(f)) for f in KEY_FIELDS)


def read_csv(path):
    if not path or not os.path.exists(path):
        return []
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def write_csv(path, cols, rows):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)


def fmt_price(ll):
    """Match the site's rendering, e.g. 1,526,524 L.L"""
    ll = (ll or "").strip()
    if not ll:
        return ""
    try:
        return "{:,} L.L".format(int(round(float(ll))))
    except ValueError:
        return ll


def scrape_index_all(delay, session, max_pages=None):
    """Walk the UNFILTERED index, which unlike letter:A-Z includes every name."""
    html = get(INDEX, session, delay)
    if not html:
        sys.exit("ERROR: could not load the MOPH index page")
    last = max_page_for_letter(html)
    if max_pages:
        last = min(last, max_pages)
    print("Index has %d pages" % last, file=sys.stderr)

    seen, rows = set(), []
    for page in range(1, last + 1):
        page_html = html if page == 1 else get("%s/page:%d" % (INDEX, page), session, delay)
        if not page_html:
            print("  [warn] page %d failed" % page, file=sys.stderr)
            continue
        for row in parse_list_page(page_html):
            if not row["id"] or row["id"] in seen:
                continue
            seen.add(row["id"])
            rows.append(row)
        if page % 25 == 0 or page == last:
            print("  page %d/%d  (total %d)" % (page, last, len(rows)), file=sys.stderr)
    return rows


def parse_detail(html, drug_id, url):
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "lxml")
    best = None
    for tr in soup.select("tr"):
        tds = tr.find_all("td")
        if len(tds) >= 18:
            best = [td.get_text(" ", strip=True) for td in tds]
            break
    fields = ["atc", "b_g", "ingredients", "code", "registration_nb", "name",
              "dosage", "presentation", "form", "route", "agent", "laboratory",
              "country", "price", "pharmacist_margin", "stratum",
              "responsible_party_name", "responsible_party_country",
              "exch_date", "subsidy_pct"]
    rec = {"id": drug_id, "url": url}
    for i, f in enumerate(fields):
        rec[f] = best[i] if best and i < len(best) else ""
    return rec


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mouacher", required=True)
    ap.add_argument("--old", default="drugs_full.csv")
    ap.add_argument("--label", default="september")
    ap.add_argument("--delay", type=float, default=0.4)
    ap.add_argument("--max-pages", type=int, default=None, help="debug: cap index pages")
    ap.add_argument("--list-cache", default=None,
                    help="reuse a saved list-view CSV instead of re-scraping it")
    ap.add_argument("--list-out", default=None, help="save the list view here")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    lab = args.label
    out_main = args.out or "drugs_full_%s.csv" % lab

    mou = {}
    for r in read_csv(args.mouacher):
        c = norm_code(r.get("code"))
        if c:
            mou[c] = r
    print("Mouacher: %d unique codes" % len(mou), file=sys.stderr)

    old_rows = read_csv(args.old)
    old_by_code = {}
    for r in old_rows:
        c = norm_code(r.get("code"))
        if c and c not in old_by_code:
            old_by_code[c] = r
    print("Existing scrape: %d rows, %d codes (suffix-normalised)"
          % (len(old_rows), len(old_by_code)), file=sys.stderr)

    session = requests.Session()

    # 1) list view
    if args.list_cache and os.path.exists(args.list_cache):
        current = read_csv(args.list_cache)
        print("Reusing cached list view: %d rows" % len(current), file=sys.stderr)
    else:
        print("Scraping list view (unfiltered index)...", file=sys.stderr)
        current = scrape_index_all(args.delay, session, args.max_pages)
        print("List view: %d drugs" % len(current), file=sys.stderr)
    if args.list_out:
        write_csv(args.list_out, ["id", "atc", "name", "b_g", "ingredients",
                                  "dosage", "form", "price", "url"], current)

    # 2) decide what to fetch, by descriptive key
    old_groups = collections.defaultdict(list)
    for r in old_rows:
        old_groups[row_key(r)].append(r)
    cur_groups = collections.defaultdict(list)
    for r in current:
        cur_groups[row_key(r)].append(r)

    todo, pairable = [], []
    for k, rows in cur_groups.items():
        held = old_groups.get(k)
        if not held or len(rows) > len(held):
            todo.extend(rows)            # new drug, or this key gained rows
        else:
            pairable.append((held, rows))  # same shape: just re-point ordinals
    print("Detail fetches needed: %d (of %d listed)" % (len(todo), len(current)),
          file=sys.stderr)

    # 3) re-point id/url for everything we are not re-fetching
    remapped = 0
    for held, rows in pairable:
        for stored, listed in zip(held, rows):   # relative order is preserved
            stored["id"] = listed["id"]
            stored["url"] = listed["url"]
            remapped += 1
    print("Re-pointed %d stored rows at their current ordinal" % remapped, file=sys.stderr)

    # 4) fetch the genuinely unknown ones
    fresh_by_code = {}
    for i, lrow in enumerate(todo, 1):
        html = get(lrow["url"], session, args.delay)
        if not html:
            continue
        rec = parse_detail(html, lrow["id"], lrow["url"])
        c = norm_code(rec.get("code"))
        if c:
            fresh_by_code[c] = rec
        if i % 25 == 0 or i == len(todo):
            print("  fetched %d/%d" % (i, len(todo)), file=sys.stderr)
    print("Parsed %d new detail rows" % len(fresh_by_code), file=sys.stderr)

    # 5) merge, keyed by mouacher code
    merged, added, unmatched = [], [], []
    for code, m in mou.items():
        scraped = fresh_by_code.get(code) or old_by_code.get(code)
        row = {c: "" for c in COLS}
        if scraped:
            for c in COLS:
                row[c] = (scraped.get(c) or "").strip()
        row["code"] = code

        row["price"] = fmt_price(m.get("price_ll"))
        for f in ("stratum", "pharmacist_margin", "exch_date"):
            row[f] = (m.get(f) or "").strip()
        for f in MOUACHER_BACKFILL:
            if not row.get(f):
                row[f] = (m.get(f) or "").strip()

        merged.append(row)
        if code not in old_by_code:
            added.append(row)
        if not scraped:
            unmatched.append(row)

    removed = []
    for code, r in old_by_code.items():
        if code not in mou:
            r = dict(r)
            r["code"] = code          # report the normalised code, not '9907/388'
            removed.append(r)

    srt = lambda rs: sorted(rs, key=lambda r: ((r.get("name") or "").upper(), r.get("code", "")))
    write_csv(out_main, COLS, srt(merged))
    write_csv("added_%s.csv" % lab, COLS, srt(added))
    write_csv("removed_%s.csv" % lab, COLS, srt(removed))
    write_csv("unmatched_%s.csv" % lab, COLS, srt(unmatched))

    print("", file=sys.stderr)
    print("==== SUMMARY ====", file=sys.stderr)
    print("  merged      %5d -> %s" % (len(merged), out_main), file=sys.stderr)
    print("    with MOPH clinical data : %d" % sum(1 for r in merged if r["atc"]), file=sys.stderr)
    print("    mouacher-only rows      : %d" % len(unmatched), file=sys.stderr)
    print("  added       %5d -> added_%s.csv" % (len(added), lab), file=sys.stderr)
    print("  removed     %5d -> removed_%s.csv" % (len(removed), lab), file=sys.stderr)
    print("  unmatched   %5d -> unmatched_%s.csv" % (len(unmatched), lab), file=sys.stderr)


if __name__ == "__main__":
    main()
