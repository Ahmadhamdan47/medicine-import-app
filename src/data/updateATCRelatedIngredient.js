const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('ommal_medapiv2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Drug = sequelize.define('drug', {
    DrugID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ATCRelatedIngredient: { type: DataTypes.STRING(500) }
}, {
    tableName: 'drug',
    timestamps: false
});

const ATC_Code = sequelize.define('atc_code', {
    ATC_ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Name: { type: DataTypes.STRING(255), allowNull: false }
}, {
    tableName: 'atc_code',
    timestamps: false
});

const Drug_ATC_Mapping = sequelize.define('drug_atc_mapping', {
    MappingID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    DrugID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'drug', key: 'DrugID' } },
    ATC_ID: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'atc_code', key: 'ATC_ID' } }
}, {
    tableName: 'drug_atc_mapping',
    timestamps: false
});

Drug_ATC_Mapping.belongsTo(Drug, { foreignKey: 'DrugID' });
Drug_ATC_Mapping.belongsTo(ATC_Code, { foreignKey: 'ATC_ID' });

const updateATCRelatedIngredient = async () => {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const mappings = await Drug_ATC_Mapping.findAll({
        include: [
            { model: Drug, attributes: ['DrugID'] },
            { model: ATC_Code, attributes: ['Name'] }
        ]
    });

    for (const mapping of mappings) {
        const { DrugID, atc_code } = mapping;
        const atcName = atc_code.Name;

        await Drug.update(
            { ATCRelatedIngredient: atcName },
            { where: { DrugID } }
        );

        console.log(`Drug with DrugID ${DrugID} has been updated with ATCRelatedIngredient: ${atcName}`);
    }

    console.log('ATCRelatedIngredient fields have been updated successfully.');
    await sequelize.close();
};

updateATCRelatedIngredient().catch(err => console.error('Unable to connect to the database:', err));
