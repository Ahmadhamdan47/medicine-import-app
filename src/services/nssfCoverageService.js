const { Op } = require('sequelize');
const NSSFCoverage = require('../models/nssfCoverage');
const NewDrug = require('../models/pharmacyDrug');

class NSSFCoverageService {
    
    /**
     * Create a new NSSF coverage record
     */
    async createCoverage(coverageData) {
        try {
            const coverage = await NSSFCoverage.create(coverageData);
            return coverage;
        } catch (error) {
            throw new Error(`Error creating NSSF coverage: ${error.message}`);
        }
    }

    /**
     * Get all NSSF coverage records with pagination
     */
    async getAllCoverage(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            const whereClause = {};

            // Apply filters
            if (filters.drug_id) {
                whereClause.drug_id = filters.drug_id;
            }
            if (filters.is_active !== undefined) {
                whereClause.is_active = filters.is_active;
            }
            if (filters.effective_date_from) {
                whereClause.effective_date = {
                    [Op.gte]: filters.effective_date_from
                };
            }
            if (filters.effective_date_to) {
                whereClause.effective_date = {
                    ...whereClause.effective_date,
                    [Op.lte]: filters.effective_date_to
                };
            }

            const { count, rows } = await NSSFCoverage.findAndCountAll({
                where: whereClause,
                include: [{
                    model: NewDrug,
                    as: 'drug',
                    attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'ATC_Code', 'Form', 'Presentation']
                }],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['effective_date', 'DESC']],
                attributes: {
                    include: [
                        'id',
                        'drug_id', 
                        'effective_date',
                        'public_price_lbp',
                        'nssf_price_lbp',
                        'nssf_coverage_percentage',
                        'nssf_coverage_amount_lbp',
                        'real_nssf_coverage_percentage',
                        'real_nssf_coverage',
                        'is_active',
                        'created_at',
                        'updated_at'
                    ]
                }
            });

            return {
                coverages: rows,
                totalCount: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error(`Error retrieving NSSF coverage records: ${error.message}`);
        }
    }

    /**
     * Get NSSF coverage by ID
     */
    async getCoverageById(id) {
        try {
            const coverage = await NSSFCoverage.findByPk(id, {
                include: [{
                    model: NewDrug,
                    as: 'drug',
                    attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'ATC_Code', 'Form', 'Presentation']
                }],
                attributes: {
                    include: [
                        'id',
                        'drug_id', 
                        'effective_date',
                        'public_price_lbp',
                        'nssf_price_lbp',
                        'nssf_coverage_percentage',
                        'nssf_coverage_amount_lbp',
                        'real_nssf_coverage_percentage',
                        'real_nssf_coverage',
                        'is_active',
                        'created_at',
                        'updated_at'
                    ]
                }
            });

            if (!coverage) {
                throw new Error('NSSF coverage record not found');
            }

            return coverage;
        } catch (error) {
            throw new Error(`Error retrieving NSSF coverage: ${error.message}`);
        }
    }

    /**
     * Get active NSSF coverage for a specific drug
     */
    async getActiveCoverageByDrugId(drugId) {
        try {
            const coverage = await NSSFCoverage.findOne({
                where: {
                    drug_id: drugId,
                    is_active: true
                },
                include: [{
                    model: NewDrug,
                    as: 'drug',
                    attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'ATC_Code', 'Form', 'Presentation']
                }],
                order: [['effective_date', 'DESC']],
                attributes: {
                    include: [
                        'id',
                        'drug_id', 
                        'effective_date',
                        'public_price_lbp',
                        'nssf_price_lbp',
                        'nssf_coverage_percentage',
                        'nssf_coverage_amount_lbp',
                        'real_nssf_coverage_percentage',
                        'real_nssf_coverage',
                        'is_active',
                        'created_at',
                        'updated_at'
                    ]
                }
            });

            return coverage;
        } catch (error) {
            throw new Error(`Error retrieving active NSSF coverage for drug ${drugId}: ${error.message}`);
        }
    }

    /**
     * Get all NSSF coverage records for a specific drug (history)
     */
    async getCoverageHistoryByDrugId(drugId) {
        try {
            const coverages = await NSSFCoverage.findAll({
                where: {
                    drug_id: drugId
                },
                include: [{
                    model: NewDrug,
                    as: 'drug',
                    attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'ATC_Code', 'Form', 'Presentation']
                }],
                order: [['effective_date', 'DESC']],
                attributes: {
                    include: [
                        'id',
                        'drug_id', 
                        'effective_date',
                        'public_price_lbp',
                        'nssf_price_lbp',
                        'nssf_coverage_percentage',
                        'nssf_coverage_amount_lbp',
                        'real_nssf_coverage_percentage',
                        'real_nssf_coverage',
                        'is_active',
                        'created_at',
                        'updated_at'
                    ]
                }
            });

            return coverages;
        } catch (error) {
            throw new Error(`Error retrieving NSSF coverage history for drug ${drugId}: ${error.message}`);
        }
    }

    /**
     * Update NSSF coverage record
     */
    async updateCoverage(id, updateData) {
        try {
            const coverage = await NSSFCoverage.findByPk(id);
            
            if (!coverage) {
                throw new Error('NSSF coverage record not found');
            }

            await coverage.update(updateData);
            
            // Return updated coverage with drug information
            return await this.getCoverageById(id);
        } catch (error) {
            throw new Error(`Error updating NSSF coverage: ${error.message}`);
        }
    }

    /**
     * Delete NSSF coverage record (soft delete by setting is_active to false)
     */
    async deleteCoverage(id) {
        try {
            const coverage = await NSSFCoverage.findByPk(id);
            
            if (!coverage) {
                throw new Error('NSSF coverage record not found');
            }

            await coverage.update({ is_active: false });
            
            return { message: 'NSSF coverage record deactivated successfully' };
        } catch (error) {
            throw new Error(`Error deleting NSSF coverage: ${error.message}`);
        }
    }

    /**
     * Hard delete NSSF coverage record
     */
    async hardDeleteCoverage(id) {
        try {
            const coverage = await NSSFCoverage.findByPk(id);
            
            if (!coverage) {
                throw new Error('NSSF coverage record not found');
            }

            await coverage.destroy();
            
            return { message: 'NSSF coverage record permanently deleted' };
        } catch (error) {
            throw new Error(`Error permanently deleting NSSF coverage: ${error.message}`);
        }
    }

    /**
     * Calculate patient share after NSSF coverage
     */
    async calculatePatientShare(drugId, requestedAmount) {
        try {
            const coverage = await this.getActiveCoverageByDrugId(drugId);
            
            if (!coverage) {
                return {
                    totalCost: requestedAmount,
                    nssfCoverage: 0,
                    patientShare: requestedAmount,
                    coveragePercentage: 0,
                    message: 'No active NSSF coverage found for this drug'
                };
            }

            const nssfCoverageAmount = coverage.real_nssf_coverage || coverage.nssf_coverage_amount_lbp || 0;
            const patientShare = Math.max(0, requestedAmount - nssfCoverageAmount);

            return {
                totalCost: requestedAmount,
                nssfCoverage: Math.min(nssfCoverageAmount, requestedAmount),
                patientShare: patientShare,
                coveragePercentage: coverage.real_nssf_coverage_percentage || coverage.nssf_coverage_percentage || 0,
                publicPrice: coverage.public_price_lbp,
                nssfPrice: coverage.nssf_price_lbp,
                coverage: coverage
            };
        } catch (error) {
            throw new Error(`Error calculating patient share: ${error.message}`);
        }
    }

    /**
     * Search NSSF coverage by drug name
     */
    async searchCoverageByDrugName(drugName, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await NSSFCoverage.findAndCountAll({
                include: [{
                    model: NewDrug,
                    as: 'drug',
                    where: {
                        [Op.or]: [
                            { DrugName: { [Op.like]: `%${drugName}%` } },
                            { DrugNameAR: { [Op.like]: `%${drugName}%` } },
                            { ATC_Code: { [Op.like]: `%${drugName}%` } },
                            { Form: { [Op.like]: `%${drugName}%` } }
                        ]
                    },
                    attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'ATC_Code', 'Form', 'Presentation']
                }],
                where: {
                    is_active: true
                },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['effective_date', 'DESC']],
                attributes: {
                    include: [
                        'id',
                        'drug_id', 
                        'effective_date',
                        'public_price_lbp',
                        'nssf_price_lbp',
                        'nssf_coverage_percentage',
                        'nssf_coverage_amount_lbp',
                        'real_nssf_coverage_percentage',
                        'real_nssf_coverage',
                        'is_active',
                        'created_at',
                        'updated_at'
                    ]
                }
            });

            return {
                coverages: rows,
                totalCount: count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(count / limit)
            };
        } catch (error) {
            throw new Error(`Error searching NSSF coverage by drug name: ${error.message}`);
        }
    }
}

module.exports = new NSSFCoverageService();
