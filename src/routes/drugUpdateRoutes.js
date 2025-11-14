// src/routes/drugUpdateRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DrugUpdateController = require('../controllers/drugUpdateController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads/drug-updates');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow CSV and TSV files
    const allowedExtensions = ['.csv', '.tsv', '.txt'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error('Only CSV, TSV, and TXT files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size
        files: 1 // Only allow 1 file at a time
    }
});

// Session Management Routes
/**
 * @swagger
 * /api/drug-update/session/initialize:
 *   post:
 *     summary: Initialize a new drug update session
 *     tags: [Drug Update]
 *     responses:
 *       200:
 *         description: Session initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 sessionInfo:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                     backupTable:
 *                       type: string
 *                     workingTable:
 *                       type: string
 *       500:
 *         description: Failed to initialize session
 */
router.post('/session/initialize', DrugUpdateController.initializeSession);

/**
 * @swagger
 * /api/drug-update/session/{sessionId}/info:
 *   get:
 *     summary: Get session information
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session information retrieved successfully
 *       400:
 *         description: Invalid session ID
 */
router.get('/session/:sessionId/info', DrugUpdateController.getSessionInfo);

/**
 * @swagger
 * /api/drug-update/sessions:
 *   get:
 *     summary: List all active sessions
 *     tags: [Drug Update]
 *     responses:
 *       200:
 *         description: Active sessions retrieved successfully
 */
router.get('/sessions', DrugUpdateController.listActiveSessions);

// File Upload Routes
/**
 * @swagger
 * /api/drug-update/session/{sessionId}/upload:
 *   post:
 *     summary: Upload and parse CSV file
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               delimiter:
 *                 type: string
 *                 description: CSV delimiter (default: auto-detect)
 *                 enum: [',', '\t', ';', '|']
 *     responses:
 *       200:
 *         description: File uploaded and parsed successfully
 *       400:
 *         description: Invalid session or file
 *       500:
 *         description: Failed to process file
 */
router.post('/session/:sessionId/upload', upload.single('file'), DrugUpdateController.uploadCsv);

// Database Operations Routes
/**
 * @swagger
 * /api/drug-update/session/{sessionId}/backup:
 *   post:
 *     summary: Create backup of current drug table
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Backup created successfully
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Failed to create backup
 */
router.post('/session/:sessionId/backup', DrugUpdateController.createBackup);

/**
 * @swagger
 * /api/drug-update/session/{sessionId}/working-copy:
 *   post:
 *     summary: Create working copy for applying changes
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Working copy created successfully
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Failed to create working copy
 */
router.post('/session/:sessionId/working-copy', DrugUpdateController.createWorkingCopy);

// Preview and Analysis Routes
/**
 * @swagger
 * /api/drug-update/session/{sessionId}/preview:
 *   get:
 *     summary: Preview changes that would be made
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Changes preview generated successfully
 *       400:
 *         description: Invalid session or no CSV data
 *       500:
 *         description: Failed to preview changes
 */
router.get('/session/:sessionId/preview', DrugUpdateController.previewChanges);

/**
 * @swagger
 * /api/drug-update/session/{sessionId}/final-changes:
 *   get:
 *     summary: Get final changes comparison between working and original tables
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Final changes retrieved successfully
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Failed to get final changes
 */
router.get('/session/:sessionId/final-changes', DrugUpdateController.getFinalChanges);

// Change Application Routes
/**
 * @swagger
 * /api/drug-update/session/{sessionId}/apply:
 *   post:
 *     summary: Apply changes to working table
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Changes applied successfully
 *       400:
 *         description: Invalid session or no CSV data
 *       500:
 *         description: Failed to apply changes
 */
router.post('/session/:sessionId/apply', DrugUpdateController.applyChanges);

/**
 * @swagger
 * /api/drug-update/session/{sessionId}/commit:
 *   post:
 *     summary: Commit changes - make them permanent
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Changes committed successfully
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Failed to commit changes
 */
router.post('/session/:sessionId/commit', DrugUpdateController.commitChanges);

/**
 * @swagger
 * /api/drug-update/session/{sessionId}/rollback:
 *   post:
 *     summary: Rollback changes - restore from backup
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Changes rolled back successfully
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Failed to rollback changes
 */
router.post('/session/:sessionId/rollback', DrugUpdateController.rollbackChanges);

// Cleanup Routes
/**
 * @swagger
 * /api/drug-update/session/{sessionId}/cleanup:
 *   delete:
 *     summary: Clean up session and temporary tables
 *     tags: [Drug Update]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session cleaned up successfully
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Failed to cleanup session
 */
router.delete('/session/:sessionId/cleanup', DrugUpdateController.cleanupSession);

// Error handling middleware specific to this router
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 50MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Only one file is allowed.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name. Use "file" as the field name.'
            });
        }
    }
    
    if (error.message === 'Only CSV, TSV, and TXT files are allowed') {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    // Pass error to general error handler
    next(error);
});

module.exports = router;