// example-interactive-mapping.js
// Example demonstrating the interactive column mapping workflow

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Base URL for your API (adjust as needed)
const BASE_URL = 'http://localhost:3000/api/drug-import';

class InteractiveMappingDemo {
    constructor(apiBaseUrl = BASE_URL) {
        this.apiBaseUrl = apiBaseUrl;
        this.sessionId = null;
    }

    /**
     * Step 1: Upload CSV file and get analysis
     */
    async uploadAndAnalyze(filePath) {
        try {
            console.log('🔄 Step 1: Uploading and analyzing CSV file...');
            
            const formData = new FormData();
            formData.append('csvFile', fs.createReadStream(filePath));

            const response = await axios.post(
                `${this.apiBaseUrl}/upload-analyze`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                    },
                }
            );

            const result = response.data;
            this.sessionId = result.sessionId;

            console.log('✅ File uploaded successfully!');
            console.log(`📋 Session ID: ${this.sessionId}`);
            console.log(`📁 File: ${result.fileName}`);
            console.log(`📊 Found ${result.analysis.headers.length} columns`);
            console.log(`📈 Sample data: ${result.analysis.rowCount} rows detected`);
            
            console.log('\n🔍 Analysis Results:');
            console.log('Original Headers:', result.analysis.headers);
            console.log('Suggested Mappings:', result.analysis.suggestedMappings);
            console.log('Unmapped Headers:', result.analysis.unmappedHeaders);
            console.log('Available DB Columns:', result.analysis.availableDbColumns);

