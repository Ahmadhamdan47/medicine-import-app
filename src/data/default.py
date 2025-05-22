import pandas as pd
import mysql.connector
from mysql.connector import Error

def read_csv(file_path):
    try:
        df = pd.read_csv(file_path, dtype=str, engine='python', encoding='utf-8').fillna('')
        # Clean column names and data entries
        df.columns = df.columns.str.strip()
        
        # Convert numeric columns appropriately
        numeric_cols = ['MoPHCode', 'PublicPrice', 'SubsidyPercentage', 'PriceForeign']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col].str.strip(), errors='coerce').fillna(0)
        
        # Convert boolean-like columns
        bool_cols = ['isOTC', 'IsDouanes', 'Substitutable', 'NotMarketed']
        for col in bool_cols:
            if col in df.columns:
                df[col] = df[col].astype(str).str.strip().replace({'TRUE': 1, 'FALSE': 0, '': 0}).astype(int)
        
        return df.set_index('MoPHCode').to_dict(orient='index')
    except Exception as e:
        print(f"Error reading CSV file: {e}")
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

def prepare_value(value, col_type):
    if pd.isna(value) or value == '':
        return None
    
    # Handle boolean types
    if 'tinyint(1)' in str(col_type).lower():
        return int(bool(value))
    
    # Handle numeric types
    if 'int' in str(col_type).lower():
        return int(float(value)) if value else 0
    if 'decimal' in str(col_type).lower() or 'float' in str(col_type).lower() or 'double' in str(col_type).lower():
        return float(value) if value else 0.0
    
    # Default to string
    return str(value)

def main():
    csv_data = read_csv('./default.csv')

    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to the database.")
        return

    try:
        conn.autocommit = False  # Start transaction
        cursor = conn.cursor(dictionary=True)

        # Get current column types
        cursor.execute("SHOW COLUMNS FROM drug")
        column_info = {row['Field']: row['Type'] for row in cursor}
        
        # Skip DrugID column
        if 'DrugID' in column_info:
            del column_info['DrugID']
        
        # Get current data for comparison
        cursor.execute("SELECT * FROM drug")
        current_data = {row['MoPHCode']: row for row in cursor.fetchall()}

        # Prepare updates - only where changes exist
        updates = []
        for code, new_values in csv_data.items():
            if code in current_data:
                changed_fields = {}
                for col in column_info:
                    if col in new_values and col != 'DrugID':  # Skip DrugID
                        # Prepare the value for comparison and database insertion
                        db_val = current_data[code].get(col)
                        prepared_new_val = prepare_value(new_values[col], column_info[col])
                        
                        # Compare based on type
                        if db_val is None and prepared_new_val is None:
                            continue
                        elif db_val is None or prepared_new_val is None:
                            changed_fields[col] = prepared_new_val
                        elif isinstance(db_val, (int, float)):
                            if float(db_val) != float(prepared_new_val):
                                changed_fields[col] = prepared_new_val
                        else:
                            if str(db_val) != str(prepared_new_val):
                                changed_fields[col] = prepared_new_val
                
                if changed_fields:
                    updates.append((changed_fields, code))

        # Show preview
        print("\n===== Changes Preview =====")
        print(f"Total records with changes: {len(updates)}")
        if updates:
            print("\nSample changes (first 3 records):")
            for i, (changes, code) in enumerate(updates[:3]):
                print(f"\nMoPHCode: {code}")
                for col, val in changes.items():
                    print(f"  {col}: {current_data[code].get(col, '')} → {val}")

        # Confirmation
        confirm = input("\nDo you want to commit these changes? (yes/no): ").lower()
        if confirm != 'yes':
            conn.rollback()
            print("Transaction rolled back")
            return

        # Execute updates
        if updates:
            # Prepare the base update query
            update_query = "UPDATE drug SET "
            update_query += ", ".join([f"{col} = %s" for col in updates[0][0].keys()])
            update_query += " WHERE MoPHCode = %s"
            
            # Prepare values for executemany
            update_values = []
            for changes, code in updates:
                row_values = list(changes.values())
                row_values.append(code)
                update_values.append(tuple(row_values))
            
            cursor.executemany(update_query, update_values)
            print(f"\nExecuting bulk update with {len(update_values)} records")
            print(f"Sample query: {update_query % update_values[0]}")

        conn.commit()
        print(f"\nSuccessfully updated {cursor.rowcount} records")

    except Error as e:
        print(f"\nDatabase error: {e}")
        conn.rollback()
    except Exception as e:
        print(f"\nError: {e}")
        conn.rollback()
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    main()