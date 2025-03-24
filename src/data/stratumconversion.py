import mysql.connector
from mysql.connector import Error
import csv
from decimal import Decimal

# Database configuration
config = {
    'user': 'ommal_ahmad',
    'password': 'fISfGr^8q!_gUPMY',
    'host': 'localhost',
    'database': 'ommal_medapiv2'
}

# CSV files and their corresponding shipping terms
csv_files = [
    ('FOB.csv', 'FOB'),
    ('Local.csv', 'Local'),
    ('CIF.csv', 'CIF')
]

def parse_csv(file_path, shipping_term):
    data = []
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # Handle different column names for LBP equivalent
            lbp_equivalent = Decimal(row['LBP_Equivalent']) if 'LBP_Equivalent' in row else None
            
            data.append((
                shipping_term,
                row['Currency'],
                Decimal(row['Rate']),
                lbp_equivalent,
                Decimal(row['(E2)']),
                Decimal(row['(E1)']),
                Decimal(row['(D)']),
                Decimal(row['(C)']),
                Decimal(row['(B)']),
                Decimal(row['(A2)']),
                Decimal(row['(A1)'])
            ))
    return data

try:
    # Connect to MySQL
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor()

    # SQL insert statement
    insert_query = """
    INSERT INTO stratum_conversion 
    (shipping_term, currency, rate, lbp_equivalent, e2, e1, d, c, b, a2, a1)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    # Process each CSV file
    for file_name, shipping_term in csv_files:
        csv_data = parse_csv(file_name, shipping_term)
        
        if csv_data:
            cursor.executemany(insert_query, csv_data)
            connection.commit()
            print(f"Inserted {len(csv_data)} rows from {file_name}")
        else:
            print(f"No data found in {file_name}")

    print("\nAll data imported successfully!")

except Error as e:
    print(f"Error: {e}")
    connection.rollback()

finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
        print("Database connection closed")