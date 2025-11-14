// src/routes/drugImportRoutes.js
const express = require('express');
const DrugImportController = require('../controllers/drugImportController');

const router = express.Router();
const drugImportController = new DrugImportController();

/**
 * Drug Import API Routes
 * 
 * Workflow:
 * 1. POST /upload-analyze - Upload CSV and get analysis
 * 2. POST /set-mapping - Set column mapping based on user choice
 * 3. GET /preview/:sessionId - Preview changes
 * 4. POST /apply/:sessionId - Apply changes to working table
 * 5. GET /final-changes/:sessionId - Review final changes
 * 6. POST /commit/:sessionId - Commit changes to live table
 * 7. POST /rollback/:sessionId - Rollback changes if needed
 */

// Step 1: Upload and analyze CSV file
router.post('/upload-analyze', drugImportController.uploadAndAnalyze);

// Step 2: Set user-defined column mapping
router.post('/set-mapping', drugImportController.setMapping);

// Step 3: Preview changes with current mapping
router.get('/preview/:sessionId', drugImportController.previewChanges);

// Step 4: Apply changes to working table
router.post('/apply/:sessionId', drugImportController.applyChanges);

// Step 5: Get final changes for review
router.get('/final-changes/:sessionId', drugImportController.getFinalChanges);

// Step 6: Commit changes to live database
router.post('/commit/:sessionId', drugImportController.commitChanges);

// Rollback changes
router.post('/rollback/:sessionId', drugImportController.rollbackChanges);

// Utility endpoints
router.get('/available-columns', drugImportController.getAvailableColumns);
router.get('/session/:sessionId', drugImportController.getSessionStatus);
router.get('/sessions', drugImportController.listSessions); // Admin endpoint

module.exports = router;