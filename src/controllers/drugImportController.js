// src/controllers/drugImportController.js
const DrugUpdateService = require('../services/drugUpdateService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'drug-import-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept CSV, TSV files
        if (file.mimetype === 'text/csv' || 
            file.mimetype === 'text/tab-separated-values' ||
            file.originalname.endsWith('.csv') ||
            file.originalname.endsWith('.tsv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and TSV files are allowed'));
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

class DrugImportController {
    constructor() {
        this.activeSessions = new Map(); // Store active sessions by sessionId
    }

    /**
     * Step 1: Upload and analyze CSV file
     */
    uploadAndAnalyze = async (req, res) => {
        try {
            // Handle file upload
            const uploadSingle = upload.single('csvFile');
            
            uploadSingle(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        error: err.message
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        error: 'No file uploaded'
                    });
                }

                try {
                    const drugService = new DrugUpdateService();
                    const session = await drugService.initializeSession();
                    
                    // Store session
                    this.activeSessions.set(session.sessionId, {
                        drugService,
                        filePath: req.file.path,
                        originalName: req.file.originalname,
                        uploadTime: new Date()
                    });

                    // Detect delimiter based on file extension
                    const delimiter = req.file.originalname.endsWith('.tsv') ? '\t' : ',';
                    
                    // Analyze the CSV file
                    const analysis = await drugService.analyzeCSVForMapping(req.file.path, delimiter);
                    
                    res.json({
                        success: true,
                        sessionId: session.sessionId,
                        fileName: req.file.originalname,
                        analysis: analysis,
                        nextStep: 'Map columns using /api/drug-import/set-mapping'
                    });

                } catch (error) {
                    // Clean up uploaded file on error
                    try {
                        await fs.unlink(req.file.path);
                    } catch (unlinkError) {
                        console.error('Error deleting uploaded file:', unlinkError);
                    }

                    res.status(500).json({
                        success: false,
                        error: error.message
                    });
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Step 2: Set column mapping
     */
    setMapping = async (req, res) => {
        try {
            const { sessionId, columnMapping } = req.body;

            if (!sessionId || !columnMapping) {
                return res.status(400).json({
                    success: false,
                    error: 'sessionId and columnMapping are required'
                });
            }

            const sessionData = this.activeSessions.get(sessionId);
            if (!sessionData) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or expired'
                });
            }

            const { drugService } = sessionData;

            // Validate the mapping
            const validation = await drugService.validateColumnMapping(columnMapping);
            
            if (!validation.valid) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid column mapping',
                    validationErrors: validation.errors,
                    warnings: validation.warnings
                });
            }

            // Set the mapping
            drugService.setColumnMapping(columnMapping);

            res.json({
                success: true,
                message: 'Column mapping set successfully',
                mappingCount: Object.keys(columnMapping).length,
                validation: validation,
                nextStep: 'Preview changes using /api/drug-import/preview'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Step 3: Preview changes
     */
    previewChanges = async (req, res) => {
        try {
            const { sessionId } = req.params;

            const sessionData = this.activeSessions.get(sessionId);
            if (!sessionData) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or expired'
                });
            }

            const { drugService, filePath } = sessionData;

            // Create backup first
            await drugService.createBackup();

            // Detect delimiter
            const delimiter = filePath.endsWith('.tsv') ? '\t' : ',';

            // Parse the file with current mapping
            const csvData = await drugService.parseCsvFile(filePath, delimiter);

            // Preview changes
            const preview = await drugService.previewChanges(csvData);

            res.json({
                success: true,
                preview: preview,
                nextStep: 'Apply changes using /api/drug-import/apply or /api/drug-import/commit'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Step 4: Apply changes to working table
     */
    applyChanges = async (req, res) => {
        try {
            const { sessionId } = req.params;

            const sessionData = this.activeSessions.get(sessionId);
            if (!sessionData) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or expired'
                });
            }

            const { drugService, filePath } = sessionData;

            // Create working copy
            await drugService.createWorkingCopy();

            // Parse and apply changes
            const delimiter = filePath.endsWith('.tsv') ? '\t' : ',';
            const csvData = await drugService.parseCsvFile(filePath, delimiter);
            const result = await drugService.applyChangesToWorkingTable(csvData);

            res.json({
                success: true,
                result: result,
                nextStep: 'Review final changes with /api/drug-import/final-changes and commit with /api/drug-import/commit'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Step 5: Get final changes for review
     */
    getFinalChanges = async (req, res) => {
        try {
            const { sessionId } = req.params;

            const sessionData = this.activeSessions.get(sessionId);
            if (!sessionData) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or expired'
                });
            }

            const { drugService } = sessionData;
            const finalChanges = await drugService.getFinalChanges();

            res.json({
                success: true,
                finalChanges: finalChanges,
                changeCount: finalChanges.length,
                nextStep: 'Commit changes using /api/drug-import/commit'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Step 6: Commit changes
     */
    commitChanges = async (req, res) => {
        try {
            const { sessionId } = req.params;

            const sessionData = this.activeSessions.get(sessionId);
            if (!sessionData) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or expired'
                });
            }

            const { drugService, filePath, originalName } = sessionData;

            // Commit changes
            const commitResult = await drugService.commitChanges();

            // Log the successful import
            console.log(`Successfully imported ${originalName} in session ${sessionId}`);

            // Clean up
            await this.cleanupSession(sessionId);

            res.json({
                success: true,
                message: 'Changes committed successfully',
                result: commitResult
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Rollback changes
     */
    rollbackChanges = async (req, res) => {
        try {
            const { sessionId } = req.params;

            const sessionData = this.activeSessions.get(sessionId);
            if (!sessionData) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or expired'
                });
            }

            const { drugService } = sessionData;

            // Rollback changes
            const rollbackResult = await drugService.rollbackChanges();

            // Clean up
            await this.cleanupSession(sessionId);

            res.json({
                success: true,
                message: 'Changes rolled back successfully',
                result: rollbackResult
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Get available database columns for mapping
     */
    getAvailableColumns = async (req, res) => {
        try {
            const drugService = new DrugUpdateService();
            const columns = await drugService.getTableColumns();
            const mappingInfo = drugService.getHeaderMappingInfo();

            res.json({
                success: true,
                availableColumns: Object.keys(columns),
                columnDetails: columns,
                defaultMappings: mappingInfo.defaultMappings,
                currencyConversion: mappingInfo.currencyConversion
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Get session status
     */
    getSessionStatus = async (req, res) => {
        try {
            const { sessionId } = req.params;

            const sessionData = this.activeSessions.get(sessionId);
            if (!sessionData) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or expired'
                });
            }

            const { drugService, originalName, uploadTime } = sessionData;
            const sessionInfo = drugService.getSessionInfo();

            res.json({
                success: true,
                session: {
                    ...sessionInfo,
                    fileName: originalName,
                    uploadTime: uploadTime,
                    mappingInfo: drugService.getHeaderMappingInfo()
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Clean up session and files
     */
    cleanupSession = async (sessionId) => {
        try {
            const sessionData = this.activeSessions.get(sessionId);
            if (sessionData) {
                const { drugService, filePath } = sessionData;
                
                // Clean up database session
                await drugService.cleanupSession();
                
                // Delete uploaded file
                try {
                    await fs.unlink(filePath);
                } catch (error) {
                    console.error('Error deleting file:', error);
                }
                
                // Remove from active sessions
                this.activeSessions.delete(sessionId);
            }
        } catch (error) {
            console.error('Error cleaning up session:', error);
        }
    };

    /**
     * List active sessions (admin endpoint)
     */
    listSessions = async (req, res) => {
        try {
            const sessions = [];
            for (const [sessionId, sessionData] of this.activeSessions.entries()) {
                sessions.push({
                    sessionId,
                    fileName: sessionData.originalName,
                    uploadTime: sessionData.uploadTime,
                    sessionInfo: sessionData.drugService.getSessionInfo()
                });
            }

            res.json({
                success: true,
                sessions: sessions,
                count: sessions.length
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    };
}

module.exports = DrugImportController;