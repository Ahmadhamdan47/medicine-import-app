const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('./Drug');
const Route = require('./Route');

const DrugRoute = sequelize.define('DrugRoute', {
    DrugRouteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Drug,
            key: 'DrugID'
        }
    },
    RouteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Route,
            key: 'RouteId'
        }
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    UpdatedDate: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'DrugRoute',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = DrugRoute;