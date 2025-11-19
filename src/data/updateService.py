import csv
import mysql.connector
from mysql.connector import Error
import pandas as pd
from datetime import datetime

def read_tsv(file_path):
    try:
        df = pd.read_csv(file_path, delimiter='\t', dtype=str, engine='python', encoding='utf-8').fillna('')
        # Clean column names
        df.columns = df.columns.str.strip()
        
        # Map TSV columns to database columns
        column_mapping = {
            'code': 'MoPHCode',
            'public_price': 'PublicPrice', 
            'agent': 'Agent',
            'manufacturer': 'Manufacturer',
            'country': 'Country'
        }
        
        # Rename columns based on mapping
        for tsv_col, db_col in column_mapping.items():
            if tsv_col in df.columns:
                df = df.rename(columns={tsv_col: db_col})
        
        # Clean data entries
        if 'MoPHCode' in df.columns:
            df['MoPHCode'] = pd.to_numeric(df['MoPHCode'].str.strip(), errors='coerce').fillna(0).astype(int)
        if 'PublicPrice' in df.columns:
            df['PublicPrice'] = pd.to_numeric(df['PublicPrice'].str.strip(), errors='coerce').fillna(0.0).astype(float)
        
        # Clean string fields
        for col in ['Agent', 'Manufacturer', 'Country']:
            if col in df.columns:
                df[col] = df[col].str.strip()
        
        return df.set_index('MoPHCode').to_dict(orient='index')
    except Exception as e:
        print(f"Error reading TSV file: {e}")
        return {}

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

def safe_str_compare(val1, val2):
    """Safely compare string values, treating None and empty string as equivalent"""
    def normalize(val):
        return str(val).strip() if val is not None else ''
    return normalize(val1) == normalize(val2)

def format_change_log(changes):
    """Format changes for display"""
    if not changes:
        return "No changes"
    
    log_lines = []
    for change in changes:
        moph_code = change['MoPHCode']
        field = change['Field']
        old_val = change['OldValue']
        new_val = change['NewValue']
        log_lines.append(f"  MoPHCode {moph_code}: {field} '{old_val}' → '{new_val}'")
    
    return '\n'.join(log_lines)

