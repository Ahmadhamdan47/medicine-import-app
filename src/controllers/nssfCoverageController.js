const nssfCoverageService = require('../services/nssfCoverageService');

class NSSFCoverageController {

    /**
     * @swagger
     * /nssf-coverage:
     *   post:
     *     summary: Create a new NSSF coverage record
     *     tags: [NSSF Coverage]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - drug_id
     *               - effective_date
     *             properties:
     *               drug_id:
     *                 type: integer
     *               effective_date:
     *                 type: string
     *                 format: date
     *               public_price_lbp:
     *                 type: number
     *               nssf_price_lbp:
     *                 type: number
     *               nssf_coverage_percentage:
     *                 type: number
     *               nssf_coverage_amount_lbp:
     *                 type: number
     *               real_nssf_coverage:
     *                 type: number
     *               is_active:
     *                 type: boolean
     *     responses:
     *       201:
     *         description: NSSF coverage created successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    async createCoverage(req, res) {
        try {
            const coverage = await nssfCoverageService.createCoverage(req.body);
            res.status(201).json({
                success: true,
                message: 'NSSF coverage created successfully',
                data: coverage
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @swagger
     * /nssf-coverage:
     *   get:
     *     summary: Get all NSSF coverage records with pagination
     *     tags: [NSSF Coverage]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Number of items per page
     *       - in: query
     *         name: drug_id
     *         schema:
     *           type: integer
     *         description: Filter by drug ID
     *       - in: query
     *         name: is_active
     *         schema:
     *           type: boolean
     *         description: Filter by active status
     *       - in: query
     *         name: effective_date_from
     *         schema:
     *           type: string
     *           format: date
     *         description: Filter by effective date from
     *       - in: query
     *         name: effective_date_to
     *         schema:
     *           type: string
     *           format: date
     *         description: Filter by effective date to
     *     responses:
     *       200:
     *         description: NSSF coverage records retrieved successfully
     *       500:
     *         description: Internal server error
     */
    async getAllCoverage(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await nssfCoverageService.getAllCoverage(page, limit, filters);
            res.status(200).json({
                success: true,
                message: 'NSSF coverage records retrieved successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @swagger
     * /nssf-coverage/{id}:
     *   get:
     *     summary: Get NSSF coverage by ID
     *     tags: [NSSF Coverage]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: NSSF coverage ID
     *     responses:
     *       200:
     *         description: NSSF coverage retrieved successfully
     *       404:
     *         description: NSSF coverage not found
     *       500:
     *         description: Internal server error
     */
    async getCoverageById(req, res) {
        try {
            const { id } = req.params;
            const coverage = await nssfCoverageService.getCoverageById(id);
            res.status(200).json({
                success: true,
                message: 'NSSF coverage retrieved successfully',
                data: coverage
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    /**
     * @swagger
     * /nssf-coverage/drug/{drugId}/active:
     *   get:
     *     summary: Get active NSSF coverage for a specific drug
     *     tags: [NSSF Coverage]
     *     parameters:
     *       - in: path
     *         name: drugId
     *         required: true
     *         schema:
     *           type: integer
     *         description: Drug ID
     *     responses:
     *       200:
     *         description: Active NSSF coverage retrieved successfully
     *       404:
     *         description: No active coverage found
     *       500:
     *         description: Internal server error
     */
    async getActiveCoverageByDrugId(req, res) {
        try {
            const { drugId } = req.params;
            const coverage = await nssfCoverageService.getActiveCoverageByDrugId(drugId);
            
            if (!coverage) {
                return res.status(404).json({
                    success: false,
                    message: 'No active NSSF coverage found for this drug'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Active NSSF coverage retrieved successfully',
                data: coverage
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @swagger
     * /nssf-coverage/drug/{drugId}/history:
     *   get:
     *     summary: Get NSSF coverage history for a specific drug
     *     tags: [NSSF Coverage]
     *     parameters:
     *       - in: path
     *         name: drugId
     *         required: true
     *         schema:
     *           type: integer
     *         description: Drug ID
     *     responses:
     *       200:
     *         description: NSSF coverage history retrieved successfully
     *       500:
     *         description: Internal server error
     */
    async getCoverageHistoryByDrugId(req, res) {
        try {
            const { drugId } = req.params;
            const coverages = await nssfCoverageService.getCoverageHistoryByDrugId(drugId);
            res.status(200).json({
                success: true,
                message: 'NSSF coverage history retrieved successfully',
                data: coverages
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @swagger
     * /nssf-coverage/{id}:
     *   put:
     *     summary: Update NSSF coverage record
     *     tags: [NSSF Coverage]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: NSSF coverage ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               effective_date:
     *                 type: string
     *                 format: date
     *               public_price_lbp:
     *                 type: number
     *               nssf_price_lbp:
     *                 type: number
     *               nssf_coverage_percentage:
     *                 type: number
     *               nssf_coverage_amount_lbp:
     *                 type: number
     *               real_nssf_coverage:
     *                 type: number
     *               is_active:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: NSSF coverage updated successfully
     *       404:
     *         description: NSSF coverage not found
     *       500:
     *         description: Internal server error
     */
    async updateCoverage(req, res) {
        try {
            const { id } = req.params;
            const coverage = await nssfCoverageService.updateCoverage(id, req.body);
            res.status(200).json({
                success: true,
                message: 'NSSF coverage updated successfully',
                data: coverage
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    /**
     * @swagger
     * /nssf-coverage/{id}:
     *   delete:
     *     summary: Soft delete NSSF coverage record (set is_active to false)
     *     tags: [NSSF Coverage]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: NSSF coverage ID
     *     responses:
     *       200:
     *         description: NSSF coverage deactivated successfully
     *       404:
     *         description: NSSF coverage not found
     *       500:
     *         description: Internal server error
     */
    async deleteCoverage(req, res) {
        try {
            const { id } = req.params;
            const result = await nssfCoverageService.deleteCoverage(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    /**
     * @swagger
     * /nssf-coverage/{id}/hard-delete:
     *   delete:
     *     summary: Permanently delete NSSF coverage record
     *     tags: [NSSF Coverage]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: NSSF coverage ID
     *     responses:
     *       200:
     *         description: NSSF coverage permanently deleted
     *       404:
     *         description: NSSF coverage not found
     *       500:
     *         description: Internal server error
     */
    async hardDeleteCoverage(req, res) {
        try {
            const { id } = req.params;
            const result = await nssfCoverageService.hardDeleteCoverage(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }

    /**
     * @swagger
     * /nssf-coverage/calculate-patient-share:
     *   post:
     *     summary: Calculate patient share after NSSF coverage
     *     tags: [NSSF Coverage]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - drug_id
     *               - requested_amount
     *             properties:
     *               drug_id:
     *                 type: integer
     *               requested_amount:
     *                 type: number
     *     responses:
     *       200:
     *         description: Patient share calculated successfully
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    async calculatePatientShare(req, res) {
        try {
            const { drug_id, requested_amount } = req.body;
            
            if (!drug_id || !requested_amount) {
                return res.status(400).json({
                    success: false,
                    message: 'drug_id and requested_amount are required'
                });
            }

            const calculation = await nssfCoverageService.calculatePatientShare(drug_id, requested_amount);
            res.status(200).json({
                success: true,
                message: 'Patient share calculated successfully',
                data: calculation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * @swagger
     * /nssf-coverage/search:
     *   get:
     *     summary: Search NSSF coverage by drug name
     *     tags: [NSSF Coverage]
     *     parameters:
     *       - in: query
     *         name: drug_name
     *         required: true
     *         schema:
     *           type: string
     *         description: Drug name to search for
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Number of items per page
     *     responses:
     *       200:
     *         description: NSSF coverage search results
     *       400:
     *         description: Bad request
     *       500:
     *         description: Internal server error
     */
    async searchCoverageByDrugName(req, res) {
        try {
            const { drug_name, page = 1, limit = 10 } = req.query;
            
            if (!drug_name) {
                return res.status(400).json({
                    success: false,
                    message: 'drug_name parameter is required'
                });
            }

            const result = await nssfCoverageService.searchCoverageByDrugName(drug_name, page, limit);
            res.status(200).json({
                success: true,
                message: 'NSSF coverage search completed successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new NSSFCoverageController();
