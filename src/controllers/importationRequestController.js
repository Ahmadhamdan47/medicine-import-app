// Importation Request Controller
const ImportationRequestService = require('../services/importationRequestService');

class ImportationRequestController {    // POST /importation-requests - Create new request (agent)
    async createImportationRequest(req, res) {
        try {
            const userId = req.user.id;
            const userAgentId = req.user.agentId; // AgentId from agent table

            // Agents can only create requests for themselves
            if (req.user.role === 'agent' && !userAgentId) {
                return res.status(403).json({ 
                    error: 'Agent account not properly configured' 
                });
            }

            const requestData = {
                ...req.body,
                // The agentId field in importation_requests refers to the UserId, not AgentId
                agentId: req.user.role === 'agent' ? userId : req.body.agentId
            };

            const importationRequest = await ImportationRequestService.createImportationRequest(requestData, userId);
            
            res.status(201).json({
                message: 'Importation request created successfully',
                data: importationRequest
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message
            });
        }
    }

    // GET /importation-requests - List requests with filtering and pagination
    async getAllImportationRequests(req, res) {
        try {
            const filters = {
                status: req.query.status,
                urgencyLevel: req.query.urgencyLevel,
                agentId: req.query.agentId
            };

            const pagination = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            };            // Agents can only see their own requests
            if (req.user.role === 'agent') {
                filters.agentId = req.user.id; // Use userId, not agentId
            }

            const result = await ImportationRequestService.getAllImportationRequests(filters, pagination);
            
            res.status(200).json({
                message: 'Requests retrieved successfully',
                ...result
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    // GET /importation-requests/:id - Get request details
    async getImportationRequestById(req, res) {
        try {
            const { id } = req.params;
            const request = await ImportationRequestService.getImportationRequestById(id);            // Check if agent can access this request
            if (req.user.role === 'agent' && request.agentId !== req.user.id) {
                return res.status(403).json({ 
                    error: 'Access denied. You can only view your own requests' 
                });
            }

            res.status(200).json({
                message: 'Request retrieved successfully',
                data: request
            });
        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /importation-requests/:id - Update request
    async updateImportationRequest(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;            // Check permissions
            const existingRequest = await ImportationRequestService.getImportationRequestById(id);
            if (req.user.role === 'agent' && existingRequest.agentId !== req.user.id) {
                return res.status(403).json({ 
                    error: 'Access denied. You can only update your own requests' 
                });
            }

            const updatedRequest = await ImportationRequestService.updateImportationRequest(id, req.body, userId);
            
            res.status(200).json({
                message: 'Request updated successfully',
                data: updatedRequest
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // DELETE /importation-requests/:id - Delete request (admin only)
    async deleteImportationRequest(req, res) {
        try {
            const { id } = req.params;
            const result = await ImportationRequestService.deleteImportationRequest(id);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /importation-requests/:id/shipping - Update shipping info
    async updateShippingInfo(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const updatedRequest = await ImportationRequestService.updateShippingInfo(id, req.body, userId);
            
            res.status(200).json({
                message: 'Shipping information updated successfully',
                data: updatedRequest
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /importation-requests/:id/warehouse - Update warehouse info
    async updateWarehouseInfo(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const updatedRequest = await ImportationRequestService.updateWarehouseInfo(id, req.body, userId);
            
            res.status(200).json({
                message: 'Warehouse information updated successfully',
                data: updatedRequest
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /importation-requests/bulk-status - Bulk status update
    async bulkUpdateStatus(req, res) {
        try {
            const { requestIds, status } = req.body;
            const userId = req.user.id;

            if (!requestIds || !Array.isArray(requestIds) || !status) {
                return res.status(400).json({ 
                    error: 'requestIds array and status are required' 
                });
            }

            const result = await ImportationRequestService.bulkUpdateStatus(requestIds, status, userId);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // POST /importation-requests/bulk - General bulk operations
    async bulkOperations(req, res) {
        try {
            const { operation, requestIds, data } = req.body;
            const userId = req.user.id;

            if (!operation || !requestIds || !Array.isArray(requestIds)) {
                return res.status(400).json({ 
                    error: 'Operation and requestIds are required' 
                });
            }

            let result;
            switch (operation) {
                case 'updateStatus':
                    if (!data.status) {
                        return res.status(400).json({ 
                            error: 'Status is required for updateStatus operation' 
                        });
                    }
                    result = await ImportationRequestService.bulkUpdateStatus(requestIds, data.status, userId);
                    break;
                default:
                    return res.status(400).json({ 
                        error: 'Unsupported operation' 
                    });
            }
            
            res.status(200).json({
                message: `Bulk ${operation} completed successfully`,
                data: result
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }    // GET /importation-requests/export-csv - Export requests to CSV
    async exportToCSV(req, res) {
        try {
            console.log('CSV Export: Method called');
            console.log('CSV Export: User role:', req.user.role);
            console.log('CSV Export: User ID:', req.user.id);
            
            const filters = {
                status: req.query.status,
                urgencyLevel: req.query.urgencyLevel,
                agentId: req.query.agentId
            };

            // Agents can only export their own requests
            if (req.user.role === 'agent') {
                filters.agentId = req.user.id; // Use userId, not agentId
                console.log('CSV Export: Agent filter applied, agentId set to:', filters.agentId);
            }

            console.log('CSV Export: Filters:', filters);
            
            const csvData = await ImportationRequestService.exportToCSV(filters);
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=importation-requests.csv');
            res.status(200).send(csvData);
        } catch (error) {
            console.error('CSV Export Error:', error);
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /importation-requests/:id/status - Update request status (import_export, admin)
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, comments } = req.body;
            const userId = req.user.id;

            const result = await ImportationRequestService.updateStatus(id, status, comments, userId);
            
            res.status(200).json({
                message: 'Request status updated successfully',
                data: result
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new ImportationRequestController();
