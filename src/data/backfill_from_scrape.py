#!/usr/bin/env python3
"""
Fill empty medapiv2 / medlist fields from the MOPH website scrape.

The mouacher carries only the 11 commercial columns, so anything it does not
cover (ATC, ingredients, route, brand/generic, and every LNDI column) stays
NULL for each drug the bulletin inserts. The scrape (drugs_full_<label>.csv)
has those fields for every code in the bulletin.

Rules:
  * Only ever writes a cell that is currently NULL or ''. Nothing is overwritten.
  * Only touches drugs whose code is in the scrape file.
  * Preview by default; --commit applies inside one transaction per database.
  * Values longer than the column allow are skipped, never truncated.

Both schemas keep the bulletin's own wording in the plain columns and the
website's wording in the LNDI columns, so the scrape maps to different columns
in each database. Every mapping below was chosen by measuring the scrape's
values against what the column already holds, not by guessing:

  medapiv2.drug                      agreement where both sides have a value
    ATC_Code         <- atc          99.4% of values already in use
    OtherIngredients <- ingredients  identical "Name - strength" format
    ProductType      <- b_g          mapped to Generic/Brand/BioTech/BioHuman
    RouteRaw         <- route        99.8%  (Route itself is only 81.3%: the
                                     site publishes IM/SC/IV, Route holds
                                     "Intramuscular")
    RouteLNDI        <- route        99.8%
    FormLNDI         <- form         98.9%
    PresentationLNDI <- presentation 99.4%
    DosageLNDI       <- dosage       96.7%
    Form, Presentation, Dosage, ResponsibleParty  (bulletin-fed, empties only)

  medlist.medications
    atc               <- atc          99.4%
    bg                <- b_g          100% -- short form here (G/B/BioTech),
                                      unlike medapiv2's ProductType
    ingredients       <- ingredients  identical format
    route_lndi        <- route        99.7%
    form_lndi         <- form         99.2%
    presentation_lndi <- presentation 99.6%
    dosage_lndi       <- dosage       96.8%
    form, presentation, strength      (bulletin-fed, empties only)

Deliberately NOT filled:
  medapiv2.Route                needs the local normalisation tables; the
                                scrape only has the raw value, and the existing
                                Route vocabulary has its own errors
                                (O-Oral, IInfusion-Intravenous, Subcutanous).
  medapiv2.ATCRelatedIngredient only 77.6% recoverable as a prefix of
                                OtherIngredients; multi-ingredient rows are
                                comma-separated lists.
  subsidy columns               the scrape never populates subsidy_pct.

Usage:
    python3 backfill_from_scrape.py --scrape drugs_full_september.csv
    python3 backfill_from_scrape.py --scrape drugs_full_september.csv --commit
    python3 backfill_from_scrape.py --db medlist --commit
"""
import argparse, csv, json, os, sys
from collections import defaultdict
from datetime import datetime

import mysql.connector
from mysql.connector import Error

PRODUCT_TYPE = {"G": "Generic", "B": "Brand", "BIOTECH": "BioTech", "BIOHUMAN": "BioHuman"}


def to_product_type(v):
    """medapiv2.ProductType spells these out; medlist.bg keeps the short code."""
    return PRODUCT_TYPE.get(v.strip().upper(), v.strip())


TARGETS = {
    "medapiv2": {
        "dsn": dict(host="localhost", user="ommal_ahmad",
                    password="fISfGr^8q!_gUPMY", database="ommal_medapiv2"),
        "table": "drug",
        "key": "MoPHCode",
        "scope": "NotMarketed = 0",
        "scope_all": None,
        "columns": [
            ("ATC_Code",         "atc",                    None),
            ("OtherIngredients", "ingredients",            None),
            ("ProductType",      "b_g",                    to_product_type),
            ("RouteRaw",         "route",                  None),
            ("RouteLNDI",        "route",                  None),
            ("FormLNDI",         "form",                   None),
            ("PresentationLNDI", "presentation",           None),
            ("DosageLNDI",       "dosage",                 None),
            ("Form",             "form",                   None),
            ("Presentation",     "presentation",           None),
            ("Dosage",           "dosage",                 None),
            ("ResponsibleParty", "responsible_party_name", None),
        ],
    },
    "medlist": {
        "dsn": dict(host="localhost", user="ommal_oummal",
                    password="dMR2id57dviMJJnc", database="ommal_medlist"),
        "table": "medications",
        "key": "code",
        "scope": None,          # medlist holds exactly the current bulletin
        "scope_all": None,
        "columns": [
            ("atc",               "atc",          None),
            ("bg",                "b_g",          None),
            ("ingredients",       "ingredients",  None),
            ("route_lndi",        "route",        None),
            ("form_lndi",         "form",         None),
            ("presentation_lndi", "presentation", None),
            ("dosage_lndi",       "dosage",       None),
            ("form",              "form",         None),
            ("presentation",      "presentation", None),
            ("strength",          "dosage",       None),
        ],
    },
}


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


def col_limits(cur, schema, table):
    cur.execute(
        "SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS "
        "WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s", (schema, table))
    return {r["COLUMN_NAME"]: r["CHARACTER_MAXIMUM_LENGTH"] for r in cur.fetchall()}


