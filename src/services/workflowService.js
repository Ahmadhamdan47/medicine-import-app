const { v4: uuidv4 } = require('uuid');
const WorkflowState = require('../models/workflowState');
const StepCompletion = require('../models/stepCompletion');
const QualityReview = require('../models/qualityReview');
const PricingReview = require('../models/pricingReview');
const WorkflowNotification = require('../models/workflowNotification');
const DrugsUnderProcess = require('../models/drugsUnderProcess');
const UserRoleService = require('./userRoleService');

class WorkflowService {
    
    // Create a new workflow for a drug
    static async createWorkflow(drugId, createdBy) {
        try {
            const workflowId = uuidv4();
            
            const workflow = await WorkflowState.create({
                id: workflowId,
                drug_id: drugId,
                current_step: 1,
                status: 'agent_in_progress',
                created_by: createdBy,
                assigned_to: createdBy
            });

            return workflow;
        } catch (error) {
            throw new Error(`Failed to create workflow: ${error.message}`);
        }
    }

    // Get workflow by drug ID
    static async getWorkflowByDrugId(drugId) {
        try {
            const workflow = await WorkflowState.findOne({
                where: { drug_id: drugId },
                include: [
                    {
                        model: StepCompletion,
                        as: 'stepCompletions'
                    },
                    {
                        model: QualityReview,
                        as: 'qualityReview'
                    },
                    {
                        model: PricingReview,
                        as: 'pricingReview'
                    },
                    {
                        model: WorkflowNotification,
                        as: 'notifications'
                    },
                    {
                        model: DrugsUnderProcess,
                        as: 'drug'
                    }
                ]
            });

            if (!workflow) {
                throw new Error('Workflow not found');
            }

            return this.formatWorkflowResponse(workflow);
        } catch (error) {
            throw new Error(`Failed to get workflow: ${error.message}`);
        }
    }

    // Update workflow state
    static async updateWorkflow(drugId, workflowData, userId) {
        try {
            const workflow = await WorkflowState.findOne({
                where: { drug_id: drugId }
            });

            if (!workflow) {
                throw new Error('Workflow not found');
            }

            // Update workflow state
            await workflow.update({
                current_step: workflowData.currentStep || workflow.current_step,
                status: workflowData.status || workflow.status,
                assigned_to: workflowData.assignedTo || workflow.assigned_to,
                updated_at: new Date()
            });

            // Update step completions
            if (workflowData.stepCompletions) {
                for (const [stepNumber, stepData] of Object.entries(workflowData.stepCompletions)) {
                    await this.updateStepCompletion(workflow.id, parseInt(stepNumber), stepData, userId);
                }
            }

            // Update quality review
            if (workflowData.qualityReview) {
                await this.updateQualityReview(workflow.id, workflowData.qualityReview, userId);
            }

            // Update pricing review
            if (workflowData.pricingReview) {
                await this.updatePricingReview(workflow.id, workflowData.pricingReview, userId);
            }

            // Update notifications
            if (workflowData.notifications) {
                for (const [stepNumber, notificationData] of Object.entries(workflowData.notifications)) {
                    await this.updateNotification(workflow.id, parseInt(stepNumber), notificationData, userId);
                }
            }

            return this.getWorkflowByDrugId(drugId);
        } catch (error) {
            throw new Error(`Failed to update workflow: ${error.message}`);
        }
    }

    // Complete a step
    static async completeStep(drugId, stepNumber, userId, comments = null) {
        try {
            const workflow = await WorkflowState.findOne({
                where: { drug_id: drugId }
            });

            if (!workflow) {
                throw new Error('Workflow not found');
            }

            // Check if user has permission to complete this step
            if (!this.hasStepPermission(userId, stepNumber, 'edit')) {
                throw new Error('User does not have permission to complete this step');
            }

            // Update or create step completion
            const [stepCompletion, created] = await StepCompletion.findOrCreate({
                where: {
                    workflow_id: workflow.id,
                    step_number: stepNumber
                },
                defaults: {
                    workflow_id: workflow.id,
                    step_number: stepNumber,
                    completed_at: new Date(),
                    completed_by: userId,
                    comments: comments
                }
            });

            if (!created) {
                await stepCompletion.update({
                    completed_at: new Date(),
                    completed_by: userId,
                    comments: comments
                });
            }

            // Update workflow status based on step completion
            await this.updateWorkflowStatus(workflow, stepNumber);

            // Send notifications if needed
            await this.sendNotifications(workflow, stepNumber);

            return this.getWorkflowByDrugId(drugId);
        } catch (error) {
            throw new Error(`Failed to complete step: ${error.message}`);
        }
    }

