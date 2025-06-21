const WorkflowState = require('../models/workflowState');
const WorkflowNotification = require('../models/workflowNotification');
const DrugsUnderProcess = require('../models/drugsUnderProcess');
const UserRoleService = require('./userRoleService');

class WorkflowNotificationService {
      // Get pending notifications for a user based on their role
    static async getNotifications(userId, userRole = null) {
        try {
            // Get user's workflow role if not provided
            if (!userRole) {
                userRole = await UserRoleService.getUserWorkflowRole(userId);
            }

            const notifications = [];
            
            switch (userRole) {
                case 'import_export':
                    // Get workflows pending import/export review
                    const importExportWorkflows = await WorkflowState.findAll({
                        where: {
                            status: 'pending_import_export_review'
                        },
                        include: [
                            {
                                model: DrugsUnderProcess,
                                as: 'drug'
                            },
                            {
                                model: WorkflowNotification,
                                as: 'notifications',
                                where: {
                                    step_number: 5,
                                    acknowledged_at: null
                                },
                                required: false
                            }
                        ]
                    });

                    importExportWorkflows.forEach(workflow => {
                        notifications.push({
                            type: 'step_completion',
                            drugId: workflow.drug_id,
                            drugName: workflow.drug?.drugName || 'Unknown Drug',
                            stepNumber: 5,
                            message: 'Agent has completed Step 5 and is waiting for your review',
                            createdAt: workflow.updated_at,
                            workflowId: workflow.id
                        });
                    });
                    break;

                case 'quality_committee':
                    // Get workflows pending quality review
                    const qualityWorkflows = await WorkflowState.findAll({
                        where: {
                            status: 'pending_quality_review'
                        },
                        include: [
                            {
                                model: DrugsUnderProcess,
                                as: 'drug'
                            }
                        ]
                    });

                    qualityWorkflows.forEach(workflow => {
                        notifications.push({
                            type: 'quality_review',
                            drugId: workflow.drug_id,
                            drugName: workflow.drug?.drugName || 'Unknown Drug',
                            stepNumber: 4,
                            message: 'Documents submitted for quality review',
                            createdAt: workflow.updated_at,
                            workflowId: workflow.id
                        });
                    });
                    break;

                case 'pricing_committee':
                    // Get workflows pending pricing review
                    const pricingWorkflows = await WorkflowState.findAll({
                        where: {
                            status: 'pending_pricing_review'
                        },
                        include: [
                            {
                                model: DrugsUnderProcess,
                                as: 'drug'
                            },
                            {
                                model: WorkflowNotification,
                                as: 'notifications',
                                where: {
                                    step_number: 6,
                                    acknowledged_at: null
                                },
                                required: false
                            }
                        ]
                    });

                    pricingWorkflows.forEach(workflow => {
                        notifications.push({
                            type: 'pricing_review',
                            drugId: workflow.drug_id,
                            drugName: workflow.drug?.drugName || 'Unknown Drug',
                            stepNumber: 6,
                            message: 'Pricing information submitted for review',
                            createdAt: workflow.updated_at,
                            workflowId: workflow.id
                        });
                    });
                    break;

                case 'agent':
                    // Get workflows assigned to this agent with status updates
                    const agentWorkflows = await WorkflowState.findAll({
                        where: {
                            created_by: userId,
                            status: ['import_export_review', 'quality_review', 'pricing_review', 'approved', 'rejected']
                        },
                        include: [
                            {
                                model: DrugsUnderProcess,
                                as: 'drug'
                            }
                        ]
                    });

                    agentWorkflows.forEach(workflow => {
                        let message = '';
                        switch (workflow.status) {
                            case 'import_export_review':
                                message = 'Your drug registration is under import/export review';
                                break;
                            case 'quality_review':
                                message = 'Your drug registration is under quality review';
                                break;
                            case 'pricing_review':
                                message = 'Your drug registration is under pricing review';
                                break;
                            case 'approved':
                                message = 'Your drug registration has been approved';
                                break;
                            case 'rejected':
                                message = 'Your drug registration has been rejected';
                                break;
                        }

                        notifications.push({
                            type: 'status_update',
                            drugId: workflow.drug_id,
                            drugName: workflow.drug?.drugName || 'Unknown Drug',
                            stepNumber: workflow.current_step,
                            message: message,
                            createdAt: workflow.updated_at,
                            workflowId: workflow.id,
                            status: workflow.status
                        });
                    });
                    break;

                case 'admin':
                    // Admins get all notifications
                    const allWorkflows = await WorkflowState.findAll({
                        where: {
                            status: ['pending_import_export_review', 'pending_quality_review', 'pending_pricing_review']
                        },
                        include: [
                            {
                                model: DrugsUnderProcess,
                                as: 'drug'
                            }
                        ]
                    });

                    allWorkflows.forEach(workflow => {
                        let message = '';
                        switch (workflow.status) {
                            case 'pending_import_export_review':
                                message = 'Workflow pending import/export review';
                                break;
                            case 'pending_quality_review':
                                message = 'Workflow pending quality review';
                                break;
                            case 'pending_pricing_review':
                                message = 'Workflow pending pricing review';
                                break;
                        }

                        notifications.push({
                            type: 'admin_notification',
                            drugId: workflow.drug_id,
                            drugName: workflow.drug?.drugName || 'Unknown Drug',
                            stepNumber: workflow.current_step,
                            message: message,
                            createdAt: workflow.updated_at,
                            workflowId: workflow.id,
                            status: workflow.status
                        });
                    });
                    break;
            }

            // Sort notifications by creation date (newest first)
            return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
            throw new Error(`Failed to get notifications: ${error.message}`);
        }
    }

