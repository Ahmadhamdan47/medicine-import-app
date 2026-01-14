// Form to DF Sequence Mapping Routes
const express = require('express');
const router = express.Router();
const formDFSequenceMappingService = require('../services/formDFSequenceMappingService');
const { authenticateToken } = require('../middlewares/auth');

// Get DFSequence by form name
router.get('/by-form/:formName', async (req, res) => {
    try {
        const { formName } = req.params;
        const dfSequence = await formDFSequenceMappingService.getDFSequenceByFormName(formName);

        if (!dfSequence) {
            return res.status(404).json({
                success: false,
                message: 'Mapping not found for the given form name'
            });
        }

        res.json({
            success: true,
            data: {
                formName,
                dfSequence
            }
        });
    } catch (error) {
        console.error('Error getting DFSequence:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving DFSequence mapping',
            error: error.message
        });
    }
});

// Get all mappings with pagination
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 100, search } = req.query;

        let result;
        if (search) {
            const mappings = await formDFSequenceMappingService.searchMappings(search);
            result = {
                total: mappings.length,
                page: 1,
                limit: mappings.length,
                totalPages: 1,
                data: mappings
            };
        } else {
            result = await formDFSequenceMappingService.getAllMappings(
                parseInt(page),
                parseInt(limit)
            );
        }

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error getting mappings:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving mappings',
            error: error.message
        });
    }
});

// Get forms by DFSequence
router.get('/by-sequence/:dfSequence', async (req, res) => {
    try {
        const { dfSequence } = req.params;
        const forms = await formDFSequenceMappingService.getFormsByDFSequence(dfSequence);

        res.json({
            success: true,
            data: {
                dfSequence,
                forms,
                count: forms.length
            }
        });
    } catch (error) {
        console.error('Error getting forms:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving forms',
            error: error.message
        });
    }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await formDFSequenceMappingService.getStatistics();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving statistics',
            error: error.message
        });
    }
});

// Create or update a mapping
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { formName, dfSequence, sequenceNumber } = req.body;

        if (!formName || !dfSequence || !sequenceNumber) {
            return res.status(400).json({
                success: false,
                message: 'Form name, DFSequence, and sequence number are required'
            });
        }

        const result = await formDFSequenceMappingService.upsertMapping(formName, dfSequence, sequenceNumber);

        res.json({
            success: true,
            message: result.created ? 'Mapping created successfully' : 'Mapping updated successfully',
            data: result.mapping
        });
    } catch (error) {
        console.error('Error upserting mapping:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating/updating mapping',
            error: error.message
        });
    }
});

// Delete a mapping
router.delete('/', authenticateToken, async (req, res) => {
    try {
        const { formName, dfSequence } = req.body;
        
        if (!formName || !dfSequence) {
            return res.status(400).json({
                success: false,
                message: 'Form name and DFSequence are required'
            });
        }

        const deleted = await formDFSequenceMappingService.deleteMapping(formName, dfSequence);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Mapping not found'
            });
        }

        res.json({
            success: true,
            message: 'Mapping deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting mapping:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting mapping',
            error: error.message
        });
    }
});

module.exports = router;
