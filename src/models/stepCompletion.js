const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const StepCompletion = sequelize.define('StepCompletion', {
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
    },    completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    completed_by: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    approved_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    approved_by: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    rejected_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    rejected_by: {
        type: DataTypes.STRING(100),
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
    tableName: 'step_completions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            unique: true,
            fields: ['workflow_id', 'step_number']
        }
    ]
});

module.exports = StepCompletion;
