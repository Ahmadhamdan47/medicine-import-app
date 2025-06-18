const sequelize = require('../config/databasePharmacy');

async function addUrlColumnToNotifications() {
    try {
        console.log('Adding Url column to notification table...');
        
        await sequelize.query(`
            ALTER TABLE notification 
            ADD COLUMN Url VARCHAR(500) NULL
        `);
        
        console.log('Url column added successfully to notification table');
    } catch (error) {
        if (error.message.includes('Duplicate column name')) {
            console.log('Url column already exists in notification table');
        } else {
            console.error('Error adding Url column:', error);
            throw error;
        }
    } finally {
        await sequelize.close();
    }
}

// Run the migration
addUrlColumnToNotifications().catch(console.error);
