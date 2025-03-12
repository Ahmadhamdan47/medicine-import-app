import json
import pandas as pd
import mysql.connector
from mysql.connector import Error

def read_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def read_tsv(file_path):
    try:
        df = pd.read_csv(file_path, delimiter='\t', dtype=str, engine='python', encoding='utf-8').fillna('')
        df['MoPHCode'] = pd.to_numeric(df['MoPHCode'].str.strip(), errors='coerce').fillna(0).astype(int)
        # Skip records with overly large values (e.g., invalid data)
        for col in df.columns:
            df[col] = df[col].apply(lambda x: x if len(str(x)) < 100 else None)
        # Map ProductType from 'B' and 'G' to 'Brand' and 'Generic'
        if 'ProductType' in df.columns:
            df['ProductType'] = df['ProductType'].map({'B': 'Brand', 'G': 'Generic'})
        # Drop PublicPrice to exclude from updates
        df.drop(['PublicPrice'], axis=1, inplace=True, errors='ignore')
        return df.set_index('MoPHCode').to_dict(orient='index')
    except Exception as e:
        print(f"Error reading TSV file: {e}")
        return {}

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

def main():
    moph_codes = read_json('./matching_drugs_mophcodes.json')
    medleb_data = read_tsv('./medleb.tsv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor()

        # Track changes
        update_list = []

        for code in moph_codes:
            if code in medleb_data:
                data = medleb_data[code]
                # Prepare update tuple (column values + MoPHCode)
                update_values = list(data.values()) + [code]
                update_list.append(tuple(update_values))

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"Records to update: {len(update_list)}")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        if update_list:
            columns = ', '.join(medleb_data[next(iter(medleb_data))].keys())
            set_clause = ', '.join([f"{col} = %s" for col in medleb_data[next(iter(medleb_data))].keys()])
            update_query = f"UPDATE drug SET {set_clause} WHERE MoPHCode = %s"
            cursor.executemany(update_query, update_list)

        conn.commit()
        print(f"Successfully updated {cursor.rowcount} records")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()