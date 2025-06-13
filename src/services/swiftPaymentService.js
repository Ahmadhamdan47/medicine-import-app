const SwiftPayment = require('../models/swiftPayment');
const ImportationRequest = require('../models/importationRequest');

class SwiftPaymentService {
    
    // Create Swift payment
    async createSwiftPayment(swiftData, userId) {
        try {
            const swiftPayment = await SwiftPayment.create({
                ...swiftData,
                createdBy: userId,
                updatedBy: userId
            });

            // Update the main importation request status
            await ImportationRequest.update(
                { status: 'swift_required' },
                { where: { id: swiftData.importationRequestId } }
            );

            return swiftPayment;
        } catch (error) {
            throw new Error(`Error creating Swift payment: ${error.message}`);
        }
    }

    // Get Swift payment by ID
    async getSwiftPaymentById(id) {
        try {
            const swiftPayment = await SwiftPayment.findByPk(id, {
                include: [{
                    model: ImportationRequest,
                    as: 'importationRequest'
                }]
            });

            if (!swiftPayment) {
                throw new Error('Swift payment not found');
            }

            return swiftPayment;
        } catch (error) {
            throw new Error(`Error retrieving Swift payment: ${error.message}`);
        }
    }

    // Update Swift payment status
    async updateSwiftStatus(id, statusData, userId) {
        try {
            const swiftPayment = await SwiftPayment.findByPk(id);
            
            if (!swiftPayment) {
                throw new Error('Swift payment not found');
            }

            const updatedSwift = await swiftPayment.update({
                status: statusData.status,
                approvedBy: statusData.status === 'approved' ? userId : null,
                approvedDate: statusData.status === 'approved' ? new Date() : null,
                rejectionReason: statusData.rejectionReason || null,
                updatedBy: userId,
                updatedDate: new Date()
            });

            // Update the main importation request
            if (statusData.status === 'approved') {
                await ImportationRequest.update(
                    { 
                        swiftApproved: true,
                        status: 'shipping'
                    },
                    { where: { id: swiftPayment.importationRequestId } }
                );
            } else if (statusData.status === 'rejected') {
                await ImportationRequest.update(
                    { 
                        swiftApproved: false,
                        status: 'rejected'
                    },
                    { where: { id: swiftPayment.importationRequestId } }
                );
            }

            return updatedSwift;
        } catch (error) {
            throw new Error(`Error updating Swift payment status: ${error.message}`);
        }
    }

    // Get all Swift payments
    async getAllSwiftPayments(filters = {}) {
        try {
            const whereClause = {};
            
            if (filters.status) whereClause.status = filters.status;
            if (filters.importationRequestId) whereClause.importationRequestId = filters.importationRequestId;

            const swiftPayments = await SwiftPayment.findAll({
                where: whereClause,
                order: [['createdDate', 'DESC']],
                include: [{
                    model: ImportationRequest,
                    as: 'importationRequest'
                }]
            });

            return swiftPayments;
        } catch (error) {
            throw new Error(`Error retrieving Swift payments: ${error.message}`);
        }
    }

    // Update Swift payment status
    async updateSwiftPaymentStatus(id, statusData, userId) {
        try {
            const swiftPayment = await SwiftPayment.findByPk(id);
            
            if (!swiftPayment) {
                throw new Error('Swift payment not found');
            }

            const updatedSwiftPayment = await swiftPayment.update({
                status: statusData.status,
                approvedBy: statusData.status === 'approved' ? userId : null,
                approvedDate: statusData.status === 'approved' ? new Date() : null,
                rejectionReason: statusData.rejectionReason || null,
                updatedBy: userId,
                updatedDate: new Date()
            });

            // Update the main importation request
            if (statusData.status === 'approved') {
                await ImportationRequest.update(
                    { 
                        swiftApproved: true,
                        status: 'shipping'
                    },
                    { where: { id: swiftPayment.importationRequestId } }
                );
            } else if (statusData.status === 'rejected') {
                await ImportationRequest.update(
                    { 
                        swiftApproved: false,
                        status: 'rejected'
                    },
                    { where: { id: swiftPayment.importationRequestId } }
                );
            }

            return updatedSwiftPayment;
        } catch (error) {
            throw new Error(`Error updating Swift payment status: ${error.message}`);
        }
    }

    // Upload Swift payment file
    async uploadSwiftPaymentFile(importationRequestId, fileData, userId) {
        try {
            const swiftPayment = await SwiftPayment.create({
                importationRequestId,
                fileId: fileData.fileId,
                fileName: fileData.fileName,
                filePath: fileData.filePath,
                fileSize: fileData.fileSize,
                checksum: fileData.checksum,
                swiftNumber: fileData.swiftNumber,
                paymentDate: fileData.paymentDate,
                amount: fileData.amount,
                currency: fileData.currency || 'USD',
                bankName: fileData.bankName,
                metadata: fileData.metadata || {},
                status: 'pending',
                createdBy: userId,
                updatedBy: userId
            });

            return swiftPayment;
        } catch (error) {
            throw new Error(`Error uploading Swift payment file: ${error.message}`);
        }
    }
}

module.exports = new SwiftPaymentService();
