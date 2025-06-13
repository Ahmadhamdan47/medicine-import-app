// RFD Request Controller
const RFDRequestService = require('../services/rfdRequestService');

class RFDRequestController {
    // POST /rfd-requests - Upload RFD file & metadata
    async createRFDRequest(req, res) {
        try {
            const userId = req.user.id;
            const rfdRequest = await RFDRequestService.createRFDRequest(req.body, userId);
            
            res.status(201).json({
                message: 'RFD request created successfully',
                data: rfdRequest
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // GET /rfd-requests - Get all RFD requests
    async getAllRFDRequests(req, res) {
        try {
            const filters = {
                status: req.query.status,
                importationRequestId: req.query.importationRequestId
            };

            const rfdRequests = await RFDRequestService.getAllRFDRequests(filters);
            
            res.status(200).json({
                message: 'RFD requests retrieved successfully',
                data: rfdRequests
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    // GET /rfd-requests/:id - Get RFD request by ID
    async getRFDRequestById(req, res) {
        try {
            const { id } = req.params;
            const rfdRequest = await RFDRequestService.getRFDRequestById(id);
            
            res.status(200).json({
                message: 'RFD request retrieved successfully',
                data: rfdRequest
            });
        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /rfd-requests/:id - Change status (accept / refuse)
    async updateRFDStatus(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const updatedRFD = await RFDRequestService.updateRFDStatus(id, req.body, userId);
            
            res.status(200).json({
                message: 'RFD status updated successfully',
                data: updatedRFD
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // POST /rfd-requests/upload - Upload RFD file
    async uploadRFDFile(req, res) {
        try {
            const userId = req.user.id;
            const { importationRequestId } = req.body;

            // File data should come from file upload middleware
            const fileData = {
                fileId: req.file?.fileId || req.body.fileId,
                fileName: req.file?.originalname || req.body.fileName,
                filePath: req.file?.path || req.body.filePath,
                fileSize: req.file?.size || req.body.fileSize,
                checksum: req.body.checksum,
                metadata: req.body.metadata
            };

            const rfdRequest = await RFDRequestService.uploadRFDFile(importationRequestId, fileData, userId);
            
            res.status(201).json({
                message: 'RFD file uploaded successfully',
                data: rfdRequest
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new RFDRequestController();
