const mysql = require('mysql2');

// Database configuration
const dbConfig = {
    host: "localhost",       // Replace with your database host
    user: "ommal_ahmad",     // Replace with your database user
    password: "fISfGr^8q!_gUPMY", // Replace with your database password
    database: "ommal_medapiv2",  // Replace with your database name
};

const db = mysql.createConnection(dbConfig);
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to the database");
});

async function updateImagesPath() {
    console.log("Updating ImagesPath for all drugs...");
    
    try {
        await new Promise((resolve, reject) => {
            db.query(
                "UPDATE drug SET ImagesPath = 'drug.jpg'",
                (err, results) => {
                    if (err) {
                        console.error("Error updating ImagesPath:", err);
                        reject(err);
                    } else {
                        console.log(`Updated ${results.affectedRows} records successfully.`);
                        resolve();
                    }
                }
            );
        });
    } catch (error) {
        console.error("Unexpected error during processing:", error);
    } finally {
        console.log("Closing database connection");
        db.end();
    }
}

// Run the script
console.log("Starting ImagesPath update script...");
updateImagesPath();
