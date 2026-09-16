#!/usr/bin/env python3
"""
Convert a MoPH "mouacher" price bulletin (.xls/.xlsx) into the two files we use
to update the databases:

  <Name>.tsv    tab-separated, snake_case headers   (like July.tsv)
  <Name>V2.csv  comma-separated, PascalCase headers (like JulyV2.csv)

Both carry the same 11 columns and the same rows; only delimiter and header
names differ.

Usage:
    python mouacher_to_tsv.py September.xls --out-dir src/data --name September
"""
import argparse, csv, os, sys

import pandas as pd

# Mouacher column -> (tsv header, csv header)
COLUMNS = [
    ("Code",                "code",          "MoPHCode"),
    ("Registration number", "reg_number",    "RegistrationNumber"),
    ("Brand name",          "brand_name",    "DrugName"),
    ("Strength",            "strength",      "Dosage"),
    ("Presentation",        "presentation",  "Presentation"),
    ("Form",                "form",          "Form"),
    ("Agent",               "agent",         "Agent"),
    ("Manufacturer",        "manufacturer",  "Manufacturer"),
    ("Country",             "country",       "Country"),
    ("Public Price LL",     "public_price",  "PublicPrice"),
    ("Stratum",             "stratum",       "Stratum"),
]
PRICE_SRC = "Public Price LL"


def cell(value, is_price=False):
    """Mouacher cell -> output string. NaN/NaT become ''; price rounds to int."""
    if value is None or (isinstance(value, float) and pd.isna(value)) or pd.isna(value):
        return ""
    if is_price:
        try:
            return str(int(round(float(value))))
        except (TypeError, ValueError):
            return str(value)
    if isinstance(value, float) and value.is_integer():
        return str(int(value))
    return str(value)


def flatten(value):
    """TSV has no quoting, so newlines/tabs inside a field become spaces."""
    return (value.replace("\r\n", " ").replace("\n", " ")
                 .replace("\r", " ").replace("\t", " "))


def load_mouacher(path, sheet=0):
    df = pd.read_excel(path, sheet_name=sheet, header=0)
    df.columns = [str(c).strip() for c in df.columns]
    missing = [src for src, _, _ in COLUMNS if src not in df.columns]
    if missing:
        sys.exit(f"ERROR: {path} is missing expected column(s): {missing}\n"
                 f"       found: {list(df.columns)}")
    return df


def build_rows(df):
    rows = []
    for rec in df.to_dict("records"):
        rows.append([cell(rec[src], is_price=(src == PRICE_SRC)) for src, _, _ in COLUMNS])
    return rows


def write_tsv(path, rows):
    with open(path, "w", encoding="utf-8", newline="") as f:
        f.write("\t".join(t for _, t, _ in COLUMNS) + "\r\n")
        for r in rows:
            f.write("\t".join(flatten(v) for v in r) + "\r\n")


def write_csv(path, rows):
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, lineterminator="\r\n")
        w.writerow([c for _, _, c in COLUMNS])
        w.writerows(rows)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("xls", help="mouacher workbook, e.g. September.xls")
    ap.add_argument("--out-dir", default="src/data")
    ap.add_argument("--name", default=None,
                    help="base name for outputs (default: workbook filename)")
    ap.add_argument("--sheet", default=0)
    args = ap.parse_args()

    name = args.name or os.path.splitext(os.path.basename(args.xls))[0]
    df = load_mouacher(args.xls, args.sheet)
    rows = build_rows(df)

    os.makedirs(args.out_dir, exist_ok=True)
    tsv = os.path.join(args.out_dir, f"{name}.tsv")
    csv_ = os.path.join(args.out_dir, f"{name}V2.csv")
    write_tsv(tsv, rows)
    write_csv(csv_, rows)

    print(f"{len(rows)} rows")
    print(f"  -> {tsv}")
    print(f"  -> {csv_}")


if __name__ == "__main__":
    main()
