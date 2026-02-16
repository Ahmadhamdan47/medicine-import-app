/**
 * Cleaning Session Service
 * 
 * Manages sessions for route, dosage, and form cleaning operations.
 * Uses in-memory storage for lightweight session tracking.
 * Each session tracks mappings, affected records, and backup data.
 * 
 * @module cleaningSessionService
 */

const logger = require('../../config/logger');
const fs = require('fs').promises;
const path = require('path');

// In-memory session storage
// Structure: { sessionId: { type, status, mappings, backupFile, affectedCount, userId, timestamps } }
const sessions = new Map();

// Session timeout: 24 hours
const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000;

/**
 * Generate a unique session ID
 * @private
 * @returns {string} Unique session identifier
 */
function generateSessionId(type) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${type}_cleaning_${timestamp}_${random}`;
}

/**
 * Create a new cleaning session
 * 
 * @param {string} type - Session type: 'route', 'dosage', or 'form'
 * @param {number} userId - ID of user creating session
 * @param {Object} metadata - Additional session metadata
 * @returns {Object} Session object with sessionId and details
 */
function createSession(type, userId, metadata = {}) {
  if (!['route', 'dosage', 'form'].includes(type)) {
    throw new Error('Session type must be "route", "dosage", or "form"');
  }

  const sessionId = generateSessionId(type);
  const now = new Date();

  const session = {
    sessionId,
    type,
    status: 'initialized', // initialized, mapped, previewed, applied, committed, rolled_back
    mappings: [],
    backupFile: null,
    affectedCount: 0,
    userId,
    createdAt: now,
    updatedAt: now,
    expiresAt: new Date(Date.now() + SESSION_TIMEOUT_MS),
    metadata: metadata || {}
  };

  sessions.set(sessionId, session);
  
  logger.info(`Created ${type} cleaning session: ${sessionId} for user ${userId}`);
  
  return session;
}

/**
 * Get session by ID
 * 
 * @param {string} sessionId - Session identifier
 * @returns {Object|null} Session object or null if not found/expired
 */
function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    return null;
  }

  const session = sessions.get(sessionId);

  // Check if session expired
  if (new Date() > session.expiresAt) {
    logger.warn(`Session ${sessionId} has expired`);
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

/**
 * Update session data
 * 
 * @param {string} sessionId - Session identifier
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated session object
 */
function updateSession(sessionId, updates) {
  const session = getSession(sessionId);
  
  if (!session) {
    throw new Error(`Session ${sessionId} not found or expired`);
  }

  // Update allowed fields
  const allowedUpdates = ['status', 'mappings', 'backupFile', 'affectedCount', 'metadata'];
  
  for (const [key, value] of Object.entries(updates)) {
    if (allowedUpdates.includes(key)) {
      if (key === 'metadata') {
        // Merge metadata instead of replacing
        session.metadata = { ...session.metadata, ...value };
      } else {
        session[key] = value;
      }
    }
  }

  session.updatedAt = new Date();
  sessions.set(sessionId, session);
  
  logger.info(`Updated session ${sessionId}: ${JSON.stringify(updates)}`);
  
  return session;
}

/**
 * Clear/delete a session
 * 
 * @param {string} sessionId - Session identifier
 * @returns {boolean} True if session was deleted
 */
function clearSession(sessionId) {
  if (!sessions.has(sessionId)) {
    return false;
  }

  const session = sessions.get(sessionId);
  sessions.delete(sessionId);
  
  logger.info(`Cleared ${session.type} cleaning session: ${sessionId}`);
  
  return true;
}

/**
 * Get all active sessions for a user
 * 
 * @param {number} userId - User ID
 * @param {string} type - Optional: filter by type ('route' or 'dosage')
 * @returns {Array<Object>} Array of session objects
 */
function getUserSessions(userId, type = null) {
  const userSessions = [];
  const now = new Date();

  for (const [sessionId, session] of sessions.entries()) {
    // Skip expired sessions
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
      continue;
    }

    if (session.userId === userId) {
      if (!type || session.type === type) {
        userSessions.push(session);
      }
    }
  }

  return userSessions;
}

/**
 * Create backup file for session
 * Stores original data before applying changes
 * 
 * @param {string} sessionId - Session identifier
 * @param {Array<Object>} data - Data to backup
 * @returns {string} Backup file path
 */
async function createBackupFile(sessionId, data) {
  const session = getSession(sessionId);
  
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const backupDir = path.join(__dirname, '../../db');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${session.type}_cleaning_backup_${sessionId}_${timestamp}.json`;
  const filepath = path.join(backupDir, filename);

  const backupData = {
    sessionId,
    type: session.type,
    timestamp: new Date().toISOString(),
    userId: session.userId,
    mappings: session.mappings,
    data
  };

  await fs.writeFile(filepath, JSON.stringify(backupData, null, 2));
  
  // Update session with backup file path
  updateSession(sessionId, { backupFile: filepath });
  
  logger.info(`Created backup file for session ${sessionId}: ${filepath}`);
  
  return filepath;
}

/**
 * Read backup file for rollback
 * 
 * @param {string} sessionId - Session identifier
 * @returns {Object} Backup data
 */
async function readBackupFile(sessionId) {
  const session = getSession(sessionId);
  
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  if (!session.backupFile) {
    throw new Error(`No backup file found for session ${sessionId}`);
  }

  try {
    const content = await fs.readFile(session.backupFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    logger.error(`Error reading backup file ${session.backupFile}:`, error);
    throw new Error(`Failed to read backup file: ${error.message}`);
  }
}

/**
 * Clean up expired sessions
 * Should be called periodically to free memory
 */
function cleanupExpiredSessions() {
  const now = new Date();
  let cleanedCount = 0;

  for (const [sessionId, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(sessionId);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    logger.info(`Cleaned up ${cleanedCount} expired sessions`);
  }

  return cleanedCount;
}

/**
 * Get session statistics
 * 
 * @returns {Object} Stats about active sessions
 */
function getSessionStats() {
  cleanupExpiredSessions();
  
  const stats = {
    total: sessions.size,
    byType: { route: 0, dosage: 0 },
    byStatus: {}
  };

  for (const session of sessions.values()) {
    stats.byType[session.type]++;
    stats.byStatus[session.status] = (stats.byStatus[session.status] || 0) + 1;
  }

  return stats;
}

// Auto-cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

module.exports = {
  createSession,
  getSession,
  updateSession,
  clearSession,
  getUserSessions,
  createBackupFile,
  readBackupFile,
  cleanupExpiredSessions,
  getSessionStats
};
