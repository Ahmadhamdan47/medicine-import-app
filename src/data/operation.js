const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');

const filePath = path.join(__dirname, 'operations.tsv');

// Function to add a new operation
const addOperation = async (operationData, categoryPricingData) => {
  try {
    const response = await axios.post('http://localhost:8066/hospitalization/operations', {
      operationData,
      categoryPricingData,
    });
    console.log(`Successfully added operation with code ${operationData.Code}`);
  } catch (error) {
    console.error(`Error adding operation with code ${operationData.Code}:`, error);
  }
};

// Read and process the TSV file
const processFile = () => {
  fs.createReadStream(filePath)
    .pipe(csv({ separator: '\t' }))
    .on('data', async (row) => {
      const code = row.Code?.trim().toUpperCase();
      if (!code || existingCodes.has(code)) return;
    
      // ✅ Clean and validate Anesthetic before using it
      const rawAnesthetic = row.Anesthetic?.trim()?.charAt(0).toUpperCase();
      const anesthetic = (rawAnesthetic === 'L' || rawAnesthetic === 'G') ? rawAnesthetic : 'L';
      const operationData = {
        Code: row.Code,
        Name: row.Name,
        systemChar: row.SystemChar,
        Anesthetic: anesthetic,
        LOS: parseInt(row.LOS, 10),
      };

      const categoryPricingData = {
        FirstSurgeon: parseFloat(row.FirstSurgeon),
        FirstAnesthist: parseFloat(row.FirstAnesthist),
        FirstConsultant: parseFloat(row.FirstConsultant),
        FirstHospital1: parseFloat(row.FirstHospital1),
        FirstHospital2: parseFloat(row.FirstHospital2),
        FirstHospital3: parseFloat(row.FirstHospital3),
        FirstCategory1: parseFloat(row.FirstCategory1),
        FirstCategory2: parseFloat(row.FirstCategory2),
        FirstCategory3: parseFloat(row.FirstCategory3),
        SecondSurgeon: parseFloat(row.SecondSurgeon),
        SecondAnesthist: parseFloat(row.SecondAnesthist),
        SecondConsultant: parseFloat(row.SecondConsultant),
        SecondHospital1: parseFloat(row.SecondHospital1),
        SecondHospital2: parseFloat(row.SecondHospital2),
        SecondHospital3: parseFloat(row.SecondHospital3),
        SecondCategory1: parseFloat(row.SecondCategory1),
        SecondCategory2: parseFloat(row.SecondCategory2),
        SecondCategory3: parseFloat(row.SecondCategory3),
      };

      // Add the operation and category pricing data
      await addOperation(operationData, categoryPricingData);
    })
    .on('end', () => {
      console.log('File processing completed.');
    });
};

processFile();
