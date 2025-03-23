import mysql.connector
from mysql.connector import Error
import pandas as pd

def read_csv(file_path):
    try:
        # Read the CSV file, ensuring all columns are read as strings and filling missing values with an empty string
        df = pd.read_csv(file_path, dtype=str, encoding='utf-8').fillna('')
        # Clean column names (trim any whitespace)
        df.columns = df.columns.str.strip()
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error reading CSV file: {e}")
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
        print(f"Error connecting to database: {e}")
        return None

def main():
    # Read data from the CSV file (with headers: ATC_ID, Code, Name, ParentID)
    csv_data = read_csv('./ATC.csv')
    if not csv_data:
        print("No data loaded from CSV. Exiting.")
        return

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start a transaction
        cursor = conn.cursor(dictionary=True)

        # Retrieve existing ATC_IDs from the atc_code table, converting them to strings for consistent comparison
        cursor.execute("SELECT ATC_ID FROM atc_code")
        existing_ids = {str(row['ATC_ID']) for row in cursor.fetchall()}

        # Determine which rows need to be inserted versus updated.
        insert_list = []
        update_list = []
        for row in csv_data:
            # Convert the CSV row's ATC_ID to string for comparison
            atc_id_str = str(row['ATC_ID']).strip()
            if atc_id_str in existing_ids:
                update_list.append(row)
            else:
                insert_list.append(row)

        # Preview changes
        print("\n===== Changes Preview =====")
        print(f"Rows to insert: {len(insert_list)}")
        print(f"Rows to update: {len(update_list)}")

        # Ask for confirmation before committing changes
        confirm = input("\nDo you want to commit these changes? (yes/no): ").strip().lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Insert new rows if any
        if insert_list:
            insert_query = """
                INSERT INTO atc_code (ATC_ID, Code, Name, ParentID)
                VALUES (%s, %s, %s, %s)
            """
            insert_values = [
                (row['ATC_ID'], row['Code'], row['Name'], row['ParentID'])
                for row in insert_list
            ]
            cursor.executemany(insert_query, insert_values)
            print(f"Inserted {cursor.rowcount} rows.")

        # Update existing rows if any
        if update_list:
            update_query = """
                UPDATE atc_code
                SET Code = %s, Name = %s, ParentID = %s
                WHERE ATC_ID = %s
            """
            update_values = [
                (row['Code'], row['Name'], row['ParentID'], row['ATC_ID'])
                for row in update_list
            ]
            cursor.executemany(update_query, update_values)
            print(f"Updated {cursor.rowcount} rows.")

        conn.commit()
        print("Transaction committed successfully.")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
