import csv
import mysql.connector
from mysql.connector import Error
import pandas as pd

def read_tsv(file_path):
    try:
        df = pd.read_csv(file_path, delimiter='\t', dtype=str, engine='python', encoding='utf-8').fillna('')
        # Clean column names
        df.columns = df.columns.str.strip()
        # Clean data entries
        df['code'] = pd.to_numeric(df['code'].str.strip(), errors='coerce').fillna(0).astype(int)
        df['public_price'] = pd.to_numeric(df['public_price'].str.strip(), errors='coerce').fillna(0.0).astype(float)
        # Drop ignored columns
        df.drop(['ResponsibleParty', 'ResponsiblePartyCountry'], axis=1, inplace=True, errors='ignore')
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
    database='ommal_medlist',
        )
    except Error as e:
        print(f"Error: {e}")
        return None

def main():
    tsv_data = read_tsv('./march.tsv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current data from medications table
        cursor.execute("SELECT code, public_price FROM medications")
        current_data = {row['code']: row for row in cursor.fetchall()}

        # Calculate updates
        update_price_list = []

        for code, details in tsv_data.items():
            if code in current_data:
                # Update PublicPrice if different (rounded to 6 decimals for precision)
                if round(float(current_data[code]['public_price'] or 0), 6) != round(details['public_price'], 6):
                    update_price_list.append((details['public_price'], code))

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"PublicPrice updates: {len(update_price_list)}")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        if update_price_list:
            update_price_query = "UPDATE medications SET public_price = %s WHERE code = %s"
            cursor.executemany(update_price_query, update_price_list)

        conn.commit()
        print(f"Successfully committed {cursor.rowcount} changes")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
