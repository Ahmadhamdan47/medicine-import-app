import mysql.connector
from mysql.connector import Error
import pandas as pd

def read_tsv(file_path):
    try:
        df = pd.read_csv(file_path, delimiter='\t', dtype=str, engine='python', encoding='utf-8').fillna('')
        # Clean column names
        df.columns = df.columns.str.strip()
        # Clean data entries
        df['code'] = pd.to_numeric(df['code'].str.strip(), errors='coerce').fillna(0).astype(int)
        # Drop ignored columns
        df.drop(['ResponsibleParty', 'ResponsiblePartyCountry'], axis=1, inplace=True, errors='ignore')
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error reading TSV file: {e}")
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

def get_column_lengths(cursor, table_name):
    try:
        cursor.execute(f"SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}'")
        return {row['COLUMN_NAME']: row['CHARACTER_MAXIMUM_LENGTH'] for row in cursor.fetchall()}
    except Error as e:
        print(f"Error fetching column lengths: {e}")
        return {}

def truncate_values(row, column_lengths):
    for col, val in row.items():
        if col in column_lengths and isinstance(val, str):
            row[col] = val[:column_lengths[col]]  # Truncate string values
        elif col == 'public_price':
            try:
                # Clean and convert to float
                val = val.replace(',', '').strip()
                row[col] = float(val) if val else None
            except (ValueError, TypeError):
                print(f"Warning: Invalid public_price value '{val}' in row with code {row.get('code')}")
                row[col] = None  # Set to NULL if conversion fails
    return row

def main():
    tsv_data = read_tsv('./August-5.tsv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current data from medications table
        cursor.execute("SELECT code FROM medications")
        current_data = {row['code'] for row in cursor.fetchall()}

        tsv_codes = {drug['code'] for drug in tsv_data}

        # Identify entries for deletion and insertion
        delete_list = list(current_data - tsv_codes)  # In DB but not in file
        insert_list = [drug for drug in tsv_data if drug['code'] not in current_data]  # In file but not in DB

        # Get column lengths
        column_lengths = get_column_lengths(cursor, 'medications')

        # Truncate values to fit within column lengths
        insert_list = [truncate_values(drug, column_lengths) for drug in insert_list]

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"Medications to delete: {len(delete_list)}")
        print(f"Medications to insert: {len(insert_list)}")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute deletions
        if delete_list:
            delete_query = "DELETE FROM medications WHERE code = %s"
            try:
                cursor.executemany(delete_query, [(code,) for code in delete_list])
            except Error as e:
                print(f"Error while deleting data: {e}")
                conn.rollback()
                return

        # Execute insertions with generated ID
        if insert_list:
            for entry in insert_list:
                entry['id'] = None  # Auto-generate ID in the database

            column_names = insert_list[0].keys()
            columns = ', '.join(column_names)
            values_placeholder = ', '.join(['%s'] * len(column_names))
            insert_query = f"INSERT INTO medications ({columns}) VALUES ({values_placeholder})"
            try:
                cursor.executemany(insert_query, [tuple(drug.values()) for drug in insert_list])
            except Error as e:
                print(f"Error while inserting data: {e}")
                for drug in insert_list:
                    try:
                        cursor.execute(insert_query, tuple(drug.values()))
                    except Error as single_error:
                        print(f"Failed to insert entry with code {drug['code']}: {single_error}")
                conn.rollback()
                return

        conn.commit()
        print(f"Successfully deleted {len(delete_list)} entries and inserted {len(insert_list)} new entries")

        # Return the codes of inserted and removed drugs
        return {"deleted_codes": delete_list, "inserted_codes": [drug['code'] for drug in insert_list]}

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
        return {"deleted_codes": [], "inserted_codes": []}
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    result = main()
    if result:
        print("\n===== Result =====")
        print(f"Deleted codes: {result['deleted_codes']}")
        print(f"Inserted codes: {result['inserted_codes']}")
