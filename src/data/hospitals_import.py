import pandas as pd
import mysql.connector
import sys
import os

def is_private(val):
    if isinstance(val, str):
        return val.strip().lower() == 'private'
    return False

# --- Read DB config from JS ---
def get_db_config(js_path=None):
    # Hardcoded DB config from your Sequelize config
    return {
        'host': 'localhost',
        'user': 'ommal_ahmad',
        'password': 'fISfGr^8q!_gUPMY',
        'database': 'ommal_medapiv2'
    }

CSV_FILE = './hospitals.csv'

# --- MAIN SCRIPT ---
def main():
    db_config = get_db_config()
    if not os.path.exists(CSV_FILE):
        print(f"CSV file not found: {CSV_FILE}")
        sys.exit(1)
    df = pd.read_csv(CSV_FILE, encoding='utf-8').fillna('')
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    try:
        conn.start_transaction()
        inserted = 0
        for _, row in df.iterrows():
            hospitalName = str(row.get('hospitalName', '')).strip()
            town = str(row.get('town', '')).strip()
            municipality = str(row.get('municipality', '')).strip()
            region = str(row.get('region', '')).strip()
            isPrivate = is_private(row.get('isPrivate', ''))
            # Default categoryType, update logic as needed
            categoryType = 'first'
            # Insert statement (add more fields as needed)
            sql = """
                INSERT INTO hospital
                (hospitalName, town, municipality, region, isPrivate, categoryType)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            values = (hospitalName, town, municipality, region, isPrivate, categoryType)
            cursor.execute(sql, values)
            inserted += 1
        print(f"\nSummary:\n  Hospitals inserted: {inserted}")
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
