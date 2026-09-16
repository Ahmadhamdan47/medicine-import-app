#!/usr/bin/env python3
"""
Fill empty medapiv2 `drug` fields from the MOPH website scrape.

The mouacher carries only the 11 commercial columns, so anything it does not
cover (ATC, ingredients, route, brand/generic) stays NULL for every drug the
bulletin inserts -- 199 currently-marketed drugs had no ATC_Code at all. The
scrape (drugs_full_<label>.csv) has those fields for every code in the bulletin.

Rules:
  * Only ever writes a cell that is currently NULL or ''. Nothing is overwritten.
  * Only touches drugs whose MoPHCode is in the scrape file.
  * Marketed drugs only, unless --include-not-marketed.
  * Preview by default; --commit applies inside one transaction.

Column mapping was chosen by measuring the scrape's vocabulary against what each
column already holds (marketed rows, September 2026):

  ATC_Code         <- atc          99.4% of scrape values already in use
  OtherIngredients <- ingredients  identical "Name - strength" format
  RouteRaw         <- route        99.8% match (vs 81.3% for Route: the site
                                   publishes IM/SC/IV, which is RouteRaw's
                                   vocabulary, not Route's "Intramuscular")
  ProductType      <- b_g          mapped to the dominant spellings
  Form             <- form         93.6% of scrape values already in use
  Presentation     <- presentation 88.7%
  Dosage           <- dosage       97.8%
  ResponsibleParty <- responsible_party_name  92.6%

Deliberately NOT filled:
  Route                 needs the local normalisation tables (routeOptions.csv,
                        FormAndRouteRaw.tsv); the scrape only has the raw value.
  ATCRelatedIngredient  only 77.6% derivable as a prefix of OtherIngredients,
                        and multi-ingredient rows are comma-separated lists.

Usage:
    python3 backfill_from_scrape.py --scrape drugs_full_september.csv
    python3 backfill_from_scrape.py --scrape drugs_full_september.csv --commit
"""
import argparse, csv, json, os, sys
from collections import defaultdict
from datetime import datetime

import mysql.connector
from mysql.connector import Error

# db column -> (scrape column, transform)
PRODUCT_TYPE = {"G": "Generic", "B": "Brand", "BIOTECH": "BioTech", "BIOHUMAN": "BioHuman"}


def map_product_type(v):
    return PRODUCT_TYPE.get(v.strip().upper(), v.strip())


MAPPING = [
    ("ATC_Code",         "atc",                    None),
    ("OtherIngredients", "ingredients",            None),
    ("RouteRaw",         "route",                  None),
    ("ProductType",      "b_g",                    map_product_type),
    ("Form",             "form",                   None),
    ("Presentation",     "presentation",           None),
    ("Dosage",           "dosage",                 None),
    ("ResponsibleParty", "responsible_party_name", None),
]

# varchar limits that matter; longer values are skipped rather than truncated
MAXLEN = {"ATC_Code": 255, "RouteRaw": 255, "ProductType": 255, "Form": 150,
          "Presentation": 150, "Dosage": 255, "ResponsibleParty": 255}


def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost',
            user='ommal_ahmad',
            password='fISfGr^8q!_gUPMY',
            database='ommal_medapiv2'
        )
    except Error as e:
        print(f"Error: {e}")
        return None


def load_scrape(path):
    out = {}
    with open(path, newline="", encoding="utf-8-sig") as f:
        for r in csv.DictReader(f):
            code = (r.get("code") or "").strip()
            if code.isdigit():
                out[int(code)] = r
    return out


def is_empty(v):
    return v is None or str(v).strip() == ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrape", default="drugs_full_september.csv")
    ap.add_argument("--commit", action="store_true", help="apply (default: preview only)")
    ap.add_argument("--include-not-marketed", action="store_true")
    ap.add_argument("--label", default="september")
    args = ap.parse_args()

    if not os.path.exists(args.scrape):
        sys.exit(f"ERROR: {args.scrape} not found")

    scrape = load_scrape(args.scrape)
    print(f"Scrape: {len(scrape)} codes from {args.scrape}")

    conn = get_db_connection()
    if conn is None:
        sys.exit("Failed to connect to the database.")
    conn.autocommit = False
    cur = conn.cursor(dictionary=True)

    cols = ", ".join(db for db, _, _ in MAPPING)
    where = "" if args.include_not_marketed else " WHERE NotMarketed = 0"
    cur.execute(f"SELECT MoPHCode, DrugName, NotMarketed, {cols} FROM drug{where}")
    rows = cur.fetchall()
    print(f"Database: {len(rows)} {'drugs' if args.include_not_marketed else 'marketed drugs'}")

    updates = defaultdict(list)   # db column -> [(value, moph_code)]
    skipped_long = defaultdict(int)
    filled_rows = {}
    for r in rows:
        s = scrape.get(r["MoPHCode"])
        if not s:
            continue
        for db, sc, fn in MAPPING:
            if not is_empty(r[db]):
                continue
            val = (s.get(sc) or "").strip()
            if fn:
                val = fn(val)
            if not val:
                continue
            lim = MAXLEN.get(db)
            if lim and len(val) > lim:
                skipped_long[db] += 1
                continue
            updates[db].append((val, r["MoPHCode"]))
            filled_rows.setdefault(r["MoPHCode"], {"DrugName": r["DrugName"], "fields": {}})
            filled_rows[r["MoPHCode"]]["fields"][db] = val

    total = sum(len(v) for v in updates.values())
    print("\n" + "=" * 72)
    print("BACKFILL PREVIEW  (only cells that are currently NULL/empty)")
    print("=" * 72)
    print(f"\n{'COLUMN':<20}{'CELLS TO FILL':>15}{'SKIPPED (too long)':>22}")
    for db, _, _ in MAPPING:
        print(f"{db:<20}{len(updates.get(db, [])):>15}{skipped_long.get(db, 0):>22}")
    print(f"\n{'TOTAL':<20}{total:>15}")
    print(f"drugs touched: {len(filled_rows)}")

    for db, _, _ in MAPPING:
        sample = updates.get(db, [])[:3]
        if sample:
            print(f"\n  {db} e.g.")
            for val, code in sample:
                print(f"     {code:<8} <- {val[:60]!r}")

    if not total:
        print("\nNothing to fill.")
        conn.close()
        return

    if not args.commit:
        print("\nPreview only. Re-run with --commit to apply.")
        conn.rollback()
        conn.close()
        return

    print("\nApplying...")
    for db, pairs in updates.items():
        cur.executemany(f"UPDATE drug SET {db} = %s WHERE MoPHCode = %s", pairs)
        print(f"  {db}: {len(pairs)} cells")

    report = {
        "generatedAt": datetime.now().isoformat(),
        "sourceFile": os.path.abspath(args.scrape),
        "scope": "all drugs" if args.include_not_marketed else "marketed drugs only",
        "rule": "only NULL/empty cells were written; nothing overwritten",
        "totalCellsFilled": total,
        "cellsPerColumn": {db: len(updates.get(db, [])) for db, _, _ in MAPPING},
        "skippedTooLong": dict(skipped_long),
        "drugs": [{"MoPHCode": str(c), "DrugName": v["DrugName"], "filled": v["fields"]}
                  for c, v in sorted(filled_rows.items())],
    }
    out = os.path.join(os.path.dirname(os.path.abspath(args.scrape)),
                       f"medleb_db_backfill_from_scrape_{args.label}_"
                       f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    conn.commit()
    print(f"\nCommitted {total} cells across {len(filled_rows)} drugs.")
    print(f"Report: {out}")
    conn.close()


if __name__ == "__main__":
    main()
