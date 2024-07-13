const fs = require('fs');
const csv = require('csv-parser');
const addPharmacyDrug = require('../services/drugService').addPharmacyDrug;

const addDrugsFromCSV = async () => {
  const drugs = [];

  const readCSV = new Promise((resolve, reject) => {
    fs.createReadStream('Drugs.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Ignore the 'seq' and 'DrugID' columns
        delete row.seq;
        delete row.NM;
        delete row.PP;
        

        // Map the data using column names
        const drug = {
            DrugName: row['DrugName'],
            DrugType: row['ProductType'] === 'B' ? 'Brand' : row['ProductType'] === 'G' ? 'Generic' : undefined,
            Price: row['Price'],
            Quantity: row['Quantity'],
            IsSubstitutable: row['Substitutable'] === 'S' ? true : false,
            IngredientAndStrength: row['IngredientAndStrength'],
            MoPHCode: row['MoPHCode'],
            RegistrationNumber: row['RegistrationNumber'],
            DFSequence: row['DFSequence'],
            PublicPrice: row['public price'],
            IsDouanes: row['IsDouanes'],
            SubsidyPercentage: row['SubsidyPercentage'],
            HospPricing: row['HospPricing'],
            Notes: row['Notes'],
          };
        drugs.push(drug);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  await readCSV;

  for (const drug of drugs) {
    try {
      await addPharmacyDrug(drug);
      console.log(`Added: ${drug.DrugName}`);
    } catch (error) {
      console.error(`Failed to add: ${drug.DrugName}`, error);
    }
  }
};

addDrugsFromCSV();