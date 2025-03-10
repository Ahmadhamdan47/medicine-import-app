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
                moph_code = int(row['MoPHCode'].strip())
                form = row['Form'].strip()
                tsv_data[moph_code] = form
            except (ValueError, KeyError) as e:
                print("Skipping invalid row: {}".format(row))
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
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current data
        cursor.execute("SELECT MoPHCode, Form FROM drug")
        current_data = {row['MoPHCode']: row['Form'] for row in cursor.fetchall()}

        # Calculate changes
        update_list = []
        delete_list = []
        
        # Find updates
        for code, new_form in tsv_data.items():
            current_form = current_data.get(code)
            if current_form != new_form:
                update_list.append((new_form, code))
        
        # Find deletions (codes in DB but not in TSV with non-null Form)
        delete_list = [code for code, form in current_data.items() 
                      if code not in tsv_data and form is not None]

        # Show preview
        print("\n===== Changes Preview =====")
        print("Updates to perform: {}".format(len(update_list)))
        if update_list:
            print("Sample updates:")
            for update in update_list[:3]:
                print("Code {}: '{}' → '{}'".format(update[1], current_data.get(update[1]), update[0]))
        
        print("\nForms to clear: {}".format(len(delete_list)))
        if delete_list:
            print("Sample deletions:")
            for code in delete_list[:3]:
                print("Code {}: '{}' → NULL".format(code, current_data[code]))

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        update_query = "UPDATE drug SET Form = %s WHERE MoPHCode = %s"
        cursor.executemany(update_query, update_list)
        
        # Execute deletions (set Form to NULL)
        if delete_list:
            delete_query = "UPDATE drug SET Form = NULL WHERE MoPHCode = %s"
            cursor.executemany(delete_query, [(code,) for code in delete_list])
        
        conn.commit()
        print("Successfully committed {} changes".format(cursor.rowcount))

    except Error as e:
        print("Database error: {}".format(e))
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()