#!/usr/bin/env python3
"""
Consolidate one bulletin cycle into a single report.

A cycle writes three payloads (updateMedApiV2, nm_insert, backfill_from_scrape)
plus changes medlist directly, so the picture is spread across several files.
This merges them into one document in the existing templateReport shape and
enriches every row with what the database actually holds now -- so the newly
marketed drugs carry their real ATC codes rather than the blanks the bulletin
had at insert time.

Usage:
    python3 build_month_report.py --label september --month "September 2026" \
        --bulletin-date 2026-09-03
"""
import argparse, glob, json, os, re
from collections import Counter, defaultdict
from datetime import datetime

import mysql.connector

APIV2 = dict(host="localhost", user="ommal_ahmad",
             password="fISfGr^8q!_gUPMY", database="ommal_medapiv2")
MEDLIST = dict(host="localhost", user="ommal_oummal",
               password="dMR2id57dviMJJnc", database="ommal_medlist")


def newest(pattern):
    hits = sorted(glob.glob(pattern))
    return hits[-1] if hits else None


def load(path):
    if not path or not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def fetch(dsn, sql):
    cn = mysql.connector.connect(**dsn)
    cur = cn.cursor(dictionary=True)
    cur.execute(sql)
    rows = cur.fetchall()
    cn.close()
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--label", default="september")
    ap.add_argument("--month", default="September 2026")
    ap.add_argument("--bulletin-date", default="2026-09-03")
    ap.add_argument("--preview-log", default="/tmp/prev2_apiv2.txt",
                    help="run log of updateMedApiV2.py; carries the old values for "
                         "Country and RegistrationNumber, which its payload omits")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    lab = args.label

    upd = load(newest(f"medleb_db_update_payload_updateMedApiV2_*.json")) or {}
    nmi = load(newest(f"medleb_db_update_payload_nm_insert_*.json")) or {}
    backfills = [load(p) for p in sorted(glob.glob(
        f"medleb_db_backfill_from_scrape_{lab}_*.json"))]
    backfills = [b for b in backfills if b]

    # ---- current state, so rows carry what the DB holds now ----
    v2 = {r["MoPHCode"]: r for r in fetch(APIV2, """
        SELECT MoPHCode, DrugName, ATC_Code, OtherIngredients, Dosage, Form,
               RouteLNDI, ProductType, Presentation, Stratum, Agent,
               Manufacturer, PublicPrice, NotMarketed
        FROM drug""")}
    ml = {r["code"]: r for r in fetch(MEDLIST, """
        SELECT code, brand_name, atc, bg, ingredients, strength, form,
               route_lndi, presentation, agent, manufacturer, public_price, stratum
        FROM medications""")}

    def row_of(code):
        d = v2.get(int(code), {})
        return {
            "MoPHCode": str(code),
            "BrandName": d.get("DrugName") or "",
            "Ingredients": d.get("OtherIngredients") or "",
            "ATC": d.get("ATC_Code") or "",
            "Dosage": d.get("Dosage") or "",
            "Strength": d.get("Dosage") or "",
            "Form": d.get("Form") or "",
            "DosageForm": d.get("Form") or "",
            "Route": d.get("RouteLNDI") or "",
            "Presentation": d.get("Presentation") or "",
            "ProductType": d.get("ProductType") or "",
            "Stratum": d.get("Stratum") or "",
            "Agent": d.get("Agent") or "",
            "Manufacturer": d.get("Manufacturer") or "",
            "PublicPrice": float(d["PublicPrice"]) if d.get("PublicPrice") is not None else None,
        }

    added = [str(c) for c in nmi.get("addedMoPHCodes", [])]
    notmk = [str(c) for c in upd.get("notMarketedTrue", [])]
    mods = upd.get("templateReport", {}).get("section3_modifications", {})
    entries = mods.get("atc_code_changes", [])          # every modified drug

    # The payload's old/new rows omit Country and RegistrationNumber, so those
    # two before-values survive only in the run log. Every group there is small
    # enough that the script printed full code lists rather than a sample.
    from_log = {}
    if args.preview_log and os.path.exists(args.preview_log):
        field = None
        pending = None
        for line in open(args.preview_log, encoding="utf-8", errors="replace"):
            m = re.search(r"(\w+) CHANGES: \d+ total", line)
            if m:
                field = m.group(1).upper()
                continue
            if field and "→" in line:
                before, _, after = line.partition("→")
                pending = (before.strip(), after.strip())
                continue
            m = re.search(r"Count: \d+ \| Codes: (.+)$", line)
            if m and pending and field:
                for c in m.group(1).split(","):
                    c = c.strip()
                    if c.isdigit():
                        from_log[(field, c)] = pending
                pending = None

    added_rows = [row_of(c) for c in added]
    notmk_rows = [row_of(c) for c in notmk]

    # ---- modifications, bucketed by what actually changed ----
    by_field = Counter()
    for e in entries:
        for f in e.get("changedFields", []):
            by_field[f] += 1

    def bucket(names):
        return [e for e in entries if any(f in e.get("changedFields", []) for f in names)]

    price_stratum = [{
        "MoPHCode": e["MoPHCode"], "BrandName": e["BrandName"],
        "oldPrice": e["old"].get("PublicPrice"), "newPrice": e["new"].get("PublicPrice"),
        "oldStratum": e["old"].get("Stratum"), "newStratum": e["new"].get("Stratum"),
    } for e in bucket(["PublicPrice", "Stratum"])]

    agent_changes = [{
        "MoPHCode": e["MoPHCode"], "BrandName": e["BrandName"],
        "old": e["old"].get("Agent", ""), "new": e["new"].get("Agent", ""),
    } for e in bucket(["Agent"])]

    manufacturer_changes = [{
        "MoPHCode": e["MoPHCode"], "BrandName": e["BrandName"],
        "old": e["old"].get("Manufacturer", ""), "new": e["new"].get("Manufacturer", ""),
    } for e in bucket(["Manufacturer"])]

    other = [e for e in entries
             if not any(f in e.get("changedFields", [])
                        for f in ["Agent", "Manufacturer", "PublicPrice", "Stratum"])]

    # ---- every individual field change, grouped by what changed ----
    changes_by_type = defaultdict(list)
    for e in entries:
        code = str(e["MoPHCode"])
        brand = e.get("BrandName") or (v2.get(int(code), {}).get("DrugName") or "")
        for f in e.get("changedFields", []):
            if f in e.get("old", {}) or f in e.get("new", {}):
                before, after = e["old"].get(f), e["new"].get(f)
            else:
                before, after = from_log.get((f.upper(), code), (None, None))
            changes_by_type[f].append({
                "MoPHCode": code, "BrandName": brand,
                "before": before, "after": after,
            })
    for f in changes_by_type:
        changes_by_type[f].sort(key=lambda r: (r["BrandName"] or "").upper())

    # ---- completeness of the two databases, after the backfill ----
    def gaps(rows, cols, scope=lambda r: True):
        n = [r for r in rows if scope(r)]
        return {c: sum(1 for r in n if r[c] is None or str(r[c]).strip() == "") for c in cols}

    v2_marketed = [r for r in v2.values() if not int(r.get("NotMarketed") or 0)]
    completeness = {
        "medapiv2_marketed": {
            "rows": len(v2_marketed),
            "empty": gaps(v2_marketed, ["ATC_Code", "OtherIngredients", "Dosage",
                                        "Form", "RouteLNDI", "ProductType"]),
        },
        "medlist": {
            "rows": len(ml),
            "empty": gaps(list(ml.values()), ["atc", "bg", "ingredients", "strength",
                                              "form", "route_lndi"]),
        },
    }

    backfill_total = defaultdict(int)
    for b in backfills:
        for db in b.get("databases", []):
            backfill_total[db["database"]] += db.get("totalCellsFilled", 0)
        if "totalCellsFilled" in b:           # first-pass single-db format
            backfill_total["ommal_medapiv2"] += b["totalCellsFilled"]

    report = {
        "report": f"{args.month} bulletin",
        "bulletinDate": args.bulletin_date,
        "generatedAt": datetime.now().isoformat(),
        "endState": {
            "medlist_rows": len(ml),
            "medapiv2_total": len(v2),
            "medapiv2_marketed": len(v2_marketed),
        },
        "headline": {
            "newly_marketed": len(added_rows),
            "newly_not_marketed": len(notmk_rows),
            "modified": len(entries),
            "price_changes": by_field.get("PublicPrice", 0),
            "agent_changes": by_field.get("Agent", 0),
            "manufacturer_changes": by_field.get("Manufacturer", 0),
            "stratum_changes": by_field.get("Stratum", 0),
            "fields_backfilled_from_website": dict(backfill_total),
        },
        "changesByField": dict(by_field),
        "changesByType": {k: v for k, v in sorted(
            changes_by_type.items(), key=lambda kv: -len(kv[1]))},
        "changesByType": {k: v for k, v in sorted(
            changes_by_type.items(), key=lambda kv: -len(kv[1]))},
        "templateReport": {
            "section1_newly_marketed": {
                "total_newly_marketed_drugs": len(added_rows),
                "total_atc_codes_newly_marketed_drugs":
                    len({r["ATC"] for r in added_rows if r["ATC"]}),
                "rows": added_rows,
            },
            "section2_newly_not_marketed": {
                "total_newly_unmarketed_drugs": len(notmk_rows),
                "total_atc_codes_newly_unmarketed_drugs":
                    len({r["ATC"] for r in notmk_rows if r["ATC"]}),
                "rows": notmk_rows,
            },
            "section3_modifications": {
                "total_modified_drugs": len(entries),
                "agent_changes": agent_changes,
                "manufacturer_changes": manufacturer_changes,
                "price_stratum_changes": price_stratum,
                "other_or_several_modifications": other,
            },
        },
        "dataCompleteness": completeness,
    }

    out = args.out or f"{lab}_report.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    h = report["headline"]
    print(f"{args.month} report -> {out}")
    print(f"  newly marketed      {h['newly_marketed']}")
    print(f"  newly not marketed  {h['newly_not_marketed']}")
    print(f"  modified            {h['modified']}")
    print(f"     price   {h['price_changes']}   agent {h['agent_changes']}"
          f"   manufacturer {h['manufacturer_changes']}   stratum {h['stratum_changes']}")
    print(f"  backfilled cells    {dict(backfill_total)}")
    print(f"  end state: medlist {len(ml)} rows, medapiv2 {len(v2_marketed)} marketed")
    print(f"  completeness: {json.dumps(completeness, indent=2)}")


if __name__ == "__main__":
    main()
