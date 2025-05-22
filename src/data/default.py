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
        # Use a buffered cursor to prevent unread result issues
        cursor = conn.cursor(dictionary=True, buffered=True)

        # Add column DosageLNDI if it does not exist
        cursor.execute("ALTER TABLE drug ADD COLUMN IF NOT EXISTS DosageLNDI VARCHAR(255)")

        update_count = 0
        for row in data:
            moph_code = row.get('MoPHCode')
            if not moph_code:
                continue

            # Fetch current database row in drug table
            cursor.execute("SELECT * FROM drug WHERE MoPHCode = %s", (moph_code,))
            current = cursor.fetchone()
            if not current:
                continue

            # Define columns to skip when updating changes
            skip_columns = set([
                'DrugID', 'MoPHCode', 
                'Numerator1','Numerator1Unit','Denominator1','Denominator1Unit',
                'Numerator2','Numerator2Unit','Denominator2','Denominator2Unit',
                'Numerator3','Numerator3Unit','Denominator3','Denominator3Unit',
                'PresentationUnitQuantity1','PresentationUnitType1',
                'PresentationUnitQuantity2','PresentationUnitType2',
                'PresentationPackageQuantity1','PresentationPackageType1',
                'PresentationPackageQuantity2','PresentationPackageType2',
                'PresentationPackageQuantity3','PresentationPackageType3',
                'PresentationDescription'
            ])

            changes = {}
            for key, value in row.items():
                if key in skip_columns:  # skip fields not intended for update
                    continue
                file_value = value.strip()
                # Convert boolean text to 0 or 1
                if file_value.lower() == "true":
                    file_value = "1"
                elif file_value.lower() == "false":
                    file_value = "0"
                db_value = str(current.get(key, '') or '')
                if db_value != file_value:
                    changes[key] = file_value

            if changes:
                set_clause = ', '.join([f"`{k}` = %s" for k in changes.keys()])
                values = list(changes.values()) + [moph_code]
                update_query = f"UPDATE drug SET {set_clause} WHERE MoPHCode = %s"
                cursor.execute(update_query, values)
                update_count += 1

            # --- New dosage update block ---
            dosage_columns = [
                'Numerator1','Numerator1Unit','Denominator1','Denominator1Unit',
                'Numerator2','Numerator2Unit','Denominator2','Denominator2Unit',
                'Numerator3','Numerator3Unit','Denominator3','Denominator3Unit'
            ]
            drug_id = row.get('DrugID')
            if not drug_id:
                continue
            cursor.execute("SELECT * FROM dosage WHERE DrugID = %s", (drug_id,))
            current_dosage = cursor.fetchone()
            if not current_dosage:
                continue
            changes_dosage = {}
            for col in dosage_columns:
                csv_value = row.get(col, '').strip()
                if csv_value.lower() == "true":
                    csv_value = "1"
                elif csv_value.lower() == "false":
                    csv_value = "0"
                if csv_value == "":
                    csv_value = "0"
                # Convert csv_value to a numeric string for numeric columns.
                try:
                    numeric_value = str(int(float(csv_value)))
                except ValueError:
                    numeric_value = "0"
                # Use the numeric_value for comparison
                db_value = str(current_dosage.get(col, '') or '')
                if db_value != numeric_value:
                    changes_dosage[col] = numeric_value
            if changes_dosage:
                set_clause_dosage = ', '.join([f"`{k}` = %s" for k in changes_dosage.keys()])
                values_dosage = list(changes_dosage.values()) + [drug_id]
                update_query_dosage = f"UPDATE dosage SET {set_clause_dosage} WHERE DrugID = %s"
                cursor.execute(update_query_dosage, values_dosage)
            # --- End of dosage update block ---

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
