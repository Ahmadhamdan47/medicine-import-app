const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('ommal_medapiv2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Drug = sequelize.define('drug', {
    DrugID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    MoPHCode: { type: DataTypes.STRING(10) }
}, {
    tableName: 'drug',
    timestamps: false
});

const DrugPresentation = sequelize.define('DrugPresentation', {
    PresentationId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    DrugId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'Drug', key: 'DrugId' } },
    UnitQuantity1: { type: DataTypes.DECIMAL(18, 3) },
    UnitType1: { type: DataTypes.INTEGER },
    UnitQuantity2: { type: DataTypes.DECIMAL(18, 3) },
    UnitType2: { type: DataTypes.INTEGER },
    PackageQuantity1: { type: DataTypes.DECIMAL(18, 3) },
    PackageType1: { type: DataTypes.STRING(255) },
    PackageQuantity2: { type: DataTypes.DECIMAL(18, 3) },
    PackageType2: { type: DataTypes.STRING(255) },
    PackageQuantity3: { type: DataTypes.DECIMAL(18, 3) },
    PackageType3: { type: DataTypes.STRING(255) },
    Description: { type: DataTypes.TEXT },
    CreatedDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    UpdatedDate: { type: DataTypes.DATE }
}, {
    tableName: 'drugpresentation',
    timestamps: false
});

const importPresentations = async () => {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const tsvFilePath = path.join(__dirname, 'Presentation.tsv');
    const tsvData = fs.readFileSync(tsvFilePath, 'utf-8');
    const lines = tsvData.split('\n');

    for (const line of lines) {
        if (!line.trim()) continue;  // Skip empty lines

        const [MoPHCode, UnitQuantity1, UnitType1, UnitQuantity2, UnitType2,
            PackageQuantity1, PackageType1, PackageQuantity2, PackageType2,
            PackageQuantity3, PackageType3, Description] = line.split('\t');

        const drug = await Drug.findOne({ where: { MoPHCode } });
        if (drug) {
            await DrugPresentation.create({
                DrugId: drug.DrugID,
                UnitQuantity1: UnitQuantity1 || null,
                UnitType1: UnitType1 || null,
                UnitQuantity2: UnitQuantity2 || null,
                UnitType2: UnitType2 || null,
                PackageQuantity1: PackageQuantity1 || null,
                PackageType1: PackageType1 || null,
                PackageQuantity2: PackageQuantity2 || null,
                PackageType2: PackageType2 || null,
                PackageQuantity3: PackageQuantity3 || null,
                PackageType3: PackageType3 || null,
                Description: Description || null
            });
        } else {
            console.log(`Drug with MoPHCode ${MoPHCode} not found`);
        }
    }

    console.log('Presentations have been imported successfully.');
    await sequelize.close();
};

importPresentations().catch(err => console.error('Unable to connect to the database:', err));
