const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const FileStorage = sequelize.define('FileStorage', {
    fileId: {
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    originalName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    checksum: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    signedUrl: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    urlExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    storageProvider: {
        type: DataTypes.ENUM,
        values: ['local', 'aws_s3', 'azure_blob', 'google_cloud'],
        defaultValue: 'local'
    },
    bucketName: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    virusScanStatus: {
        type: DataTypes.ENUM,
        values: ['pending', 'clean', 'infected', 'failed'],
        defaultValue: 'pending'
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'useraccounts',
            key: 'UserId'
        }
    },
    createdDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'file_storage',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
});

module.exports = FileStorage;
