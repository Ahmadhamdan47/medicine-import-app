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
    data = read_csv('./dates.csv')
    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False
        cursor = conn.cursor()

        updates = []
        for row in data:
            moph_code = row.get('MoPHCode')
            if not moph_code:
                continue

            update_fields = {}
            for col in ['rep', '2019', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028']:
                if row.get(col, '').strip() != '':
                    update_fields[f"`{col}`"] = True
                else:
                    update_fields[f"`{col}`"] = None

            # Date fields
            update_fields['registrationDay'] = row.get('registrationDate', '').strip() or None
            update_fields['registrationMonth'] = row.get('registrationMonth', '').strip() or None
            update_fields['registrationYear'] = row.get('registrationYear', '').strip() or None

            set_clause = ', '.join([f"{col} = %s" for col in update_fields])
            values = list(update_fields.values())
            values.append(moph_code)

            query = f"""
            UPDATE drug
            SET {set_clause}
            WHERE MoPHCode = %s
            """
            updates.append((query, values))

        print(f"Prepared {len(updates)} updates for confirmation.")

        confirm = input("Do you want to execute these updates? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back.")
            return

        for query, values in updates:
            cursor.execute(query, values)

        conn.commit()
        print(f"Successfully updated {len(updates)} drug records.")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
