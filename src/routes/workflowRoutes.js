const express = require('express');
const router = express.Router();
const WorkflowController = require('../controllers/workflowController');

/**
 * @swagger
 * /workflow:
 *   post:
 *     summary: Create a new workflow for a drug
 *     tags: [Workflow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drugId:
 *                 type: string
 *               createdBy:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workflow created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', WorkflowController.createWorkflow);

/**
 * @swagger
 * /workflow/{drugId}:
 *   get:
 *     summary: Get workflow state for a specific drug
 *     tags: [Workflow]
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workflow state retrieved successfully
 *       404:
 *         description: Workflow not found
 */
router.get('/:drugId', WorkflowController.getWorkflowByDrugId);

/**
 * @swagger
 * /workflow/{drugId}:
 *   put:
 *     summary: Update workflow state for a specific drug
 *     tags: [Workflow]
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Workflow updated successfully
 *       404:
 *         description: Workflow not found
 *       403:
 *         description: Permission denied
 */
router.put('/:drugId', WorkflowController.updateWorkflow);

/**
 * @swagger
 * /workflow/{drugId}/complete-step:
 *   post:
 *     summary: Complete a workflow step
 *     tags: [Workflow]
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stepNumber:
 *                 type: integer
 *               comments:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Step completed successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Workflow not found
 */
router.post('/:drugId/complete-step', WorkflowController.completeStep);

/**
 * @swagger
 * /workflow/{drugId}/approve-step:
 *   post:
 *     summary: Approve a workflow step
 *     tags: [Workflow]
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stepNumber:
 *                 type: integer
 *               comments:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Step approved successfully
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Workflow not found
 */
router.post('/:drugId/approve-step', WorkflowController.approveStep);

/**
 * @swagger
 * /workflow/{drugId}/reject-step:
 *   post:
 *     summary: Reject a workflow step
 *     tags: [Workflow]
 *     parameters:
 *       - in: path
 *         name: drugId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stepNumber:
 *                 type: integer
 *               comments:
 *                 type: string
 *                 required: true
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Step rejected successfully
 *       400:
 *         description: Comments required for rejection
 *       403:
 *         description: Permission denied
 *       404:
 *         description: Workflow not found
 */
router.post('/:drugId/reject-step', WorkflowController.rejectStep);

/**
 * @swagger
 * /workflows:
 *   get:
 *     summary: Get all workflows filtered by user role
 *     tags: [Workflow]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: userRole
 *         schema:
 *           type: string
 *           enum: [agent, import_export, quality_committee, pricing_committee, admin]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workflows retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', WorkflowController.getAllWorkflows);

module.exports = router;
