import mysql.connector
from mysql.connector import Error
import pandas as pd

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

def read_tsv(file_path):
    try:
        df = pd.read_csv(file_path, delimiter='\t', dtype=str, engine='python').fillna('')
        existing_moph_codes = set(df.iloc[:, 0].str.strip())  # First column assumed to be MoPHCode
        return existing_moph_codes
    except Exception as e:
        print(f"Error reading TSV file: {e}")
        return set()

def clear_form_and_route(file_path):
    existing_moph_codes = read_tsv(file_path)

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Fetch all MoPHCodes from the database
        cursor.execute("SELECT DrugID, MoPHCode, Form, Route FROM drug")
        drugs = cursor.fetchall()

        # Identify entries for updates
        updates = [drug for drug in drugs if str(drug['MoPHCode']) not in existing_moph_codes]
        update_count = len(updates)

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"Records to clear Form and Route: {update_count}")
        if updates:
            print("Sample changes:")
            for drug in updates[:5]:  # Show sample updates
                print(f"DrugID {drug['DrugID']}: Form '{drug['Form']}' → '', Route '{drug['Route']}' → ''")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").strip().lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back.")
            return

        # Execute updates in batches
        batch_size = 500
        for i in range(0, update_count, batch_size):
            batch = updates[i:i + batch_size]
            cursor.executemany(
                "UPDATE drug SET Form = '', Route = '' WHERE DrugID = %s AND NotMarketed = 0",
                [(drug['DrugID'],) for drug in batch]
            )
            print(f"✅ Processed {i + len(batch)} / {update_count}")

        conn.commit()  # Commit transaction
        print("✅ Data update complete.")

    except Error as e:
        conn.rollback()  # Rollback on error
        print(f"❌ Error during data update: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    file_path = './routenull.tsv'  # Specify the path to your TSV file
    clear_form_and_route(file_path)
