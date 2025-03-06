async function updateMedications() {
    let connection;

    try {
        console.log("Connecting to the database...");
        connection = await mysql.createConnection(dbConfig);
        console.log("Connected to the database.");

        // Step 1: Fetch existing medications
        console.log("Fetching existing medication records...");
        const [existingMeds] = await connection.execute("SELECT * FROM medications");
        console.log("Fetched existing medication records.");

        const existingMedsMap = new Map(existingMeds.map(med => [med.code, med]));

        for (const med of parsedData) {
            const {
                code,
                reg_number,
                brand_name,
                strength,
                presentation,
                form,
                agent,
                manufacturer,
                country,
                public_price,
                stratum
            } = med;

            const existingMed = existingMedsMap.get(code);
            const publicPrice = isNaN(parseFloat(public_price)) ? null : parseFloat(public_price) / 89500;

            if (existingMed) {
                if (
                    existingMed.reg_number !== reg_number ||
                    existingMed.brand_name !== brand_name ||
                    existingMed.strength !== strength ||
                    existingMed.presentation !== presentation ||
                    existingMed.form !== form ||
                    existingMed.agent !== agent ||
                    existingMed.manufacturer !== manufacturer ||
                    existingMed.country !== country ||
                    existingMed.public_price !== publicPrice ||
                    existingMed.stratum !== stratum
                ) {
                    console.log(`Updating medication record: ${code}`);
                    await connection.execute(
                        `UPDATE medications SET reg_number = ?, brand_name = ?, strength = ?, presentation = ?, form = ?, agent = ?, manufacturer = ?, country = ?, public_price = ?, stratum = ? WHERE code = ?`,
                        [
                            reg_number, brand_name, strength, presentation, form, agent, manufacturer, country, publicPrice, stratum, code
                        ]
                    );
                }
            }
        }
    } catch (error) {
        console.error("Error updating medications:", error);
    } finally {
        if (connection) await connection.end();
        console.log("Database connection closed.");
    }
}

console.log("Starting Medlist data processing script...");
updateMedications();
