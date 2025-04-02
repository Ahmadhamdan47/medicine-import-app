import mysql.connector
from mysql.connector import Error
import pandas as pd


def read_csv(file_path):
    try:
        try:
            df = pd.read_csv(file_path, dtype=str, encoding='utf-8').fillna('')
        except UnicodeDecodeError:
            print("Warning: UTF-8 encoding failed. Trying ISO-8859-1.")
            df = pd.read_csv(file_path, dtype=str, encoding='ISO-8859-1').fillna('')
        df.columns = df.columns.str.strip()
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return []


def get_db_connection():
    try:
        return mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='ommal_medapiv2'
        )
    except Error as e:
        print(f"Error connecting to database: {e}")
        return None


def main():
    csv_data = read_csv('./Dosage.csv')
    if not csv_data:
        print("No data loaded from CSV. Exiting.")
        return

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False
        cursor = conn.cursor(dictionary=True)

        insert_list = []
        update_list = []

        for row in csv_data:
            moph_code = str(row['MoPHCode']).strip()
            if not moph_code:
                continue

            cursor.execute("SELECT DrugID FROM drug WHERE MoPHCode = %s", (moph_code,))
            drug = cursor.fetchall()

            if drug:
                drug_id = drug[0]['DrugID']
                update_list.append((drug_id, row))
            else:
                insert_list.append(row)

        print("\n===== Changes Preview =====")
        print(f"Rows to insert: {len(insert_list)}")
        print(f"Rows to update: {len(update_list)}")

        confirm = input("\nDo you want to commit these changes? (yes/no): ").strip().lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back.")
            return

        batch_size = 100

        if insert_list:
            insert_query = """
                INSERT INTO dosage (DrugID, Numerator1, Numerator1Unit, Denominator1, Denominator1Unit, Numerator2, Numerator2Unit, Denominator2, Denominator2Unit, Numerator3, Numerator3Unit, Denominator3, Denominator3Unit)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                Numerator1 = VALUES(Numerator1), Numerator1Unit = VALUES(Numerator1Unit),
                Denominator1 = VALUES(Denominator1), Denominator1Unit = VALUES(Denominator1Unit),
                Numerator2 = VALUES(Numerator2), Numerator2Unit = VALUES(Numerator2Unit),
                Denominator2 = VALUES(Denominator2), Denominator2Unit = VALUES(Denominator2Unit),
                Numerator3 = VALUES(Numerator3), Numerator3Unit = VALUES(Numerator3Unit),
                Denominator3 = VALUES(Denominator3), Denominator3Unit = VALUES(Denominator3Unit);
            """

            for i in range(0, len(insert_list), batch_size):
                batch = insert_list[i:i+batch_size]
                values = [(
                    row['DrugID'], row['Numerator1'], row['Numerator1Unit'], row['Denominator1'], row['Denominator1Unit'],
                    row['Numerator2'], row['Numerator2Unit'], row['Denominator2'], row['Denominator2Unit'],
                    row['Numerator3'], row['Numerator3Unit'], row['Denominator3'], row['Denominator3Unit']
                ) for row in batch]
                cursor.executemany(insert_query, values)
                conn.commit()
                print(f"Inserted batch: {i + len(batch)}/{len(insert_list)} rows inserted.")

        if update_list:
            update_query = """
                UPDATE dosage SET
                Numerator1 = %s, Numerator1Unit = %s, Denominator1 = %s, Denominator1Unit = %s,
                Numerator2 = %s, Numerator2Unit = %s, Denominator2 = %s, Denominator2Unit = %s,
                Numerator3 = %s, Numerator3Unit = %s, Denominator3 = %s, Denominator3Unit = %s
                WHERE DrugID = %s;
            """

            for i in range(0, len(update_list), batch_size):
                batch = update_list[i:i+batch_size]
                values = [(
                    row['Numerator1'], row['Numerator1Unit'], row['Denominator1'], row['Denominator1Unit'],
                    row['Numerator2'], row['Numerator2Unit'], row['Denominator2'], row['Denominator2Unit'],
                    row['Numerator3'], row['Numerator3Unit'], row['Denominator3'], row['Denominator3Unit'],
                    drug_id
                ) for drug_id, row in batch]
                cursor.executemany(update_query, values)
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
