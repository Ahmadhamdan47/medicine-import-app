const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const SwiftPayment = sequelize.define('SwiftPayment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    importationRequestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'importation_requests',
            key: 'id'
        }
    },
    fileId: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fileName: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    filePath: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    checksum: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    transactionReference: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    paymentAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: 'USD'
    },
    senderBank: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    receiverBank: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'approved', 'rejected', 'verification_required'],
        defaultValue: 'pending'
    },
    approvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'useraccounts',
            key: 'UserId'
        }
    },
    approvedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'swift_payments',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
});

module.exports = SwiftPayment;
