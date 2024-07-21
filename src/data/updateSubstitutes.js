const { Sequelize, DataTypes, Op } = require('sequelize');
const sequelize = new Sequelize('ommal_medapiv2', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Drug = sequelize.define('drug', {
    DrugID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ATCRelatedIngredient: { type: DataTypes.STRING(500) },
    Route: { type: DataTypes.STRING(255) },
    RouteParent: { type: DataTypes.STRING(255) },
    Dosage: { type: DataTypes.STRING(255) },
    DfSequence: { type: DataTypes.STRING(255) }
}, {
    tableName: 'drug',
    timestamps: false
});

const Substitute = sequelize.define('substitute', {
    SubstituteId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    Drug: { type: DataTypes.INTEGER, allowNull: true, references: { model: Drug, key: 'DrugID' } },
    Substitute: { type: DataTypes.INTEGER, allowNull: true, references: { model: Drug, key: 'DrugID' } }
}, {
    tableName: 'substitute',
    timestamps: false
});

const updateSubstitutes = async () => {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Truncate the substitute table
    await Substitute.destroy({ truncate: true });
    console.log('Substitute table has been truncated successfully.');

    const drugs = await Drug.findAll();

    for (let i = 0; i < drugs.length; i++) {
        for (let j = i + 1; j < drugs.length; j++) {
            const drug1 = drugs[i];
            const drug2 = drugs[j];

            const sameATC = drug1.ATCRelatedIngredient === drug2.ATCRelatedIngredient;
            const sameRoute = (drug1.Route === drug2.Route) || (drug1.RouteParent === drug2.RouteParent);
            const sameDosage = drug1.Dosage === drug2.Dosage;
            const sameDfSequence = drug1.DfSequence === drug2.DfSequence;

            if (sameATC && sameRoute && sameDosage && sameDfSequence) {
                await Substitute.create({
                    Drug: drug1.DrugID,
                    Substitute: drug2.DrugID
                });
                await Substitute.create({
                    Drug: drug2.DrugID,
                    Substitute: drug1.DrugID
                });
                console.log(`Substitute pair added: DrugID ${drug1.DrugID} and DrugID ${drug2.DrugID}`);
            }
        }
    }

    console.log('Substitutes have been updated successfully.');
    await sequelize.close();
};

updateSubstitutes().catch(err => console.error('Unable to connect to the database:', err));
