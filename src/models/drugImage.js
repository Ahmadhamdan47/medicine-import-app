const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DrugImage = sequelize.define('DrugImage', {
    ImageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Drug', // This is a reference to another model
            key: 'DrugID', // This is the column name of the referenced model
        }
    },
    ImagePath: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ImageExtension: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING(500)
    },
    IsDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    CreatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE
    },
    CreatedBy: {
        type: DataTypes.UUID
    },
    UpdatedBy: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'drugimage',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DrugImage;