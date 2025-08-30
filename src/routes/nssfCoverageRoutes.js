const express = require('express');
const router = express.Router();
const nssfCoverageController = require('../controllers/nssfCoverageController');

// Create new NSSF coverage
router.post('/', nssfCoverageController.createCoverage);

// Get all NSSF coverage records with pagination and filters
router.get('/', nssfCoverageController.getAllCoverage);

// Search NSSF coverage by drug name
router.get('/search', nssfCoverageController.searchCoverageByDrugName);

// Calculate patient share after NSSF coverage
router.post('/calculate-patient-share', nssfCoverageController.calculatePatientShare);

// Get NSSF coverage by ID
router.get('/:id', nssfCoverageController.getCoverageById);

// Get active NSSF coverage for a specific drug
router.get('/drug/:drugId/active', nssfCoverageController.getActiveCoverageByDrugId);

// Get NSSF coverage history for a specific drug
router.get('/drug/:drugId/history', nssfCoverageController.getCoverageHistoryByDrugId);

// Update NSSF coverage
router.put('/:id', nssfCoverageController.updateCoverage);

// Soft delete NSSF coverage (set is_active to false)
router.delete('/:id', nssfCoverageController.deleteCoverage);

// Hard delete NSSF coverage (permanently remove)
router.delete('/:id/hard-delete', nssfCoverageController.hardDeleteCoverage);

module.exports = router;
