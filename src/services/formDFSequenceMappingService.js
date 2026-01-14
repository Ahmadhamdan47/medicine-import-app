// Form to DF Sequence Mapping Service
const FormDFSequenceMapping = require('../models/formDFSequenceMapping');
const { Op } = require('sequelize');

class FormDFSequenceMappingService {
    async getDFSequenceByFormName(formName) {
        try {
            if (!formName) return null;

            const mapping = await FormDFSequenceMapping.findOne({
                where: { formName: formName.toString() }
            });

            return mapping ? mapping.dfSequence : null;
        } catch (error) {
            console.error('Error getting DFSequence by form:', error);
            throw error;
        }
    }

    async getFormsByDFSequence(dfSequence) {
        try {
            if (!dfSequence) return [];

            const mappings = await FormDFSequenceMapping.findAll({
                where: { dfSequence },
                attributes: ['formName']
            });

            return mappings.map(m => m.formName);
        } catch (error) {
            console.error('Error getting forms by DFSequence:', error);
            throw error;
        }
    }

    async getAllMappings(page = 1, limit = 100) {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await FormDFSequenceMapping.findAndCountAll({
                limit,
                offset,
                order: [['sequenceNumber', 'ASC'], ['formName', 'ASC']]
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

    async searchMappings(searchTerm) {
        try {
            if (!searchTerm) return [];

            const mappings = await FormDFSequenceMapping.findAll({
                where: {
                    [Op.or]: [
                        { formName: { [Op.like]: `%${searchTerm}%` } },
                        { dfSequence: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                limit: 50,
                order: [['sequenceNumber', 'ASC']]
            });

            return mappings;
        } catch (error) {
            console.error('Error searching mappings:', error);
            throw error;
        }
    }

    async getStatistics() {
        try {
            const sequelize = FormDFSequenceMapping.sequelize;

            const totalCount = await FormDFSequenceMapping.count();
            const uniqueForms = await FormDFSequenceMapping.count({
                distinct: true,
                col: 'formName'
            });
            const uniqueSequences = await FormDFSequenceMapping.count({
                distinct: true,
                col: 'dfSequence'
            });

            const [formsPerSeq] = await sequelize.query(`
                SELECT df_sequence, COUNT(*) as form_count 
                FROM form_df_sequence_mapping 
                GROUP BY df_sequence 
                ORDER BY form_count DESC 
                LIMIT 10
            `);

            return {
                totalMappings: totalCount,
                uniqueForms,
                uniqueSequences,
                formsPerSequence: formsPerSeq
            };
        } catch (error) {
            console.error('Error getting statistics:', error);
            throw error;
        }
    }

    async upsertMapping(formName, dfSequence, sequenceNumber) {
        try {
            if (!formName || !dfSequence || !sequenceNumber) {
                throw new Error('Form name, DFSequence, and sequence number are required');
            }

            const [mapping, created] = await FormDFSequenceMapping.upsert({
                formName,
                dfSequence,
                sequenceNumber: parseInt(sequenceNumber)
            });

            return { mapping, created };
        } catch (error) {
            console.error('Error upserting mapping:', error);
            throw error;
        }
    }

    async deleteMapping(formName, dfSequence) {
        try {
            if (!formName || !dfSequence) return false;

            const deleted = await FormDFSequenceMapping.destroy({
                where: { 
                    formName: formName.toString(),
                    dfSequence: dfSequence.toString()
                }
            });

            return deleted > 0;
        } catch (error) {
            console.error('Error deleting mapping:', error);
            throw error;
        }
    }
}

module.exports = new FormDFSequenceMappingService();
