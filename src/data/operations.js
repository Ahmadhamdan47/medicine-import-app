const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const readline = require('readline');
const axios = require('axios');

const filePath = path.join(__dirname, 'operations-new.tsv');

let existingCodes = new Set();
let newOperations = [];

// Load existing operations
const loadExistingOperations = async () => {
  try {
    const response = await axios.get('https://apiv2.medleb.org/hospitalization/operations/');
    existingCodes = new Set(response.data.map((op) => op.Code));
    console.log(`🔍 Loaded ${existingCodes.size} existing operations.`);
  } catch (error) {
    console.error('❌ Failed to fetch existing operations:', error.message);
    process.exit(1);
  }
};

// Collect new operations from TSV
const previewFile = async () => {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv({ separator: '\t' }))
        .on('data', (row) => {
          const code = row.Code?.trim().toUpperCase();
          if (!code || existingCodes.has(code)) return;
  
          const operationData = {
            Code: code,
            Name: row.Name,
            systemChar: row.SystemChar,
            Anesthetic: row.Anesthetic,
            LOS: parseInt(row.LOS, 10),
            Description: row.Description || '',         // Add fallback if empty
            DescriptionAR: row.DescriptionAR || '',     // Critical field to avoid error
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
  
          newOperations.push({ operationData, categoryPricingData });
        })
        .on('end', resolve)
        .on('error', reject);
    });
  };
  

// Ask for user confirmation
const askForConfirmation = async (count) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`⚠️ This will add ${count} new operations. Proceed? [y/N]: `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
};

// Send operations to API
const addOperation = async (operationData, categoryPricingData) => {
  try {
    await axios.post('http://localhost:8066/hospitalization/operations', {
      operationData,
      categoryPricingData,
    });
    console.log(`✅ Added operation: ${operationData.Code}`);
  } catch (error) {
    console.error(`❌ Failed to add operation ${operationData.Code}:`, error.message);
  }
};

const processFile = async () => {
  await loadExistingOperations();
  await previewFile();

  if (newOperations.length === 0) {
    console.log('✅ No new operations to add.');
    return;
  }

  const confirm = await askForConfirmation(newOperations.length);
  if (!confirm) {
    console.log('❌ Operation cancelled.');
    return;
  }

  for (const { operationData, categoryPricingData } of newOperations) {
    await addOperation(operationData, categoryPricingData);
  }

  console.log('🎉 All new operations processed.');
};

processFile();
