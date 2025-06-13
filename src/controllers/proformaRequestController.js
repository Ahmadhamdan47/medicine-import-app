// Proforma Request Controller
const ProformaRequestService = require('../services/proformaRequestService');

class ProformaRequestController {
    // POST /proforma-requests - Upload Pro-forma file & metadata
    async createProformaRequest(req, res) {
        try {
            const userId = req.user.id;
            const proformaRequest = await ProformaRequestService.createProformaRequest(req.body, userId);
            
            res.status(201).json({
                message: 'Proforma request created successfully',
                data: proformaRequest
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // GET /proforma-requests - Get all Proforma requests
    async getAllProformaRequests(req, res) {
        try {
            const filters = {
                status: req.query.status,
                importationRequestId: req.query.importationRequestId
            };

            const proformaRequests = await ProformaRequestService.getAllProformaRequests(filters);
            
            res.status(200).json({
                message: 'Proforma requests retrieved successfully',
                data: proformaRequests
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    // GET /proforma-requests/:id - Get Proforma request by ID
    async getProformaRequestById(req, res) {
        try {
            const { id } = req.params;
            const proformaRequest = await ProformaRequestService.getProformaRequestById(id);
            
            res.status(200).json({
                message: 'Proforma request retrieved successfully',
                data: proformaRequest
            });
        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /proforma-requests/:id - Sign / reject
    async updateProformaStatus(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const updatedProforma = await ProformaRequestService.updateProformaStatus(id, req.body, userId);
            
            res.status(200).json({
                message: 'Proforma status updated successfully',
                data: updatedProforma
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // POST /proforma-requests/upload - Upload Proforma file
    async uploadProformaFile(req, res) {
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
                invoiceNumber: req.body.invoiceNumber,
                invoiceDate: req.body.invoiceDate,
                totalAmount: req.body.totalAmount,
                currency: req.body.currency,
                metadata: req.body.metadata
            };

            const proformaRequest = await ProformaRequestService.uploadProformaFile(importationRequestId, fileData, userId);
            
            res.status(201).json({
                message: 'Proforma file uploaded successfully',
                data: proformaRequest
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new ProformaRequestController();
