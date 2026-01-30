const sequelize = require('../config/databasePharmacy');
const Donor = require('../src/models/donor');
const Donation = require('../src/models/donation');
const BatchLotTracking = require('../src/models/batchlot');
const BatchSerialNumber = require('../src/models/batchserialnumber');
const path = require('path');

// Check if exceljs is installed
let ExcelJS;
try {
  ExcelJS = require('exceljs');
} catch (error) {
  console.error('\n⚠️  ERROR: exceljs package is not installed!');
  console.error('Please run: npm install exceljs');
  console.error('Then run this script again.\n');
  process.exit(1);
}

/**
 * Export all batch lots and serial numbers from donations by donor "AHLLAN"
 * to an Excel file with the following columns:
 * - Brand Name
 * - Presentation
 * - Form
 * - Laboratory
 * - Country
 * - GTIN
 * - LOT Nb
 * - Expiry Date
 * - Serial Nb
 */
async function exportAhllanBatchSerials() {
  try {
    console.log('Starting export process...');
    
    // Find the donor "AHLLAN"
    const donor = await Donor.findOne({
      where: { DonorName: 'AHLLAN' }
    });

    if (!donor) {
      console.error('Donor "AHLLAN" not found in the database.');
      return;
    }

    console.log(`Found donor: ${donor.DonorName} (ID: ${donor.DonorId})`);

    // Find all donations by this donor
    const donations = await Donation.findAll({
      where: { DonorId: donor.DonorId }
    });

    if (!donations || donations.length === 0) {
      console.log('No donations found for donor "AHLLAN".');
      return;
    }

    console.log(`Found ${donations.length} donation(s) by AHLLAN`);

    // Get all donation IDs
    const donationIds = donations.map(d => d.DonationId);

    // Find all batch lots for these donations
    const batchLots = await BatchLotTracking.findAll({
      where: { DonationId: donationIds }
    });

    if (!batchLots || batchLots.length === 0) {
      console.log('No batch lots found for AHLLAN donations.');
      return;
    }

    console.log(`Found ${batchLots.length} batch lot(s)`);

    // Get all batch lot IDs
    const batchLotIds = batchLots.map(bl => bl.BatchLotId);

    // Find all serial numbers for these batch lots
    const serialNumbers = await BatchSerialNumber.findAll({
      where: { BatchId: batchLotIds }
    });

    console.log(`Found ${serialNumbers.length} serial number(s)`);

    // Create a map of batch lot ID to batch lot data
    const batchLotMap = {};
    batchLots.forEach(bl => {
      batchLotMap[bl.BatchLotId] = bl;
    });

    // Prepare data for Excel export
    const excelData = [];
    
    serialNumbers.forEach(serial => {
      const batchLot = batchLotMap[serial.BatchId];
      
      if (batchLot) {
        excelData.push({
          brandName: batchLot.DrugName || '',
          presentation: batchLot.Presentation || '',
          form: batchLot.Form || '',
          laboratory: batchLot.Laboratory || '',
          country: batchLot.LaboratoryCountry || '',
          gtin: batchLot.GTIN ? batchLot.GTIN.toString() : '',
          lotNb: batchLot.BatchNumber || '',
          expiryDate: batchLot.ExpiryDate ? formatDate(batchLot.ExpiryDate) : '',
          serialNb: serial.SerialNumber || ''
        });
      }
    });

    console.log(`Prepared ${excelData.length} row(s) for export`);

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('AHLLAN Batch Serials');

    // Define columns
    worksheet.columns = [
      { header: 'Brand Name', key: 'brandName', width: 30 },
      { header: 'Presentation', key: 'presentation', width: 20 },
      { header: 'Form', key: 'form', width: 15 },
      { header: 'Laboratory', key: 'laboratory', width: 25 },
      { header: 'Country', key: 'country', width: 20 },
      { header: 'GTIN', key: 'gtin', width: 20 },
      { header: 'LOT Nb', key: 'lotNb', width: 20 },
      { header: 'Expiry Date', key: 'expiryDate', width: 15 },
      { header: 'Serial Nb', key: 'serialNb', width: 25 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };

    // Add data rows
    excelData.forEach(row => {
      worksheet.addRow(row);
    });

    // Auto-filter
    worksheet.autoFilter = {
      from: 'A1',
      to: 'I1'
    };

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `AHLLAN_Batch_Serials_${timestamp}.xlsx`;
    const filepath = path.join(__dirname, '..', 'src', 'data', filename);

    // Save the file
    await workbook.xlsx.writeFile(filepath);

    console.log(`\n✓ Export completed successfully!`);
    console.log(`✓ File saved to: ${filepath}`);
    console.log(`✓ Total records exported: ${excelData.length}`);

  } catch (error) {
    console.error('Error during export:', error);
    throw error;
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('\nDatabase connection closed.');
  }
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Run the export
exportAhllanBatchSerials()
  .then(() => {
    console.log('\nScript completed.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });
