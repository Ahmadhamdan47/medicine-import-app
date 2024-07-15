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
  ProductType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // Add other fields as necessary
}, {
  tableName: 'drug', // Specify the table name if different
  timestamps: false,  // Disable timestamps if not used
});

// Function to check and update the drug type
const checkAndUpdateDrugType = async (MoPHCode, ProductType) => {
  try {
    const drug = await Drug.findOne({ where: { MoPHCode } });

    if (drug) {
      await drug.update({ ProductType });
    } else {
      await Drug.create({ MoPHCode, ProductType });
    }
  } catch (error) {
    console.error(`Error updating drug ${MoPHCode}:`, error);
    throw error;
  }
};

const updateDrugTypesFromCSV = async () => {
  const filePath = path.join(__dirname, 'ProductType.csv'); // Path to the uploaded CSV file

  const readCSV = new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        const MoPHCode = row['MoPHCode'];
        const ProductType = row['ProductType'] === 'B' ? 'Brand' : row['ProductType'] === 'G' ? 'Generic' : undefined;

        if (ProductType && MoPHCode) {
          try {
            await checkAndUpdateDrugType(MoPHCode, ProductType);
            console.log(`Updated: ${MoPHCode} to ${ProductType}`);
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
updateDrugTypesFromCSV()
  .then(() => {
    console.log('Drug types updated successfully.');
  })
  .catch(err => {
    console.error('Error updating drug types:', err);
  });
