from sqlalchemy import create_engine, text
import pandas as pd
import logging

# Create the database engine
engine = create_engine('mysql+pymysql://root:@localhost:3306/ommal_medapiv2')

# Read the data from the database into a pandas DataFrame
df = pd.read_sql('SELECT * FROM atc_code', engine)
print("Initial data fetched from database:")
print(df.head())

# Remove leading and trailing whitespaces from the 'Code' column
df['Code'] = df['Code'].str.strip()

# Set up logging
logging.basicConfig(level=logging.INFO)

# Update the 'Code' column in the database
try:
    with engine.begin() as connection:
        for i in df.index:
            result = connection.execute(
                text("UPDATE atc_code SET Code = :code WHERE ATC_ID = :ATC_ID"), 
                {'code': df.at[i, 'Code'], 'ATC_ID': df.at[i, 'ATC_ID']}
            )
            if result.rowcount == 0:
                logging.warning(f"No rows updated for ATC_ID {df.at[i, 'ATC_ID']}")
            else:
                logging.info(f"Updated ATC_ID {df.at[i, 'ATC_ID']}")
except Exception as e:
    logging.error(f"An error occurred: {e}")

# Verify the changes by re-reading the data
df_updated = pd.read_sql('SELECT * FROM atc_code', engine)
print("Updated data fetched from database:")
print(df_updated.head())
