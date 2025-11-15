// src/controllers/drugUpdateController.js
const DrugUpdateService = require('../services/drugUpdateService');
const path = require('path');
const fs = require('fs').promises;

// Store active sessions (in production, use Redis or database)
const activeSessions = new Map();

class DrugUpdateController {
    /**
     * Initialize a new update session
     */
    static async initializeSession(req, res) {
        try {
            const service = new DrugUpdateService();
            const sessionInfo = await service.initializeSession();
            
            // Store service instance with session
            activeSessions.set(sessionInfo.sessionId, service);
            
            res.json({
                success: true,
                sessionInfo,
                message: 'Update session initialized successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to initialize session',
                error: error.message
            });
        }
    }

    /**
     * Upload and parse CSV file
     */
    static async uploadCsv(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }

            // Determine delimiter based on file extension or content
            const delimiter = req.body.delimiter || 
                (req.file.originalname.endsWith('.tsv') ? '\t' : ',');

            // Parse CSV file
            const csvData = await service.parseCsvFile(req.file.path, delimiter);
            
            // Clean up uploaded file
            await fs.unlink(req.file.path);

            if (csvData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No valid data found in CSV file'
                });
            }

            // Store CSV data in session (in production, store in database/cache)
            service.csvData = csvData;

            res.json({
                success: true,
                message: 'CSV file uploaded and parsed successfully',
                data: {
                    totalRows: csvData.length,
                    columns: Object.keys(csvData[0] || {}),
                    sampleRows: csvData.slice(0, 3)
                }
            });
        } catch (error) {
            // Clean up uploaded file if it exists
            if (req.file?.path) {
                try {
                    await fs.unlink(req.file.path);
                } catch (cleanupError) {
                    console.error('Failed to cleanup uploaded file:', cleanupError);
                }
            }

            res.status(500).json({
                success: false,
                message: 'Failed to process CSV file',
                error: error.message
            });
        }
    }

    /**
     * Set column mapping for the session (optional - uses default if not provided)
     */
    static async setMapping(req, res) {
        try {
            const { sessionId } = req.params;
            const { columnMapping } = req.body;

            const service = activeSessions.get(sessionId);
            if (!service) {
                return res.status(404).json({
                    success: false,
                    error: 'Session not found or expired'
                });
            }

            let finalMapping;
            let mappingType;
            let result;

            if (columnMapping && Object.keys(columnMapping).length > 0) {
                // Custom mapping provided - validate it
                const validation = await service.validateColumnMapping(columnMapping);
                
                if (!validation.valid) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid column mapping',
                        validationErrors: validation.errors,
                        warnings: validation.warnings
                    });
                }

                // Set the custom mapping
                result = service.setColumnMapping(columnMapping);
                finalMapping = columnMapping;
                mappingType = 'custom';
            } else {
                // No custom mapping provided - use default mapping
                // Don't call setColumnMapping to keep userColumnMapping as null
                // so getCurrentMapping() will return the default mapping
                finalMapping = service.getCurrentMapping();
                mappingType = 'default';
                result = {
                    mappingCount: Object.keys(finalMapping).length,
                    mapping: finalMapping
                };
            }

            res.json({
                success: true,
                message: `Column mapping ${mappingType === 'custom' ? 'set' : 'using default'} successfully`,
                mappingType: mappingType,
                mappingCount: result.mappingCount,
                mapping: finalMapping,
                nextStep: `Preview changes using /api/drug-update/session/${sessionId}/preview`
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to set column mapping',
                error: error.message
            });
        }
    }

    /**
     * Create backup of current drug table
     */
    static async createBackup(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            const backupResult = await service.createBackup();
            
            res.json({
                success: true,
                message: 'Backup created successfully',
                data: backupResult
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create backup',
                error: error.message
            });
        }
    }

    /**
     * Create working copy for applying changes
     */
    static async createWorkingCopy(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            const workingCopyResult = await service.createWorkingCopy();
            
            res.json({
                success: true,
                message: 'Working copy created successfully',
                data: workingCopyResult
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create working copy',
                error: error.message
            });
        }
    }

    /**
     * Preview changes that would be made
     */
    static async previewChanges(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            if (!service.csvData) {
                return res.status(400).json({
                    success: false,
                    message: 'No CSV data available. Upload a CSV file first.'
                });
            }

            const preview = await service.previewChanges(service.csvData);
            
            res.json({
                success: true,
                message: 'Changes preview generated successfully',
                data: preview
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to preview changes',
                error: error.message
            });
        }
    }

    /**
     * Apply changes to working table
     */
    static async applyChanges(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            if (!service.csvData) {
                return res.status(400).json({
                    success: false,
                    message: 'No CSV data available. Upload a CSV file first.'
                });
            }

            const applyResult = await service.applyChangesToWorkingTable(service.csvData);
            
            res.json({
                success: true,
                message: 'Changes applied to working table successfully',
                data: applyResult
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to apply changes',
                error: error.message
            });
        }
    }

    /**
     * Get final changes comparison
     */
    static async getFinalChanges(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            const finalChanges = await service.getFinalChanges();
            
            res.json({
                success: true,
                message: 'Final changes retrieved successfully',
                data: {
                    totalChanges: finalChanges.length,
                    changes: finalChanges
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to get final changes',
                error: error.message
            });
        }
    }

    /**
     * Commit changes - make them permanent
     */
    static async commitChanges(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            const commitResult = await service.commitChanges();
            
            res.json({
                success: true,
                message: 'Changes committed successfully',
                data: commitResult
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to commit changes',
                error: error.message
            });
        }
    }

    /**
     * Rollback changes - restore from backup
     */
    static async rollbackChanges(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            const rollbackResult = await service.rollbackChanges();
            
            res.json({
                success: true,
                message: 'Changes rolled back successfully',
                data: rollbackResult
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to rollback changes',
                error: error.message
            });
        }
    }

    /**
     * Clean up session and temporary tables
     */
    static async cleanupSession(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            const cleanupResult = await service.cleanupSession();
            
            // Remove session from memory
            activeSessions.delete(sessionId);
            
            res.json({
                success: true,
                message: 'Session cleaned up successfully',
                data: cleanupResult
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to cleanup session',
                error: error.message
            });
        }
    }

    /**
     * Get session information
     */
    static async getSessionInfo(req, res) {
        try {
            const { sessionId } = req.params;
            const service = activeSessions.get(sessionId);
            
            if (!service) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid session ID'
                });
            }

            const sessionInfo = service.getSessionInfo();
            
            res.json({
                success: true,
                data: {
                    ...sessionInfo,
                    hasCsvData: !!service.csvData,
                    csvRowCount: service.csvData?.length || 0
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to get session info',
                error: error.message
            });
        }
    }

    /**
     * List all active sessions
     */
    static async listActiveSessions(req, res) {
        try {
            const sessions = [];
            
            for (const [sessionId, service] of activeSessions.entries()) {
                const sessionInfo = service.getSessionInfo();
                sessions.push({
                    ...sessionInfo,
                    hasCsvData: !!service.csvData,
                    csvRowCount: service.csvData?.length || 0
                });
            }
            
            res.json({
                success: true,
                data: {
                    totalSessions: sessions.length,
                    sessions
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to list sessions',
                error: error.message
            });
        }
    }
}

module.exports = DrugUpdateController;