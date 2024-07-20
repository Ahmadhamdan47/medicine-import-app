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

const Dosage = sequelize.define('Dosage', {
    DosageId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Numerator1: { type: DataTypes.INTEGER, allowNull: false },
    Numerator1Unit: { type: DataTypes.STRING(50) },
    Denominator1: { type: DataTypes.INTEGER, allowNull: false },
    Denominator1Unit: { type: DataTypes.STRING(50) },
    Numerator2: { type: DataTypes.INTEGER, allowNull: false },
    Numerator2Unit: { type: DataTypes.STRING(50) },
    Denominator2: { type: DataTypes.INTEGER, allowNull: false },
    Denominator2Unit: { type: DataTypes.STRING(50) },
    Numerator3: { type: DataTypes.INTEGER, allowNull: false },
    Numerator3Unit: { type: DataTypes.STRING(50) },
    Denominator3: { type: DataTypes.INTEGER, allowNull: false },
    Denominator3Unit: { type: DataTypes.STRING(50) },
    CreatedDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    UpdatedDate: { type: DataTypes.DATE },
    DrugId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Drug, key: 'DrugID' } }
}, {
    tableName: 'dosage',
    timestamps: false
});

const importDosages = async () => {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const tsvFilePath = path.join(__dirname, 'Dosage.tsv');
    const tsvData = fs.readFileSync(tsvFilePath, 'utf-8');
    const lines = tsvData.split('\n');

    for (const line of lines) {
        const [MoPHCode, Numerator1, Numerator1Unit, Denominator1, Denominator1Unit,
            Numerator2, Numerator2Unit, Denominator2, Denominator2Unit,
            Numerator3, Numerator3Unit, Denominator3, Denominator3Unit] = line.split('\t');

        const drug = await Drug.findOne({ where: { MoPHCode } });
        if (drug) {
            await Dosage.create({
                DrugId: drug.DrugID,
                Numerator1,
                Numerator1Unit,
                Denominator1,
                Denominator1Unit,
                Numerator2,
                Numerator2Unit,
                Denominator2,
                Denominator2Unit,
                Numerator3,
                Numerator3Unit,
                Denominator3,
                Denominator3Unit
            });
        } else {
            console.log(`Drug with MoPHCode ${MoPHCode} not found`);
        }
    }

    console.log('Dosages have been imported successfully.');
    await sequelize.close();
};

importDosages().catch(err => console.error('Unable to connect to the database:', err));