            return result;

        } catch (error) {
            console.error('❌ Error uploading file:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Step 2: Set column mapping based on user choice
     */
    async setColumnMapping(columnMapping) {
        try {
            console.log('\n🔄 Step 2: Setting column mapping...');

            const response = await axios.post(`${this.apiBaseUrl}/set-mapping`, {
                sessionId: this.sessionId,
                columnMapping: columnMapping
            });

            const result = response.data;
            console.log('✅ Column mapping set successfully!');
            console.log(`📊 Mapped ${result.mappingCount} columns`);
            
            if (result.validation.warnings.length > 0) {
                console.log('⚠️ Warnings:', result.validation.warnings);
            }

            return result;

        } catch (error) {
            console.error('❌ Error setting mapping:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Step 3: Preview changes
     */
    async previewChanges() {
        try {
            console.log('\n🔄 Step 3: Previewing changes...');

            const response = await axios.get(`${this.apiBaseUrl}/preview/${this.sessionId}`);
            const result = response.data;

            console.log('✅ Preview generated successfully!');
            console.log('📊 Summary:');
            console.log(`  - Total rows: ${result.preview.summary.totalRows}`);
            console.log(`  - Updates: ${result.preview.summary.updates}`);
            console.log(`  - Inserts: ${result.preview.summary.inserts}`);
            console.log(`  - Errors: ${result.preview.summary.errors}`);
            
            if (result.preview.summary.skippedColumns.length > 0) {
                console.log(`  - Skipped columns: ${result.preview.summary.skippedColumns.join(', ')}`);
            }

            // Show some sample changes
            if (result.preview.details.updates.length > 0) {
                console.log('\n📝 Sample Updates:');
                result.preview.details.updates.slice(0, 3).forEach((update, index) => {
                    console.log(`  ${index + 1}. MoPHCode ${update.MoPHCode}:`);
                    Object.keys(update.changes).forEach(column => {
                        const change = update.changes[column];
                        console.log(`     ${column}: "${change.from}" → "${change.to}"`);
                    });
                });
            }

            if (result.preview.details.inserts.length > 0) {
                console.log(`\n➕ ${result.preview.details.inserts.length} new records will be inserted`);
            }

            return result;

        } catch (error) {
            console.error('❌ Error previewing changes:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Step 4: Apply changes
     */
    async applyChanges() {
        try {
            console.log('\n🔄 Step 4: Applying changes to working table...');

            const response = await axios.post(`${this.apiBaseUrl}/apply/${this.sessionId}`);
            const result = response.data;

            console.log('✅ Changes applied successfully!');
            console.log(`📊 Updated: ${result.result.updatedCount} records`);
            console.log(`➕ Inserted: ${result.result.insertedCount} records`);
            console.log(`📈 Total processed: ${result.result.totalProcessed}`);
            
            if (result.result.skippedColumns.length > 0) {
                console.log(`⚠️ Skipped columns: ${result.result.skippedColumns.join(', ')}`);
            }

            return result;

        } catch (error) {
            console.error('❌ Error applying changes:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Step 5: Review final changes
     */
    async getFinalChanges() {
        try {
            console.log('\n🔄 Step 5: Getting final changes for review...');

            const response = await axios.get(`${this.apiBaseUrl}/final-changes/${this.sessionId}`);
            const result = response.data;

            console.log('✅ Final changes retrieved!');
            console.log(`📊 Total changes: ${result.changeCount}`);

            // Show sample final changes
            if (result.finalChanges.length > 0) {
                console.log('\n🔍 Sample Final Changes:');
                result.finalChanges.slice(0, 5).forEach((change, index) => {
                    console.log(`  ${index + 1}. ${change.ChangeType} - MoPHCode: ${change.MoPHCode}`);
                    if (change.ChangeType === 'UPDATE') {
                        console.log(`     Name: "${change.Original_BrandName}" → "${change.New_BrandName}"`);
                        console.log(`     Price: $${change.Original_PublicPrice} → $${change.New_PublicPrice}`);
                    }
                });
            }

            return result;

        } catch (error) {
            console.error('❌ Error getting final changes:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Step 6: Commit changes
     */
    async commitChanges() {
        try {
            console.log('\n🔄 Step 6: Committing changes to live database...');

            const response = await axios.post(`${this.apiBaseUrl}/commit/${this.sessionId}`);
            const result = response.data;

            console.log('✅ Changes committed successfully!');
            console.log('🎉 Import process completed!');

            return result;

        } catch (error) {
            console.error('❌ Error committing changes:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Rollback changes if needed
     */
    async rollbackChanges() {
        try {
            console.log('\n🔄 Rolling back changes...');

            const response = await axios.post(`${this.apiBaseUrl}/rollback/${this.sessionId}`);
            const result = response.data;

            console.log('✅ Changes rolled back successfully!');

            return result;

        } catch (error) {
            console.error('❌ Error rolling back changes:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Get available database columns
     */
    async getAvailableColumns() {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/available-columns`);
            const result = response.data;

            console.log('📋 Available Database Columns:');
            result.availableColumns.forEach((column, index) => {
                console.log(`  ${index + 1}. ${column}`);
            });

            console.log('\n💰 Currency Conversion Info:');
            console.log(`  Columns: ${result.currencyConversion.columns.join(', ')}`);
            console.log(`  Rate: 1 USD = ${result.currencyConversion.rate} LBP`);

            return result;

        } catch (error) {
            console.error('❌ Error getting available columns:', error.response?.data || error.message);
            throw error;
        }
    }
}

// Example usage function
async function demonstrateInteractiveMapping() {
    const demo = new InteractiveMappingDemo();

    try {
        // Create a sample CSV file first
        const sampleCSV = `Code,Registration number,Brand name,Strength,Public Price LL,Form,Agent
12345,REG001,Sample Drug A,10mg,1790000,Tablet,Agent A
23456,REG002,Sample Drug B,5mg,895000,Capsule,Agent B
34567,REG003,Sample Drug C,250mg,2685000,Syrup,Agent C`;

        fs.writeFileSync('sample-drug-data.csv', sampleCSV);
        console.log('📁 Created sample CSV file: sample-drug-data.csv');

        // Step 1: Upload and analyze
        const analysis = await demo.uploadAndAnalyze('sample-drug-data.csv');

        // Step 2: Set column mapping (user would choose this interactively)
        const userMapping = {
            'Code': 'MoPHCode',
            'Registration number': 'RegistrationNumber',
            'Brand name': 'DrugName',
            'Strength': 'Dosage',
            'Public Price LL': 'PublicPrice', // This will be converted from LBP to USD
            'Form': 'Form',
            'Agent': 'Agent'
        };

        await demo.setColumnMapping(userMapping);

        // Step 3: Preview changes
        await demo.previewChanges();

        // Step 4: Apply changes
        await demo.applyChanges();

        // Step 5: Review final changes
        await demo.getFinalChanges();

        // Step 6: User would decide to commit or rollback
        console.log('\n❓ Would you like to commit these changes? (This is where user interaction would happen)');
        console.log('For demo purposes, we will NOT commit to avoid affecting your database.');
        
        // Uncomment to actually commit:
        // await demo.commitChanges();

        // For demo, we'll rollback
        console.log('\n🔄 Rolling back changes for demo safety...');
        await demo.rollbackChanges();

    } catch (error) {
        console.error('❌ Demo failed:', error);
    } finally {
        // Clean up sample file
        try {
            fs.unlinkSync('sample-drug-data.csv');
            console.log('🧹 Cleaned up sample file');
        } catch (e) {
            // File might not exist
        }
    }
}

// Export for use in other scripts
module.exports = InteractiveMappingDemo;

// Run demo if this file is executed directly
if (require.main === module) {
    console.log('🚀 Interactive Drug Import Mapping Demo\n');
    
    console.log('This demo shows the complete workflow:');
    console.log('1. 📤 Upload CSV file');
    console.log('2. 🗺️  Set column mapping');
    console.log('3. 👀 Preview changes');
    console.log('4. ⚡ Apply changes');
    console.log('5. 📋 Review final changes');
    console.log('6. ✅ Commit or rollback');
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Note: This demo won't work without a running server
    console.log('⚠️  Note: This demo requires your API server to be running on http://localhost:3000');
    console.log('   Start your server first, then run: node example-interactive-mapping.js');
    
    // Uncomment to run the demo (when server is running):
    // demonstrateInteractiveMapping();
}