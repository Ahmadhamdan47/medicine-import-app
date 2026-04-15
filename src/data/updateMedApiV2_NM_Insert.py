import csv
import mysql.connector
from mysql.connector import Error
import pandas as pd
from collections import defaultdict
import os

def read_file(file_path):
    """Read CSV or TSV file and return data dictionary"""
    try:
        # Determine delimiter based on file extension
        if file_path.endswith('.tsv'):
            delimiter = '\t'
        else:
            delimiter = ','
        
        df = pd.read_csv(file_path, delimiter=delimiter, dtype=str, engine='python', encoding='utf-8').fillna('')
        
        # Clean column names
        df.columns = df.columns.str.strip()
        
        # Clean and convert data
        df['MoPHCode'] = pd.to_numeric(df['MoPHCode'].str.strip(), errors='coerce').fillna(0).astype(int)
        df['PublicPrice'] = pd.to_numeric(df['PublicPrice'].str.strip(), errors='coerce').fillna(0.0).astype(float)
        
        # Strip whitespace from string columns
        string_columns = ['RegistrationNumber', 'DrugName', 'Dosage', 'Presentation', 
                         'Form', 'Agent', 'Manufacturer', 'Country', 'Stratum']
        for col in string_columns:
            if col in df.columns:
                df[col] = df[col].str.strip()
        
        return df.set_index('MoPHCode').to_dict(orient='index')
    except Exception as e:
        print(f"Error reading file: {e}")
        return {}

def get_db_connection():
    """Establish connection to medapiv2 database"""
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
    print("\n" + "="*80)
    print("MedAPI v2 - NotMarketed & Insert New Drugs Script")
    print("="*80)
    
    # Get input file
    file_path = input("\nEnter file path (or press Enter for './aprv2.csv'): ").strip()
    if not file_path:
        file_path = './aprv2.csv'
    
    if not os.path.exists(file_path):
        print(f"\n❌ Error: File '{file_path}' not found.")
        return
    
    # Read data from file
    print(f"\n📂 Reading data from {file_path}...")
    file_data = read_file(file_path)
    
    if not file_data:
        print("❌ No data loaded from file.")
        return
    
    print(f"✅ Loaded {len(file_data)} records from file")
    
    # Connect to database
    print("\n🔌 Connecting to database...")
    conn = get_db_connection()
    if conn is None:
        print("❌ Failed to connect to the database.")
        return
    
    print("✅ Connected to ommal_medapiv2 database")

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current MoPHCodes and NotMarketed status from database
        print("\n📊 Fetching drug codes from database...")
        cursor.execute("SELECT MoPHCode, NotMarketed FROM drug")
        db_records = cursor.fetchall()
        current_data = {row['MoPHCode']: row for row in db_records}
        print(f"✅ Fetched {len(current_data)} records from database")

        # Prepare lists
        update_not_marketed_list = []
        insert_drug_list = []
        
        file_moph_codes = set(file_data.keys())
        db_moph_codes = set(current_data.keys())

        # Find drugs to mark as NotMarketed (in DB but not in file)
        print("\n🔍 Checking for drugs to mark as NotMarketed...")
        for moph_code in db_moph_codes:
            if moph_code not in file_moph_codes:
                if int(current_data[moph_code]['NotMarketed'] or 0) == 0:
                    update_not_marketed_list.append(moph_code)

        # Find new drugs to insert (in file but not in DB)
        print("🔍 Checking for new drugs to insert...")
        for moph_code in file_moph_codes:
            if moph_code not in db_moph_codes:
                record = file_data[moph_code]
                insert_drug_list.append((
                    moph_code,
                    record.get('RegistrationNumber', ''),
                    record.get('DrugName', ''),
                    record.get('Dosage', ''),
                    record.get('Presentation', ''),
                    record.get('Form', ''),
                    record.get('Agent', ''),
                    record.get('Manufacturer', ''),
                    record.get('Country', ''),
                    record.get('PublicPrice', 0),
                    record.get('Stratum', '')
                ))

        # Display preview
        print("\n" + "="*80)
        print("CHANGES PREVIEW")
        print("="*80)
        
        total_changes = len(update_not_marketed_list) + len(insert_drug_list)
        print(f"\n📊 Total changes: {total_changes}")
        print(f"   - NotMarketed updates: {len(update_not_marketed_list)}")
        print(f"   - New drugs to insert: {len(insert_drug_list)}")
        
        # Show NotMarketed details
        if update_not_marketed_list:
            print(f"\n📝 DRUGS TO MARK AS NOT MARKETED ({len(update_not_marketed_list)} drugs):")
            if len(update_not_marketed_list) <= 20:
                print(f"   Codes: {', '.join(map(str, sorted(update_not_marketed_list)))}")
            else:
                print(f"   Sample codes: {', '.join(map(str, sorted(update_not_marketed_list)[:20]))}...")
        
        # Show insertion details
        if insert_drug_list:
            print(f"\n📝 NEW DRUGS TO INSERT ({len(insert_drug_list)} drugs):")
            if len(insert_drug_list) <= 10:
                for drug in insert_drug_list[:10]:
                    print(f"   Code {drug[0]}: {drug[2]} - {drug[6]} - {drug[7]}")
            else:
                for drug in insert_drug_list[:10]:
                    print(f"   Code {drug[0]}: {drug[2]} - {drug[6]} - {drug[7]}")
                print(f"   ... and {len(insert_drug_list) - 10} more")

        print("\n" + "="*80)

        # Confirmation
        if not update_not_marketed_list and not insert_drug_list:
            print("\n✅ No changes to commit. Database is up to date!")
            return

        confirm = input("\n⚠️  Do you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("\n❌ Transaction rolled back. No changes were made.")
            return

        # Execute updates
        print("\n🔄 Applying changes...")
        
        if update_not_marketed_list:
            update_not_marketed_query = "UPDATE drug SET NotMarketed = 1 WHERE MoPHCode = %s"
            cursor.executemany(update_not_marketed_query, [(code,) for code in update_not_marketed_list])
            print(f"✅ Marked {len(update_not_marketed_list)} drugs as NotMarketed")
        
        if insert_drug_list:
            insert_drug_query = """
                INSERT INTO drug 
                (MoPHCode, RegistrationNumber, DrugName, Dosage, Presentation, 
                 Form, Agent, Manufacturer, Country, PublicPrice, Stratum, NotMarketed)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 0)
            """
            cursor.executemany(insert_drug_query, insert_drug_list)
            print(f"✅ Inserted {len(insert_drug_list)} new drugs")

        conn.commit()
        print(f"\n🎉 Successfully committed all changes to the database!")
        print(f"📊 Total records affected: {total_changes}")

    except Error as e:
        print(f"\n❌ Database error: {e}")
        conn.rollback()
        print("❌ Transaction rolled back. No changes were made.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        conn.rollback()
        print("❌ Transaction rolled back. No changes were made.")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("\n🔌 Database connection closed.")

if __name__ == "__main__":
    main()
