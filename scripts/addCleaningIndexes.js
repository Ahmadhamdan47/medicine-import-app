/**
 * Add Database Indexes for Route and Dosage Cleaning
 * 
 * This script adds performance indexes to the drug and dosage tables
 * to optimize queries used by the route and dosage cleaning services.
 * 
 * Indexes created:
 * - drug(RouteRaw) - for GROUP BY and WHERE queries on RouteRaw
 * - drug(Form) - for filtering dosage records by form type
 * - dosage(DrugId) - for fast JOIN operations (may already exist)
 * 
 * Usage:
 *   node scripts/addCleaningIndexes.js
 */

const sequelize = require('../config/databasePharmacy');

async function checkIndexExists(tableName, indexName) {
  try {
    const [results] = await sequelize.query(`
      SHOW INDEX FROM ${tableName} WHERE Key_name = ?
    `, {
      replacements: [indexName]
    });
    return results.length > 0;
  } catch (error) {
    console.error(`Error checking index ${indexName} on ${tableName}:`, error);
    return false;
  }
}

async function addIndexes() {
  console.log('Starting database index migration for route and dosage cleaning...\n');

  try {
    // 1. Add index on drug.RouteRaw
    const routeRawIndexExists = await checkIndexExists('drug', 'idx_drug_routeraw');
    
    if (!routeRawIndexExists) {
      console.log('Creating index on drug.RouteRaw...');
      await sequelize.query(`
        CREATE INDEX idx_drug_routeraw ON drug(RouteRaw)
      `);
      console.log('✓ Index idx_drug_routeraw created successfully');
    } else {
      console.log('✓ Index idx_drug_routeraw already exists');
    }

    // 2. Add index on drug.Form
    const formIndexExists = await checkIndexExists('drug', 'idx_drug_form');
    
    if (!formIndexExists) {
      console.log('Creating index on drug.Form...');
      await sequelize.query(`
        CREATE INDEX idx_drug_form ON drug(Form)
      `);
      console.log('✓ Index idx_drug_form created successfully');
    } else {
      console.log('✓ Index idx_drug_form already exists');
    }

    // 3. Add index on dosage.DrugId (if not exists)
    const dosageDrugIdIndexExists = await checkIndexExists('dosage', 'idx_dosage_drugid');
    
    if (!dosageDrugIdIndexExists) {
      console.log('Creating index on dosage.DrugId...');
      await sequelize.query(`
        CREATE INDEX idx_dosage_drugid ON dosage(DrugId)
      `);
      console.log('✓ Index idx_dosage_drugid created successfully');
    } else {
      console.log('✓ Index idx_dosage_drugid already exists');
    }

    // 4. Optional: Add index on drug.Route for stats queries
    const routeIndexExists = await checkIndexExists('drug', 'idx_drug_route');
    
    if (!routeIndexExists) {
      console.log('Creating index on drug.Route...');
      await sequelize.query(`
        CREATE INDEX idx_drug_route ON drug(Route)
      `);
      console.log('✓ Index idx_drug_route created successfully');
    } else {
      console.log('✓ Index idx_drug_route already exists');
    }

    // 5. Optional: Add index on drug.Dosage for stats queries
    const dosageIndexExists = await checkIndexExists('drug', 'idx_drug_dosage');
    
    if (!dosageIndexExists) {
      console.log('Creating index on drug.Dosage...');
      await sequelize.query(`
        CREATE INDEX idx_drug_dosage ON drug(Dosage(255))
      `);
      console.log('✓ Index idx_drug_dosage created successfully');
    } else {
      console.log('✓ Index idx_drug_dosage already exists');
    }

    console.log('\n✅ All indexes created successfully!');
    console.log('\nIndexes Summary:');
    console.log('  - idx_drug_routeraw: Optimizes RouteRaw grouping and filtering');
    console.log('  - idx_drug_form: Optimizes Form filtering for dosage records');
    console.log('  - idx_dosage_drugid: Optimizes dosage-drug JOINs');
    console.log('  - idx_drug_route: Optimizes Route statistics queries');
    console.log('  - idx_drug_dosage: Optimizes Dosage statistics queries');
    console.log('\nNote: These indexes will improve performance of route and dosage cleaning operations.');

  } catch (error) {
    console.error('\n❌ Error creating indexes:', error);
    throw error;
  }
}

async function showTableSizes() {
  console.log('\nFetching table statistics...');
  
  try {
    const [drugStats] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_drugs,
        COUNT(DISTINCT RouteRaw) as unique_route_raws,
        COUNT(DISTINCT Route) as unique_routes,
        COUNT(DISTINCT Form) as unique_forms
      FROM drug
    `);

    const [dosageStats] = await sequelize.query(`
      SELECT COUNT(*) as total_dosage_records
      FROM dosage
    `);

    console.log('\nTable Statistics:');
    console.log(`  Drug table: ${drugStats[0].total_drugs.toLocaleString()} records`);
    console.log(`  - Unique RouteRaw values: ${drugStats[0].unique_route_raws.toLocaleString()}`);
    console.log(`  - Unique Route values: ${drugStats[0].unique_routes.toLocaleString()}`);
    console.log(`  - Unique Form values: ${drugStats[0].unique_forms.toLocaleString()}`);
    console.log(`  Dosage table: ${dosageStats[0].total_dosage_records.toLocaleString()} records`);

  } catch (error) {
    console.error('Error fetching table statistics:', error);
  }
}

async function main() {
  try {
    console.log('='.repeat(60));
    console.log('Route and Dosage Cleaning - Database Index Migration');
    console.log('='.repeat(60));
    console.log();

    await showTableSizes();
    console.log();
    await addIndexes();
    
    console.log('\n' + '='.repeat(60));
    console.log('Migration completed successfully!');
    console.log('='.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('Migration failed:', error);
    console.error('='.repeat(60));
    process.exit(1);
  }
}

// Run the migration
main();
