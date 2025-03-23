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
    # Read data from the CSV file
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

        # Retrieve existing ATC_IDs from the atc_code table
        cursor.execute("SELECT ATC_ID FROM atc_code")
        existing_ids = {row['ATC_ID'] for row in cursor.fetchall()}

        # Determine which rows are new inserts vs. updates
        insert_list = []
        update_list = []
        for row in csv_data:
            # row keys: ATC_ID, Code, Name, ParentID
            if row['ATC_ID'] in existing_ids:
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

        conn.commit()
        print(f"Successfully inserted {len(insert_list)} new rows and updated {len(update_list)} rows.")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
