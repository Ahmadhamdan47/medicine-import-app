/**
 * Route Cleaning Service
 * 
 * Provides functionality for bulk cleaning and standardization of Route fields
 * in the drug table. Allows users to map RouteRaw values to clean Route values
 * from the routeOptions lookup table.
 * 
 * @module routeCleaningService
 */

const { Op } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('../models/drug');
const RouteOption = require('../models/routeOption');
const sessionService = require('./cleaningSessionService');
const logger = require('../../config/logger');

/**
 * Get unique RouteRaw values with drug counts
 * Returns distinct RouteRaw values and how many drugs have each value
 * 
 * @param {Object} options - Query options
 * @param {boolean} options.includeNull - Include null/empty RouteRaw values (default: false)
 * @param {number} options.minCount - Minimum drug count to include (default: 1)
 * @returns {Array<Object>} Array of {routeRaw, drugCount, sampleRoute}
 */
async function getUniqueRouteRaw(options = {}) {
  const { includeNull = false, minCount = 1 } = options;

  try {
    const whereClause = includeNull ? {} : {
      RouteRaw: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.ne]: '' }
        ]
      }
    };

    // Query to get unique RouteRaw values with counts
    const results = await Drug.findAll({
      attributes: [
        'RouteRaw',
        [sequelize.fn('COUNT', sequelize.col('DrugID')), 'drugCount'],
        [sequelize.fn('MIN', sequelize.col('Route')), 'sampleRoute']
      ],
      where: whereClause,
      group: ['RouteRaw'],
      having: sequelize.literal(`COUNT(DrugID) >= ${minCount}`),
      order: [[sequelize.literal('drugCount'), 'DESC']],
      raw: true
    });

    logger.info(`Found ${results.length} unique RouteRaw values`);
    
    return results.map(r => ({
      routeRaw: r.RouteRaw,
      drugCount: parseInt(r.drugCount),
      sampleRoute: r.sampleRoute
    }));
  } catch (error) {
    logger.error('Error fetching unique RouteRaw values:', error);
    throw new Error(`Failed to get unique RouteRaw values: ${error.message}`);
  }
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching
 * 
 * @private
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const matrix = [];
  
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[s2.length][s1.length];
}

/**
 * Suggest matching Route values from routeOptions for a given RouteRaw
 * Uses fuzzy matching on Acronym and Route fields
 * 
 * @param {string} routeRaw - Raw route value to match
 * @param {number} limit - Maximum suggestions to return (default: 3)
 * @returns {Array<Object>} Array of suggestions with confidence scores
 */
async function suggestRouteMatch(routeRaw, limit = 3) {
  if (!routeRaw || typeof routeRaw !== 'string') {
    return [];
  }

  try {
    // Get all route options
    const routeOptions = await RouteOption.findAll({
      attributes: ['RouteOptionId', 'Acronym', 'Route', 'Category'],
      raw: true
    });

    const routeRawLower = routeRaw.toLowerCase().trim();
    const matches = [];

    for (const option of routeOptions) {
      const acronym = (option.Acronym || '').toLowerCase().trim();
      const route = (option.Route || '').toLowerCase().trim();
      
      let score = 0;
      let matchType = null;

      // Exact match on acronym (highest priority)
      if (acronym === routeRawLower) {
        score = 100;
        matchType = 'exact_acronym';
      }
      // Exact match on route
      else if (route === routeRawLower) {
        score = 95;
        matchType = 'exact_route';
      }
      // Starts with match on acronym
      else if (acronym && routeRawLower.startsWith(acronym)) {
        score = 90;
        matchType = 'starts_acronym';
      }
      // Contains match on acronym
      else if (acronym && routeRawLower.includes(acronym)) {
        score = 80;
        matchType = 'contains_acronym';
      }
      // Starts with match on route
      else if (route && routeRawLower.startsWith(route.substring(0, 3))) {
        score = 70;
        matchType = 'starts_route';
      }
      // Contains match on route
      else if (route && routeRawLower.includes(route.substring(0, 4))) {
        score = 60;
        matchType = 'contains_route';
      }
      // Fuzzy match - use Levenshtein distance
      else {
        const distAcronym = acronym ? levenshteinDistance(routeRawLower, acronym) : 999;
        const distRoute = route ? levenshteinDistance(routeRawLower, route) : 999;
        const minDist = Math.min(distAcronym, distRoute);
        
        // Only consider if distance is reasonable
        const maxLen = Math.max(routeRawLower.length, acronym ? acronym.length : 0, route ? route.length : 0);
        if (minDist <= maxLen * 0.4) { // 40% tolerance
          score = Math.max(10, 50 - (minDist * 5));
          matchType = minDist === distAcronym ? 'fuzzy_acronym' : 'fuzzy_route';
        }
      }

      if (score > 0) {
        matches.push({
          routeOptionId: option.RouteOptionId,
          acronym: option.Acronym,
          route: option.Route,
          category: option.Category,
          confidence: score,
          matchType
        });
      }
    }

    // Sort by confidence descending
    matches.sort((a, b) => b.confidence - a.confidence);

    // Return top matches
    const topMatches = matches.slice(0, limit);
    
    logger.info(`Found ${topMatches.length} suggestions for RouteRaw "${routeRaw}"`);
    
    return topMatches;
  } catch (error) {
    logger.error(`Error suggesting route match for "${routeRaw}":`, error);
    throw new Error(`Failed to suggest route matches: ${error.message}`);
  }
}

