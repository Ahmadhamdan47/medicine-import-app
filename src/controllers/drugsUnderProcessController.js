const DrugsUnderProcessService = require('../services/drugsUnderProcessService');
const WorkflowService = require('../services/workflowService');

class DrugsUnderProcessController {
  static async getAllDrugsUnderProcess(req, res) {
    try {
      const userId = req.user?.id || req.query.userId;
      const userRole = req.user?.role || req.query.userRole || 'agent';
      
      // Apply role-based filtering
      const drugs = await DrugsUnderProcessService.getAllDrugsUnderProcess(userId, userRole);
      res.status(200).json(drugs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getDrugUnderProcessById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.query.userId;
      const userRole = req.user?.role || req.query.userRole || 'agent';
      
      const drug = await DrugsUnderProcessService.getDrugUnderProcessById(id, userId, userRole);
      
      // Also get workflow state if it exists
      try {
        const workflow = await WorkflowService.getWorkflowByDrugId(id);
        drug.workflow = workflow;
      } catch (workflowError) {
        // Workflow doesn't exist yet, that's okay
        drug.workflow = null;
      }
      
      res.status(200).json(drug);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  static async createDrugUnderProcess(req, res) {
    try {
      const userId = req.user?.id || req.body.userId || req.body.createdBy;
      
      // Pass the complete multi-step form data (including new variables)
      const drug = await DrugsUnderProcessService.createDrugUnderProcess(req.body, userId);
      
      // Create initial workflow state
      try {
        const workflow = await WorkflowService.createWorkflow(drug.id.toString(), userId);
        drug.workflow = workflow;
      } catch (workflowError) {
        console.error('Failed to create workflow:', workflowError.message);
        // Continue even if workflow creation fails
      }
      
      res.status(201).json(drug);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async updateDrugUnderProcess(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.userId;
      const userRole = req.user?.role || req.body.userRole || 'agent';
      
      // Check permissions before updating
      const hasPermission = await DrugsUnderProcessService.checkUpdatePermission(id, userId, userRole);
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions to update this drug' });
      }
      
      const drug = await DrugsUnderProcessService.updateDrugUnderProcess(id, req.body, userId);
      
      // Update workflow if step completion data is provided
      if (req.body.workflow) {
        try {
          const workflow = await WorkflowService.updateWorkflow(id, req.body.workflow, userId);
          drug.workflow = workflow;
        } catch (workflowError) {
          console.error('Failed to update workflow:', workflowError.message);
        }
      }
      
      res.status(200).json(drug);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteDrugUnderProcess(req, res) {
    try {
      const { id } = req.params;
      const result = await DrugsUnderProcessService.deleteDrugUnderProcess(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Workflow integration methods
  static async completeStep(req, res) {
    try {
      const { id } = req.params;
      const { stepNumber, comments } = req.body;
      const userId = req.user?.id || req.body.userId;

      const workflow = await WorkflowService.completeStep(id, stepNumber, userId, comments);
      res.status(200).json(workflow);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('permission')) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  static async getWorkflow(req, res) {
    try {
      const { id } = req.params;
      const workflow = await WorkflowService.getWorkflowByDrugId(id);
      res.status(200).json(workflow);
    } catch (error) {
      if (error.message.includes('not found')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = DrugsUnderProcessController;