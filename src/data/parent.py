import mysql.connector
from mysql.connector import Error
import pandas as pd
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def read_csv(file_path):
    try:
        df = pd.read_csv(file_path, dtype=str, encoding='ISO-8859-1').fillna('')
        df['Manufacturer'] = df['Manufacturer'].str.strip()
        df['parentCompany'] = df['parentCompany'].str.strip()
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
    data = read_csv('./parent.csv')
    conn = get_db_connection()
    if conn is None:
        logging.error("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False
        cursor = conn.cursor()

        updates = []
        for row in data:
            name = row['Manufacturer']
            parent = row['parentCompany']
            logging.info(f"Processed record: Manufacturer='{name}', ParentCompany='{parent}'")
            if name and parent:
                query = """
                UPDATE manufacturer
                SET ParentCompany = %s
                WHERE ManufacturerName = %s
                """
                updates.append((query, (parent, name), name))

        logging.info(f"Prepared {len(updates)} updates for confirmation.")
        confirm = input("Do you want to execute these updates? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            logging.info("Transaction rolled back.")
            return

        for query, values, name in updates:
            cursor.execute(query, values)
            logging.info(f"Updated manufacturer: '{name}'")

        conn.commit()
        logging.info(f"Successfully updated {len(updates)} manufacturers.")

    except Error as e:
        logging.error(f"Database error: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()
