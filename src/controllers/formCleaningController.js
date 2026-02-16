/**
 * Form Cleaning Controller
 * 
 * Handles HTTP requests for form cleaning operations.
 * Validates input and delegates to formCleaningService.
 * 
 * @module formCleaningController
 */

const formCleaningService = require('../services/formCleaningService');
const sessionService = require('../services/cleaningSessionService');

/**
 * Get unique FormRaw values with counts
 * GET /form-cleaning/unique-values
 */
const getUniqueFormRaw = async (req, res) => {
  try {
    const { includeNull, minCount } = req.query;
    
    const options = {
      includeNull: includeNull === 'true',
      minCount: minCount ? parseInt(minCount) : 1
    };

    const uniqueValues = await formCleaningService.getUniqueFormRaw(options);
    
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
 * Suggest form matches for a FormRaw value
 * POST /form-cleaning/suggest-matches
 */
const suggestFormMatch = async (req, res) => {
  try {
    const { formRaw, limit } = req.body;

    if (!formRaw) {
      return res.status(400).json({
        success: false,
        error: 'formRaw is required'
      });
    }

    const suggestions = await formCleaningService.suggestFormMatch(
      formRaw,
      limit || 3
    );

    res.json({
      success: true,
      formRaw,
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
 * Get drugs affected by a FormRaw value
 * GET /form-cleaning/affected-drugs?formRaw=value
 */
const getAffectedDrugs = async (req, res) => {
  try {
    const { formRaw, limit } = req.query;

    if (!formRaw) {
      return res.status(400).json({
        success: false,
        error: 'formRaw query parameter is required'
      });
    }

    const drugs = await formCleaningService.getAffectedDrugs(
      formRaw,
      limit ? parseInt(limit) : 100
    );

    res.json({
      success: true,
      formRaw,
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
 * Preview form mappings
 * POST /form-cleaning/preview
 */
const previewFormMapping = async (req, res) => {
  try {
    const { mappings } = req.body;

    if (!Array.isArray(mappings) || mappings.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'mappings array is required'
      });
    }

    const preview = await formCleaningService.previewFormMapping(mappings);

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
 * Create a new form cleaning session
 * POST /form-cleaning/session
 */
const createSession = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1; // Get from auth middleware
    const { metadata } = req.body;

    const session = sessionService.createSession('form', userId, metadata);

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
 * Apply form mappings
 * POST /form-cleaning/apply
 */
const applyFormMappings = async (req, res) => {
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

    const results = await formCleaningService.applyFormMappings(
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
 * Rollback form changes
 * POST /form-cleaning/rollback
 */
const rollbackFormChanges = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const result = await formCleaningService.rollbackFormChanges(sessionId);

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
 * Get form statistics
 * GET /form-cleaning/stats
 */
const getFormStats = async (req, res) => {
  try {
    const stats = await formCleaningService.getFormStats();

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
 * GET /form-cleaning/session/:sessionId
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
 * DELETE /form-cleaning/session/:sessionId
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
  getUniqueFormRaw,
  suggestFormMatch,
  getAffectedDrugs,
  previewFormMapping,
  createSession,
  applyFormMappings,
  rollbackFormChanges,
  getFormStats,
  getSession,
  clearSession
};
