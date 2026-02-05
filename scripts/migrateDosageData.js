/**
 * Dosage Data Migration Script
 * 
 * Purpose: Parse all drug.Dosage strings and populate the dosage table
 * with structured numerator/denominator data.
 * 
 * Usage:
 *   node scripts/migrateDosageData.js [--dry-run] [--limit=N]
 * 
 * Options:
 *   --dry-run    Preview changes without writing to database
 *   --limit=N    Process only N drugs (for testing)
 *   --verbose    Show detailed parsing results
 * 
 * Example:
 *   node scripts/migrateDosageData.js --dry-run --limit=10 --verbose
 */

const sequelize = require('../config/databasePharmacy');
const { parseDosage, formatDosage, isValidParsedDosage } = require('../src/utils/dosageParser');

// Parse command-line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const limitArg = args.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

console.log('===========================================');
console.log('Dosage Data Migration Script');
console.log('===========================================\n');
console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes will be made)' : 'LIVE (database will be updated)'}`);
if (limit) {
  console.log(`Limit: Processing first ${limit} drugs`);
}
console.log(`Verbose: ${verbose ? 'ON' : 'OFF'}`);
console.log('\n');

/**
 * Main migration function
 */
async function migrateDosageData() {
  let transaction;
  
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established\n');

    // Start transaction (only if not dry run)
    if (!isDryRun) {
      transaction = await sequelize.transaction();
    }

    // Fetch all drugs with non-null Dosage field
    const query = `
      SELECT DrugID, Dosage, GenericEn 
      FROM drug 
      WHERE Dosage IS NOT NULL AND Dosage != ''
      ${limit ? `LIMIT ${limit}` : ''}
    `;

    const [drugs] = await sequelize.query(query);
    
    console.log(`Found ${drugs.length} drugs with dosage data to process\n`);

    if (drugs.length === 0) {
      console.log('No drugs to process. Exiting.');
      return;
    }

    // Statistics tracking
    const stats = {
      total: drugs.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      updated: 0,
      inserted: 0
    };

    const failedDrugs = [];
    const skippedDrugs = [];

    // Process each drug
    for (let i = 0; i < drugs.length; i++) {
      const drug = drugs[i];
      const { DrugID, Dosage, GenericEn } = drug;

      if (verbose) {
        console.log(`\n[${i + 1}/${drugs.length}] Processing Drug ID: ${DrugID}`);
        console.log(`  Name: ${GenericEn || 'N/A'}`);
        console.log(`  Dosage String: "${Dosage}"`);
      }

      // Parse the dosage string
      const parsedDosages = parseDosage(Dosage);

      if (!parsedDosages || parsedDosages.length === 0) {
        if (verbose) {
          console.log(`  ⚠ Failed to parse dosage`);
        }
        stats.failed++;
        failedDrugs.push({
          DrugID,
          GenericEn,
          Dosage,
          reason: 'Parser returned empty result'
        });
        continue;
      }

      // Validate parsed dosages
      const allValid = parsedDosages.every(isValidParsedDosage);
      if (!allValid) {
        if (verbose) {
          console.log(`  ⚠ Parsed dosage failed validation`);
        }
        stats.failed++;
        failedDrugs.push({
          DrugID,
          GenericEn,
          Dosage,
          reason: 'Validation failed',
          parsed: parsedDosages
        });
        continue;
      }

      if (verbose) {
        console.log(`  ✓ Parsed: ${formatDosage(parsedDosages)}`);
        parsedDosages.forEach((d, idx) => {
          console.log(`    Ingredient ${idx + 1}: ${d.numerator}${d.numeratorUnit}${d.denominator ? '/' + d.denominator + d.denominatorUnit : ''}`);
        });
      }

      // Prepare dosage record data
      const dosageData = {
        DrugId: DrugID,
        Numerator1: parsedDosages[0]?.numerator || 0,
        Numerator1Unit: parsedDosages[0]?.numeratorUnit || '',
        Denominator1: parsedDosages[0]?.denominator || 0,
        Denominator1Unit: parsedDosages[0]?.denominatorUnit || '',
        Numerator2: parsedDosages[1]?.numerator || 0,
        Numerator2Unit: parsedDosages[1]?.numeratorUnit || '',
        Denominator2: parsedDosages[1]?.denominator || 0,
        Denominator2Unit: parsedDosages[1]?.denominatorUnit || '',
        Numerator3: parsedDosages[2]?.numerator || 0,
        Numerator3Unit: parsedDosages[2]?.numeratorUnit || '',
        Denominator3: parsedDosages[2]?.denominator || 0,
        Denominator3Unit: parsedDosages[2]?.denominatorUnit || '',
        CreatedDate: new Date(),
        UpdatedDate: new Date()
      };

      if (!isDryRun) {
        try {
          // Check if dosage record already exists
          const [existing] = await sequelize.query(
            'SELECT DosageId FROM dosage WHERE DrugId = ?',
            { replacements: [DrugID], transaction }
          );

          if (existing && existing.length > 0) {
            // Update existing record
            await sequelize.query(
              `UPDATE dosage SET 
                Numerator1 = ?, Numerator1Unit = ?, Denominator1 = ?, Denominator1Unit = ?,
                Numerator2 = ?, Numerator2Unit = ?, Denominator2 = ?, Denominator2Unit = ?,
                Numerator3 = ?, Numerator3Unit = ?, Denominator3 = ?, Denominator3Unit = ?,
                UpdatedDate = ?
              WHERE DrugId = ?`,
              {
                replacements: [
                  dosageData.Numerator1, dosageData.Numerator1Unit,
                  dosageData.Denominator1, dosageData.Denominator1Unit,
                  dosageData.Numerator2, dosageData.Numerator2Unit,
                  dosageData.Denominator2, dosageData.Denominator2Unit,
                  dosageData.Numerator3, dosageData.Numerator3Unit,
                  dosageData.Denominator3, dosageData.Denominator3Unit,
                  dosageData.UpdatedDate,
                  DrugID
                ],
                transaction
              }
            );
            stats.updated++;
            if (verbose) {
              console.log(`  ✓ Updated existing dosage record`);
            }
          } else {
            // Insert new record
            await sequelize.query(
              `INSERT INTO dosage (
                DrugId, Numerator1, Numerator1Unit, Denominator1, Denominator1Unit,
                Numerator2, Numerator2Unit, Denominator2, Denominator2Unit,
                Numerator3, Numerator3Unit, Denominator3, Denominator3Unit,
                CreatedDate, UpdatedDate
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              {
                replacements: [
                  dosageData.DrugId,
                  dosageData.Numerator1, dosageData.Numerator1Unit,
                  dosageData.Denominator1, dosageData.Denominator1Unit,
                  dosageData.Numerator2, dosageData.Numerator2Unit,
                  dosageData.Denominator2, dosageData.Denominator2Unit,
                  dosageData.Numerator3, dosageData.Numerator3Unit,
                  dosageData.Denominator3, dosageData.Denominator3Unit,
                  dosageData.CreatedDate, dosageData.UpdatedDate
                ],
                transaction
              }
            );
            stats.inserted++;
            if (verbose) {
              console.log(`  ✓ Inserted new dosage record`);
            }
          }
        } catch (dbError) {
          console.error(`  ✗ Database error for Drug ID ${DrugID}:`, dbError.message);
          stats.failed++;
          failedDrugs.push({
            DrugID,
            GenericEn,
            Dosage,
            reason: `Database error: ${dbError.message}`
          });
          continue;
        }
      }

      stats.successful++;
    }

    // Commit transaction
    if (!isDryRun && transaction) {
      await transaction.commit();
      console.log('\n✓ Transaction committed\n');
    }

    // Print summary
    console.log('\n===========================================');
    console.log('Migration Summary');
    console.log('===========================================');
    console.log(`Total drugs processed: ${stats.total}`);
    console.log(`Successful: ${stats.successful}`);
    console.log(`Failed: ${stats.failed}`);
    
    if (!isDryRun) {
      console.log(`  - Inserted: ${stats.inserted}`);
      console.log(`  - Updated: ${stats.updated}`);
    }

    // Print failed drugs
    if (failedDrugs.length > 0) {
      console.log(`\n⚠ ${failedDrugs.length} drugs failed to parse:`);
      console.log('-------------------------------------------');
      
      failedDrugs.slice(0, 20).forEach((drug, idx) => {
        console.log(`${idx + 1}. Drug ID ${drug.DrugID}: "${drug.GenericEn || 'N/A'}"`);
        console.log(`   Dosage: "${drug.Dosage}"`);
        console.log(`   Reason: ${drug.reason}`);
        if (drug.parsed) {
          console.log(`   Parsed result: ${JSON.stringify(drug.parsed)}`);
        }
        console.log('');
      });

      if (failedDrugs.length > 20) {
        console.log(`... and ${failedDrugs.length - 20} more. See failed_drugs.json for full list.`);
      }

      // Write failed drugs to file for review
      const fs = require('fs');
      fs.writeFileSync(
        'failed_dosage_migrations.json',
        JSON.stringify(failedDrugs, null, 2)
      );
      console.log('\n✓ Failed drugs saved to failed_dosage_migrations.json');
    }

    console.log('\n===========================================');
    if (isDryRun) {
      console.log('DRY RUN COMPLETE - No changes were made');
      console.log('Remove --dry-run flag to apply changes');
    } else {
      console.log('MIGRATION COMPLETE');
    }
    console.log('===========================================\n');

  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    
    // Rollback transaction on error
    if (transaction) {
      await transaction.rollback();
      console.log('✓ Transaction rolled back\n');
    }
    
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run migration
migrateDosageData();
