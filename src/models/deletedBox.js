const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const DeletedBox = sequelize.define('DeletedBox', {
    DeletedBoxId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Original box fields
    OriginalBoxId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Original BoxId from the box table'
    },
    DonationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    BoxLabel: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    NumberOfPacks: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    inspected: {
        type: DataTypes.ENUM('inspected', 'not_inspected', 'rejected'),
        allowNull: true,
    },
    CreatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Original creation date of the box'
    },
    // Deletion metadata
    DeletedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    DeletedBy: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'User who deleted the box'
    },
    DeletionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Optional reason for deletion'
    }
}, {
    tableName: 'deleted_boxes',
    timestamps: false,
});

module.exports = DeletedBox;
