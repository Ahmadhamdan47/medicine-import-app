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
        df['PublicPrice'] = pd.to_numeric(df['PublicPrice'].str.strip(), errors='coerce').fillna(0.0).astype(float)
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
    tsv_data = read_tsv('./march.tsv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current data
        cursor.execute("SELECT MoPHCode, PublicPrice, NotMarketed FROM drug")
        current_data = {row['MoPHCode']: row for row in cursor.fetchall()}

        # Calculate changes
        update_price_list = []
        update_not_marketed_list = []

        for code, details in tsv_data.items():
            if code in current_data:
                # Update PublicPrice if different (rounded to 6 decimals for precision)
                if round(float(current_data[code]['PublicPrice'] or 0), 6) != round(details['PublicPrice'], 6):
                    update_price_list.append((details['PublicPrice'], code))
                # If MoPHCode exists in both, update NotMarketed to 0 if currently 1
                if int(current_data[code]['NotMarketed']) == 1:
                    update_not_marketed_list.append((0, code))

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"PublicPrice updates: {len(update_price_list)}")
        print(f"NotMarketed changes: {len(update_not_marketed_list)}")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        if update_price_list:
            update_price_query = "UPDATE drug SET PublicPrice = %s WHERE MoPHCode = %s"
            cursor.executemany(update_price_query, update_price_list)

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