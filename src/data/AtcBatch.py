import mysql.connector
from mysql.connector import Error
import pandas as pd

def read_csv(file_path):
    try:
        # Read the CSV file as strings and fill missing values with an empty string.
        df = pd.read_csv(file_path, dtype=str, encoding='utf-8').fillna('')
        # Trim whitespace from column names.
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
    # Read CSV data with headers: ATC_ID, Code, Name, ParentID
    csv_data = read_csv('./ATC.csv')
    if not csv_data:
        print("No data loaded from CSV. Exiting.")
        return

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        # We'll be committing per batch so turn off autocommit
        conn.autocommit = False  
        cursor = conn.cursor(dictionary=True)

        # Fetch existing ATC_IDs from the database (convert to string for reliable comparisons)
        cursor.execute("SELECT ATC_ID FROM atc_code")
        existing_ids = {str(row['ATC_ID']).strip() for row in cursor.fetchall()}

        # Partition CSV rows into those that should be inserted and those that exist (to update)
        insert_list = []
        update_list = []
        for row in csv_data:
            atc_id = str(row['ATC_ID']).strip()
            if atc_id in existing_ids:
                update_list.append(row)
            else:
                insert_list.append(row)

        # Batch size (adjust as needed)
        batch_size = 100

        # Preview changes
        print("\n===== Changes Preview =====")
        print(f"Rows to insert: {len(insert_list)}")
        print(f"Rows to update: {len(update_list)}")

        # Confirmation prompt
        confirm = input("\nDo you want to commit these changes? (yes/no): ").strip().lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Process inserts in batches
        if insert_list:
            insert_query = """
                INSERT INTO atc_code (ATC_ID, Code, Name, ParentID)
                VALUES (%s, %s, %s, %s)
            """
            for i in range(0, len(insert_list), batch_size):
                batch = insert_list[i:i+batch_size]
                insert_values = [
                    (row['ATC_ID'], row['Code'], row['Name'], row['ParentID'])
                    for row in batch
                ]
                cursor.executemany(insert_query, insert_values)
                conn.commit()
                print(f"Inserted batch: {i + len(batch)}/{len(insert_list)} rows inserted.")

        # Process updates in batches
        if update_list:
            update_query = """
                UPDATE atc_code
                SET Code = %s, Name = %s, ParentID = %s
                WHERE ATC_ID = %s
            """
            for i in range(0, len(update_list), batch_size):
                batch = update_list[i:i+batch_size]
                update_values = [
                    (row['Code'], row['Name'], row['ParentID'], row['ATC_ID'])
                    for row in batch
                ]
                cursor.executemany(update_query, update_values)
                conn.commit()
                print(f"Updated batch: {i + len(batch)}/{len(update_list)} rows updated.")

        print("All batches processed successfully.")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
