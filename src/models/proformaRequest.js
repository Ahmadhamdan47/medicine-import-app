const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const ProformaRequest = sequelize.define('ProformaRequest', {
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
    invoiceNumber: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    invoiceDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: 'USD'
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'signed', 'rejected', 'requires_correction'],
        defaultValue: 'pending'
    },
    signedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'useraccounts',
            key: 'UserId'
        }
    },
    signedDate: {
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
    tableName: 'proforma_requests',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
});

module.exports = ProformaRequest;
