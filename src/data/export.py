import mysql.connector
from mysql.connector import Error
import pandas as pd


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


def read_csv(file_path):
    try:
        try:
            df = pd.read_csv(file_path, dtype=str, encoding='utf-8').fillna('')
        except UnicodeDecodeError:
            print("Warning: UTF-8 encoding failed. Trying ISO-8859-1.")
            df = pd.read_csv(file_path, dtype=str, encoding='ISO-8859-1').fillna('')
        df.columns = df.columns.str.strip()
        return df['MoPHCode'].drop_duplicates().tolist()
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return []
    try:
        df = pd.read_csv(file_path, dtype=str, encoding='utf-8').fillna('')
        df.columns = df.columns.str.strip()
        return df['MoPHCode'].drop_duplicates().tolist()
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return []


def format_decimal(value):
    if value is None:
        return ''
    try:
        value = float(value)
        if value.is_integer():
            return str(int(value))
        return str(value)
    except ValueError:
        return str(value)


def export_dosage_to_excel():
    moph_codes = read_csv('./Dosage.csv')
    if not moph_codes:
        print("No MoPHCodes found in CSV. Exiting.")
        return

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        cursor = conn.cursor(dictionary=True)

        query = f"""
        SELECT d.MoPHCode, d.DrugName, ds.Numerator1, ds.Numerator1Unit, ds.Denominator1, ds.Denominator1Unit, 
               ds.Numerator2, ds.Numerator2Unit, ds.Denominator2, ds.Denominator2Unit,
               ds.Numerator3, ds.Numerator3Unit, ds.Denominator3, ds.Denominator3Unit
        FROM drug d
        JOIN dosage ds ON d.DrugID = ds.DrugID
        WHERE d.MoPHCode IN ({', '.join(['%s'] * len(moph_codes))});
        """
        cursor.execute(query, moph_codes)
        results = cursor.fetchall()

        # Formatting the data
        formatted_results = []
        for row in results:
            formatted_row = {key: format_decimal(value) if 'Numerator' in key or 'Denominator' in key else value for key, value in row.items()}
            formatted_results.append(formatted_row)

        # Convert to DataFrame
        df = pd.DataFrame(formatted_results)

        # Excel writer with formatting
        output_file = "dosage_export.xlsx"
        with pd.ExcelWriter(output_file, engine='xlsxwriter') as writer:
            df.to_excel(writer, index=False, sheet_name='Dosage Data')

            # Get the xlsxwriter workbook and worksheet objects
            workbook = writer.book
            worksheet = writer.sheets['Dosage Data']

            # Add a filter to the header row
            worksheet.autofilter(0, 0, len(df), len(df.columns) - 1)

            # Format for numbers without trailing zeros
            decimal_format = workbook.add_format({'num_format': '#,##0.##'})
            for col_num, value in enumerate(df.columns):
                if 'Numerator' in value or 'Denominator' in value:
                    worksheet.set_column(col_num, col_num, 12, decimal_format)
                else:
                    worksheet.set_column(col_num, col_num, 20)

        print(f"Exported data to {output_file} with filtering and formatting.")

    except Error as e:
        print(f"Database error: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


if __name__ == "__main__":
    export_dosage_to_excel()
