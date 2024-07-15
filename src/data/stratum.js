const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { Sequelize } = require('sequelize');

// Define your Sequelize instance with custom timeout settings
const sequelize = new Sequelize('ommal_medapiv2',  'root', "", {
    host: 'localhost',
    dialect: 'mysql', // or 'postgres', 'sqlite', 'mariadb', 'mssql'
    pool: {
      max: 5,
      min: 0,
      acquire: 30000000, // 30 seconds
      idle: 10000000
    },
    dialectOptions: {
      connectTimeout: 60000000 // 60 seconds
    }
  });
  

const Drug = sequelize.define('Drug', {
  MoPHCode: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  Stratum: {
    type: Sequelize.STRING,
    allowNull: true, // Assuming Stratum can be nullable initially
  },
  // Add other fields as necessary
}, {
  tableName: 'drug', // Specify the table name if different
  timestamps: false,  // Disable timestamps if not used
});

// Function to check and update the drug stratum
const checkAndUpdateDrugStratum = async (MoPHCode, Stratum) => {
  try {
    const drug = await Drug.findOne({ where: { MoPHCode } });

    if (drug) {
      await drug.update({ Stratum });
    } else {
      console.error(`MoPHCode: ${MoPHCode} not found in the database.`);
    }
  } catch (error) {
    console.error(`Error updating drug ${MoPHCode}:`, error);
    throw error;
  }
};

const updateDrugStratumsFromCSV = async () => {
const filePath = path.join(__dirname,  'Stratum.csv'); // Path to the uploaded CSV file

  const readCSV = new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        const MoPHCode = row['MoPHCode'];
        const Stratum = row['Stratum'];

        if (Stratum && MoPHCode) {
          try {
            await checkAndUpdateDrugStratum(MoPHCode, Stratum);
            console.log(`Updated: ${MoPHCode} with Stratum: ${Stratum}`);
          } catch (error) {
            console.error(`Failed to update: ${MoPHCode}`, error);
          }
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  await readCSV;
};

// Run the script
updateDrugStratumsFromCSV()
  .then(() => {
    console.log('Drug stratums updated successfully.');
  })
  .catch(err => {
    console.error('Error updating drug stratums:', err);
  });
