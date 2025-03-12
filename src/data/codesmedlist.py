import pandas as pd
import pymysql
import json
from decimal import Decimal

# Function to convert Decimal to float for JSON serialization
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

# Load TSV file
df_codes = pd.read_csv('./codes.tsv', sep='\t')

# Ensure MoPHCode is integer type
df_codes['MoPHCode'] = pd.to_numeric(df_codes['MoPHCode'], errors='coerce').dropna().astype(int)
codes_list = df_codes['MoPHCode'].tolist()

# Database connection
conn = pymysql.connect(host='localhost',
                       user='ommal_oummal',
                       password='dMR2id57dviMJJnc',
                       db='ommal_medlist',
                       charset='utf8mb4',
                       cursorclass=pymysql.cursors.DictCursor)

try:
    with conn.cursor() as cursor:
        # Query to find matching medications
        format_strings = ','.join(['%s'] * len(codes_list))
        sql_query = f"""
            SELECT * FROM medications
            WHERE code IN ({format_strings})
              AND (form IS NULL OR form = '')
        """

        cursor.execute(sql_query, codes_list)
        matching_medications = cursor.fetchall()

    # Count matching medications
    count_matching = len(matching_medications)

    # Save full details to JSON
    with open('matching_medications_details.json', 'w', encoding='utf-8') as details_file:
        json.dump(matching_medications, details_file, default=decimal_default, ensure_ascii=False, indent=4)

    # Save only codes to JSON
    matching_codes = [med['code'] for med in matching_medications]
    with open('matching_medications_codes.json', 'w', encoding='utf-8') as codes_file:
        json.dump(matching_codes, codes_file, ensure_ascii=False, indent=4)

finally:
    conn.close()
