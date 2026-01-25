#!/usr/bin/env python3
"""
Update ProductType field in ommal_medapiv2.Drugs from a TSV file by matching on MoPHCode.

Rules:
- Only update DB fields when ProductType differs between database and TSV file.
- TSV format: First column is MoPHCode, second column is ProductType (tab-separated, with header).
- Shows a preview of how many records will change before committing.
- Requires user confirmation before applying changes.

Safety:
- Preview by default (no DB writes). User must confirm to apply changes.
- Transaction-based: all changes succeed or all rollback on error.
- Logs summary of planned/applied changes.

Usage:
  python scripts/update_product_type_from_tsv.py                           # preview changes
  python scripts/update_product_type_from_tsv.py --tsv path/to/file.tsv   # custom TSV file
"""

from __future__ import annotations

import argparse
import csv
import os
import sys
from typing import Any, Dict, List, Optional, Tuple

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
    """Establish database connection."""
    if USING_MYSQL_CONNECTOR:
        return mysql.connector.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"],
        )
    else:
        return pymysql.connect(  # type: ignore[name-defined]
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            db=DB_CONFIG["database"],
            charset=DB_CONFIG["charset"],
            cursorclass=pymysql.cursors.DictCursor,  # type: ignore[name-defined]
        )


def load_tsv_records(tsv_path: str) -> List[Dict[str, str]]:
    """Read TSV file with MoPHCode and ProductType columns."""
    records: List[Dict[str, str]] = []
    
    with open(tsv_path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f, delimiter='\t')
        
        # Verify required columns exist
        if not reader.fieldnames:
            print("Error: TSV file is empty or has no header.")
            sys.exit(1)
        
        # Normalize header names (strip whitespace)
        headers = [h.strip() if h else "" for h in reader.fieldnames]
        
        if "MoPHCode" not in headers or "ProductType" not in headers:
            print(f"Error: TSV must have 'MoPHCode' and 'ProductType' columns.")
            print(f"Found headers: {headers}")
            sys.exit(1)
        
        for row in reader:
            moph_code = row.get("MoPHCode", "").strip()
            product_type = row.get("ProductType", "").strip()
            
            if moph_code and product_type:
                records.append({
                    "MoPHCode": moph_code,
                    "ProductType": product_type
                })
    
    return records


def parse_moph_code(val: str) -> Optional[int]:
    """Parse MoPHCode as integer."""
    if val is None:
        return None
    s = str(val).strip()
    if not s:
        return None
    try:
        return int(float(s))
    except Exception:
        return None


def fetch_drugs_by_moph_codes(conn, moph_codes: List[int]) -> Dict[int, Dict[str, Any]]:
    """Fetch drugs from database by MoPHCode."""
    if not moph_codes:
        return {}
    
    placeholders = ", ".join(["%s"] * len(moph_codes))
    query = f"SELECT DrugID, MoPHCode, ProductType FROM Drugs WHERE MoPHCode IN ({placeholders})"
    
    if USING_MYSQL_CONNECTOR:
        cur = conn.cursor(dictionary=True)
    else:
        cur = conn.cursor()
    
    try:
        cur.execute(query, moph_codes)
        rows = cur.fetchall()
    finally:
        cur.close()
    
    # Build map: MoPHCode -> drug record
    db_map: Dict[int, Dict[str, Any]] = {}
    for row in rows:
        if isinstance(row, dict):
            moph_code = row.get("MoPHCode")
            if moph_code is not None:
                db_map[int(moph_code)] = row
    
    return db_map


