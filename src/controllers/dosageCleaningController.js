/**
 * Dosage Cleaning Controller
 * 
 * Handles HTTP requests for dosage cleaning operations.
 * Validates input and delegates to dosageCleaningService.
 * 
 * @module dosageCleaningController
 */

const dosageCleaningService = require('../services/dosageCleaningService');
const sessionService = require('../services/cleaningSessionService');

/**
 * Get unique dosage forms with counts
 * GET /dosage-cleaning/forms
 */
const getUniqueDosageForms = async (req, res) => {
  try {
    const { includeNull } = req.query;
    
    const options = {
      includeNull: includeNull === 'true'
    };

    const forms = await dosageCleaningService.getUniqueDosageForms(options);
    
    res.json({
      success: true,
      count: forms.length,
      data: forms
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * Get dosage records for cleaning
 * GET /dosage-cleaning/records?formFilter=Tablet&limit=100&offset=0
 */
const getDosageRecordsForCleaning = async (req, res) => {
  try {
    const { formFilter, limit, offset } = req.query;

    const options = {
      formFilter: formFilter || null,
      limit: limit ? parseInt(limit) : 100,
      offset: offset ? parseInt(offset) : 0
    };

    const result = await dosageCleaningService.getDosageRecordsForCleaning(options);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Update a single dosage record
 * PUT /dosage-cleaning/record/:dosageId
 */
const updateDosageRecord = async (req, res) => {
  try {
    const { dosageId } = req.params;
    const userId = req.user ? req.user.id : 1;
    const updates = req.body;

    if (!dosageId) {
      return res.status(400).json({
        success: false,
        error: 'dosageId is required'
      });
    }

    const updatedRecord = await dosageCleaningService.updateDosageRecord(
      parseInt(dosageId),
      updates,
      userId
    );

    res.json({
      success: true,
      data: updatedRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Reconstruct drug.Dosage from dosage table
 * POST /dosage-cleaning/reconstruct/:drugId
 */
const reconstructDrugDosage = async (req, res) => {
  try {
    const { drugId } = req.params;

    if (!drugId) {
      return res.status(400).json({
        success: false,
        error: 'drugId is required'
      });
    }

    const result = await dosageCleaningService.reconstructDrugDosage(
      parseInt(drugId)
    );

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
 * Bulk reconstruct dosages
 * POST /dosage-cleaning/bulk-reconstruct
 */
const bulkReconstructDosages = async (req, res) => {
  try {
    const { drugIds, sessionId } = req.body;

    if (!Array.isArray(drugIds) || drugIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'drugIds array is required'
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const results = await dosageCleaningService.bulkReconstructDosages(
      drugIds,
      sessionId
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
 * Preview dosage changes
 * POST /dosage-cleaning/preview
 */
const previewDosageChanges = async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'updates array is required'
      });
    }

    const previews = await dosageCleaningService.previewDosageChanges(updates);

    res.json({
      success: true,
      previews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Rollback dosage changes
 * POST /dosage-cleaning/rollback
 */
const rollbackDosageChanges = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const result = await dosageCleaningService.rollbackDosageChanges(sessionId);

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
 * Suggest dosage form matches
 * POST /dosage-cleaning/suggest-form
 */
const suggestDosageFormMatch = async (req, res) => {
  try {
    const { form, limit } = req.body;

    if (!form) {
      return res.status(400).json({
        success: false,
        error: 'form is required'
      });
    }

    const suggestions = await dosageCleaningService.suggestDosageFormMatch(
      form,
      limit || 3
    );

    res.json({
      success: true,
      form,
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
 * Get dosage statistics
 * GET /dosage-cleaning/stats
 */
const getDosageStats = async (req, res) => {
  try {
    const stats = await dosageCleaningService.getDosageStats();

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
 * Create a new dosage cleaning session
 * POST /dosage-cleaning/session
 */
const createSession = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1; // Get from auth middleware
    const { metadata } = req.body;

    const session = sessionService.createSession('dosage', userId, metadata);

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
 * Get session info
 * GET /dosage-cleaning/session/:sessionId
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
 * DELETE /dosage-cleaning/session/:sessionId
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
  getUniqueDosageForms,
  getDosageRecordsForCleaning,
  updateDosageRecord,
  reconstructDrugDosage,
  bulkReconstructDosages,
  previewDosageChanges,
  rollbackDosageChanges,
  suggestDosageFormMatch,
  getDosageStats,
  createSession,
  getSession,
  clearSession
};
