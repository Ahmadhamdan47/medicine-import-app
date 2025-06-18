const { DataTypes } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

const NSSFCoverage = sequelize.define('nssf_coverage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    drug_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'drug',
            key: 'DrugID'
        }
    },
    effective_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    public_price_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Public Price (MoPH) in LBP'
    },
    nssf_price_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'NSSF Price in LBP'
    },
    nssf_coverage_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'NSSF Coverage Percentage (e.g., 80.00 for 80%)'
    },
    nssf_coverage_amount_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'NSSF Coverage Amount in LBP'
    },
    real_nssf_coverage_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Real NSSF Coverage Percentage per public price (MoPH) - calculated as (nssf_coverage_amount_lbp / public_price_lbp) * 100'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this coverage record is currently active'
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
    tableName: 'nssf_coverage',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['drug_id', 'effective_date'],
            name: 'idx_coverage_drug_date'
        },
        {
            fields: ['drug_id', 'is_active'],
            name: 'idx_coverage_drug_active'
        },
        {
            unique: true,
            fields: ['drug_id', 'effective_date'],
            name: 'unique_coverage_drug_date'
        }
    ],
    hooks: {
        beforeSave: (instance) => {
            // Auto-calculate real_nssf_coverage_percentage if values are available
            if (instance.public_price_lbp && instance.nssf_coverage_amount_lbp && instance.public_price_lbp > 0) {
                instance.real_nssf_coverage_percentage = (instance.nssf_coverage_amount_lbp / instance.public_price_lbp) * 100;
            }
        }
    }
});

module.exports = NSSFCoverage;
