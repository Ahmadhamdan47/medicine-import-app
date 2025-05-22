import mysql.connector
from mysql.connector import Error
import pandas as pd

def read_csv(file_path):
    try:
        df = pd.read_csv(file_path, dtype=str).fillna('')
        df['MoPHCode'] = pd.to_numeric(df['MoPHCode'].str.strip(), errors='coerce').fillna(0).astype(int)
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return []

def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost',
            user='ommal_ahmad',
            password='fISfGr^8q!_gUPMY',
            database='ommal_medapiv2',
        )
    except Error as e:
        print(f"Error: {e}")
        return None

def main():
    file_path = './default.csv'
    data = read_csv(file_path)
    if not data:
        print("No data to process.")
        return

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False
        cursor = conn.cursor(dictionary=True)

        update_count = 0
        for row in data:
            moph_code = row.get('MoPHCode')
            if not moph_code:
                continue

            # Fetch current database row
            cursor.execute("SELECT * FROM drug WHERE MoPHCode = %s", (moph_code,))
            current = cursor.fetchone()
            if not current:
                continue

            changes = {}
            for key, value in row.items():
                if key in ['DrugID', 'MoPHCode']:
                    continue
                db_value = str(current.get(key, '') or '')
                file_value = value.strip()
                if db_value != file_value:
                    changes[key] = file_value

            if changes:
                set_clause = ', '.join([f"{k} = %s" for k in changes.keys()])
                values = list(changes.values()) + [moph_code]
                update_query = f"UPDATE drug SET {set_clause} WHERE MoPHCode = %s"
                cursor.execute(update_query, values)
                update_count += 1

        print(f"Prepared {update_count} updates for confirmation.")
        confirm = input("Commit these changes? (yes/no): ").lower()
        if confirm == 'yes':
            conn.commit()
            print(f"Successfully updated {update_count} rows.")
        else:
            conn.rollback()
            print("Transaction rolled back.")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
