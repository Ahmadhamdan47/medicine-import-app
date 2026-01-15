const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DrugChangeRequest = sequelize.define('DrugChangeRequest', {
    ChangeRequestId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    DrugID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Reference to the drug being edited'
    },
    RequestedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'UserId from useraccounts who requested the change'
    },
    RequestedByRole: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Role name at the time of request'
    },
    Status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
    },
    ChangeType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Type of change: update, create, delete'
    },
    ChangesJSON: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'All proposed changes as JSON object'
    },
    PreviousValuesJSON: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Original values before changes for comparison'
    },
    ReviewedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Admin UserId who approved/rejected'
    },
    ReviewedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ReviewComments: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Admin comments on approval/rejection'
    }
}, {
    tableName: 'drug_change_requests',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    indexes: [
        {
            name: 'idx_drug_id',
            fields: ['DrugID']
        },
        {
            name: 'idx_status',
            fields: ['Status']
        },
        {
            name: 'idx_requested_by',
            fields: ['RequestedBy']
        },
        {
            name: 'idx_change_request_status_created',
            fields: ['Status', 'CreatedAt']
        }
    ]
});

// Define associations
DrugChangeRequest.associate = (models) => {
    // Requester association
    DrugChangeRequest.belongsTo(models.UserAccounts, {
        foreignKey: 'RequestedBy',
        as: 'requester'
    });
    
    // Reviewer association
    DrugChangeRequest.belongsTo(models.UserAccounts, {
        foreignKey: 'ReviewedBy',
        as: 'reviewer'
    });
    
    // Drug association
    DrugChangeRequest.belongsTo(models.Drug, {
        foreignKey: 'DrugID',
        as: 'drug'
    });
};

module.exports = DrugChangeRequest;
