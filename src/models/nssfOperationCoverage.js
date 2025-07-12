const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');


const NSSFOperationCoverage = sequelize.define('nssf_operation_coverage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    operation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'operation',
            key: 'ID'
        }
    },
    nssf_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'NSSF Code for the operation'
    },
    surgeon: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Surgeon fee in LBP'
    },
    anesthetist: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Anesthetist fee in LBP'
    },
    consultants: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Consultants fee in LBP'
    },
    hospital1: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Hospital Category 1 fee in LBP'
    },
    hospital2: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Hospital Category 2 fee in LBP'
    },
    hospital3: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Hospital Category 3 fee in LBP'
    },
    total1: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Total for Category 1 in LBP'
    },
    total2: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Total for Category 2 in LBP'
    },
    total3: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Total for Category 3 in LBP'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes about the coverage'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this coverage record is active'
    }
}, {
    sequelize,
    tableName: 'nssf_operation_coverage',
    timestamps: true,
    indexes: [
        {
            unique: false,
            fields: ['operation_id']
        },
        {
            unique: false,
            fields: ['effective_date']
        },
        {
            unique: false,
            fields: ['is_active']
        }
    ]
});

module.exports = NSSFOperationCoverage;
