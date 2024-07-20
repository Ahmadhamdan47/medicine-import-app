const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('ommal_medapiv2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Drug = sequelize.define('drug', {
    DrugID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    MoPHCode: { type: DataTypes.STRING(10) },
    Form: { type: DataTypes.STRING(255) },
    isScored: { type: DataTypes.TINYINT(1) },
    Route: { type: DataTypes.STRING(255) },
    RouteParent: { type: DataTypes.STRING(255) },
    isParentaral: { type: DataTypes.TINYINT(1) }
}, {
    tableName: 'drug',
    timestamps: false
});

const updateDrugs = async () => {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const tsvFilePath = path.join(__dirname, 'FromAndRoute.tsv');
    const tsvData = fs.readFileSync(tsvFilePath, 'utf-8');
    const lines = tsvData.split('\n');

    for (const line of lines) {
        if (!line.trim()) continue;  // Skip empty lines

        const [MoPHCode, Form, scored, Route, Parent, Parentaral] = line.split('\t');

        const drug = await Drug.findOne({ where: { MoPHCode } });
        if (drug) {
            await drug.update({
                Form: Form || null,
                isScored: scored || null,
                Route: Route || null,
                RouteParent: Parent || null,
                isParentaral: Parentaral || null
            });
            console.log(`Drug with MoPHCode ${MoPHCode} has been updated.`);
        } else {
            console.log(`Drug with MoPHCode ${MoPHCode} not found`);
        }
    }

    console.log('Drugs have been updated successfully.');
    await sequelize.close();
};

updateDrugs().catch(err => console.error('Unable to connect to the database:', err));
