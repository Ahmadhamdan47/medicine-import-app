// Swift Payment Controller
const SwiftPaymentService = require('../services/swiftPaymentService');

class SwiftPaymentController {
    // POST /swift-payments - Upload Swift payment proof
    async createSwiftPayment(req, res) {
        try {
            const userId = req.user.id;
            const swiftPayment = await SwiftPaymentService.createSwiftPayment(req.body, userId);
            
            res.status(201).json({
                message: 'Swift payment created successfully',
                data: swiftPayment
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // GET /swift-payments - Get all Swift payments
    async getAllSwiftPayments(req, res) {
        try {
            const filters = {
                status: req.query.status,
                importationRequestId: req.query.importationRequestId
            };

            const swiftPayments = await SwiftPaymentService.getAllSwiftPayments(filters);
            
            res.status(200).json({
                message: 'Swift payments retrieved successfully',
                data: swiftPayments
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    // GET /swift-payments/:id - Get Swift payment by ID
    async getSwiftPaymentById(req, res) {
        try {
            const { id } = req.params;
            const swiftPayment = await SwiftPaymentService.getSwiftPaymentById(id);
            
            res.status(200).json({
                message: 'Swift payment retrieved successfully',
                data: swiftPayment
            });
        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /swift-payments/:id - Approve / reject
    async updateSwiftPaymentStatus(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const updatedSwiftPayment = await SwiftPaymentService.updateSwiftPaymentStatus(id, req.body, userId);
            
            res.status(200).json({
                message: 'Swift payment status updated successfully',
                data: updatedSwiftPayment
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // POST /swift-payments/upload - Upload Swift payment file
    async uploadSwiftPaymentFile(req, res) {
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
                swiftNumber: req.body.swiftNumber,
                paymentDate: req.body.paymentDate,
                amount: req.body.amount,
                currency: req.body.currency,
                bankName: req.body.bankName,
                metadata: req.body.metadata
            };

            const swiftPayment = await SwiftPaymentService.uploadSwiftPaymentFile(importationRequestId, fileData, userId);
            
            res.status(201).json({
                message: 'Swift payment file uploaded successfully',
                data: swiftPayment
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new SwiftPaymentController();
