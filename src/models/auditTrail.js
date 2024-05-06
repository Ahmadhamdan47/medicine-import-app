const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const AuditTrail = sequelize.define('AuditTrail', {
    AuditTrailId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    TableName: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    RecordId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Operation: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'UserAccounts',
            key: 'UserId'
        }
    },
    Timestamp: {
        type: DataTypes.DATE,
        allowNull: true
    },
    OldValue: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    NewValue: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'audittrail',
    timestamps: false // Assuming there are no 'createdAt' and 'updatedAt' fields in the table
});

module.exports = AuditTrail;