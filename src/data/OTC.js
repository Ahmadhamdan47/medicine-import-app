const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { Sequelize } = require('sequelize');

// Reuse the existing Sequelize instance and Drug model definition
const sequelize = new Sequelize('ommal_medapiv2', 'root', "", {
  host: 'localhost',
  dialect: 'mysql',
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



// Function to update the isOTC status
const Drug = sequelize.define('Drug', {
    MoPHCode: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    isOTC: {
      type: Sequelize.INTEGER, // Adjusted to INTEGER to match tinyint(1)
      allowNull: false,
      defaultValue: 0, // Use 0 as the default value, representing false
    },
    // Include other fields as necessary
  }, {
    tableName: 'drug',
    timestamps: false,
  });
  
  // Function to update the isOTC status
  const updateDrugOTCStatus = async (MoPHCode) => {
    try {
      const drug = await Drug.findOne({ where: { MoPHCode } });
  
      if (drug) {
        await drug.update({ isOTC: 1 }); // Use 1 to represent true
        console.log(`Updated: ${MoPHCode} to isOTC: true`);
      } else {
        console.error(`MoPHCode: ${MoPHCode} not found in the database.`);
      }
    } catch (error) {
      console.error(`Error updating isOTC status for ${MoPHCode}:`, error);
      throw error;
    }
  };
const updateOTCStatusFromCSV = async () => {
  const filePath = path.join(__dirname, 'OTC.csv'); // Path to the OTC CSV file

  const readCSV = new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        const MoPHCode = row['MoPHCode'];
        if (MoPHCode) {
          try {
            await updateDrugOTCStatus(MoPHCode);
          } catch (error) {
            console.error(`Failed to update isOTC status for: ${MoPHCode}`, error);
          }
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  await readCSV;
};

// Run the script
updateOTCStatusFromCSV()
  .then(() => {
    console.log('OTC status updated successfully.');
  })
  .catch(err => {
    console.error('Error updating OTC status:', err);
  });