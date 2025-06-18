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
    effective_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    // Private Hospital Coverage
    private_operation_cost_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Private Operation Cost in LBP'
    },
    private_nssf_coverage_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'NSSF Coverage Percentage for Private Operations (e.g., 80.00 for 80%)'
    },
    private_nssf_coverage_amount_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'NSSF Coverage Amount for Private Operations in LBP'
    },
    private_patient_share_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Patient Share for Private Operations in LBP (calculated as private_operation_cost_lbp - private_nssf_coverage_amount_lbp)'
    },
    // Public Hospital Coverage
    public_operation_cost_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Public Operation Cost in LBP'
    },
    public_nssf_coverage_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'NSSF Coverage Percentage for Public Operations (e.g., 90.00 for 90%)'
    },
    public_nssf_coverage_amount_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'NSSF Coverage Amount for Public Operations in LBP'
    },
    public_patient_share_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Patient Share for Public Operations in LBP (calculated as public_operation_cost_lbp - public_nssf_coverage_amount_lbp)'
    },
    // Category-specific pricing for different patient categories
    category1_nssf_coverage_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'NSSF Coverage for Category 1 patients in LBP'
    },
    category2_nssf_coverage_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'NSSF Coverage for Category 2 patients in LBP'
    },
    category3_nssf_coverage_lbp: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'NSSF Coverage for Category 3 patients in LBP'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether this coverage record is active'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Additional notes about the coverage'
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
    ],
    // Add hooks to calculate patient shares automatically
    hooks: {
        beforeSave: (nssfOperationCoverage, options) => {
            // Calculate private patient share
            if (nssfOperationCoverage.private_operation_cost_lbp && nssfOperationCoverage.private_nssf_coverage_amount_lbp) {
                nssfOperationCoverage.private_patient_share_lbp = 
                    parseFloat(nssfOperationCoverage.private_operation_cost_lbp) - 
                    parseFloat(nssfOperationCoverage.private_nssf_coverage_amount_lbp);
            }
            
            // Calculate public patient share
            if (nssfOperationCoverage.public_operation_cost_lbp && nssfOperationCoverage.public_nssf_coverage_amount_lbp) {
                nssfOperationCoverage.public_patient_share_lbp = 
                    parseFloat(nssfOperationCoverage.public_operation_cost_lbp) - 
                    parseFloat(nssfOperationCoverage.public_nssf_coverage_amount_lbp);
            }
        }
    }
});

module.exports = NSSFOperationCoverage;
