const DrugsUnderProcess = require('../models/drugsUnderProcess');
const WorkflowState = require('../models/workflowState');

class DrugsUnderProcessService {
  static async getAllDrugsUnderProcess(userId = null, userRole = 'agent') {
    try {
      let whereClause = {};
      let includeWorkflow = false;

      // Apply role-based filtering
      switch (userRole) {
        case 'agent':
          // Agents can only see their own drugs
          if (userId) {
            includeWorkflow = true;
            // We'll filter by workflow created_by since the drug might not have a direct user association
          }
          break;
        case 'import_export':
          // Import/Export can see drugs pending their review
          includeWorkflow = true;
          break;
        case 'quality_committee':
          // Quality committee can see drugs pending quality review
          includeWorkflow = true;
          break;
        case 'pricing_committee':
          // Pricing committee can see drugs pending pricing review
          includeWorkflow = true;
          break;
        case 'admin':
          // Admins can see all drugs
          includeWorkflow = true;
          break;
      }

      const queryOptions = {
        where: whereClause
      };

      if (includeWorkflow) {
        queryOptions.include = [
          {
            model: WorkflowState,
            as: 'workflowState',
            required: false // Left join to include drugs without workflow
          }
        ];
      }

      let drugs = await DrugsUnderProcess.findAll(queryOptions);

      // Apply additional filtering based on role and workflow state
      if (includeWorkflow && userRole !== 'admin') {
        drugs = drugs.filter(drug => {
          if (!drug.workflowState) return false;

          switch (userRole) {
            case 'agent':
              return drug.workflowState.created_by === userId;
            case 'import_export':
              return ['pending_import_export_review', 'import_export_review'].includes(drug.workflowState.status);
            case 'quality_committee':
              return ['pending_quality_review', 'quality_review'].includes(drug.workflowState.status);
            case 'pricing_committee':
              return ['pending_pricing_review', 'pricing_review'].includes(drug.workflowState.status);
            default:
              return true;
          }
        });
      }

      return drugs;
    } catch (error) {
      console.error('Error fetching drugs under process:', error);
      throw new Error('Failed to fetch drugs under process');
    }
  }
  static async getDrugUnderProcessById(id, userId = null, userRole = 'agent') {
    try {
      const queryOptions = {
        where: { id },
        include: [
          {
            model: WorkflowState,
            as: 'workflowState',
            required: false
          }
        ]
      };

      const drug = await DrugsUnderProcess.findOne(queryOptions);
      
      if (!drug) {
        throw new Error(`Drug under process with ID ${id} not found`);
      }

      // Check if user has permission to view this drug
      if (userRole === 'agent' && drug.workflowState && drug.workflowState.created_by !== userId) {
        throw new Error('Access denied: You can only view your own drug registrations');
      }

      return drug;
    } catch (error) {
      console.error('Error fetching drug under process by ID:', error);
      throw new Error(error.message || 'Failed to fetch drug under process');
    }
  }
  static async createDrugUnderProcess(data, userId) {
    try {
      // Ensure all new fields from the multi-step form are passed
      const newDrug = await DrugsUnderProcess.create({ 
        ...data,
        // Add any additional fields needed for workflow integration
        createdBy: userId // If the model supports this field
      });
      return newDrug;
    } catch (error) {
      console.error('Error creating drug under process:', error);
      throw new Error('Failed to create drug under process');
    }
  }
  static async updateDrugUnderProcess(id, data, userId) {
    try {
      const drug = await DrugsUnderProcess.findByPk(id);
      if (!drug) {
        throw new Error(`Drug under process with ID ${id} not found`);
      }
      
      // Update including new fields
      await drug.update({ ...data });
      return drug;
    } catch (error) {
      console.error('Error updating drug under process:', error);
      throw new Error('Failed to update drug under process');
    }
  }

  // Check if user has permission to update a drug
  static async checkUpdatePermission(drugId, userId, userRole) {
    try {
      const drug = await DrugsUnderProcess.findOne({
        where: { id: drugId },
        include: [
          {
            model: WorkflowState,
            as: 'workflowState',
            required: false
          }
        ]
      });

      if (!drug) {
        return false;
      }

      // Role-based permission matrix
      switch (userRole) {
        case 'agent':
          // Agents can only edit their own drugs and only if workflow allows
          if (!drug.workflowState || drug.workflowState.created_by !== userId) {
            return false;
          }
          // Check if workflow status allows agent editing
          return ['draft', 'agent_in_progress'].includes(drug.workflowState.status);
          
        case 'import_export':
          // Import/Export can edit when workflow is in their review phase
          return drug.workflowState && 
                 ['pending_import_export_review', 'import_export_review'].includes(drug.workflowState.status);
          
        case 'quality_committee':
          // Quality committee can always review (view-only access handled at frontend)
          return drug.workflowState && 
                 ['pending_quality_review', 'quality_review'].includes(drug.workflowState.status);
          
        case 'pricing_committee':
          // Pricing committee can review pricing information
          return drug.workflowState && 
                 ['pending_pricing_review', 'pricing_review'].includes(drug.workflowState.status);
          
        case 'admin':
          // Admins can always edit
          return true;
          
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking update permission:', error);
      return false;
    }
  }

  static async deleteDrugUnderProcess(id) {
    try {
      const drug = await DrugsUnderProcess.findByPk(id);
      if (!drug) {
        throw new Error(`Drug under process with ID ${id} not found`);
      }
      await drug.destroy();
      return { message: 'Drug under process deleted successfully' };
    } catch (error) {
      console.error('Error deleting drug under process:', error);
      throw new Error('Failed to delete drug under process');
    }
  }
}

module.exports = DrugsUnderProcessService;