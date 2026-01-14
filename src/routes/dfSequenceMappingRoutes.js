// DF Sequence Mapping Routes
// API endpoints for managing MoPH code to DFSequence mappings
const express = require('express');
const router = express.Router();
const dfSequenceMappingService = require('../services/dfSequenceMappingService');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/df-sequence-mapping/{mophCode}:
 *   get:
 *     summary: Get DFSequence by MoPH code
 *     tags: [DFSequenceMapping]
 *     parameters:
 *       - in: path
 *         name: mophCode
 *         required: true
 *         schema:
 *           type: string
 *         description: MoPH code
 *     responses:
 *       200:
 *         description: DFSequence found
 *       404:
 *         description: Mapping not found
 */
router.get('/:mophCode', async (req, res) => {
    try {
        const { mophCode } = req.params;
        const dfSequence = await dfSequenceMappingService.getDFSequenceByMophCode(mophCode);

        if (!dfSequence) {
            return res.status(404).json({
                success: false,
                message: 'Mapping not found for the given MoPH code'
            });
        }

        res.json({
            success: true,
            data: {
                mophCode,
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

/**
 * @swagger
 * /api/df-sequence-mapping:
 *   get:
 *     summary: Get all mappings with pagination
 *     tags: [DFSequenceMapping]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for MoPH code or DFSequence
 *     responses:
 *       200:
 *         description: List of mappings
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 100, search } = req.query;

        let result;
        if (search) {
            const mappings = await dfSequenceMappingService.searchMappings(search);
            result = {
                total: mappings.length,
                page: 1,
                limit: mappings.length,
                totalPages: 1,
                data: mappings
            };
        } else {
            result = await dfSequenceMappingService.getAllMappings(
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

/**
 * @swagger
 * /api/df-sequence-mapping/by-sequence/{dfSequence}:
 *   get:
 *     summary: Get MoPH codes by DFSequence
 *     tags: [DFSequenceMapping]
 *     parameters:
 *       - in: path
 *         name: dfSequence
 *         required: true
 *         schema:
 *           type: string
 *         description: DFSequence value
 *     responses:
 *       200:
 *         description: List of MoPH codes
 */
router.get('/by-sequence/:dfSequence', async (req, res) => {
    try {
        const { dfSequence } = req.params;
        const mophCodes = await dfSequenceMappingService.getMophCodesByDFSequence(dfSequence);

        res.json({
            success: true,
            data: {
                dfSequence,
                mophCodes,
                count: mophCodes.length
            }
        });
    } catch (error) {
        console.error('Error getting MoPH codes:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving MoPH codes',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/df-sequence-mapping/stats:
 *   get:
 *     summary: Get statistics about DF Sequence mappings
 *     tags: [DFSequenceMapping]
 *     responses:
 *       200:
 *         description: Statistics
 */
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await dfSequenceMappingService.getStatistics();

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

/**
 * @swagger
 * /api/df-sequence-mapping:
 *   post:
 *     summary: Create or update a mapping
 *     tags: [DFSequenceMapping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mophCode
 *               - dfSequence
 *             properties:
 *               mophCode:
 *                 type: string
 *               dfSequence:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mapping created/updated
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { mophCode, dfSequence } = req.body;

        if (!mophCode || !dfSequence) {
            return res.status(400).json({
                success: false,
                message: 'MoPH code and DFSequence are required'
            });
        }

        const result = await dfSequenceMappingService.upsertMapping(mophCode, dfSequence);

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

/**
 * @swagger
 * /api/df-sequence-mapping/bulk:
 *   post:
 *     summary: Bulk import mappings
 *     tags: [DFSequenceMapping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mappings
 *             properties:
 *               mappings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mophCode:
 *                       type: string
 *                     dfSequence:
 *                       type: string
 *     responses:
 *       200:
 *         description: Import results
 */
router.post('/bulk', authenticateToken, async (req, res) => {
    try {
        const { mappings } = req.body;

        if (!mappings || !Array.isArray(mappings)) {
            return res.status(400).json({
                success: false,
                message: 'Mappings array is required'
            });
        }

        const result = await dfSequenceMappingService.bulkImport(mappings);

        res.json({
            success: true,
            message: 'Bulk import completed',
            data: result
        });
    } catch (error) {
        console.error('Error bulk importing:', error);
        res.status(500).json({
            success: false,
            message: 'Error performing bulk import',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /api/df-sequence-mapping/{mophCode}:
 *   delete:
 *     summary: Delete a mapping
 *     tags: [DFSequenceMapping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mophCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mapping deleted
 *       404:
 *         description: Mapping not found
 */
router.delete('/:mophCode', authenticateToken, async (req, res) => {
    try {
        const { mophCode } = req.params;
        const deleted = await dfSequenceMappingService.deleteMapping(mophCode);

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
