const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const ImportationRequest = sequelize.define('ImportationRequest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    agentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'useraccounts',
            key: 'UserId'
        }
    },
    drugName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    brandName: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    manufacturerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'manufacturer',
            key: 'ManufacturerId'
        }
    },
    quantityRequested: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    totalValue: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending', 'under_review', 'rfd_required', 'proforma_required', 'swift_required', 'shipping', 'inspection', 'approved', 'rejected'],
        defaultValue: 'pending'
    },
    urgencyLevel: {
        type: DataTypes.ENUM,
        values: ['low', 'medium', 'high', 'critical'],
        defaultValue: 'medium'
    },
    purpose: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rfdApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    proformaApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    swiftApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    shippingMethod: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    estimatedArrival: {
        type: DataTypes.DATE,
        allowNull: true
    },
    actualArrival: {
        type: DataTypes.DATE,
        allowNull: true
    },
    borderCrossingInfo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    warehouseLocation: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    batchNumbers: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    inspectionResult: {
        type: DataTypes.ENUM,
        values: ['pending', 'passed', 'failed', 'conditional'],
        defaultValue: 'pending'
    },
    inspectionNotes: {
        type: DataTypes.TEXT,
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
    tableName: 'importation_requests',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
});

module.exports = ImportationRequest;