/**
 * Get all drugs affected by a RouteRaw value
 * 
 * @param {string} routeRaw - RouteRaw value to query
 * @param {number} limit - Maximum records to return (default: 100)
 * @returns {Array<Object>} Array of drug records
 */
async function getAffectedDrugs(routeRaw, limit = 100) {
  try {
    const drugs = await Drug.findAll({
      where: { RouteRaw: routeRaw },
      attributes: ['DrugID', 'DrugName', 'Route', 'RouteRaw', 'Form', 'Dosage', 'Manufacturer'],
      limit,
      raw: true
    });

    logger.info(`Found ${drugs.length} drugs with RouteRaw "${routeRaw}"`);
    
    return drugs;
  } catch (error) {
    logger.error(`Error getting affected drugs for RouteRaw "${routeRaw}":`, error);
    throw new Error(`Failed to get affected drugs: ${error.message}`);
  }
}

/**
 * Preview route mappings before applying
 * Shows what will change
 * 
 * @param {Array<Object>} mappings - Array of {routeRaw, newRoute}
 * @returns {Object} Preview data with affected counts and sample drugs
 */
async function previewRouteMapping(mappings) {
  if (!Array.isArray(mappings) || mappings.length === 0) {
    throw new Error('Mappings array is required');
  }

  try {
    const preview = {
      totalMappings: mappings.length,
      totalAffectedDrugs: 0,
      mappingDetails: []
    };

    for (const mapping of mappings) {
      const { routeRaw, newRoute } = mapping;

      if (!routeRaw || !newRoute) {
        continue;
      }

      // Count affected drugs
      const count = await Drug.count({
        where: { RouteRaw: routeRaw }
      });

      // Get sample drugs (up to 5)
      const sampleDrugs = await Drug.findAll({
        where: { RouteRaw: routeRaw },
        attributes: ['DrugID', 'DrugName', 'Route', 'RouteRaw'],
        limit: 5,
        raw: true
      });

      preview.totalAffectedDrugs += count;
      preview.mappingDetails.push({
        routeRaw,
        newRoute,
        affectedCount: count,
        sampleDrugs
      });
    }

    logger.info(`Preview: ${preview.totalAffectedDrugs} drugs will be affected by ${mappings.length} mappings`);
    
    return preview;
  } catch (error) {
    logger.error('Error previewing route mappings:', error);
    throw new Error(`Failed to preview mappings: ${error.message}`);
  }
}

/**
 * Apply route mappings to drug table
 * Updates Route field for all drugs matching RouteRaw values
 * 
 * @param {Array<Object>} mappings - Array of {routeRaw, newRoute}
 * @param {string} sessionId - Session identifier
 * @param {number} userId - User applying changes
 * @returns {Object} Result with updated counts
 */
