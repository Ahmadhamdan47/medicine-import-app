const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const ImportationAnnouncement = sequelize.define('ImportationAnnouncement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM,
        values: ['general', 'urgent', 'policy', 'deadline', 'maintenance'],
        defaultValue: 'general'
    },
    priority: {
        type: DataTypes.ENUM,
        values: ['low', 'medium', 'high', 'critical'],
        defaultValue: 'medium'
    },
    targetRole: {
        type: DataTypes.STRING(50),
        allowNull: true // null means visible to all roles
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    attachmentFileId: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
        allowNull: false,
        references: {
            model: 'useraccounts',
            key: 'UserId'
        }
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'importation_announcements',
    timestamps: true,
    createdAt: 'createdDate',
    updatedAt: 'updatedDate'
});

module.exports = ImportationAnnouncement;
