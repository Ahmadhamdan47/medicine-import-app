const WorkflowNotificationService = require('../services/workflowNotificationService');

class WorkflowNotificationController {
    
    // GET /api/notifications
    static async getNotifications(req, res) {
        try {
            const userId = req.user?.id || req.query.userId;
            const userRole = req.user?.role || req.query.userRole || 'agent';

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const notifications = await WorkflowNotificationService.getNotifications(userId, userRole);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // POST /api/notifications/acknowledge
    static async acknowledgeNotification(req, res) {
        try {
            const { drugId, stepNumber } = req.body;
            const userId = req.user?.id || req.body.userId;

            if (!drugId || !stepNumber || !userId) {
                return res.status(400).json({ 
                    error: 'Drug ID, step number, and user ID are required' 
                });
            }

            const notification = await WorkflowNotificationService.acknowledgeNotification(
                drugId, 
                stepNumber, 
                userId
            );

            res.status(200).json({ 
                message: 'Notification acknowledged successfully',
                notification
            });
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    // GET /api/notifications/stats
    static async getNotificationStats(req, res) {
        try {
            const userId = req.user?.id || req.query.userId;
            const userRole = req.user?.role || req.query.userRole || 'agent';

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const stats = await WorkflowNotificationService.getNotificationStats(userId, userRole);
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = WorkflowNotificationController;