def main():
    parser = argparse.ArgumentParser(
        description="Update ProductType in Drugs table from TSV file by MoPHCode."
    )
    parser.add_argument(
        "--tsv",
        required=False,
        default=os.path.join("src", "data", "typeold.tsv"),
        help="Path to TSV file (default: src/data/typeold.tsv)"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Verbose logging of per-row updates"
    )

    args = parser.parse_args()
    tsv_path = args.tsv
    verbose = args.verbose

    if not os.path.isfile(tsv_path):
        print(f"TSV file not found: {tsv_path}")
        sys.exit(1)

    print(f"Loading TSV file: {tsv_path}")
    tsv_records = load_tsv_records(tsv_path)
    
    if not tsv_records:
        print("No valid records found in TSV file.")
        sys.exit(1)
    
    print(f"Loaded {len(tsv_records)} records from TSV file.")

    # Connect to database
    try:
        conn = connect_db()
        print(f"Connected to database: {DB_CONFIG['database']}")
    except MySQLError as e:  # type: ignore[name-defined]
        print(f"Failed to connect to database: {e}")
        sys.exit(1)

    try:
        # Get MoPHCodes from TSV
        moph_codes = []
        for rec in tsv_records:
            code = parse_moph_code(rec["MoPHCode"])
            if code is not None:
                moph_codes.append(code)
        
        if not moph_codes:
            print("No valid MoPHCodes found in TSV.")
            sys.exit(1)
        
        print(f"Found {len(moph_codes)} valid MoPHCodes in TSV.")
        
        # Fetch existing drugs
        print("Fetching drugs from database...")
        db_drugs = fetch_drugs_by_moph_codes(conn, moph_codes)
        print(f"Found {len(db_drugs)} matching drugs in database.")
        
        # Build list of changes needed
        changes: List[Tuple[int, int, str, str]] = []  # (DrugID, MoPHCode, old_type, new_type)
        
        for rec in tsv_records:
            moph_code = parse_moph_code(rec["MoPHCode"])
            if moph_code is None:
                continue
            
            tsv_product_type = rec["ProductType"]
            
            if moph_code not in db_drugs:
                if verbose:
                    print(f"  MoPHCode {moph_code} not found in database - skipping")
                continue
            
            drug = db_drugs[moph_code]
            db_product_type = drug.get("ProductType")
            drug_id = drug.get("DrugID")
            
            # Normalize for comparison (handle None and strip whitespace)
            db_type_normalized = (db_product_type or "").strip()
            tsv_type_normalized = tsv_product_type.strip()
            
            # Check if there's a disparity
            if db_type_normalized != tsv_type_normalized:
                changes.append((drug_id, moph_code, db_type_normalized or "(empty)", tsv_type_normalized))
                if verbose:
                    print(f"  MoPHCode {moph_code} (DrugID {drug_id}): '{db_type_normalized}' -> '{tsv_type_normalized}'")
        
        # Display summary
        print("\n" + "="*80)
        print("PREVIEW OF CHANGES")
        print("="*80)
        print(f"Total TSV records: {len(tsv_records)}")
        print(f"Drugs found in database: {len(db_drugs)}")
        print(f"ProductType changes needed: {len(changes)}")
        print("="*80)
        
        if not changes:
            print("\nNo changes needed. All ProductType values match between database and TSV.")
            return
        
        # Show sample of changes
        print("\nSample changes (first 10):")
        for i, (drug_id, moph_code, old_type, new_type) in enumerate(changes[:10], 1):
            print(f"  {i}. DrugID={drug_id}, MoPHCode={moph_code}: '{old_type}' -> '{new_type}'")
        
        if len(changes) > 10:
            print(f"  ... and {len(changes) - 10} more changes")
        
        # Ask for confirmation
        print("\n" + "="*80)
        response = input(f"Do you want to apply these {len(changes)} changes? (yes/no): ").strip().lower()
        
        if response not in ["yes", "y"]:
            print("Changes cancelled. No updates applied.")
            return
        
        # Apply changes in a transaction
        print("\nApplying changes...")
        
        if USING_MYSQL_CONNECTOR:
            conn.start_transaction()
        
        try:
            if USING_MYSQL_CONNECTOR:
                cur = conn.cursor()
            else:
                cur = conn.cursor()
            
            try:
                update_count = 0
                for drug_id, moph_code, old_type, new_type in changes:
                    sql = "UPDATE Drugs SET ProductType = %s WHERE DrugID = %s"
                    cur.execute(sql, (new_type, drug_id))
                    update_count += 1
                
                # Commit transaction
                conn.commit()
                print(f"\n✓ Successfully updated ProductType for {update_count} drugs.")
                
            finally:
                cur.close()
        
        except MySQLError as e:  # type: ignore[name-defined]
            try:
                conn.rollback()
            except Exception:
                pass
            print(f"\n✗ Error applying updates. Transaction rolled back.")
            print(f"Error: {e}")
            sys.exit(1)
    
    finally:
        try:
            conn.close()
        except Exception:
            pass


if __name__ == "__main__":
    main()