    // Approve a step
    static async approveStep(drugId, stepNumber, userId, comments = null) {
        try {
            const workflow = await WorkflowState.findOne({
                where: { drug_id: drugId }
            });

            if (!workflow) {
                throw new Error('Workflow not found');
            }

            const stepCompletion = await StepCompletion.findOne({
                where: {
                    workflow_id: workflow.id,
                    step_number: stepNumber
                }
            });

            if (!stepCompletion) {
                throw new Error('Step completion not found');
            }

            await stepCompletion.update({
                approved: true,
                approved_at: new Date(),
                approved_by: userId,
                comments: comments
            });

            // Update workflow status
            await this.updateWorkflowStatusAfterApproval(workflow, stepNumber);

            return this.getWorkflowByDrugId(drugId);
        } catch (error) {
            throw new Error(`Failed to approve step: ${error.message}`);
        }
    }

    // Reject a step
    static async rejectStep(drugId, stepNumber, userId, comments) {
        try {
            const workflow = await WorkflowState.findOne({
                where: { drug_id: drugId }
            });

            if (!workflow) {
                throw new Error('Workflow not found');
            }

            const stepCompletion = await StepCompletion.findOne({
                where: {
                    workflow_id: workflow.id,
                    step_number: stepNumber
                }
            });

            if (!stepCompletion) {
                throw new Error('Step completion not found');
            }

            await stepCompletion.update({
                approved: false,
                rejected_at: new Date(),
                rejected_by: userId,
                comments: comments
            });

            // Update workflow status to rejected
            await workflow.update({
                status: 'rejected',
                updated_at: new Date()
            });

            return this.getWorkflowByDrugId(drugId);
        } catch (error) {
            throw new Error(`Failed to reject step: ${error.message}`);
        }
    }

    // Helper methods
    static async updateStepCompletion(workflowId, stepNumber, stepData, userId) {
        const [stepCompletion, created] = await StepCompletion.findOrCreate({
            where: {
                workflow_id: workflowId,
                step_number: stepNumber
            },
            defaults: {
                workflow_id: workflowId,
                step_number: stepNumber,
                ...stepData
            }
        });

        if (!created) {
            await stepCompletion.update(stepData);
        }

        return stepCompletion;
    }

    static async updateQualityReview(workflowId, qualityData, userId) {
        const [qualityReview, created] = await QualityReview.findOrCreate({
            where: { workflow_id: workflowId },
            defaults: {
                workflow_id: workflowId,
                ...qualityData
            }
        });

        if (!created) {
            await qualityReview.update(qualityData);
        }

        return qualityReview;
    }

    static async updatePricingReview(workflowId, pricingData, userId) {
        const [pricingReview, created] = await PricingReview.findOrCreate({
            where: { workflow_id: workflowId },
            defaults: {
                workflow_id: workflowId,
                ...pricingData
            }
        });

        if (!created) {
            await pricingReview.update(pricingData);
        }

        return pricingReview;
    }

    static async updateNotification(workflowId, stepNumber, notificationData, userId) {
        const [notification, created] = await WorkflowNotification.findOrCreate({
            where: {
                workflow_id: workflowId,
                step_number: stepNumber
            },
            defaults: {
                workflow_id: workflowId,
                step_number: stepNumber,
                ...notificationData
            }
        });

        if (!created) {
            await notification.update(notificationData);
        }

        return notification;
    }

    static async updateWorkflowStatus(workflow, stepNumber) {
        let newStatus = workflow.status;

        switch (stepNumber) {
            case 5:
                newStatus = 'pending_import_export_review';
                break;
            case 6:
                newStatus = 'pending_pricing_review';
                break;
            case 8:
                newStatus = 'approved';
                break;
        }

        if (newStatus !== workflow.status) {
            await workflow.update({
                status: newStatus,
                current_step: stepNumber + 1,
                updated_at: new Date()
            });
        }
    }

    static async updateWorkflowStatusAfterApproval(workflow, stepNumber) {
        let newStatus = workflow.status;

        switch (stepNumber) {
            case 5:
                newStatus = 'import_export_review';
                break;
            case 6:
                newStatus = 'pricing_review';
                break;
        }

        if (newStatus !== workflow.status) {
            await workflow.update({
                status: newStatus,
                updated_at: new Date()
            });
        }
    }

