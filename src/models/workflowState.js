const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const WorkflowState = sequelize.define('WorkflowState', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
    },
    drug_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'DrugsUnderProcesses',
            key: 'id'
        }
    },
    current_step: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    status: {
        type: DataTypes.ENUM(
            'draft',
            'agent_in_progress',
            'pending_import_export_review',
            'import_export_review',
            'pending_quality_review',
            'quality_review',
            'pending_pricing_review',
            'pricing_review',
            'approved',
            'rejected'
        ),
        allowNull: false,
        defaultValue: 'draft'
    },
    created_by: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    assigned_to: {
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
    tableName: 'workflow_states',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['drug_id']
        },
        {
            fields: ['status']
        },
        {
            fields: ['created_by']
        }
    ]
});

module.exports = WorkflowState;
