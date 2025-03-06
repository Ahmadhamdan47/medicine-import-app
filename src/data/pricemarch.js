const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'ommal_oummal',
    password: 'dMR2id57dviMJJnc',
    database: 'ommal_medlist',
};

async function updatePrices() {
    let connection;
    try {
        // Connect to the database
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the database.');

        // Read the TSV file
        const filePath = path.join(__dirname, 'pricesmarch.tsv');
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Split the file content into lines
        const lines = fileContent.split('\n');

        // Prepare the SQL query for updating the prices
        const query = `
            UPDATE medications
            SET public_price = ?
            WHERE code = ?
        `;

        // Execute updates in a transaction
        await connection.beginTransaction();
        for (let i = 1; i < lines.length; i++) { // Start from 1 to skip the header
            const [code, public_price] = lines[i].split('\t');

            if (code && public_price) {
                const price = parseFloat(public_price);
                if (!isNaN(price) && price >= 0 && price <= 999999.99) { // Adjust the range as needed
                    await connection.execute(query, [price, code]);
                } else {
                    console.warn(`Skipping invalid price at line ${i + 1}: ${public_price}`);
                }
            }
        }
        await connection.commit();
        console.log('Prices updated successfully.');
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error updating prices:', error);
    } finally {
        if (connection) await connection.end();
        console.log('Database connection closed.');
    }
}

// Run the updatePrices function
updatePrices();