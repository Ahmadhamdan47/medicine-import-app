const ImportationAnnouncement = require('../models/importationAnnouncement');
const { Op } = require('sequelize');

class ImportationAnnouncementService {
    
    // Create announcement
    async createAnnouncement(announcementData, userId) {
        try {
            const announcement = await ImportationAnnouncement.create({
                ...announcementData,
                createdBy: userId,
                updatedBy: userId
            });

            return announcement;
        } catch (error) {
            throw new Error(`Error creating announcement: ${error.message}`);
        }
    }

    // Get all visible announcements
    async getVisibleAnnouncements(userRole = null) {
        try {
            const whereClause = {
                isActive: true,
                [Op.or]: [
                    { endDate: null },
                    { endDate: { [Op.gte]: new Date() } }
                ],
                [Op.or]: [
                    { startDate: null },
                    { startDate: { [Op.lte]: new Date() } }
                ]
            };

            // If user has a specific role, include role-specific and general announcements
            if (userRole) {
                whereClause[Op.or].push(
                    { targetRole: null },
                    { targetRole: userRole }
                );
            } else {
                // If no role provided, only show general announcements
                whereClause.targetRole = null;
            }

            const announcements = await ImportationAnnouncement.findAll({
                where: whereClause,
                order: [
                    ['priority', 'DESC'],
                    ['createdDate', 'DESC']
                ]
            });

            // Increment view count
            if (announcements.length > 0) {
                await ImportationAnnouncement.increment('viewCount', {
                    where: {
                        id: { [Op.in]: announcements.map(a => a.id) }
                    }
                });
            }

            return announcements;
        } catch (error) {
            throw new Error(`Error retrieving announcements: ${error.message}`);
        }
    }

    // Get all announcements (admin view)
    async getAllAnnouncements(filters = {}, userRole = null) {
        try {
            const whereClause = {};
            
            if (filters.type) whereClause.type = filters.type;
            if (filters.priority) whereClause.priority = filters.priority;
            if (filters.isActive !== undefined) whereClause.isActive = filters.isActive;

            // Filter by target role - if targetRole is null, announcement is visible to all
            if (userRole) {
                whereClause[Op.or] = [
                    { targetRole: null },
                    { targetRole: userRole }
                ];
            }

            // Only show active announcements within date range
            const currentDate = new Date();
            whereClause[Op.and] = [
                {
                    [Op.or]: [
                        { startDate: null },
                        { startDate: { [Op.lte]: currentDate } }
                    ]
                },
                {
                    [Op.or]: [
                        { endDate: null },
                        { endDate: { [Op.gte]: currentDate } }
                    ]
                }
            ];

            const announcements = await ImportationAnnouncement.findAll({
                where: whereClause,
                order: [
                    ['priority', 'DESC'], // critical, high, medium, low
                    ['createdDate', 'DESC']
                ]
            });

            return announcements;
        } catch (error) {
            throw new Error(`Error retrieving announcements: ${error.message}`);
        }
    }

    // Get announcement by ID
    async getAnnouncementById(id, userRole = null) {
        try {
            const whereClause = { id };

            // Check if user can access this announcement
            if (userRole) {
                whereClause[Op.or] = [
                    { targetRole: null },
                    { targetRole: userRole }
                ];
            }

            const announcement = await ImportationAnnouncement.findOne({
                where: whereClause
            });

            if (!announcement) {
                throw new Error('Announcement not found or access denied');
            }

            return announcement;
        } catch (error) {
            throw new Error(`Error retrieving announcement: ${error.message}`);
        }
    }

    // Update announcement
    async updateAnnouncement(id, updateData, userId) {
        try {
            const announcement = await ImportationAnnouncement.findByPk(id);
            
            if (!announcement) {
                throw new Error('Announcement not found');
            }

            const updatedAnnouncement = await announcement.update({
                ...updateData,
                updatedBy: userId,
                updatedDate: new Date()
            });

            return updatedAnnouncement;
        } catch (error) {
            throw new Error(`Error updating announcement: ${error.message}`);
        }
    }

    // Delete announcement
    async deleteAnnouncement(id) {
        try {
            const announcement = await ImportationAnnouncement.findByPk(id);
            
            if (!announcement) {
                throw new Error('Announcement not found');
            }

            await announcement.destroy();
            return { message: 'Announcement deleted successfully' };
        } catch (error) {
            throw new Error(`Error deleting announcement: ${error.message}`);
        }
    }

    // Mark announcement as viewed (increment view count)
    async markAsViewed(id, userId) {
        try {
            const announcement = await ImportationAnnouncement.findByPk(id);
            
            if (!announcement) {
                throw new Error('Announcement not found');
            }

            await announcement.update({
                viewCount: announcement.viewCount + 1
            });

            return { message: 'Announcement marked as viewed' };
        } catch (error) {
            throw new Error(`Error marking announcement as viewed: ${error.message}`);
        }
    }    // Deactivate announcement
    async deactivateAnnouncement(id, userId) {
        try {
            const announcement = await ImportationAnnouncement.findByPk(id);
            
            if (!announcement) {
                throw new Error('Announcement not found');
            }

            const updatedAnnouncement = await announcement.update({
                isActive: false,
                updatedBy: userId,
                updatedDate: new Date()
            });

            return updatedAnnouncement;
        } catch (error) {
            throw new Error(`Error deactivating announcement: ${error.message}`);
        }
    }

    // Get unread announcement count for user
    async getUnreadCount(userId, userRole) {
        try {
            const whereClause = {
                isActive: true,
                [Op.or]: [
                    { targetRole: 'all' },
                    { targetRole: userRole },
                    { targetRole: null }
                ]
            };

            // Add date filtering if needed
            const now = new Date();
            whereClause[Op.and] = [
                {
                    [Op.or]: [
                        { startDate: null },
                        { startDate: { [Op.lte]: now } }
                    ]
                },
                {
                    [Op.or]: [
                        { endDate: null },
                        { endDate: { [Op.gte]: now } }
                    ]
                }
            ];

            // Count announcements that haven't been viewed by this user
            const unreadCount = await ImportationAnnouncement.count({
                where: whereClause,
                include: [{
                    model: sequelize.models.announcement_views || sequelize.define('announcement_views', {}),
                    as: 'views',
                    where: { userId },
                    required: false
                }],
                having: sequelize.literal('COUNT(views.id) = 0')
            });

            return unreadCount;
        } catch (error) {
            // Fallback: simple count without complex joins
            try {
                const whereClause = {
                    isActive: true,
                    [Op.or]: [
                        { targetRole: 'all' },
                        { targetRole: userRole },
                        { targetRole: null }
                    ]
                };

                const totalCount = await ImportationAnnouncement.count({ where: whereClause });
                return totalCount; // Return total count as fallback
            } catch (fallbackError) {
                throw new Error(`Error getting unread count: ${error.message}`);
            }
        }
    }
}

module.exports = new ImportationAnnouncementService();
