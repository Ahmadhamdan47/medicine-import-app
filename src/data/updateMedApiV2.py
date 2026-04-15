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
    print("MedAPI v2 Database Update Script")
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

        # Get current data from drug table
        print("\n📊 Fetching current drug data...")
        cursor.execute("""
            SELECT MoPHCode, DrugName, RegistrationNumber, Dosage, Presentation, 
                   Form, Agent, Manufacturer, Country, PublicPrice, Stratum, NotMarketed
            FROM drug
        """)
        current_data = {row['MoPHCode']: row for row in cursor.fetchall()}
        print(f"✅ Fetched {len(current_data)} records from database")

        # Prepare update lists
        update_drug_list = []
        update_not_marketed_list = []
        
        # Track changes by type
        field_changes = {
            'DrugName': defaultdict(list),
            'RegistrationNumber': defaultdict(list),
            'Dosage': defaultdict(list),
            'Presentation': defaultdict(list),
            'Form': defaultdict(list),
            'Agent': defaultdict(list),
            'Manufacturer': defaultdict(list),
            'Country': defaultdict(list),
            'PublicPrice': defaultdict(list),
            'Stratum': defaultdict(list),
            'NotMarketed': defaultdict(list)
        }
        
        file_moph_codes = set(file_data.keys())
        db_moph_codes = set(current_data.keys())

        # Process drugs in file - update their data
        for moph_code, file_record in file_data.items():
            if moph_code in current_data:
                db_record = current_data[moph_code]
                changes = {}
                
                # Helper function to safely compare values (handles None)
                def safe_str(value):
                    return str(value) if value is not None else ''
                
                # Check each field for changes
                db_drug_name = safe_str(db_record['DrugName'])
                file_drug_name = file_record.get('DrugName', '')
                if db_drug_name != file_drug_name:
                    changes['DrugName'] = file_drug_name
                    field_changes['DrugName'][f"{db_drug_name[:50]} → {file_drug_name[:50]}"].append(moph_code)
                
                db_reg_num = safe_str(db_record['RegistrationNumber'])
                file_reg_num = file_record.get('RegistrationNumber', '')
                if db_reg_num != file_reg_num:
                    changes['RegistrationNumber'] = file_reg_num
                    field_changes['RegistrationNumber'][f"{db_reg_num} → {file_reg_num}"].append(moph_code)
                
                db_dosage = safe_str(db_record['Dosage'])
                file_dosage = file_record.get('Dosage', '')
                if db_dosage != file_dosage:
                    changes['Dosage'] = file_dosage
                    field_changes['Dosage'][f"{db_dosage[:30]} → {file_dosage[:30]}"].append(moph_code)
                
                db_presentation = safe_str(db_record['Presentation'])
                file_presentation = file_record.get('Presentation', '')
                if db_presentation != file_presentation:
                    changes['Presentation'] = file_presentation
                    field_changes['Presentation'][f"{db_presentation[:30]} → {file_presentation[:30]}"].append(moph_code)
                
                db_form = safe_str(db_record['Form'])
                file_form = file_record.get('Form', '')
                if db_form != file_form:
                    changes['Form'] = file_form
                    field_changes['Form'][f"{db_form} → {file_form}"].append(moph_code)
                
                db_agent = safe_str(db_record['Agent'])
                file_agent = file_record.get('Agent', '')
                if db_agent != file_agent:
                    changes['Agent'] = file_agent
                    field_changes['Agent'][f"{db_agent[:40]} → {file_agent[:40]}"].append(moph_code)
                
                db_manufacturer = safe_str(db_record['Manufacturer'])
                file_manufacturer = file_record.get('Manufacturer', '')
                if db_manufacturer != file_manufacturer:
                    changes['Manufacturer'] = file_manufacturer
                    field_changes['Manufacturer'][f"{db_manufacturer[:40]} → {file_manufacturer[:40]}"].append(moph_code)
                
                db_country = safe_str(db_record['Country'])
                file_country = file_record.get('Country', '')
                if db_country != file_country:
                    changes['Country'] = file_country
                    field_changes['Country'][f"{db_country} → {file_country}"].append(moph_code)
                
                # PublicPrice comparison with precision handling
                db_price = float(db_record['PublicPrice'] or 0)
                file_price = float(file_record.get('PublicPrice', 0))
                if round(db_price, 6) != round(file_price, 6):
                    changes['PublicPrice'] = file_price
                    field_changes['PublicPrice'][f"{db_price} → {file_price}"].append(moph_code)
                
                db_stratum = safe_str(db_record['Stratum'])
                file_stratum = file_record.get('Stratum', '')
                if db_stratum != file_stratum:
                    changes['Stratum'] = file_stratum
                    field_changes['Stratum'][f"{db_stratum} → {file_stratum}"].append(moph_code)
                
                if changes:
                    update_drug_list.append((
                        changes.get('DrugName', safe_str(db_record['DrugName'])),
                        changes.get('RegistrationNumber', safe_str(db_record['RegistrationNumber'])),
                        changes.get('Dosage', safe_str(db_record['Dosage'])),
                        changes.get('Presentation', safe_str(db_record['Presentation'])),
                        changes.get('Form', safe_str(db_record['Form'])),
                        changes.get('Agent', safe_str(db_record['Agent'])),
                        changes.get('Manufacturer', safe_str(db_record['Manufacturer'])),
                        changes.get('Country', safe_str(db_record['Country'])),
                        changes.get('PublicPrice', float(db_record['PublicPrice'] or 0)),
                        changes.get('Stratum', safe_str(db_record['Stratum'])),
                        moph_code
                    ))

        # Process drugs NOT in file - mark as NotMarketed
        for moph_code, db_record in current_data.items():
            if moph_code not in file_moph_codes and int(db_record['NotMarketed'] or 0) == 0:
                update_not_marketed_list.append(moph_code)
                field_changes['NotMarketed']['0 → 1 (Not in file)'].append(moph_code)

        # Display preview
        print("\n" + "="*80)
        print("CHANGES PREVIEW")
        print("="*80)
        
        total_changes = len(update_drug_list) + len(update_not_marketed_list)
        print(f"\n📊 Total changes: {total_changes}")
        print(f"   - Drug updates: {len(update_drug_list)}")
        print(f"   - NotMarketed updates: {len(update_not_marketed_list)}")
        
        # Show detailed changes for each field
        for field, changes in field_changes.items():
            if changes:
                print(f"\n📝 {field.upper()} CHANGES: {sum(len(codes) for codes in changes.values())} total")
                for change, codes in sorted(changes.items()):
                    if len(codes) <= 10:
                        print(f"   {change}")
                        print(f"      Count: {len(codes)} | Codes: {', '.join(map(str, sorted(codes)))}")
                    else:
                        print(f"   {change}")
                        print(f"      Count: {len(codes)} | Sample codes: {', '.join(map(str, sorted(codes)[:10]))}...")

        print("\n" + "="*80)

        # Confirmation
        if not update_drug_list and not update_not_marketed_list:
            print("\n✅ No changes to commit. Database is up to date!")
            return

        confirm = input("\n⚠️  Do you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("\n❌ Transaction rolled back. No changes were made.")
            return

        # Execute updates
        print("\n🔄 Applying changes...")
        
        if update_drug_list:
            update_drug_query = """
                UPDATE drug 
                SET DrugName = %s, RegistrationNumber = %s, Dosage = %s, 
                    Presentation = %s, Form = %s, Agent = %s, Manufacturer = %s, 
                    Country = %s, PublicPrice = %s, Stratum = %s
                WHERE MoPHCode = %s
            """
            cursor.executemany(update_drug_query, update_drug_list)
            print(f"✅ Updated {len(update_drug_list)} drug records")
        
        if update_not_marketed_list:
            update_not_marketed_query = "UPDATE drug SET NotMarketed = 1 WHERE MoPHCode = %s"
            cursor.executemany(update_not_marketed_query, [(code,) for code in update_not_marketed_list])
            print(f"✅ Marked {len(update_not_marketed_list)} drugs as NotMarketed")

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
