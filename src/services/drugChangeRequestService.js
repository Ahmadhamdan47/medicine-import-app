// src/services/drugChangeRequestService.js
const DrugChangeRequest = require('../models/drugChangeRequest');
const DrugChangeHistory = require('../models/drugChangeHistory');
const Drug = require('../models/pharmacyDrug');
const UserAccounts = require('../models/userAccounts');
const Role = require('../models/roles');
const { Op } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');

// Initialize associations if not already done
if (DrugChangeRequest.associate && !DrugChangeRequest.associations.requester) {
  DrugChangeRequest.associate({ UserAccounts, Drug, DrugChangeRequest });
}
if (DrugChangeHistory.associate && !DrugChangeHistory.associations.changer) {
  DrugChangeHistory.associate({ UserAccounts, Drug, DrugChangeRequest, DrugChangeHistory });
}
if (UserAccounts.associate && !UserAccounts.associations.role) {
  UserAccounts.associate({ Role, UserAccounts, Donor: require('../models/donor'), Recipient: require('../models/recipient') });
}

class DrugChangeRequestService {
  /**
   * Create a new change request for drug edits
   */
  static async createChangeRequest(userId, userRole, drugId, proposedChanges, previousValues = null) {
    try {
      // If previousValues not provided, fetch current drug data
      if (!previousValues) {
        const drug = await Drug.findByPk(drugId);
        if (!drug) {
          throw new Error(`Drug with ID ${drugId} not found`);
        }
        previousValues = drug.toJSON();
      }

      // Extract only the fields that are being changed
      const filteredPreviousValues = {};
      Object.keys(proposedChanges).forEach(key => {
        if (previousValues[key] !== undefined) {
          filteredPreviousValues[key] = previousValues[key];
        }
      });

      const changeRequest = await DrugChangeRequest.create({
        DrugID: drugId,
        RequestedBy: userId,
        RequestedByRole: userRole,
        Status: 'pending',
        ChangeType: 'update',
        ChangesJSON: proposedChanges,
        PreviousValuesJSON: filteredPreviousValues
      });

      return changeRequest;
    } catch (error) {
      console.error('Error creating change request:', error);
      throw error;
    }
  }