    static async sendNotifications(workflow, stepNumber) {
        // Create notification record
        await WorkflowNotification.create({
            workflow_id: workflow.id,
            step_number: stepNumber,
            notified_at: new Date()
        });

        // TODO: Implement email notifications
        // This would integrate with an email service
    }    static async hasStepPermission(userId, stepNumber, action) {
        try {
            const workflowRole = await UserRoleService.getUserWorkflowRole(userId);
            
            // Permission matrix based on role and step
            const permissions = {
                'agent': {
                    edit: stepNumber <= 5,
                    view: true
                },
                'import_export': {
                    edit: stepNumber >= 6 && stepNumber <= 8,
                    view: true,
                    approve: stepNumber === 5
                },
                'quality_committee': {
                    edit: false,
                    view: true,
                    approve: true, // Can approve quality reviews
                    reject: true
                },
                'pricing_committee': {
                    edit: false,
                    view: true,
                    approve: true, // Can approve pricing reviews
                    reject: true
                },
                'admin': {
                    edit: true,
                    view: true,
                    approve: true,
                    reject: true
                }
            };

            const rolePermissions = permissions[workflowRole];
            if (!rolePermissions) {
                return false;
            }

            return rolePermissions[action] || false;
        } catch (error) {
            console.error('Error checking step permission:', error);
            return false;
        }
    }

    static formatWorkflowResponse(workflow) {
        const stepCompletions = {};
        const notifications = {};

        // Format step completions
        workflow.stepCompletions.forEach(step => {
            stepCompletions[step.step_number] = {
                completedAt: step.completed_at,
                completedBy: step.completed_by,
                approved: step.approved,
                approvedAt: step.approved_at,
                approvedBy: step.approved_by,
                rejectedAt: step.rejected_at,
                rejectedBy: step.rejected_by,
                comments: step.comments
            };
        });

        // Format notifications
        workflow.notifications.forEach(notification => {
            notifications[notification.step_number] = {
                notifiedAt: notification.notified_at,
                acknowledgedAt: notification.acknowledged_at,
                acknowledgedBy: notification.acknowledged_by
            };
        });

        return {
            drugId: workflow.drug_id,
            currentStep: workflow.current_step,
            status: workflow.status,
            createdBy: workflow.created_by,
            assignedTo: workflow.assigned_to,
            stepCompletions,
            qualityReview: workflow.qualityReview ? {
                status: workflow.qualityReview.status,
                report: workflow.qualityReview.report,
                reviewedBy: workflow.qualityReview.reviewed_by,
                reviewedAt: workflow.qualityReview.reviewed_at,
                comments: workflow.qualityReview.comments
            } : null,
            pricingReview: workflow.pricingReview ? {
                status: workflow.pricingReview.status,
                reviewedBy: workflow.pricingReview.reviewed_by,
                reviewedAt: workflow.pricingReview.reviewed_at,
                comments: workflow.pricingReview.comments
            } : null,
            notifications,
            drug: workflow.drug
        };
    }

    // Get all workflows with filtering based on user role
    static async getAllWorkflows(userId, userRole, filters = {}) {
        try {
            const whereClause = {};

            // Apply role-based filtering
            switch (userRole) {
                case 'agent':
                    whereClause.created_by = userId;
                    break;
                case 'import_export':
                    whereClause.status = ['pending_import_export_review', 'import_export_review'];
                    break;
                case 'quality_committee':
                    whereClause.status = ['pending_quality_review', 'quality_review'];
                    break;
                case 'pricing_committee':
                    whereClause.status = ['pending_pricing_review', 'pricing_review'];
                    break;
                case 'admin':
                    // Admins can see all workflows
                    break;
            }

            // Apply additional filters
            if (filters.status) {
                whereClause.status = filters.status;
            }

            const workflows = await WorkflowState.findAll({
                where: whereClause,
                include: [
                    {
                        model: DrugsUnderProcess,
                        as: 'drug'
                    },
                    {
                        model: StepCompletion,
                        as: 'stepCompletions'
                    },
                    {
                        model: QualityReview,
                        as: 'qualityReview'
                    },
                    {
                        model: PricingReview,
                        as: 'pricingReview'
                    }
                ],
                order: [['updated_at', 'DESC']]
            });

            return workflows.map(workflow => this.formatWorkflowResponse(workflow));
        } catch (error) {
            throw new Error(`Failed to get workflows: ${error.message}`);
        }
    }
}

module.exports = WorkflowService;
