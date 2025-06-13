const RFDRequest = require('../models/rfdRequest');
const ImportationRequest = require('../models/importationRequest');

class RFDRequestService {
    
    // Create RFD request
    async createRFDRequest(rfdData, userId) {
        try {
            const rfdRequest = await RFDRequest.create({
                ...rfdData,
                createdBy: userId,
                updatedBy: userId
            });

            // Update the main importation request status
            await ImportationRequest.update(
                { status: 'rfd_required' },
                { where: { id: rfdData.importationRequestId } }
            );

            return rfdRequest;
        } catch (error) {
            throw new Error(`Error creating RFD request: ${error.message}`);
        }
    }

    // Get RFD request by ID
    async getRFDRequestById(id) {
        try {
            const rfdRequest = await RFDRequest.findByPk(id, {
                include: [{
                    model: ImportationRequest,
                    as: 'importationRequest'
                }]
            });

            if (!rfdRequest) {
                throw new Error('RFD request not found');
            }

            return rfdRequest;
        } catch (error) {
            throw new Error(`Error retrieving RFD request: ${error.message}`);
        }
    }

    // Update RFD request status
    async updateRFDStatus(id, statusData, userId) {
        try {
            const rfdRequest = await RFDRequest.findByPk(id);
            
            if (!rfdRequest) {
                throw new Error('RFD request not found');
            }

            const updatedRFD = await rfdRequest.update({
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
                        rfdApproved: true,
                        status: 'proforma_required'
                    },
                    { where: { id: rfdRequest.importationRequestId } }
                );
            } else if (statusData.status === 'rejected') {
                await ImportationRequest.update(
                    { 
                        rfdApproved: false,
                        status: 'rejected'
                    },
                    { where: { id: rfdRequest.importationRequestId } }
                );
            }

            return updatedRFD;
        } catch (error) {
            throw new Error(`Error updating RFD status: ${error.message}`);
        }
    }

    // Get all RFD requests
    async getAllRFDRequests(filters = {}) {
        try {
            const whereClause = {};
            
            if (filters.status) whereClause.status = filters.status;
            if (filters.importationRequestId) whereClause.importationRequestId = filters.importationRequestId;

            const rfdRequests = await RFDRequest.findAll({
                where: whereClause,
                order: [['createdDate', 'DESC']],
                include: [{
                    model: ImportationRequest,
                    as: 'importationRequest'
                }]
            });

            return rfdRequests;
        } catch (error) {
            throw new Error(`Error retrieving RFD requests: ${error.message}`);
        }
    }

    // Upload RFD file
    async uploadRFDFile(importationRequestId, fileData, userId) {
        try {
            const rfdRequest = await RFDRequest.create({
                importationRequestId,
                fileId: fileData.fileId,
                fileName: fileData.fileName,
                filePath: fileData.filePath,
                fileSize: fileData.fileSize,
                checksum: fileData.checksum,
                metadata: fileData.metadata || {},
                status: 'pending',
                createdBy: userId,
                updatedBy: userId
            });

            return rfdRequest;
        } catch (error) {
            throw new Error(`Error uploading RFD file: ${error.message}`);
        }
    }
}

module.exports = new RFDRequestService();
