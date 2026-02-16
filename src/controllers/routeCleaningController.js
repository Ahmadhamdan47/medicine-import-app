/**
 * Route Cleaning Controller
 * 
 * Handles HTTP requests for route cleaning operations.
 * Validates input and delegates to routeCleaningService.
 * 
 * @module routeCleaningController
 */

const routeCleaningService = require('../services/routeCleaningService');
const sessionService = require('../services/cleaningSessionService');

/**
 * Get unique RouteRaw values with counts
 * GET /route-cleaning/unique-values
 */
const getUniqueRouteRaw = async (req, res) => {
  try {
    const { includeNull, minCount } = req.query;
    
    const options = {
      includeNull: includeNull === 'true',
      minCount: minCount ? parseInt(minCount) : 1
    };

    const uniqueValues = await routeCleaningService.getUniqueRouteRaw(options);
    
    res.json({
      success: true,
      count: uniqueValues.length,
      data: uniqueValues
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Suggest route matches for a RouteRaw value
 * POST /route-cleaning/suggest-matches
 */
const suggestRouteMatch = async (req, res) => {
  try {
    const { routeRaw, limit } = req.body;

    if (!routeRaw) {
      return res.status(400).json({
        success: false,
        error: 'routeRaw is required'
      });
    }

    const suggestions = await routeCleaningService.suggestRouteMatch(
      routeRaw,
      limit || 3
    );

    res.json({
      success: true,
      routeRaw,
      suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get drugs affected by a RouteRaw value
 * GET /route-cleaning/affected-drugs?routeRaw=value
 */
const getAffectedDrugs = async (req, res) => {
  try {
    const { routeRaw, limit } = req.query;

    if (!routeRaw) {
      return res.status(400).json({
        success: false,
        error: 'routeRaw query parameter is required'
      });
    }

    const drugs = await routeCleaningService.getAffectedDrugs(
      routeRaw,
      limit ? parseInt(limit) : 100
    );

    res.json({
      success: true,
      routeRaw,
      count: drugs.length,
      data: drugs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Preview route mappings
 * POST /route-cleaning/preview
 */
const previewRouteMapping = async (req, res) => {
  try {
    const { mappings } = req.body;

    if (!Array.isArray(mappings) || mappings.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'mappings array is required'
      });
    }

    const preview = await routeCleaningService.previewRouteMapping(mappings);

    res.json({
      success: true,
      preview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Create a new route cleaning session
 * POST /route-cleaning/session
 */
const createSession = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1; // Get from auth middleware
    const { metadata } = req.body;

    const session = sessionService.createSession('route', userId, metadata);

    res.json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Apply route mappings
 * POST /route-cleaning/apply
 */
const applyRouteMappings = async (req, res) => {
  try {
    const { mappings, sessionId } = req.body;
    const userId = req.user ? req.user.id : 1;

    if (!Array.isArray(mappings) || mappings.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'mappings array is required'
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const results = await routeCleaningService.applyRouteMappings(
      mappings,
      sessionId,
      userId
    );

    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Rollback route changes
 * POST /route-cleaning/rollback
 */
const rollbackRouteChanges = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const result = await routeCleaningService.rollbackRouteChanges(sessionId);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get route statistics
 * GET /route-cleaning/stats
 */
const getRouteStats = async (req, res) => {
  try {
    const stats = await routeCleaningService.getRouteStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get session info
 * GET /route-cleaning/session/:sessionId
 */
const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = sessionService.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found or expired'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Clear/delete a session
 * DELETE /route-cleaning/session/:sessionId
 */
const clearSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const cleared = sessionService.clearSession(sessionId);

    if (!cleared) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getUniqueRouteRaw,
  suggestRouteMatch,
  getAffectedDrugs,
  previewRouteMapping,
  createSession,
  applyRouteMappings,
  rollbackRouteChanges,
  getRouteStats,
  getSession,
  clearSession
};