  /**
   * Get all pending change requests with filters
   */
  static async getPendingRequests(filters = {}) {
    try {
      const whereClause = { Status: 'pending' };

      if (filters.drugId) {
        whereClause.DrugID = filters.drugId;
      }

      if (filters.requestedBy) {
        whereClause.RequestedBy = filters.requestedBy;
      }

      const requests = await DrugChangeRequest.findAll({
        where: whereClause,
        include: [
          {
            model: UserAccounts,
            as: 'requester',
            attributes: ['UserId', 'Username', 'Email'],
            include: [{
              model: Role,
              as: 'role',
              attributes: ['RoleId', 'RoleName']
            }]
          },
          {
            model: Drug,
            as: 'drug',
            attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'MoPHCode', 'RegistrationNumber']
          }
        ],
        order: [['CreatedAt', 'DESC']]
      });

      return requests;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      throw error;
    }
  }

  /**
   * Get all change requests (with status filter)
   */
  static async getAllRequests(filters = {}) {
    try {
      const whereClause = {};

      if (filters.status) {
        whereClause.Status = filters.status;
      }

      if (filters.drugId) {
        whereClause.DrugID = filters.drugId;
      }

      if (filters.requestedBy) {
        whereClause.RequestedBy = filters.requestedBy;
      }

      const requests = await DrugChangeRequest.findAll({
        where: whereClause,
        include: [
          {
            model: UserAccounts,
            as: 'requester',
            attributes: ['UserId', 'Username', 'Email'],
            include: [{
              model: Role,
              as: 'role',
              attributes: ['RoleId', 'RoleName']
            }]
          },
          {
            model: UserAccounts,
            as: 'reviewer',
            attributes: ['UserId', 'Username', 'Email'],
            required: false
          },
          {
            model: Drug,
            as: 'drug',
            attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'MoPHCode', 'RegistrationNumber']
          }
        ],
        order: [['CreatedAt', 'DESC']]
      });

      return requests;
    } catch (error) {
      console.error('Error fetching change requests:', error);
      throw error;
    }
  }

  /**
   * Get a specific change request by ID with full details
   */
  static async getChangeRequestById(requestId) {
    try {
      const request = await DrugChangeRequest.findByPk(requestId, {
        include: [
          {
            model: UserAccounts,
            as: 'requester',
            attributes: ['UserId', 'Username', 'Email'],
            include: [{
              model: Role,
              as: 'role',
              attributes: ['RoleId', 'RoleName']
            }]
          },
          {
            model: UserAccounts,
            as: 'reviewer',
            attributes: ['UserId', 'Username', 'Email'],
            required: false
          },
          {
            model: Drug,
            as: 'drug',
            attributes: ['DrugID', 'DrugName', 'DrugNameAR', 'MoPHCode', 'RegistrationNumber', 'Price', 'Form', 'Dosage', 'Presentation']
          }
        ]
      });

      if (!request) {
        throw new Error(`Change request with ID ${requestId} not found`);
      }

      // Format the response to show before/after comparison
      const comparison = {
        drugInfo: request.drug,
        requestInfo: {
          id: request.ChangeRequestId,
          status: request.Status,
          requestedBy: request.requester,
          requestedAt: request.CreatedAt,
          reviewedBy: request.reviewer,
          reviewedAt: request.ReviewedAt,
          reviewComments: request.ReviewComments
        },
        changes: []
      };

      // Compare previous values with proposed changes
      const changes = request.ChangesJSON;
      const previous = request.PreviousValuesJSON;

      Object.keys(changes).forEach(field => {
        comparison.changes.push({
          field: field,
          previousValue: previous[field],
          proposedValue: changes[field]
        });
      });

      return comparison;
    } catch (error) {
      console.error('Error fetching change request:', error);
      throw error;
    }
  }

  /**
   * Approve a change request and apply changes to drug table
   */
  static async approveChangeRequest(requestId, adminId, comments = null) {
    const transaction = await sequelize.transaction();

    try {
      // Get the change request
      const request = await DrugChangeRequest.findByPk(requestId, { transaction });

      if (!request) {
        throw new Error(`Change request with ID ${requestId} not found`);
      }

      if (request.Status !== 'pending') {
        throw new Error(`Change request is already ${request.Status}`);
      }

      // Apply changes to the drug table
      const drug = await Drug.findByPk(request.DrugID, { transaction });
      if (!drug) {
        throw new Error(`Drug with ID ${request.DrugID} not found`);
      }

      await drug.update(request.ChangesJSON, { transaction });

      // Update the change request status
      await request.update({
        Status: 'approved',
        ReviewedBy: adminId,
        ReviewedAt: new Date(),
        ReviewComments: comments
      }, { transaction });

      // Log each field change in history
      const changes = request.ChangesJSON;
      const previous = request.PreviousValuesJSON;

      for (const field of Object.keys(changes)) {
        await DrugChangeHistory.create({
          DrugID: request.DrugID,
          ChangeRequestId: request.ChangeRequestId,
          ChangedBy: request.RequestedBy,
          ChangedByRole: request.RequestedByRole,
          ChangeType: 'update',
          FieldName: field,
          OldValue: previous[field] != null ? String(previous[field]) : null,
          NewValue: changes[field] != null ? String(changes[field]) : null,
          ApprovedBy: adminId,
          ChangeTimestamp: new Date()
        }, { transaction });
      }

      await transaction.commit();

      return {
        success: true,
        message: 'Change request approved and applied successfully',
        changeRequestId: requestId,
        drugId: request.DrugID
      };
    } catch (error) {
      await transaction.rollback();
      console.error('Error approving change request:', error);
      throw error;
    }
  }

  /**
   * Reject a change request
   */
  static async rejectChangeRequest(requestId, adminId, comments = null) {
    try {
      const request = await DrugChangeRequest.findByPk(requestId);

      if (!request) {
        throw new Error(`Change request with ID ${requestId} not found`);
      }

      if (request.Status !== 'pending') {
        throw new Error(`Change request is already ${request.Status}`);
      }

      await request.update({
        Status: 'rejected',
        ReviewedBy: adminId,
        ReviewedAt: new Date(),
        ReviewComments: comments
      });

      return {
        success: true,
        message: 'Change request rejected',
        changeRequestId: requestId
      };
    } catch (error) {
      console.error('Error rejecting change request:', error);
      throw error;
    }
  }

  /**
   * Get change history for a specific drug
   */
  static async getChangeHistory(drugId, limit = 50) {
    try {
      const history = await DrugChangeHistory.findAll({
        where: { DrugID: drugId },
        include: [
          {
            model: UserAccounts,
            as: 'changer',
            attributes: ['UserId', 'Username', 'Email']
          },
          {
            model: UserAccounts,
            as: 'approver',
            attributes: ['UserId', 'Username', 'Email'],
            required: false
          },
          {
            model: DrugChangeRequest,
            as: 'changeRequest',
            attributes: ['ChangeRequestId', 'Status', 'ReviewComments'],
            required: false
          }
        ],
        order: [['ChangeTimestamp', 'DESC']],
        limit: limit
      });

      return history;
    } catch (error) {
      console.error('Error fetching change history:', error);
      throw error;
    }
  }

  /**
   * Log a direct change (for admin users who edit directly)
   */
  static async logDirectChange(drugId, userId, userRole, changes, previousValues) {
    const transaction = await sequelize.transaction();

    try {
      // Log each field change
      for (const field of Object.keys(changes)) {
        await DrugChangeHistory.create({
          DrugID: drugId,
          ChangeRequestId: null, // No change request for direct edits
          ChangedBy: userId,
          ChangedByRole: userRole,
          ChangeType: 'update',
          FieldName: field,
          OldValue: previousValues[field] != null ? String(previousValues[field]) : null,
          NewValue: changes[field] != null ? String(changes[field]) : null,
          ApprovedBy: userId, // Admin approved their own change
          ChangeTimestamp: new Date()
        }, { transaction });
      }

      await transaction.commit();

      return { success: true, message: 'Change logged successfully' };
    } catch (error) {
      await transaction.rollback();
      console.error('Error logging direct change:', error);
      throw error;
    }
  }

  /**
   * Get statistics about change requests
   */
  static async getStatistics() {
    try {
      const [pending, approved, rejected] = await Promise.all([
        DrugChangeRequest.count({ where: { Status: 'pending' } }),
        DrugChangeRequest.count({ where: { Status: 'approved' } }),
        DrugChangeRequest.count({ where: { Status: 'rejected' } })
      ]);

      return {
        pending,
        approved,
        rejected,
        total: pending + approved + rejected
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Get pending changes for a specific drug and user
   * Used to restore unsaved changes when user reopens the drug
   */
  static async getUserPendingChanges(drugId, userId) {
    try {
      const pendingRequest = await DrugChangeRequest.findOne({
        where: {
          DrugID: drugId,
          RequestedBy: userId,
          Status: 'pending'
        },
        order: [['CreatedAt', 'DESC']] // Get most recent if multiple
      });

      if (!pendingRequest) {
        return null;
      }

      return {
        changeRequestId: pendingRequest.ChangeRequestId,
        status: pendingRequest.Status,
        changes: pendingRequest.ChangesJSON,
        previousValues: pendingRequest.PreviousValuesJSON,
        createdAt: pendingRequest.CreatedAt
      };
    } catch (error) {
      console.error('Error fetching user pending changes:', error);
      throw error;
    }
  }

  /**
   * Update an existing pending change request
   * Allows user to modify their pending changes before admin approval
   */
  static async updatePendingRequest(requestId, userId, newChanges) {
    try {
      const request = await DrugChangeRequest.findByPk(requestId);

      if (!request) {
        throw new Error(`Change request with ID ${requestId} not found`);
      }

      // Verify the request belongs to this user
      if (request.RequestedBy !== userId) {
        throw new Error('You can only update your own change requests');
      }

      if (request.Status !== 'pending') {
        throw new Error(`Cannot update ${request.Status} request. Only pending requests can be modified.`);
      }

      // Update the changes while keeping previous values
      await request.update({
        ChangesJSON: newChanges,
        UpdatedAt: new Date()
      });

      return {
        success: true,
        message: 'Change request updated successfully',
        changeRequest: request
      };
    } catch (error) {
      console.error('Error updating pending request:', error);
      throw error;
    }
  }

  /**
   * Delete/cancel a pending change request
   * Allows user to discard their pending changes
   */
  static async cancelPendingRequest(requestId, userId) {
    try {
      const request = await DrugChangeRequest.findByPk(requestId);

      if (!request) {
        throw new Error(`Change request with ID ${requestId} not found`);
      }

      // Verify the request belongs to this user
      if (request.RequestedBy !== userId) {
        throw new Error('You can only cancel your own change requests');
      }

      if (request.Status !== 'pending') {
        throw new Error(`Cannot cancel ${request.Status} request. Only pending requests can be canceled.`);
      }

      await request.destroy();

      return {
        success: true,
        message: 'Change request canceled successfully'
      };
    } catch (error) {
      console.error('Error canceling pending request:', error);
      throw error;
    }
  }

  /**
   * Get drug data merged with user's pending changes
   * Returns the drug as it would appear if the pending changes were applied
   */
  static async getDrugWithPendingChanges(drugId, userId) {
    try {
      // Get the drug data
      const drug = await Drug.findByPk(drugId);
      if (!drug) {
        throw new Error(`Drug with ID ${drugId} not found`);
      }

      const drugData = drug.toJSON();

      // Get pending changes for this user
      const pendingChanges = await this.getUserPendingChanges(drugId, userId);

      if (!pendingChanges) {
        // No pending changes, return drug as-is
        return {
          drugData,
          hasPendingChanges: false,
          pendingRequest: null
        };
      }

      // Merge pending changes with drug data
      const mergedData = { ...drugData, ...pendingChanges.changes };

      return {
        drugData: mergedData,
        originalData: drugData,
        hasPendingChanges: true,
        pendingRequest: {
          id: pendingChanges.changeRequestId,
          status: pendingChanges.status,
          createdAt: pendingChanges.createdAt,
          changes: pendingChanges.changes
        }
      };
    } catch (error) {
      console.error('Error getting drug with pending changes:', error);
      throw error;
    }
  }
}

module.exports = DrugChangeRequestService;
