const { Pool } = require('pg');

async function createPharmacyServiceAccount() {
    const pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'medicine_import_db',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
    });

    const client = await pool.connect();

    try {
        console.log('Creating pharmacy_service role...');
        
        // Create pharmacy_service role
        await client.query('CREATE ROLE pharmacy_service');
        
        // Grant permissions to pharmacy_service role
        await client.query('GRANT SELECT, INSERT, UPDATE ON medicines TO pharmacy_service');
        await client.query('GRANT SELECT, INSERT, UPDATE ON inventory TO pharmacy_service');
        await client.query('GRANT SELECT, INSERT, UPDATE ON orders TO pharmacy_service');
        await client.query('GRANT SELECT ON suppliers TO pharmacy_service');
        await client.query('GRANT SELECT ON categories TO pharmacy_service');
        
        console.log('Creating test user...');
        
        // Create test user for pharmacy service
        await client.query("CREATE USER pharmacy_test_user WITH PASSWORD 'password123'");
        
        // Assign role to test user
        await client.query('GRANT pharmacy_service TO pharmacy_test_user');
        
        // Grant login permission
        await client.query('ALTER USER pharmacy_test_user WITH LOGIN');
        
        console.log('✅ Pharmacy service test account created successfully!');
        console.log('Username: pharmacy_test_user');
        console.log('Password: password123');
        console.log('Role: pharmacy_service');
        
    } catch (error) {
        if (error.code === '42710') {
            console.log('⚠️  Role or user already exists');
        } else {
            console.error('❌ Error creating pharmacy service account:', error.message);
        }
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the script
createPharmacyServiceAccount()
    .then(() => process.exit(0))
    .catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
