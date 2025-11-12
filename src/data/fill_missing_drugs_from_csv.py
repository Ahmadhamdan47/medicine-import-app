#!/usr/bin/env python3
"""
Fill missing fields in ommal_medapiv2.drug from a CSV file by matching on `MoPHCode`.

Rules:
- Only update DB fields that are currently NULL or empty string ('').
- CSV columns are used as DB column names (first row header). Columns not present in DB are ignored.
- `MoPHCode` is required in the CSV and is used to match rows.
- Empty/unset CSV values do not overwrite anything.

Safety:
- Dry-run by default (no DB writes). Use --commit to apply changes.
- Logs a summary of planned/applied changes.

Edge cases handled (based on existing repo scripts):
- Trims whitespace for string fields.
- Robust numeric parsing for decimal/integer fields, including scientific notation for GTIN.
- Ignores blank/unnamed CSV header columns.
- Optional conversion factor for PublicPrice (to match prior scripts) via --price-divisor.

Usage examples:
  python fill_missing_drugs_from_csv.py --csv TBFMED.csv           # dry run
  python3 fill_missing_drugs_from_csv.py --csv TBFMED.csv --commit  # apply
  python fill_missing_drugs_from_csv.py --csv TBFMED.csv --limit 50 --verbose
  python fill_missing_drugs_from_csv.py --csv TBFMED.csv --commit --price-divisor 89500
"""

from __future__ import annotations

import argparse
import csv
import decimal
import os
import sys
from typing import Any, Dict, List, Optional, Set, Tuple

# Prefer mysql-connector; fall back to PyMySQL if unavailable
try:
    import mysql.connector  # type: ignore
    from mysql.connector import Error as MySQLError  # type: ignore
    USING_MYSQL_CONNECTOR = True
except Exception:  # noqa: BLE001
    try:
        import pymysql  # type: ignore
        USING_MYSQL_CONNECTOR = False
        MySQLError = pymysql.MySQLError  # type: ignore
    except Exception as e:  # noqa: BLE001
        print("Neither mysql-connector-python nor PyMySQL is installed. Please install one.")
        print("pip install mysql-connector-python  OR  pip install pymysql")
        raise


DB_CONFIG = {
    "host": "localhost",
    "user": "ommal_ahmad", 
    "password": "fISfGr^8q!_gUPMY",
    "database": "ommal_medapiv2",
    "charset": "utf8mb4",
}


def connect_db():
    if USING_MYSQL_CONNECTOR:
        conn = mysql.connector.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"],
            autocommit=True,  # Enable autocommit to avoid transaction issues
        )
        return conn
    else:
        return pymysql.connect(  # type: ignore[name-defined]
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            db=DB_CONFIG["database"],
            charset=DB_CONFIG["charset"],
            cursorclass=pymysql.cursors.DictCursor,  # type: ignore[name-defined]
        )


def fetch_table_columns(conn, table: str) -> List[Dict[str, Any]]:
    """Return a list of column metadata dicts with name and data_type."""
    q = (
        "SELECT COLUMN_NAME as name, DATA_TYPE as data_type "
        "FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=%s AND TABLE_NAME=%s"
    )
    params = (DB_CONFIG["database"], table)
    if USING_MYSQL_CONNECTOR:
        cur = conn.cursor(dictionary=True)
    else:
        cur = conn.cursor()
    try:
        cur.execute(q, params)
        rows = cur.fetchall()
    finally:
        cur.close()
    # Normalize to list of dicts
    result: List[Dict[str, Any]] = []
    if rows:
        if isinstance(rows[0], dict):
            result = rows  # from mysql-connector
        else:
            # PyMySQL returns tuples by default only if not dict cursor; but we asked for DictCursor
            result = rows  # type: ignore[assignment]
    return result


