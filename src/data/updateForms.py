# -*- coding: utf-8 -*-
import csv
import mysql.connector
from mysql.connector import Error

def read_tsv(file_path):
    tsv_data = {}
    with open(file_path, 'r', newline='', encoding='utf-8') as tsvfile:
        reader = csv.DictReader(tsvfile, delimiter='\t')
        for row in reader:
            try:
                moph_code = row['MoPHCode'].strip()  # Clean TSV codes
                form = row['Form'].strip()
                tsv_data[moph_code] = form
            except KeyError:
                print(f"Skipping invalid row: {row}")
    return tsv_data

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
    tsv_data = read_tsv('RPFD.tsv')
    
    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False
        cursor = conn.cursor(dictionary=True)

        # Fetch and clean database codes
        cursor.execute("SELECT MoPHCode, Form FROM drug")
        current_data = {
            row['MoPHCode'].strip(): row['Form']  # Clean DB codes
            for row in cursor.fetchall()
        }

        # Calculate changes
        update_list = []
        delete_list = []

        # Process TSV codes (5578 entries)
        for code, new_form in tsv_data.items():
            current_form = current_data.get(code)
            if current_form != new_form:
                update_list.append((new_form, code))

        # Process codes in DB but not in TSV
        delete_list = [
            code for code, form in current_data.items()
            if code not in tsv_data and form is not None
        ]

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"Updates to perform: {len(update_list)}")
        if update_list:
            print("Sample updates:")
            for update in update_list[:3]:
                print(f"Code {update[1]}: '{current_data.get(update[1])}' → '{update[0]}'")

        print(f"\nForms to clear: {len(delete_list)}")
        if delete_list:
            print("Sample deletions:")
            for code in delete_list[:3]:
                print(f"Code {code}: '{current_data[code]}' → NULL")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        if update_list:
            update_query = "UPDATE drug SET Form = %s WHERE MoPHCode = %s"
            cursor.executemany(update_query, update_list)

        # Execute deletions
        if delete_list:
            delete_query = "UPDATE drug SET Form = NULL WHERE MoPHCode = %s"
            cursor.executemany(delete_query, [(code,) for code in delete_list])

        conn.commit()
        print(f"\nSuccessfully committed changes:")
        print(f"- {len(update_list)} updates")
        print(f"- {len(delete_list)} deletions")

    except Error as e:
        print(f"\nDatabase error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()