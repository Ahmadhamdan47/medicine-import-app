// src/controllers/drugChangeRequestController.js
const DrugChangeRequestService = require('../services/drugChangeRequestService');

class DrugChangeRequestController {
  /**
   * Submit a new change request
   * POST /drug-change-requests
   */
  static async submitChangeRequest(req, res) {
    try {
      const { drugId, changes } = req.body;
      const userId = req.user?.UserId;
      const userRole = req.user?.role?.RoleName;

      if (!userId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      if (!drugId || !changes || Object.keys(changes).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Drug ID and changes are required'
        });
      }

      const changeRequest = await DrugChangeRequestService.createChangeRequest(
        userId,
        userRole,
        drugId,
        changes
      );

      return res.status(201).json({
        success: true,
        message: 'Change request submitted successfully for admin approval',
        data: changeRequest
      });
    } catch (error) {
      console.error('Error in submitChangeRequest:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit change request',
        error: error.message
      });
    }
  }

  /**
   * Get all pending change requests
   * GET /drug-change-requests/pending
   */
  static async getPendingRequests(req, res) {
    try {
      const { drugId, requestedBy } = req.query;

      const filters = {};
      if (drugId) filters.drugId = parseInt(drugId);
      if (requestedBy) filters.requestedBy = parseInt(requestedBy);

      const requests = await DrugChangeRequestService.getPendingRequests(filters);

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
      });
    } catch (error) {
      console.error('Error in getPendingRequests:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch pending requests',
        error: error.message
      });
    }
  }

  /**
   * Get all change requests (with optional status filter)
   * GET /drug-change-requests
   */
  static async getAllRequests(req, res) {
    try {
      const { status, drugId, requestedBy } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (drugId) filters.drugId = parseInt(drugId);
      if (requestedBy) filters.requestedBy = parseInt(requestedBy);

      const requests = await DrugChangeRequestService.getAllRequests(filters);

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
      });
    } catch (error) {
      console.error('Error in getAllRequests:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch change requests',
        error: error.message
      });
    }
  }

  /**
   * Get a specific change request with before/after comparison
   * GET /drug-change-requests/:id
   */
  static async getChangeRequestById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Change request ID is required'
        });
      }

      const comparison = await DrugChangeRequestService.getChangeRequestById(parseInt(id));

      return res.status(200).json({
        success: true,
        data: comparison
      });
    } catch (error) {
      console.error('Error in getChangeRequestById:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch change request',
        error: error.message
      });
    }
  }

  /**
   * Approve a change request and apply changes
   * PUT /drug-change-requests/:id/approve
   */
  static async approveChangeRequest(req, res) {
    try {
      const { id } = req.params;
      const { comments } = req.body;
      const adminId = req.user?.UserId;
      const userRole = req.user?.role?.RoleName;

      if (!adminId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      // Check if user is admin
      if (userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can approve change requests'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Change request ID is required'
        });
      }

      const result = await DrugChangeRequestService.approveChangeRequest(
        parseInt(id),
        adminId,
        comments
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in approveChangeRequest:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('already')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to approve change request',
        error: error.message
      });
    }
  }

  /**
   * Reject a change request
   * PUT /drug-change-requests/:id/reject
   */
  static async rejectChangeRequest(req, res) {
    try {
      const { id } = req.params;
      const { comments } = req.body;
      const adminId = req.user?.UserId;
      const userRole = req.user?.role?.RoleName;

      if (!adminId || !userRole) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      // Check if user is admin
      if (userRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only administrators can reject change requests'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Change request ID is required'
        });
      }

      const result = await DrugChangeRequestService.rejectChangeRequest(
        parseInt(id),
        adminId,
        comments
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in rejectChangeRequest:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('already')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to reject change request',
        error: error.message
      });
    }
  }

  /**
   * Get change history for a specific drug
   * GET /drug-change-requests/history/:drugId
   */
  static async getChangeHistory(req, res) {
    try {
      const { drugId } = req.params;
      const { limit } = req.query;

      if (!drugId) {
        return res.status(400).json({
          success: false,
          message: 'Drug ID is required'
        });
      }

      const history = await DrugChangeRequestService.getChangeHistory(
        parseInt(drugId),
        limit ? parseInt(limit) : 50
      );

      return res.status(200).json({
        success: true,
        count: history.length,
        data: history
      });
    } catch (error) {
      console.error('Error in getChangeHistory:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch change history',
        error: error.message
      });
    }
  }

  /**
   * Get statistics about change requests
   * GET /drug-change-requests/statistics
   */
  static async getStatistics(req, res) {
    try {
      const stats = await DrugChangeRequestService.getStatistics();

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStatistics:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }

  /**
   * Get user's pending changes for a drug (to restore unsaved edits)
   * GET /drug-change-requests/drug/:drugId/my-pending
   */
  static async getMyPendingChanges(req, res) {
    try {
      const { drugId } = req.params;
      const userId = req.user?.UserId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      if (!drugId) {
        return res.status(400).json({
          success: false,
          message: 'Drug ID is required'
        });
      }

      const pendingChanges = await DrugChangeRequestService.getUserPendingChanges(
        parseInt(drugId),
        userId
      );

      if (!pendingChanges) {
        return res.status(200).json({
          success: true,
          hasPendingChanges: false,
          data: null
        });
      }

      return res.status(200).json({
        success: true,
        hasPendingChanges: true,
        data: pendingChanges
      });
    } catch (error) {
      console.error('Error in getMyPendingChanges:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch pending changes',
        error: error.message
      });
    }
  }

  /**
   * Get drug data merged with user's pending changes
   * GET /drug-change-requests/drug/:drugId/with-pending
   */
  static async getDrugWithPendingChanges(req, res) {
    try {
      const { drugId } = req.params;
      const userId = req.user?.UserId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      if (!drugId) {
        return res.status(400).json({
          success: false,
          message: 'Drug ID is required'
        });
      }

      const result = await DrugChangeRequestService.getDrugWithPendingChanges(
        parseInt(drugId),
        userId
      );

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getDrugWithPendingChanges:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to fetch drug with pending changes',
        error: error.message
      });
    }
  }

  /**
   * Update an existing pending change request
   * PUT /drug-change-requests/:id/update
   */
  static async updatePendingRequest(req, res) {
    try {
      const { id } = req.params;
      const { changes } = req.body;
      const userId = req.user?.UserId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      if (!id || !changes) {
        return res.status(400).json({
          success: false,
          message: 'Request ID and changes are required'
        });
      }

      const result = await DrugChangeRequestService.updatePendingRequest(
        parseInt(id),
        userId,
        changes
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in updatePendingRequest:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('only update your own') || error.message.includes('Cannot update')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to update pending request',
        error: error.message
      });
    }
  }

  /**
   * Cancel/delete a pending change request
   * DELETE /drug-change-requests/:id/cancel
   */
  static async cancelPendingRequest(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.UserId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Request ID is required'
        });
      }

      const result = await DrugChangeRequestService.cancelPendingRequest(
        parseInt(id),
        userId
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in cancelPendingRequest:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message.includes('only cancel your own') || error.message.includes('Cannot cancel')) {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to cancel pending request',
        error: error.message
      });
    }
  }
}

module.exports = DrugChangeRequestController;