def load_csv_records(csv_path: str) -> Tuple[List[str], List[Dict[str, str]]]:
    """Read CSV preserving strings and header; ignore blank header columns."""
    with open(csv_path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        # Clean header: strip spaces and drop blanks/duplicates
        raw_headers = reader.fieldnames or []
        headers: List[str] = []
        seen: Set[str] = set()
        for h in raw_headers:
            h_clean = (h or "").strip()
            if not h_clean:
                continue
            if h_clean in seen:
                # skip duplicate header name
                continue
            headers.append(h_clean)
            seen.add(h_clean)

        records: List[Dict[str, str]] = []
        for row in reader:
            # Normalize keys using our cleaned headers
            rec: Dict[str, str] = {}
            for h in headers:
                val = row.get(h, "")
                # Keep raw string; trim whitespace
                rec[h] = (val if val is not None else "").strip()
            records.append(rec)
    return headers, records


def parse_moph_code(val: str) -> Optional[str]:
    """Parse MoPHCode as string (not int like medlist code)."""
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    return s


def is_empty_db_value(v: Any) -> bool:
    return v is None or (isinstance(v, str) and v.strip() == "")


def to_db_typed_value(col_type: str, csv_val: str, *, price_divisor: Optional[float]) -> Any:
    """Coerce CSV string to appropriate DB type based on INFORMATION_SCHEMA data type."""
    if csv_val is None:
        return None
    s = str(csv_val).strip()
    if s == "":
        return None

    # Common text types
    if col_type in {"varchar", "text", "longtext", "mediumtext", "char"}:
        return s

    # Integer types
    if col_type in {"int", "bigint", "smallint", "tinyint"}:
        # Handle scientific notation like 5.28102E+12 for GTIN
        try:
            d = decimal.Decimal(s)
            return int(d.to_integral_value(rounding=decimal.ROUND_DOWN))
        except Exception:
            try:
                return int(float(s))
            except Exception:
                return None

    # Decimal/float types
    if col_type in {"decimal", "double", "float"}:
        try:
            d = float(s)
        except Exception:
            try:
                d = float(decimal.Decimal(s))
            except Exception:
                return None

        return d

    # Datetime/date/time
    if col_type in {"datetime", "timestamp", "date", "time"}:
        # Store raw string; rely on MySQL to parse or reject invalid
        return s

    # Fallback: store as string
    return s


def build_updates_for_row(
    db_row: Dict[str, Any],
    csv_row: Dict[str, str],
    updatable_cols: Dict[str, str],  # name -> data_type
    *,
    price_divisor: Optional[float],
) -> Dict[str, Any]:
    updates: Dict[str, Any] = {}
    for col, col_type in updatable_cols.items():
        if col == "MoPHCode":
            continue
        db_val = db_row.get(col)
        if not is_empty_db_value(db_val):
            continue  # skip already-filled fields

        if col not in csv_row:
            continue
        raw_val = csv_row.get(col, "")
        if raw_val is None or str(raw_val).strip() == "":
            continue  # nothing to fill

        # Special case: optional price divisor for PublicPrice
        if price_divisor and col == "PublicPrice":
            try:
                num = float(decimal.Decimal(str(raw_val)))
                raw_val = str(num / float(price_divisor))
            except Exception:
                pass

        v = to_db_typed_value(col_type, str(raw_val), price_divisor=price_divisor)
        if v is not None:
            updates[col] = v
    return updates


def main():
    parser = argparse.ArgumentParser(description="Fill missing fields in drug table from CSV by MoPHCode.")
    parser.add_argument("--csv", required=False, default="TBFMED.csv", help="Path to CSV file")
    parser.add_argument("--commit", action="store_true", help="Apply changes to DB; default is dry-run")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of CSV rows to process")
    parser.add_argument("--verbose", action="store_true", help="Verbose logging of per-row updates")
    parser.add_argument("--price-divisor", type=float, default=None, help="Divide CSV PublicPrice by this factor before storing (e.g., 89500)")

    args = parser.parse_args()
    csv_path = args.csv
    is_commit = args.commit
    limit = args.limit
    verbose = args.verbose
    price_divisor = args["price_divisor"] if isinstance(args, dict) and "price_divisor" in args else getattr(args, "price_divisor", None)

    if not os.path.isfile(csv_path):
        print(f"CSV not found: {csv_path}")
        sys.exit(1)

    headers, records = load_csv_records(csv_path)
    if "MoPHCode" not in headers:
        print("CSV must include a 'MoPHCode' column.")
        sys.exit(1)

    if limit is not None:
        records = records[:limit]

    try:
        conn = connect_db()
    except MySQLError as e:  # type: ignore[name-defined]
        print(f"Failed to connect to DB: {e}")
        sys.exit(1)

    try:
        # Discover table columns and types
        cols_meta = fetch_table_columns(conn, "drug")
        col_types = {c["name"]: c["data_type"] for c in cols_meta}

        # Only consider columns that exist in DB and are present in CSV
        candidate_cols = [h for h in headers if h in col_types]

        # Fetch existing rows by MoPHCode into a dict
        col_list = ["MoPHCode"] + [c for c in candidate_cols if c != "MoPHCode"]
        select_cols = ", ".join(f"`{c}`" for c in col_list)

        if USING_MYSQL_CONNECTOR:
            cur = conn.cursor(dictionary=True)
        else:
            cur = conn.cursor()

        try:
            cur.execute(f"SELECT {select_cols} FROM drug")
            rows = cur.fetchall()
        finally:
            cur.close()

        # Normalize to dict mapping MoPHCode -> row dict
        db_map: Dict[str, Dict[str, Any]] = {}
        for r in rows:
            if not isinstance(r, dict):
                # For safety; PyMySQL DictCursor gives dicts
                continue
            moph_code = parse_moph_code(str(r.get("MoPHCode", "")))
            if moph_code is None:
                continue
            db_map[moph_code] = r

        # Prepare updates
        total_rows = 0
        rows_with_updates = 0
        total_updates = 0
        planned_changes: List[Tuple[str, Dict[str, Any]]] = []

        updatable_cols = {c: col_types[c] for c in candidate_cols}

        for rec in records:
            moph_code = parse_moph_code(rec.get("MoPHCode", ""))
            if moph_code is None:
                continue
            total_rows += 1
            db_row = db_map.get(moph_code)
            if not db_row:
                continue  # MoPHCode not in DB

            updates = build_updates_for_row(db_row, rec, updatable_cols, price_divisor=price_divisor)
            if updates:
                planned_changes.append((moph_code, updates))
                rows_with_updates += 1
                total_updates += len(updates)
                if verbose:
                    print(f"MoPHCode={moph_code} -> {updates}")

        print(f"CSV rows processed: {total_rows}")
        print(f"Rows needing updates: {rows_with_updates}")
        print(f"Total individual field updates planned: {total_updates}")

        if not planned_changes:
            print("No changes to apply.")
            return

        if not is_commit:
            print("Dry-run only. Use --commit to apply changes.")
            return

        # Apply updates in a transaction
        if USING_MYSQL_CONNECTOR:
            # Disable autocommit for transaction
            conn.autocommit = False
        else:
            # autocommit is False by default for PyMySQL connection
            pass

        try:
            if USING_MYSQL_CONNECTOR:
                cur2 = conn.cursor()
            else:
                cur2 = conn.cursor()

            try:
                for moph_code, updates in planned_changes:
                    set_clause = ", ".join(f"`{k}`=%s" for k in updates.keys())
                    params = list(updates.values()) + [moph_code]
                    sql = f"UPDATE drug SET {set_clause} WHERE MoPHCode = %s"
                    cur2.execute(sql, params)

                # Commit
                conn.commit()
            finally:
                cur2.close()

            print(f"Applied updates to {rows_with_updates} rows; {total_updates} fields updated.")
        except MySQLError as e:  # type: ignore[name-defined]
            try:
                conn.rollback()
            except Exception:
                pass
            print(f"Error applying updates; transaction rolled back. Error: {e}")
            sys.exit(1)
    finally:
        try:
            conn.close()
        except Exception:
            pass


if __name__ == "__main__":
    main()