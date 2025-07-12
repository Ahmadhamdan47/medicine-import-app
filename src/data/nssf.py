import pandas as pd
import mysql.connector
import re
import sys
import os
import getpass

# --- Read DB config from JS ---
def get_db_config(js_path=None):
    # Hardcoded DB config from your Sequelize config
    return {
        'host': 'localhost',
        'user': 'ommal_ahmad',
        'password': '',
        'database': 'ommal_medapiv2'
    }

# --- CSV FILES ---
CSV_FILES = [
    './nssf-sheet1.csv',
    './nssf-sheet2.csv',
    './nssf-sheet3.csv',
    './nssf-sheet4.csv',
    './nssf-sheet5.csv'
]

# --- MAIN SCRIPT ---
def main():
    # Get DB config from JS
    db_config = get_db_config()

    # Read all sheets into one DataFrame
    df = pd.concat([pd.read_csv(f, encoding='utf-8') for f in CSV_FILES], ignore_index=True)
    df = df.fillna('')

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    try:
        conn.start_transaction()
        inserted_operations = 0
        inserted_coverages = 0
        op_code_to_id = {}

        # Preload all operation codes for fast lookup
        cursor.execute("SELECT ID, Code FROM operation")
        for row in cursor.fetchall():
            op_code_to_id[row['Code']] = row['ID']

        for _, row in df.iterrows():
            nssf_code = str(row['NSSF CODES']).strip()
            op_code = f'C{nssf_code}G'
            los = int(row['LOS']) if str(row['LOS']).isdigit() else None
            name = str(row['Operation']).strip()
            # Check if operation exists
            operation_id = op_code_to_id.get(op_code)
            if not operation_id:
                # Insert operation
                cursor.execute(
                    "INSERT INTO operation (Name, Code, Los) VALUES (%s, %s, %s)",
                    (name, op_code, los)
                )
                operation_id = cursor.lastrowid
                op_code_to_id[op_code] = operation_id
                inserted_operations += 1

            # Insert coverage
            cursor.execute(
                """
                INSERT INTO nssf_operation_coverage
                (operation_id, nssf_code, surgeon, anesthetist, consultants, hospital1, hospital2, hospital3, total1, total2, total3, notes, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1)
                """,
                (
                    operation_id,
                    nssf_code,
                    row.get('Surgeon') or None,
                    row.get('Anesthetist') or None,
                    row.get('2 Consultants') or None,
                    row.get('Hospital I') or None,
                    row.get('Hospital II') or None,
                    row.get('Hospital III') or None,
                    row.get('Total I') or None,
                    row.get('Total II') or None,
                    row.get('Total III') or None,
                    row.get('Notes') or None
                )
            )
            inserted_coverages += 1

        print(f"\nSummary:\n  Operations inserted: {inserted_operations}\n  Coverages inserted: {inserted_coverages}")
        confirm = input("Apply these changes to the database? (yes/no): ").strip().lower()
        if confirm == 'yes':
            conn.commit()
            print("Changes committed.")
        else:
            conn.rollback()
            print("Changes rolled back.")
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    main()