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
        # Clean column names
        df.columns = df.columns.str.strip().str.lower()
        # Clean and convert code to integers
        df['code'] = pd.to_numeric(df['code'].str.strip(), errors='coerce').fillna(0).astype(int)
        # Skip invalid seq values
        if 'seq' in df.columns:
            df['seq'] = pd.to_numeric(df['seq'].str.strip(), errors='coerce')
        # Retain 'bg' column as-is for medlist database
        if 'bg' in df.columns:
            df['bg'] = df['bg'].str.strip()
        # Drop PublicPrice to exclude from updates
        df.drop(['public_price'], axis=1, inplace=True, errors='ignore')
        return df.set_index('code').to_dict(orient='index')
    except Exception as e:
        print(f"Error reading TSV file: {e}")
        return {}

def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost',
            user='ommal_oummal',
            password='dMR2id57dviMJJnc',
            database='ommal_medlist'
        )
    except Error as e:
        print(f"Error: {e}")
        return None

def main():
    moph_codes = read_json('./matching_drugs_mophcodes.json')
    medleb_data = read_tsv('./meddown.tsv')

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
                # Filter out invalid seq values
                if 'seq' in data and pd.isna(data['seq']):
                    data.pop('seq')
                # Prepare update tuple (column values + code)
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
            update_query = f"UPDATE medications SET {set_clause} WHERE code = %s"
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