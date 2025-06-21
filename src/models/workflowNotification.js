const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const WorkflowNotification = sequelize.define('WorkflowNotification', {
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
    step_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },    notified_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    acknowledged_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    acknowledged_by: {
        type: DataTypes.STRING(100),
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
    tableName: 'workflow_notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = WorkflowNotification;
