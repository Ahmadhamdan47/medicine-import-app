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
moph_codes = df_codes['MoPHCode'].tolist()

# Database connection
conn = pymysql.connect(host='localhost',
                       user='ommal_ahmad',
                       password='fISfGr^8q!_gUPMY',
                       db='ommal_medapiv2',
                       charset='utf8mb4',
                       cursorclass=pymysql.cursors.DictCursor)

try:
    with conn.cursor() as cursor:
        # Query to find matching drugs
        format_strings = ','.join(['%s'] * len(moph_codes))
        sql_query = f"""
            SELECT * FROM drug
            WHERE MoPHCode IN ({format_strings})
              AND NotMarketed = 0
              AND (form IS NULL OR form = '')
        """

        cursor.execute(sql_query, moph_codes)
        matching_drugs = cursor.fetchall()

    # Count matching drugs
    count_matching = len(matching_drugs)

    # Save full details to JSON
    with open('matching_drugs_details.json', 'w', encoding='utf-8') as details_file:
        json.dump(matching_drugs, details_file, default=decimal_default, ensure_ascii=False, indent=4)

    # Save only MoPHCodes to JSON
    matching_moph_codes = [drug['MoPHCode'] for drug in matching_drugs]
    with open('matching_drugs_mophcodes.json', 'w', encoding='utf-8') as codes_file:
        json.dump(matching_moph_codes, codes_file, ensure_ascii=False, indent=4)

finally:
    conn.close()