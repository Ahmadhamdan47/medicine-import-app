const express = require('express');
const router = express.Router();
const DrugsUnderProcessController = require('../controllers/drugsUnderProcessController');

/**
 * @swagger
 * /drugsUnderProcess:
 *   get:
 *     summary: Get all drugs under process
 *     tags: [DrugsUnderProcess]
 *     responses:
 *       200:
 *         description: A list of drugs under process.
 */
router.get('/', DrugsUnderProcessController.getAllDrugsUnderProcess);

/**
 * @swagger
 * /drugsUnderProcess/{id}:
 *   get:
 *     summary: Get a drug under process by ID
 *     tags: [DrugsUnderProcess]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A drug under process object.
 *       404:
 *         description: Drug under process not found.
 */
router.get('/:id', DrugsUnderProcessController.getDrugUnderProcessById);

/**
 * @swagger
 * /drugsUnderProcess:
 *   post:
 *     summary: Create a new drug under process
 *     tags: [DrugsUnderProcess]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: The created drug under process object.
 */
router.post('/', DrugsUnderProcessController.createDrugUnderProcess);

/**
 * @swagger
 * /drugsUnderProcess/{id}:
 *   put:
 *     summary: Update a drug under process by ID
 *     tags: [DrugsUnderProcess]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The updated drug under process object.
 */
router.put('/:id', DrugsUnderProcessController.updateDrugUnderProcess);

/**
 * @swagger
 * /drugsUnderProcess/{id}:
 *   delete:
 *     summary: Delete a drug under process by ID
 *     tags: [DrugsUnderProcess]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A confirmation message.
 */
router.delete('/:id', DrugsUnderProcessController.deleteDrugUnderProcess);

/**
 * @swagger
 * /drugsUnderProcess/{id}/complete-step:
 *   post:
 *     summary: Complete a workflow step for a drug
 *     tags: [DrugsUnderProcess]
 *     parameters:
 *       - in: path
 *         name: id
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
 */
router.post('/:id/complete-step', DrugsUnderProcessController.completeStep);

/**
 * @swagger
 * /drugsUnderProcess/{id}/workflow:
 *   get:
 *     summary: Get workflow state for a drug
 *     tags: [DrugsUnderProcess]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workflow state retrieved successfully
 *       404:
 *         description: Workflow not found
 */
router.get('/:id/workflow', DrugsUnderProcessController.getWorkflow);

module.exports = router;