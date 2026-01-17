import csv
import mysql.connector
from mysql.connector import Error
import pandas as pd
from collections import defaultdict

def read_tsv(file_path):
    try:
        df = pd.read_csv(file_path, delimiter='\t', dtype=str, engine='python', encoding='utf-8').fillna('')
        # Clean column names
        df.columns = df.columns.str.strip()
        # Clean data entries
        df['code'] = pd.to_numeric(df['code'].str.strip(), errors='coerce').fillna(0).astype(int)
        df['agent'] = df['agent'].str.strip()
        df['manufacturer'] = df['manufacturer'].str.strip()
        df['country'] = df['country'].str.strip()
        # Drop ignored columns
        df.drop(['ResponsibleParty', 'ResponsiblePartyCountry'], axis=1, inplace=True, errors='ignore')
        return df.set_index('code').to_dict(orient='index')
    except Exception as e:
        print(f"Error reading TSV file: {e}")
        return {}

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

def main():
    tsv_file = input("Enter TSV file path (or press Enter for './Dec.tsv'): ").strip()
    if not tsv_file:
        tsv_file = './Dec.tsv'
    
    tsv_data = read_tsv(tsv_file)
    if not tsv_data:
        print("No data loaded from TSV file.")
        return

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current data from medications table
        cursor.execute("SELECT code, agent, manufacturer, country FROM medications")
        current_data = {row['code']: row for row in cursor.fetchall()}

        # Calculate updates
        update_agent_list = []
        update_manufacturer_list = []
        update_country_list = []

        # Track changes by field value for detailed preview
        agent_changes = defaultdict(list)
        manufacturer_changes = defaultdict(list)
        country_changes = defaultdict(list)

        for code, details in tsv_data.items():
            if code in current_data:
                current = current_data[code]
                
                # Check agent changes
                new_agent = details.get('agent', '')
                old_agent = current['agent'] or ''
                if new_agent != old_agent:
                    update_agent_list.append((new_agent, code))
                    agent_changes[f"{old_agent} → {new_agent}"].append(code)

                # Check manufacturer changes
                new_manufacturer = details.get('manufacturer', '')
                old_manufacturer = current['manufacturer'] or ''
                if new_manufacturer != old_manufacturer:
                    update_manufacturer_list.append((new_manufacturer, code))
                    manufacturer_changes[f"{old_manufacturer} → {new_manufacturer}"].append(code)

                # Check country changes
                new_country = details.get('country', '')
                old_country = current['country'] or ''
                if new_country != old_country:
                    update_country_list.append((new_country, code))
                    country_changes[f"{old_country} → {new_country}"].append(code)

        # Show detailed preview
        print("\n" + "="*80)
        print("CHANGES PREVIEW")
        print("="*80)

        # Agent changes
        print(f"\n📋 AGENT UPDATES: {len(update_agent_list)} total changes")
        if agent_changes:
            for change, codes in sorted(agent_changes.items()):
                print(f"\n  {change}")
                print(f"    Count: {len(codes)}")
                print(f"    Codes: {', '.join(map(str, sorted(codes)))}")
        else:
            print("  No agent changes detected.")

        # Manufacturer changes
        print(f"\n🏭 MANUFACTURER UPDATES: {len(update_manufacturer_list)} total changes")
        if manufacturer_changes:
            for change, codes in sorted(manufacturer_changes.items()):
                print(f"\n  {change}")
                print(f"    Count: {len(codes)}")
                print(f"    Codes: {', '.join(map(str, sorted(codes)))}")
        else:
            print("  No manufacturer changes detected.")

        # Country changes
        print(f"\n🌍 COUNTRY UPDATES: {len(update_country_list)} total changes")
        if country_changes:
            for change, codes in sorted(country_changes.items()):
                print(f"\n  {change}")
                print(f"    Count: {len(codes)}")
                print(f"    Codes: {', '.join(map(str, sorted(codes)))}")
        else:
            print("  No country changes detected.")

        print("\n" + "="*80)
        print(f"TOTAL CHANGES: {len(update_agent_list) + len(update_manufacturer_list) + len(update_country_list)}")
        print("="*80)

        # Confirmation
        if not (update_agent_list or update_manufacturer_list or update_country_list):
            print("\nNo changes to commit.")
            return

        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back. No changes were made.")
            return

        # Execute updates
        changes_made = 0
        
        if update_agent_list:
            update_agent_query = "UPDATE medications SET agent = %s WHERE code = %s"
            cursor.executemany(update_agent_query, update_agent_list)
            changes_made += len(update_agent_list)
            print(f"✓ Updated {len(update_agent_list)} agent records")

        if update_manufacturer_list:
            update_manufacturer_query = "UPDATE medications SET manufacturer = %s WHERE code = %s"
            cursor.executemany(update_manufacturer_query, update_manufacturer_list)
            changes_made += len(update_manufacturer_list)
            print(f"✓ Updated {len(update_manufacturer_list)} manufacturer records")

        if update_country_list:
            update_country_query = "UPDATE medications SET country = %s WHERE code = %s"
            cursor.executemany(update_country_query, update_country_list)
            changes_made += len(update_country_list)
            print(f"✓ Updated {len(update_country_list)} country records")

        conn.commit()
        print(f"\n✅ Successfully committed {changes_made} changes to the database!")

    except Error as e:
        print(f"\n❌ Database error: {e}")
        conn.rollback()
        print("Transaction rolled back. No changes were made.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        conn.rollback()
        print("Transaction rolled back. No changes were made.")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("\nDatabase connection closed.")

if __name__ == "__main__":
    main()
