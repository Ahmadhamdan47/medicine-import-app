const ProformaRequest = require('../models/proformaRequest');
const ImportationRequest = require('../models/importationRequest');

class ProformaRequestService {
    
    // Create Proforma request
    async createProformaRequest(proformaData, userId) {
        try {
            const proformaRequest = await ProformaRequest.create({
                ...proformaData,
                createdBy: userId,
                updatedBy: userId
            });

            // Update the main importation request status
            await ImportationRequest.update(
                { status: 'proforma_required' },
                { where: { id: proformaData.importationRequestId } }
            );

            return proformaRequest;
        } catch (error) {
            throw new Error(`Error creating Proforma request: ${error.message}`);
        }
    }

    // Get Proforma request by ID
    async getProformaRequestById(id) {
        try {
            const proformaRequest = await ProformaRequest.findByPk(id, {
                include: [{
                    model: ImportationRequest,
                    as: 'importationRequest'
                }]
            });

            if (!proformaRequest) {
                throw new Error('Proforma request not found');
            }

            return proformaRequest;
        } catch (error) {
            throw new Error(`Error retrieving Proforma request: ${error.message}`);
        }
    }

    // Update Proforma request status
    async updateProformaStatus(id, statusData, userId) {
        try {
            const proformaRequest = await ProformaRequest.findByPk(id);
            
            if (!proformaRequest) {
                throw new Error('Proforma request not found');
            }

            const updatedProforma = await proformaRequest.update({
                status: statusData.status,
                signedBy: statusData.status === 'signed' ? userId : null,
                signedDate: statusData.status === 'signed' ? new Date() : null,
                rejectionReason: statusData.rejectionReason || null,
                updatedBy: userId,
                updatedDate: new Date()
            });

            // Update the main importation request
            if (statusData.status === 'signed') {
                await ImportationRequest.update(
                    { 
                        proformaApproved: true,
                        status: 'swift_required'
                    },
                    { where: { id: proformaRequest.importationRequestId } }
                );
            } else if (statusData.status === 'rejected') {
                await ImportationRequest.update(
                    { 
                        proformaApproved: false,
                        status: 'rejected'
                    },
                    { where: { id: proformaRequest.importationRequestId } }
                );
            }

            return updatedProforma;
        } catch (error) {
            throw new Error(`Error updating Proforma status: ${error.message}`);
        }
    }

    // Get all Proforma requests
    async getAllProformaRequests(filters = {}) {
        try {
            const whereClause = {};
            
            if (filters.status) whereClause.status = filters.status;
            if (filters.importationRequestId) whereClause.importationRequestId = filters.importationRequestId;

            const proformaRequests = await ProformaRequest.findAll({
                where: whereClause,
                order: [['createdDate', 'DESC']],
                include: [{
                    model: ImportationRequest,
                    as: 'importationRequest'
                }]
            });

            return proformaRequests;
        } catch (error) {
            throw new Error(`Error retrieving Proforma requests: ${error.message}`);
        }
    }

    // Upload Proforma file
    async uploadProformaFile(importationRequestId, fileData, userId) {
        try {
            const proformaRequest = await ProformaRequest.create({
                importationRequestId,
                fileId: fileData.fileId,
                fileName: fileData.fileName,
                filePath: fileData.filePath,
                fileSize: fileData.fileSize,
                checksum: fileData.checksum,
                invoiceNumber: fileData.invoiceNumber,
                invoiceDate: fileData.invoiceDate,
                totalAmount: fileData.totalAmount,
                currency: fileData.currency || 'USD',
                metadata: fileData.metadata || {},
                status: 'pending',
                createdBy: userId,
                updatedBy: userId
            });

            return proformaRequest;
        } catch (error) {
            throw new Error(`Error uploading Proforma file: ${error.message}`);
        }
    }
}

module.exports = new ProformaRequestService();