    // Acknowledge a notification
    static async acknowledgeNotification(drugId, stepNumber, userId) {
        try {
            const workflow = await WorkflowState.findOne({
                where: { drug_id: drugId }
            });

            if (!workflow) {
                throw new Error('Workflow not found');
            }

            // Find or create the notification
            const [notification, created] = await WorkflowNotification.findOrCreate({
                where: {
                    workflow_id: workflow.id,
                    step_number: stepNumber
                },
                defaults: {
                    workflow_id: workflow.id,
                    step_number: stepNumber,
                    notified_at: new Date(),
                    acknowledged_at: new Date(),
                    acknowledged_by: userId
                }
            });

            if (!created && !notification.acknowledged_at) {
                await notification.update({
                    acknowledged_at: new Date(),
                    acknowledged_by: userId
                });
            }

            return notification;
        } catch (error) {
            throw new Error(`Failed to acknowledge notification: ${error.message}`);
        }
    }

    // Create a notification
    static async createNotification(workflowId, stepNumber) {
        try {
            const notification = await WorkflowNotification.create({
                workflow_id: workflowId,
                step_number: stepNumber,
                notified_at: new Date()
            });

            return notification;
        } catch (error) {
            throw new Error(`Failed to create notification: ${error.message}`);
        }
    }

    // Get notification statistics for dashboard
    static async getNotificationStats(userId, userRole) {
        try {
            const stats = {
                total: 0,
                pending_import_export: 0,
                pending_quality: 0,
                pending_pricing: 0,
                approved: 0,
                rejected: 0
            };

            let whereClause = {};

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
                    // No filter for admin
                    break;
            }

            const workflows = await WorkflowState.findAll({
                where: whereClause,
                attributes: ['status']
            });

            workflows.forEach(workflow => {
                stats.total++;
                switch (workflow.status) {
                    case 'pending_import_export_review':
                        stats.pending_import_export++;
                        break;
                    case 'pending_quality_review':
                        stats.pending_quality++;
                        break;
                    case 'pending_pricing_review':
                        stats.pending_pricing++;
                        break;
                    case 'approved':
                        stats.approved++;
                        break;
                    case 'rejected':
                        stats.rejected++;
                        break;
                }
            });

            return stats;
        } catch (error) {
            throw new Error(`Failed to get notification stats: ${error.message}`);
        }
    }
}

module.exports = WorkflowNotificationService;
