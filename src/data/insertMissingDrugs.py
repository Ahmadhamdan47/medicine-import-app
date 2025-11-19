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
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error reading TSV file: {e}")
        return []

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

def get_column_lengths(cursor, table_name):
    cursor.execute(f"SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'")
    return {row['COLUMN_NAME']: row['CHARACTER_MAXIMUM_LENGTH'] for row in cursor.fetchall()}

def truncate_values(row, column_lengths):
    return {col: (val[:column_lengths[col]] if col in column_lengths and isinstance(val, str) else val) for col, val in row.items()}

def main():
    tsv_data = read_tsv('./oct.tsv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current MoPHCodes from database
        cursor.execute("SELECT MoPHCode FROM drug")
        existing_moph_codes = {row['MoPHCode'] for row in cursor.fetchall()}

        # Get column lengths
        column_lengths = get_column_lengths(cursor, 'drug')

        # Identify entries to insert
        insert_list = [
            truncate_values({**row, 'NotMarketed': 0}, column_lengths)  # Add NotMarketed field with value 0 and truncate values
            for row in tsv_data if row['MoPHCode'] not in existing_moph_codes
        ]

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"New drugs to insert: {len(insert_list)}")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute inserts
        if insert_list:
            column_names = insert_list[0].keys()
            columns = ', '.join(column_names)
            values_placeholder = ', '.join(['%s'] * len(column_names))
            insert_query = f"INSERT INTO drug ({columns}) VALUES ({values_placeholder})"
            cursor.executemany(insert_query, [tuple(row.values()) for row in insert_list])

        conn.commit()
        print(f"Successfully inserted {cursor.rowcount} new drugs")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()