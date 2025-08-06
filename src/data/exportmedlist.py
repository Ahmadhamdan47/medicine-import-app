import mysql.connector
import pandas as pd

codes = [12179, 12182, 12180, 12178, 11144, 12176, 12181, 12213, 12183, 12184, 12203, 12198, 11496, 12191, 12215, 12195, 12185, 12186, 12172, 12173, 12174, 12175, 12187, 12190, 12214, 12171, 103, 12194, 12216, 12217, 12200, 12212, 12208, 6007, 6008, 12177, 12197, 12209, 12199, 12188, 12189, 12196, 12193, 12210, 12211, 12207, 9887, 9888, 12201, 12206, 12202, 11732, 12204, 12205, 12192, 402]

conn = mysql.connector.connect(
    host='localhost',
    user='ommal_oummal',
    password='dMR2id57dviMJJnc',
    database='ommal_medlist'
)
query = f"SELECT * FROM medications WHERE code IN ({','.join(['%s'] * len(codes))})"
df = pd.read_sql(query, conn, params=tuple(codes))

# Optional: sort by code for convenience
df = df.sort_values('code')

# Export to CSV with column headers
df.to_csv('inserted_medications.csv', index=False, encoding='utf-8')

print("Exported inserted medications to inserted_medications.csv")

conn.close()
