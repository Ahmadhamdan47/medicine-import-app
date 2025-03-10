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
                public_price = float(row['PublicPrice'].strip())
                not_marketed = int(row['NotMarketed'].strip())
                tsv_data[moph_code] = {'PublicPrice': public_price, 'NotMarketed': not_marketed}
            except (ValueError, KeyError):
                print(f"Skipping invalid row: {row}")
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
    tsv_data = read_tsv('/march.tsv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current data
        cursor.execute("SELECT MoPHCode, PublicPrice, NotMarketed FROM drug")
        current_data = {row['MoPHCode']: row for row in cursor.fetchall()}

        # Calculate changes
        update_price_list = []
        update_not_marketed_list = []

        for code, details in tsv_data.items():
            if code in current_data:
                # Update PublicPrice if different
                if current_data[code]['PublicPrice'] != details['PublicPrice']:
                    update_price_list.append((details['PublicPrice'], code))
                # Update NotMarketed to 0 if currently 1
                if current_data[code]['NotMarketed'] == 1:
                    update_not_marketed_list.append((0, code))

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"PublicPrice updates: {len(update_price_list)}")
        print(f"NotMarketed changes: {len(update_not_marketed_list)}")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        if update_price_list:
            update_price_query = "UPDATE drug SET PublicPrice = %s WHERE MoPHCode = %s"
            cursor.executemany(update_price_query, update_price_list)

        if update_not_marketed_list:
            update_not_marketed_query = "UPDATE drug SET NotMarketed = %s WHERE MoPHCode = %s"
            cursor.executemany(update_not_marketed_query, update_not_marketed_list)

        conn.commit()
        print(f"Successfully committed {cursor.rowcount} changes")

    except Error as e:
        print(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
