const ImportationRequest = require('../models/importationRequest');
const RFDRequest = require('../models/rfdRequest');
const ProformaRequest = require('../models/proformaRequest');
const SwiftPayment = require('../models/swiftPayment');
const { Op } = require('sequelize');

class ImportationRequestService {
    
    // Create a new importation request
    async createImportationRequest(requestData, userId) {
        try {
            const importationRequest = await ImportationRequest.create({
                ...requestData,
                createdBy: userId,
                updatedBy: userId
            });
            return importationRequest;
        } catch (error) {
            throw new Error(`Error creating importation request: ${error.message}`);
        }
    }

    // Get all importation requests with filtering and pagination
    async getAllImportationRequests(filters = {}, pagination = {}) {
        try {
            const { page = 1, limit = 10, status, agentId, urgencyLevel } = { ...filters, ...pagination };
            
            const whereClause = {};
            
            if (status) whereClause.status = status;
            if (agentId) whereClause.agentId = agentId;
            if (urgencyLevel) whereClause.urgencyLevel = urgencyLevel;

            const offset = (page - 1) * limit;

            const result = await ImportationRequest.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: offset,
                order: [['createdDate', 'DESC']],
                include: [
                    {
                        model: require('../models/rfdRequest'),
                        as: 'rfdRequests',
                        required: false
                    },
                    {
                        model: require('../models/proformaRequest'),
                        as: 'proformaRequests',
                        required: false
                    },
                    {
                        model: require('../models/swiftPayment'),
                        as: 'swiftPayments',
                        required: false
                    }
                ]
            });

            return {
                requests: result.rows,
                totalCount: result.count,
                currentPage: page,
                totalPages: Math.ceil(result.count / limit)
            };
        } catch (error) {
            throw new Error(`Error retrieving importation requests: ${error.message}`);
        }
    }

    // Get importation request by ID
    async getImportationRequestById(id) {
        try {
            const request = await ImportationRequest.findByPk(id, {
                include: [
                    {
                        model: require('../models/rfdRequest'),
                        as: 'rfdRequests'
                    },
                    {
                        model: require('../models/proformaRequest'),
                        as: 'proformaRequests'
                    },
                    {
                        model: require('../models/swiftPayment'),
                        as: 'swiftPayments'
                    }
                ]
            });

            if (!request) {
                throw new Error('Importation request not found');
            }

            return request;
        } catch (error) {
            throw new Error(`Error retrieving importation request: ${error.message}`);
        }
    }

    // Update importation request
    async updateImportationRequest(id, updateData, userId) {
        try {
            const request = await ImportationRequest.findByPk(id);
            
            if (!request) {
                throw new Error('Importation request not found');
            }

            const updatedRequest = await request.update({
                ...updateData,
                updatedBy: userId,
                updatedDate: new Date()
            });

            return updatedRequest;
        } catch (error) {
            throw new Error(`Error updating importation request: ${error.message}`);
        }
    }

    // Delete importation request (admin only)
    async deleteImportationRequest(id) {
        try {
            const request = await ImportationRequest.findByPk(id);
            
            if (!request) {
                throw new Error('Importation request not found');
            }

            await request.destroy();
            return { message: 'Importation request deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting importation request: ${error.message}`);
        }
    }

    // Update shipping information
    async updateShippingInfo(id, shippingData, userId) {
        try {
            const request = await ImportationRequest.findByPk(id);
            
            if (!request) {
                throw new Error('Importation request not found');
            }

            const updatedRequest = await request.update({
                shippingMethod: shippingData.shippingMethod,
                estimatedArrival: shippingData.estimatedArrival,
                actualArrival: shippingData.actualArrival,
                borderCrossingInfo: shippingData.borderCrossingInfo,
                updatedBy: userId,
                updatedDate: new Date()
            });

            return updatedRequest;
        } catch (error) {
            throw new Error(`Error updating shipping information: ${error.message}`);
        }
    }

    // Update warehouse information
    async updateWarehouseInfo(id, warehouseData, userId) {
        try {
            const request = await ImportationRequest.findByPk(id);
            
            if (!request) {
                throw new Error('Importation request not found');
            }

            const updatedRequest = await request.update({
                warehouseLocation: warehouseData.warehouseLocation,
                batchNumbers: warehouseData.batchNumbers,
                inspectionResult: warehouseData.inspectionResult,
                inspectionNotes: warehouseData.inspectionNotes,
                updatedBy: userId,
                updatedDate: new Date()
            });

            return updatedRequest;
        } catch (error) {
            throw new Error(`Error updating warehouse information: ${error.message}`);
        }
    }

    // Get requests by agent (for role-based access)
    async getRequestsByAgent(agentId, filters = {}, pagination = {}) {
        try {
            return await this.getAllImportationRequests({ 
                ...filters, 
                agentId 
            }, pagination);
        } catch (error) {
            throw new Error(`Error retrieving agent requests: ${error.message}`);
        }
    }

    // Bulk status update
    async bulkUpdateStatus(requestIds, status, userId) {
        try {
            const result = await ImportationRequest.update(
                { 
                    status, 
                    updatedBy: userId,
                    updatedDate: new Date()
                },
                { 
                    where: { 
                        id: { [Op.in]: requestIds } 
                    } 
                }
            );

            return { 
                message: `${result[0]} requests updated successfully`,
                updatedCount: result[0]
            };
        } catch (error) {
            throw new Error(`Error bulk updating status: ${error.message}`);
        }
    }

    // Update request status with comments
    async updateStatus(id, status, comments, userId) {
        try {
            const request = await ImportationRequest.findByPk(id);
            if (!request) {
                throw new Error('Importation request not found');
            }

            const updatedRequest = await request.update({
                status,
                remarks: comments || request.remarks,
                updatedBy: userId,
                updatedDate: new Date()
            });

            return updatedRequest;
        } catch (error) {
            throw new Error(`Error updating request status: ${error.message}`);
        }
    }    // Export requests to CSV
    async exportToCSV(filters = {}) {
        try {
            console.log('CSV Service: exportToCSV called with filters:', filters);
            
            const whereClause = {};
            
            if (filters.status) whereClause.status = filters.status;
            if (filters.agentId) whereClause.agentId = filters.agentId;
            if (filters.urgencyLevel) whereClause.urgencyLevel = filters.urgencyLevel;

            console.log('CSV Service: whereClause:', whereClause);

            const requests = await ImportationRequest.findAll({
                where: whereClause,
                order: [['createdDate', 'DESC']]
            });

            console.log('CSV Service: Found requests count:', requests.length);

            // Create CSV headers
            const headers = [
                'ID', 'Drug Name', 'Brand Name', 'Quantity Requested', 
                'Status', 'Urgency Level', 'Total Value', 'Agent ID', 
                'Created Date'
            ];

            // Convert requests to CSV rows
            const rows = requests.map(request => [
                request.id,
                request.drugName,
                request.brandName || '',
                request.quantityRequested,
                request.status,
                request.urgencyLevel,
                request.totalValue || '',
                request.agentId,
                request.createdDate
            ]);

            // Combine headers and rows
            const csvContent = [headers, ...rows]
                .map(row => row.map(field => `"${field}"`).join(','))
                .join('\n');

            console.log('CSV Service: Generated CSV content length:', csvContent.length);
            return csvContent;
        } catch (error) {
            console.error('CSV Service Error:', error);
            throw new Error(`Error exporting to CSV: ${error.message}`);
        }
    }
}

module.exports = new ImportationRequestService();
