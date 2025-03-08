const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Database connection configuration
const connectionConfig = {
  host: 'localhost',
  user: 'ommal_ahmad',
  database: 'ommal_medapiv2',
  password: 'fISfGr^8q!_gUPMY',
  port: 3306,
};


// Function to read and parse the TSV file
const readTSVFile = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const [MOPHCode, RouteLNDI] = lines[i].split('\t');
    if (MOPHCode && RouteLNDI) {
      result.push({ MOPHCode: MOPHCode.trim(), RouteLNDI: RouteLNDI.trim() });
    }
  }

  return result;
};

// Function to update the drug table in the database
const updateDrugRoutes = async (drugRoutes) => {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    for (const { MOPHCode, RouteLNDI } of drugRoutes) {
      await connection.execute(
        'UPDATE drug SET RouteLNDI = ? WHERE MOPHCode = ?',
        [RouteLNDI, MOPHCode]
      );
    }

    console.log('Drug routes updated successfully.');
  } catch (err) {
    console.error('Error updating drug routes:', err);
  } finally {
    await connection.end();
  }
};

// Main function to execute the script
const main = async () => {
    const filePath = path.join(__dirname, 'routelndi.tsv');
    const drugRoutes = readTSVFile(filePath);
    await updateDrugRoutes(drugRoutes);
};

main();