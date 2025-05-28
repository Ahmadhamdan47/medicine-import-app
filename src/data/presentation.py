import mysql.connector
from mysql.connector import Error
import pandas as pd

CSV_PATH = './defaultpres.csv'
DB_CONFIG = {
    'host':     'localhost',
    'user':     'ommal_ahmad',
    'password': 'fISfGr^8q!_gUPMY',
    'database': 'ommal_medapiv2',
}

# Columns that should be numeric/decimal in the DB
NUMERIC_COLS = [
    'UnitQuantity1', 'UnitQuantity2', 'PackageQuantity1', 'PackageQuantity2', 'PackageQuantity3'
]

def read_csv(path):
    df = pd.read_csv(path, dtype=str, encoding='utf-8').fillna('')
    # Ensure DrugId is an int
    df['DrugId'] = pd.to_numeric(df['DrugId'].str.strip(), errors='coerce').fillna(0).astype(int)
    return df.to_dict(orient='records')

def clean_row(row):
    for col in NUMERIC_COLS:
        val = row.get(col, '').strip()
        if val == '':
            row[col] = None
        else:
            try:
                row[col] = float(val)
            except ValueError:
                row[col] = None
    return row

def get_db_connection():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Error as e:
        print(f"Error connecting to DB: {e}")
        return None

def main():
    data = read_csv(CSV_PATH)
    conn = get_db_connection()
    if not conn:
        return

    try:
        conn.autocommit = False
        cursor = conn.cursor(dictionary=True)

        updates = 0
        inserts = 0

        for row in data:
            drug_id = row['DrugId']
            if not drug_id:
                continue
            row = clean_row(row)
            # 1) Check if there's already a presentation
            cursor.execute(
                "SELECT * FROM drugpresentation WHERE DrugId = %s",
                (drug_id,)
            )
            existing = cursor.fetchone()

            # Prepare only the presentation columns (all except DrugId)
            pres_cols = [c for c in row.keys() if c != 'DrugId']
            if existing:
                # 2a) UPDATE path: only if values differ
                changes = {}
                for col in pres_cols:
                    file_val = row[col]
                    db_val   = existing.get(col, None)
                    # For numeric columns, compare as float or None
                    if col in NUMERIC_COLS:
                        try:
                            db_val = float(db_val) if db_val is not None and db_val != '' else None
                        except ValueError:
                            db_val = None
                    else:
                        db_val = str(db_val or '')
                        file_val = str(file_val or '')
                    if file_val != db_val:
                        changes[col] = file_val

                if changes:
                    set_clause = ', '.join(f"`{c}` = %s" for c in changes)
                    vals = list(changes.values()) + [drug_id]
                    sql = f"UPDATE drugpresentation SET {set_clause} WHERE DrugId = %s"
                    cursor.execute(sql, vals)
                    updates += 1

            else:
                # 2b) INSERT path
                cols       = pres_cols + ['DrugId']
                col_list   = ', '.join(f"`{c}`" for c in cols)
                placeholders = ', '.join(['%s'] * len(cols))
                vals = [row[c] for c in pres_cols] + [drug_id]
                sql = f"INSERT INTO drugpresentation ({col_list}) VALUES ({placeholders})"
                cursor.execute(sql, vals)
                inserts += 1

        print(f"Prepared {updates} UPDATE(s) and {inserts} INSERT(s).")
        confirm = input("Commit these changes? (yes/no): ").lower()
        if confirm == 'yes':
            conn.commit()
            print(f"Committed: {updates} updated, {inserts} inserted.")
        else:
            conn.rollback()
            print("Rolled back, no changes made.")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