def run(name, cfg, scrape, commit, include_all, label):
    print("\n" + "=" * 74)
    print(f"{name}  ({cfg['dsn']['database']}.{cfg['table']})")
    print("=" * 74)
    try:
        conn = mysql.connector.connect(**cfg["dsn"])
    except Error as e:
        print(f"  connection failed: {e}")
        return None
    conn.autocommit = False
    cur = conn.cursor(dictionary=True)

    limits = col_limits(cur, cfg["dsn"]["database"], cfg["table"])
    cols = sorted({db for db, _, _ in cfg["columns"]})
    scope = cfg["scope_all"] if include_all else cfg["scope"]
    where = f" WHERE {scope}" if scope else ""
    namecol = "DrugName" if name == "medapiv2" else "brand_name"
    cur.execute(f"SELECT {cfg['key']}, {namecol}, {', '.join(cols)} "
                f"FROM {cfg['table']}{where}")
    rows = cur.fetchall()
    print(f"  rows in scope: {len(rows)}"
          + (f"   ({scope})" if scope else "   (all rows)"))

    updates = defaultdict(list)
    skipped = defaultdict(int)
    touched = {}
    for r in rows:
        s = scrape.get(r[cfg["key"]])
        if not s:
            continue
        for db, sc, fn in cfg["columns"]:
            if not is_empty(r[db]):
                continue
            val = (s.get(sc) or "").strip()
            if fn:
                val = fn(val)
            if not val:
                continue
            lim = limits.get(db)
            if lim and len(val) > lim:
                skipped[db] += 1
                continue
            updates[db].append((val, r[cfg["key"]]))
            touched.setdefault(r[cfg["key"]], {"name": r[namecol], "fields": {}})
            touched[r[cfg["key"]]]["fields"][db] = val

    total = sum(len(v) for v in updates.values())
    print(f"\n  {'COLUMN':<20}{'TO FILL':>10}{'SKIPPED (too long)':>22}")
    for db, _, _ in cfg["columns"]:
        n = len(updates.get(db, []))
        if n or skipped.get(db):
            print(f"  {db:<20}{n:>10}{skipped.get(db, 0):>22}")
    print(f"  {'-'*52}")
    print(f"  {'TOTAL':<20}{total:>10}     drugs touched: {len(touched)}")

    if not total:
        print("\n  Nothing to fill.")
        conn.close()
        return {"database": cfg["dsn"]["database"], "totalCellsFilled": 0,
                "cellsPerColumn": {}, "drugs": []}

    for db, _, _ in cfg["columns"]:
        sample = updates.get(db, [])[:2]
        for val, code in sample:
            print(f"     {db:<18} {code:<8} <- {val[:52]!r}")

    if not commit:
        print("\n  Preview only. Re-run with --commit to apply.")
        conn.rollback()
        conn.close()
        return None

    print("\n  Applying...")
    for db, pairs in updates.items():
        cur.executemany(
            f"UPDATE {cfg['table']} SET {db} = %s WHERE {cfg['key']} = %s", pairs)
        print(f"    {db}: {len(pairs)}")
    conn.commit()
    conn.close()
    print(f"  Committed {total} cells across {len(touched)} drugs.")

    return {
        "database": cfg["dsn"]["database"],
        "table": cfg["table"],
        "scope": scope or "all rows",
        "totalCellsFilled": total,
        "cellsPerColumn": {db: len(updates.get(db, [])) for db, _, _ in cfg["columns"]
                           if updates.get(db)},
        "skippedTooLong": dict(skipped),
        "drugs": [{"code": str(c), "name": v["name"], "filled": v["fields"]}
                  for c, v in sorted(touched.items())],
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scrape", default="drugs_full_september.csv")
    ap.add_argument("--db", choices=["medapiv2", "medlist", "both"], default="both")
    ap.add_argument("--commit", action="store_true", help="apply (default: preview only)")
    ap.add_argument("--include-not-marketed", action="store_true",
                    help="medapiv2: also touch NotMarketed drugs")
    ap.add_argument("--label", default="september")
    args = ap.parse_args()

    if not os.path.exists(args.scrape):
        sys.exit(f"ERROR: {args.scrape} not found")
    scrape = load_scrape(args.scrape)
    print(f"Scrape: {len(scrape)} codes from {args.scrape}")
    print("Rule: only NULL/empty cells are written; nothing is overwritten.")

    names = ["medapiv2", "medlist"] if args.db == "both" else [args.db]
    reports = []
    for n in names:
        rep = run(n, TARGETS[n], scrape, args.commit, args.include_not_marketed, args.label)
        if rep:
            reports.append(rep)

    if args.commit and reports:
        out = os.path.join(os.path.dirname(os.path.abspath(args.scrape)),
                           f"medleb_db_backfill_from_scrape_{args.label}_"
                           f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
        with open(out, "w", encoding="utf-8") as f:
            json.dump({
                "generatedAt": datetime.now().isoformat(),
                "sourceFile": os.path.abspath(args.scrape),
                "rule": "only NULL/empty cells were written; nothing overwritten",
                "databases": reports,
            }, f, ensure_ascii=False, indent=2)
        print(f"\nReport: {out}")


if __name__ == "__main__":
    main()
