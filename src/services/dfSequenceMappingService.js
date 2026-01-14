// DF Sequence Mapping Service
// Provides helper functions to work with DF Sequence mappings
const DFSequenceMapping = require('../models/dfSequenceMapping');
const { Op } = require('sequelize');

class DFSequenceMappingService {
    /**
     * Get DFSequence for a given MoPH code
     * @param {string} mophCode - The MoPH code to lookup
     * @returns {Promise<string|null>} The DFSequence value or null if not found
     */
    async getDFSequenceByMophCode(mophCode) {
        try {
            if (!mophCode) return null;

            const mapping = await DFSequenceMapping.findOne({
                where: { mophCode: mophCode.toString() }
            });

            return mapping ? mapping.dfSequence : null;
        } catch (error) {
            console.error('Error getting DFSequence:', error);
            throw error;
        }
    }

    /**
     * Get MoPH codes for a given DFSequence
     * @param {string} dfSequence - The DFSequence to lookup
     * @returns {Promise<Array<string>>} Array of MoPH codes
     */
    async getMophCodesByDFSequence(dfSequence) {
        try {
            if (!dfSequence) return [];

            const mappings = await DFSequenceMapping.findAll({
                where: { dfSequence },
                attributes: ['mophCode']
            });

            return mappings.map(m => m.mophCode);
        } catch (error) {
            console.error('Error getting MoPH codes:', error);
            throw error;
        }
    }

    /**
     * Get all mappings with pagination
     * @param {number} page - Page number (default: 1)
     * @param {number} limit - Items per page (default: 100)
     * @returns {Promise<Object>} Paginated results
     */
    async getAllMappings(page = 1, limit = 100) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await DFSequenceMapping.findAndCountAll({
                limit,
                offset,
                order: [['mophCode', 'ASC']]
            });

            return {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
                data: rows
            };
        } catch (error) {
            console.error('Error getting all mappings:', error);
            throw error;
        }
    }

    /**
     * Search mappings by MoPH code or DFSequence
     * @param {string} searchTerm - Search term
     * @returns {Promise<Array>} Matching mappings
     */
    async searchMappings(searchTerm) {
        try {
            if (!searchTerm) return [];

            const mappings = await DFSequenceMapping.findAll({
                where: {
                    [Op.or]: [
                        { mophCode: { [Op.like]: `%${searchTerm}%` } },
                        { dfSequence: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                limit: 50,
                order: [['mophCode', 'ASC']]
            });

            return mappings;
        } catch (error) {
            console.error('Error searching mappings:', error);
            throw error;
        }
    }

    /**
     * Get statistics about DF Sequence mappings
     * @returns {Promise<Object>} Statistics
     */
    async getStatistics() {
        try {
            const sequelize = DFSequenceMapping.sequelize;

            // Total count
            const totalCount = await DFSequenceMapping.count();

            // Unique DF Sequences
            const uniqueSequences = await DFSequenceMapping.count({
                distinct: true,
                col: 'dfSequence'
            });

            // Most common DF Sequences
            const [commonSequences] = await sequelize.query(`
                SELECT df_sequence, COUNT(*) as count 
                FROM df_sequence_mapping 
                GROUP BY df_sequence 
                ORDER BY count DESC 
                LIMIT 10
            `);

            return {
                totalMappings: totalCount,
                uniqueSequences,
                mostCommonSequences: commonSequences
            };
        } catch (error) {
            console.error('Error getting statistics:', error);
            throw error;
        }
    }

    /**
     * Create or update a mapping
     * @param {string} mophCode - MoPH code
     * @param {string} dfSequence - DFSequence value
     * @returns {Promise<Object>} Created or updated mapping
     */
    async upsertMapping(mophCode, dfSequence) {
        try {
            if (!mophCode || !dfSequence) {
                throw new Error('MoPH code and DFSequence are required');
            }

            const [mapping, created] = await DFSequenceMapping.upsert({
                mophCode: mophCode.toString(),
                dfSequence
            });

            return { mapping, created };
        } catch (error) {
            console.error('Error upserting mapping:', error);
            throw error;
        }
    }

    /**
     * Delete a mapping by MoPH code
     * @param {string} mophCode - MoPH code
     * @returns {Promise<boolean>} True if deleted
     */
    async deleteMapping(mophCode) {
        try {
            if (!mophCode) return false;

            const deleted = await DFSequenceMapping.destroy({
                where: { mophCode: mophCode.toString() }
            });

            return deleted > 0;
        } catch (error) {
            console.error('Error deleting mapping:', error);
            throw error;
        }
    }

    /**
     * Bulk import mappings from array
     * @param {Array<Object>} mappings - Array of {mophCode, dfSequence} objects
     * @returns {Promise<Object>} Import results
     */
    async bulkImport(mappings) {
        try {
            if (!Array.isArray(mappings) || mappings.length === 0) {
                throw new Error('Mappings array is required');
            }

            const results = {
                success: 0,
                failed: 0,
                errors: []
            };

            for (const mapping of mappings) {
                try {
                    await this.upsertMapping(mapping.mophCode, mapping.dfSequence);
                    results.success++;
                } catch (error) {
                    results.failed++;
                    results.errors.push({
                        mophCode: mapping.mophCode,
                        error: error.message
                    });
                }
            }

            return results;
        } catch (error) {
            console.error('Error bulk importing mappings:', error);
            throw error;
        }
    }
}

module.exports = new DFSequenceMappingService();