def main():
    tsv_data = read_tsv('./sep.tsv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current data with all relevant fields
        cursor.execute("""
            SELECT MoPHCode, PublicPrice, NotMarketed, Agent, Manufacturer, Country 
            FROM drug 
            WHERE MoPHCode IS NOT NULL
        """)
        current_data = {row['MoPHCode']: row for row in cursor.fetchall()}

        # Track all changes
        all_changes = []
        update_operations = []

        for code, details in tsv_data.items():
            if code in current_data:
                current_row = current_data[code]
                row_changes = []
                
                # Check PublicPrice changes
                if 'PublicPrice' in details:
                    current_price = float(current_row['PublicPrice'] or 0)
                    new_price = details['PublicPrice']
                    if round(current_price, 6) != round(new_price, 6):
                        row_changes.append({
                            'MoPHCode': code,
                            'Field': 'PublicPrice',
                            'OldValue': current_price,
                            'NewValue': new_price,
                            'UpdateType': 'price'
                        })
                
                # Check Agent changes
                if 'Agent' in details:
                    current_agent = current_row['Agent'] or ''
                    new_agent = details['Agent'] or ''
                    if not safe_str_compare(current_agent, new_agent):
                        row_changes.append({
                            'MoPHCode': code,
                            'Field': 'Agent',
                            'OldValue': current_agent,
                            'NewValue': new_agent,
                            'UpdateType': 'agent'
                        })
                
                # Check Manufacturer changes
                if 'Manufacturer' in details:
                    current_manufacturer = current_row['Manufacturer'] or ''
                    new_manufacturer = details['Manufacturer'] or ''
                    if not safe_str_compare(current_manufacturer, new_manufacturer):
                        row_changes.append({
                            'MoPHCode': code,
                            'Field': 'Manufacturer',
                            'OldValue': current_manufacturer,
                            'NewValue': new_manufacturer,
                            'UpdateType': 'manufacturer'
                        })
                
                # Check Country changes
                if 'Country' in details:
                    current_country = current_row['Country'] or ''
                    new_country = details['Country'] or ''
                    if not safe_str_compare(current_country, new_country):
                        row_changes.append({
                            'MoPHCode': code,
                            'Field': 'Country',
                            'OldValue': current_country,
                            'NewValue': new_country,
                            'UpdateType': 'country'
                        })
                
                # Check NotMarketed changes
                if int(current_row['NotMarketed']) == 1:
                    row_changes.append({
                        'MoPHCode': code,
                        'Field': 'NotMarketed',
                        'OldValue': 1,
                        'NewValue': 0,
                        'UpdateType': 'not_marketed'
                    })
                
                # Add changes to tracking lists
                all_changes.extend(row_changes)
                for change in row_changes:
                    update_operations.append(change)

        # Group changes by type for display
        price_changes = [c for c in all_changes if c['UpdateType'] == 'price']
        agent_changes = [c for c in all_changes if c['UpdateType'] == 'agent']
        manufacturer_changes = [c for c in all_changes if c['UpdateType'] == 'manufacturer']
        country_changes = [c for c in all_changes if c['UpdateType'] == 'country']
        not_marketed_changes = [c for c in all_changes if c['UpdateType'] == 'not_marketed']

        # Show detailed preview
        print("\n" + "="*60)
        print("CHANGES PREVIEW - BEFORE COMMIT")
        print("="*60)
        
        print(f"\n📊 SUMMARY:")
        print(f"  PublicPrice updates: {len(price_changes)}")
        print(f"  Agent updates: {len(agent_changes)}")
        print(f"  Manufacturer updates: {len(manufacturer_changes)}")
        print(f"  Country updates: {len(country_changes)}")
        print(f"  NotMarketed changes: {len(not_marketed_changes)}")
        print(f"  Total changes: {len(all_changes)}")

        if price_changes:
            print(f"\n💰 PUBLICPRICE CHANGES ({len(price_changes)}):")
            print(format_change_log(price_changes))

        if agent_changes:
            print(f"\n🏢 AGENT CHANGES ({len(agent_changes)}):")
            print(format_change_log(agent_changes))

        if manufacturer_changes:
            print(f"\n🏭 MANUFACTURER CHANGES ({len(manufacturer_changes)}):")
            print(format_change_log(manufacturer_changes))

        if country_changes:
            print(f"\n🌍 COUNTRY CHANGES ({len(country_changes)}):")
            print(format_change_log(country_changes))

        if not_marketed_changes:
            print(f"\n✅ NOTMARKETED CHANGES ({len(not_marketed_changes)}):")
            print(format_change_log(not_marketed_changes))

        if not all_changes:
            print("\n✨ No changes detected. Database is already up to date.")
            return

        # Confirmation
        print("\n" + "="*60)
        confirm = input(f"Do you want to commit these {len(all_changes)} changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back - no changes made.")
            return

        # Execute updates
        total_updated_rows = 0
        
        # Update PublicPrice
        if price_changes:
            price_updates = [(c['NewValue'], c['MoPHCode']) for c in price_changes]
            cursor.executemany("UPDATE drug SET PublicPrice = %s WHERE MoPHCode = %s", price_updates)
            total_updated_rows += cursor.rowcount

        # Update Agent
        if agent_changes:
            agent_updates = [(c['NewValue'], c['MoPHCode']) for c in agent_changes]
            cursor.executemany("UPDATE drug SET Agent = %s WHERE MoPHCode = %s", agent_updates)
            total_updated_rows += cursor.rowcount

        # Update Manufacturer
        if manufacturer_changes:
            manufacturer_updates = [(c['NewValue'], c['MoPHCode']) for c in manufacturer_changes]
            cursor.executemany("UPDATE drug SET Manufacturer = %s WHERE MoPHCode = %s", manufacturer_updates)
            total_updated_rows += cursor.rowcount

        # Update Country
        if country_changes:
            country_updates = [(c['NewValue'], c['MoPHCode']) for c in country_changes]
            cursor.executemany("UPDATE drug SET Country = %s WHERE MoPHCode = %s", country_updates)
            total_updated_rows += cursor.rowcount

        # Update NotMarketed
        if not_marketed_changes:
            not_marketed_updates = [(c['NewValue'], c['MoPHCode']) for c in not_marketed_changes]
            cursor.executemany("UPDATE drug SET NotMarketed = %s WHERE MoPHCode = %s", not_marketed_updates)
            total_updated_rows += cursor.rowcount

        conn.commit()
        
        # Show post-commit summary
        print("\n" + "="*60)
        print("CHANGES COMMITTED SUCCESSFULLY")
        print("="*60)
        print(f"✅ Total database rows updated: {total_updated_rows}")
        print(f"📅 Commit timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Verify changes by re-querying affected records
        if all_changes:
            affected_codes = list(set([c['MoPHCode'] for c in all_changes]))
            placeholders = ','.join(['%s'] * len(affected_codes))
            cursor.execute(f"""
                SELECT MoPHCode, PublicPrice, Agent, Manufacturer, Country, NotMarketed 
                FROM drug 
                WHERE MoPHCode IN ({placeholders})
                ORDER BY MoPHCode
            """, affected_codes)
            
            updated_records = cursor.fetchall()
            
            print(f"\n🔍 VERIFICATION - POST COMMIT STATE:")
            print(f"  Retrieved {len(updated_records)} updated records for verification")
            
            # Show sample of updated records
            sample_size = min(5, len(updated_records))
            if sample_size > 0:
                print(f"\n📋 Sample of updated records (showing first {sample_size}):")
                for i, record in enumerate(updated_records[:sample_size]):
                    print(f"  MoPHCode {record['MoPHCode']}: Price={record['PublicPrice']}, "
                          f"Agent='{record['Agent']}', Manufacturer='{record['Manufacturer']}', "
                          f"Country='{record['Country']}', NotMarketed={record['NotMarketed']}")

        print("\n" + "="*60)

    except Error as e:
        print(f"❌ Database error: {e}")
        conn.rollback()
        print("Transaction rolled back due to error.")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        conn.rollback()
        print("Transaction rolled back due to unexpected error.")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    main()