const fs = require('fs');
const csv = require('csv-parser');
const addATCMapping = require('../services/atcService').addATCMapping;

const addATCMappingFromCSV = async () => {
  const mappings = [];

  const readCSV = new Promise((resolve, reject) => {
    fs.createReadStream('ATCMap.csv')
      .pipe(csv())
      .on('data', (row) => {
        const mapping = {
          atcCode: row['Code'],
          DrugName: row['DrugName']
        };      
        mappings.push(mapping);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  await readCSV;

  for (const mapping of mappings) {
    try {
      await addATCMapping(mapping.atcCode, mapping.DrugName);
      console.log(`Added ATC mapping: ${mapping.atcCode} to ${mapping.DrugName}`);
    } catch (error) {
      console.error(`Failed to add ATC mapping: ${mapping.atcCode} to ${mapping.DrugName}`, error);
    }
  }
};

addATCMappingFromCSV();