async function applyRouteMappings(mappings, sessionId, userId) {
  if (!Array.isArray(mappings) || mappings.length === 0) {
    throw new Error('Mappings array is required');
  }

  const session = sessionService.getSession(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const transaction = await sequelize.transaction();

  try {
    // Create backup before applying changes
    const affectedDrugs = [];
    
    for (const mapping of mappings) {
      const drugs = await Drug.findAll({
        where: { RouteRaw: mapping.routeRaw },
        attributes: ['DrugID', 'DrugName', 'Route', 'RouteRaw'],
        raw: true
      });
      affectedDrugs.push(...drugs);
    }

    // Save backup
    const backupFile = await sessionService.createBackupFile(sessionId, affectedDrugs);
    logger.info(`Created backup: ${backupFile}`);

    // Apply mappings
    const results = {
      totalUpdated: 0,
      mappingResults: []
    };

    for (const mapping of mappings) {
      const { routeRaw, newRoute } = mapping;

      if (!routeRaw || !newRoute) {
        results.mappingResults.push({
          routeRaw,
          newRoute,
          success: false,
          updatedCount: 0,
          error: 'Missing routeRaw or newRoute'
        });
        continue;
      }

      try {
        const [updatedCount] = await Drug.update(
          { 
            Route: newRoute,
            UpdatedDate: new Date()
          },
          {
            where: { RouteRaw: routeRaw },
            transaction
          }
        );

        results.totalUpdated += updatedCount;
        results.mappingResults.push({
          routeRaw,
          newRoute,
          success: true,
          updatedCount
        });

        logger.info(`Updated ${updatedCount} drugs: RouteRaw "${routeRaw}" → Route "${newRoute}"`);
      } catch (mappingError) {
        logger.error(`Error applying mapping ${routeRaw} → ${newRoute}:`, mappingError);
        results.mappingResults.push({
          routeRaw,
          newRoute,
          success: false,
          updatedCount: 0,
          error: mappingError.message
        });
      }
    }

    // Commit transaction
    await transaction.commit();

    // Update session
    sessionService.updateSession(sessionId, {
      status: 'applied',
      affectedCount: results.totalUpdated,
      mappings
    });

    logger.info(`Successfully applied ${mappings.length} route mappings, updated ${results.totalUpdated} drugs`);
    
    return results;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error applying route mappings:', error);
    throw new Error(`Failed to apply mappings: ${error.message}`);
  }
}

/**
 * Rollback route changes using backup file
 * Restores original Route values from session backup
 * 
 * @param {string} sessionId - Session identifier
 * @returns {Object} Rollback result
 */
async function rollbackRouteChanges(sessionId) {
  const session = sessionService.getSession(sessionId);
  
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  if (session.status !== 'applied') {
    throw new Error(`Cannot rollback session in status: ${session.status}`);
  }

  const transaction = await sequelize.transaction();

  try {
    // Read backup file
    const backup = await sessionService.readBackupFile(sessionId);
    
    if (!backup.data || backup.data.length === 0) {
      throw new Error('Backup file contains no data');
    }

    let restoredCount = 0;

    // Restore each drug's Route value
    for (const drug of backup.data) {
      await Drug.update(
        { 
          Route: drug.Route,
          UpdatedDate: new Date()
        },
        {
          where: { DrugID: drug.DrugID },
          transaction
        }
      );
      restoredCount++;
    }

    await transaction.commit();

    // Update session status
    sessionService.updateSession(sessionId, {
      status: 'rolled_back'
    });

    logger.info(`Rollback complete: restored ${restoredCount} drugs from backup`);
    
    return {
      success: true,
      restoredCount,
      backupFile: backup.sessionId
    };
  } catch (error) {
    await transaction.rollback();
    logger.error('Error rolling back route changes:', error);
    throw new Error(`Failed to rollback changes: ${error.message}`);
  }
}

/**
 * Get statistics about Route data quality
 * 
 * @returns {Object} Statistics about routes
 */
async function getRouteStats() {
  try {
    const totalDrugs = await Drug.count();
    
    const drugsWithRoute = await Drug.count({
      where: {
        Route: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' }
          ]
        }
      }
    });

    const drugsWithRouteRaw = await Drug.count({
      where: {
        RouteRaw: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' }
          ]
        }
      }
    });

    const uniqueRouteRaws = await Drug.count({
      distinct: true,
      col: 'RouteRaw',
      where: {
        RouteRaw: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' }
          ]
        }
      }
    });

    return {
      totalDrugs,
      drugsWithRoute,
      drugsWithRouteRaw,
      drugsWithoutRoute: totalDrugs - drugsWithRoute,
      uniqueRouteRaws,
      cleanPercentage: totalDrugs > 0 ? ((drugsWithRoute / totalDrugs) * 100).toFixed(2) : 0
    };
  } catch (error) {
    logger.error('Error getting route stats:', error);
    throw new Error(`Failed to get route stats: ${error.message}`);
  }
}

module.exports = {
  getUniqueRouteRaw,
  suggestRouteMatch,
  getAffectedDrugs,
  previewRouteMapping,
  applyRouteMappings,
  rollbackRouteChanges,
  getRouteStats
};
