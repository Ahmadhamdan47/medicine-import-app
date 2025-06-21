const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const QualityReview = sequelize.define('QualityReview', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    workflow_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'workflow_states',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'under_review'),
        allowNull: false,
        defaultValue: 'pending'
    },
    report: {
        type: DataTypes.TEXT,
        allowNull: true
    },    reviewed_by: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'quality_reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = QualityReview;
