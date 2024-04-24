const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');


const ATC_Code = sequelize.define('ATC_Code', {
    ATC_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Description: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    ParentID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ATC_Code',
            key: 'ATC_ID'
        }
    }
}, {
    tableName: 'ATC_Code',
    timestamps: false 
});

module.exports = ATC_Code;