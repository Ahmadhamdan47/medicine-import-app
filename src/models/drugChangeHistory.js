const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DrugChangeHistory = sequelize.define('DrugChangeHistory', {
    HistoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to the drug that was changed'
    },
    ChangeRequestId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Links to change request if change came from approval system'
    },
    ChangedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'UserId who made the change'
    },
    ChangedByRole: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Role of the user at time of change'
    },
    ChangeType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Type of operation: update, create, delete'
    },
    FieldName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Specific field that was changed'
    },
    OldValue: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Previous value of the field'
    },
    NewValue: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'New value of the field'
    },
    ApprovedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Admin UserId who approved the change (if applicable)'
    },
    ChangeTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'drug_change_history',
    timestamps: false,
    indexes: [
        {
            name: 'idx_drug_id',
            fields: ['DrugID']
        },
        {
            name: 'idx_changed_by',
            fields: ['ChangedBy']
        },
        {
            name: 'idx_change_timestamp',
            fields: ['ChangeTimestamp']
        },
        {
            name: 'idx_history_drug_timestamp',
            fields: ['DrugID', 'ChangeTimestamp']
        }
    ]
});

// Define associations
DrugChangeHistory.associate = (models) => {
    // User who made the change
    DrugChangeHistory.belongsTo(models.UserAccounts, {
        foreignKey: 'ChangedBy',
        as: 'changer'
    });
    
    // Admin who approved
    DrugChangeHistory.belongsTo(models.UserAccounts, {
        foreignKey: 'ApprovedBy',
        as: 'approver'
    });
    
    // Drug association
    DrugChangeHistory.belongsTo(models.Drug, {
        foreignKey: 'DrugID',
        as: 'drug'
    });
    
    // Change request association
    DrugChangeHistory.belongsTo(models.DrugChangeRequest, {
        foreignKey: 'ChangeRequestId',
        as: 'changeRequest'
    });
};

module.exports = DrugChangeHistory;
