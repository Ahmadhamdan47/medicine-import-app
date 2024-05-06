const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const Route = sequelize.define('Route', {
    RouteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    Code: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    NameAr: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    Definition: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    IsChild: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    ParentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Route',
            key: 'RouteId'
        }
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
    tableName: 'route',
    timestamps: false
});

module.exports = Route;