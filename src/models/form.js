const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');


const Form = sequelize.define('Form', {
    FormId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ParentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: FormParent,
            key: 'FormParentId',
        }
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CreatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    UpdatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    tableName: 'form',
    timestamps: false
});

module.exports = Form;