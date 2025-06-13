// Importation Announcement Controller
const ImportationAnnouncementService = require('../services/importationAnnouncementService');

class ImportationAnnouncementController {
    // POST /importation-announcements - Create announcement (import_export)
    async createAnnouncement(req, res) {
        try {
            const userId = req.user.id;
            const announcement = await ImportationAnnouncementService.createAnnouncement(req.body, userId);
            
            res.status(201).json({
                message: 'Announcement created successfully',
                data: announcement
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // GET /importation-announcements - List visible announcements
    async getAllAnnouncements(req, res) {
        try {
            const userRole = req.user.role;
            const filters = {
                type: req.query.type,
                priority: req.query.priority,
                isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : true
            };

            const announcements = await ImportationAnnouncementService.getAllAnnouncements(filters, userRole);
            
            res.status(200).json({
                message: 'Announcements retrieved successfully',
                data: announcements
            });
        } catch (error) {
            res.status(500).json({ 
                error: error.message 
            });
        }
    }

    // GET /importation-announcements/:id - Get announcement by ID
    async getAnnouncementById(req, res) {
        try {
            const { id } = req.params;
            const userRole = req.user.role;
            const announcement = await ImportationAnnouncementService.getAnnouncementById(id, userRole);
            
            res.status(200).json({
                message: 'Announcement retrieved successfully',
                data: announcement
            });
        } catch (error) {
            res.status(404).json({ 
                error: error.message 
            });
        }
    }

    // PATCH /importation-announcements/:id - Update announcement
    async updateAnnouncement(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const updatedAnnouncement = await ImportationAnnouncementService.updateAnnouncement(id, req.body, userId);
            
            res.status(200).json({
                message: 'Announcement updated successfully',
                data: updatedAnnouncement
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // DELETE /importation-announcements/:id - Remove announcement
    async deleteAnnouncement(req, res) {
        try {
            const { id } = req.params;
            const result = await ImportationAnnouncementService.deleteAnnouncement(id);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }    // POST /importation-announcements/:id/view - Mark announcement as viewed
    async markAsViewed(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await ImportationAnnouncementService.markAsViewed(id, userId);
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }

    // GET /importation-announcements/unread-count - Get unread announcement count
    async getUnreadCount(req, res) {
        try {
            const userId = req.user.id;
            const userRole = req.user.role;

            const unreadCount = await ImportationAnnouncementService.getUnreadCount(userId, userRole);
            
            res.status(200).json({
                message: 'Unread count retrieved successfully',
                unreadCount
            });
        } catch (error) {
            res.status(400).json({ 
                error: error.message 
            });
        }
    }
}

module.exports = new ImportationAnnouncementController();
