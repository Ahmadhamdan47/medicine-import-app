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
        df['MoPHCode'] = pd.to_numeric(df['MoPHCode'].str.strip(), errors='coerce').fillna(0).astype(int)
        return set(df['MoPHCode'].tolist())
    except Exception as e:
        print(f"Error reading TSV file: {e}")
        return set()

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
    tsv_moph_codes = read_tsv('./march.tsv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current data
        cursor.execute("SELECT MoPHCode, NotMarketed FROM drug")
        current_data = {row['MoPHCode']: row for row in cursor.fetchall()}

        # Calculate changes
        update_not_marketed_list = []

        for code, details in current_data.items():
            if code not in tsv_moph_codes and int(details['NotMarketed']) == 0:
                update_not_marketed_list.append((1, code))

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"NotMarketed updates: {len(update_not_marketed_list)}")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        if update_not_marketed_list:
            update_not_marketed_query = "UPDATE drug SET NotMarketed = %s WHERE MoPHCode = %s"
            cursor.executemany(update_not_marketed_query, update_not_marketed_list)

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
