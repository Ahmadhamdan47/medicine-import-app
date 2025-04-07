import mysql.connector
from mysql.connector import Error
import pandas as pd

def read_csv(file_path):
    try:
        df = pd.read_csv(file_path, dtype=str).fillna('')
        df['code'] = pd.to_numeric(df['code'].str.strip(), errors='coerce').fillna(0).astype(int)
        df['reg_number'] = df['reg_number'].str.strip()
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return []

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
    csv_data = read_csv('./reg_num.csv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Fetch records where reg_number is empty or 0
        query = """
        SELECT code, reg_number 
        FROM medications 
        WHERE reg_number = '' OR reg_number = '0' OR reg_number IS NULL
        """
        cursor.execute(query)
        missing_reg_nums = {row['code']: row['reg_number'] for row in cursor.fetchall()}

        # Prepare updates
        updates = []
        for entry in csv_data:
            code = entry['code']
            reg_number = entry['reg_number']
            if code in missing_reg_nums:
                updates.append((reg_number, code))

        # Show preview
        print("\n===== Update Preview =====")
        print(f"Total records to update: {len(updates)}")

        # Confirmation
        confirm = input("\nDo you want to commit these updates? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        update_query = """
        UPDATE medications 
        SET reg_number = %s 
        WHERE code = %s
        """
        try:
            cursor.executemany(update_query, updates)
            conn.commit()
            print(f"Successfully updated {len(updates)} entries.")
        except Error as e:
            print(f"Error while updating data: {e}")
            conn.rollback()
            return

        # Return the codes of updated drugs
        updated_codes = [code for _, code in updates]
        print("\n===== Result =====")
        print(f"Updated codes: {updated_codes}")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
