import pandas as pd
import pymysql
import json

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

    # Save results to JSON
    result = {
        "count": count_matching,
        "matching_drugs": matching_drugs
    }

    with open('matching_drugs.json', 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, ensure_ascii=False, indent=4)

finally:
    conn.close()