const WorkflowService = require('../services/workflowService');

class WorkflowController {
    
    // GET /api/workflow/:drugId
    static async getWorkflowByDrugId(req, res) {
        try {
            const { drugId } = req.params;
            const workflow = await WorkflowService.getWorkflowByDrugId(drugId);
            res.status(200).json(workflow);
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    // PUT /api/workflow/:drugId
    static async updateWorkflow(req, res) {
        try {
            const { drugId } = req.params;
            const userId = req.user?.id || req.body.userId; // Get from auth middleware or request body
            
            const workflow = await WorkflowService.updateWorkflow(drugId, req.body, userId);
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

    // POST /api/workflow
    static async createWorkflow(req, res) {
        try {
            const { drugId, createdBy } = req.body;
            const userId = req.user?.id || createdBy;
            
            const workflow = await WorkflowService.createWorkflow(drugId, userId);
            res.status(201).json(workflow);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // POST /api/workflow/:drugId/complete-step
    static async completeStep(req, res) {
        try {
            const { drugId } = req.params;
            const { stepNumber, comments } = req.body;
            const userId = req.user?.id || req.body.userId;

            const workflow = await WorkflowService.completeStep(drugId, stepNumber, userId, comments);
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

    // POST /api/workflow/:drugId/approve-step
    static async approveStep(req, res) {
        try {
            const { drugId } = req.params;
            const { stepNumber, comments } = req.body;
            const userId = req.user?.id || req.body.userId;

            const workflow = await WorkflowService.approveStep(drugId, stepNumber, userId, comments);
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

    // POST /api/workflow/:drugId/reject-step
    static async rejectStep(req, res) {
        try {
            const { drugId } = req.params;
            const { stepNumber, comments } = req.body;
            const userId = req.user?.id || req.body.userId;

            if (!comments) {
                return res.status(400).json({ error: 'Comments are required for rejection' });
            }

            const workflow = await WorkflowService.rejectStep(drugId, stepNumber, userId, comments);
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

    // GET /api/workflows
    static async getAllWorkflows(req, res) {
        try {
            const userId = req.user?.id || req.query.userId;
            const userRole = req.user?.role || req.query.userRole || 'agent';
            const filters = {
                status: req.query.status
            };

            const workflows = await WorkflowService.getAllWorkflows(userId, userRole, filters);
            res.status(200).json(workflows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = WorkflowController;
