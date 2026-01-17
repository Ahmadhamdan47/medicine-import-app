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
        cursor.execute("SELECT code, agent FROM medications")
        current_data = {row['code']: row for row in cursor.fetchall()}

        # Calculate updates
        update_agent_list = []

        # Track changes by field value for detailed preview
        agent_changes = defaultdict(list)

        for code, details in tsv_data.items():
            if code in current_data:
                current = current_data[code]
                
                # Check agent changes
                new_agent = details.get('agent', '')
                old_agent = current['agent'] or ''
                if new_agent != old_agent:
                    update_agent_list.append((new_agent, code))
                    agent_changes[f"{old_agent} → {new_agent}"].append(code)

        # Show detailed preview
        print("\n" + "="*80)
        print("AGENT CHANGES PREVIEW")
        print("="*80)

        print(f"\n📋 AGENT UPDATES: {len(update_agent_list)} total changes")
        if agent_changes:
            for change, codes in sorted(agent_changes.items()):
                print(f"\n  {change}")
                print(f"    Count: {len(codes)}")
                print(f"    Codes: {', '.join(map(str, sorted(codes)))}")
        else:
            print("  No agent changes detected.")

        print("\n" + "="*80)

        # Confirmation
        if not update_agent_list:
            print("\nNo changes to commit.")
            return

        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back. No changes were made.")
            return

        # Execute updates
        update_agent_query = "UPDATE medications SET agent = %s WHERE code = %s"
        cursor.executemany(update_agent_query, update_agent_list)
        
        conn.commit()
        print(f"\n✅ Successfully committed {len(update_agent_list)} agent changes to the database!")

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
