/**
 * Form Cleaning Service
 * 
 * Provides functionality for bulk cleaning and standardization of Form fields
 * in the drug table. Allows users to map FormRaw values to clean Form values
 * from the form lookup table.
 * 
 * @module formCleaningService
 */

const { Op } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('../models/drug');
const DosageOption = require('../models/dosageOption');
const sessionService = require('./cleaningSessionService');
const logger = require('../../config/logger');

/**
 * Get unique FormRaw values with drug counts
 * Returns distinct FormRaw values and how many drugs have each value
 * 
 * @param {Object} options - Query options
 * @param {boolean} options.includeNull - Include null/empty FormRaw values (default: false)
 * @param {number} options.minCount - Minimum drug count to include (default: 1)
 * @returns {Array<Object>} Array of {formRaw, drugCount, sampleForm}
 */
async function getUniqueFormRaw(options = {}) {
  const { includeNull = false, minCount = 1 } = options;

  try {
    const whereClause = includeNull ? {
      [Op.or]: [
        { NotMarketed: false },
        { NotMarketed: null }
      ]
    } : {
      FormRaw: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.ne]: '' }
        ]
      },
      [Op.or]: [
        { NotMarketed: false },
        { NotMarketed: null }
      ]
    };

    // Query to get unique FormRaw values with counts
    const results = await Drug.findAll({
      attributes: [
        'FormRaw',
        [sequelize.fn('COUNT', sequelize.col('DrugID')), 'drugCount'],
        [sequelize.fn('MIN', sequelize.col('Form')), 'sampleForm']
      ],
      where: whereClause,
      group: ['FormRaw'],
      having: sequelize.literal(`COUNT(DrugID) >= ${minCount}`),
      order: [[sequelize.literal('drugCount'), 'DESC']],
      raw: true
    });

    logger.info(`Found ${results.length} unique FormRaw values`);
    
    return results.map(r => ({
      formRaw: r.FormRaw,
      drugCount: parseInt(r.drugCount),
      sampleForm: r.sampleForm
    }));
  } catch (error) {
    logger.error('Error fetching unique FormRaw values:', error);
    throw new Error(`Failed to get unique FormRaw values: ${error.message}`);
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
 * Suggest matching Form values from dosageOptions table for a given FormRaw
 * Uses fuzzy matching on DosageFormClean field
 * 
 * @param {string} formRaw - Raw form value to match
 * @param {number} limit - Maximum suggestions to return (default: 3)
 * @returns {Array<Object>} Array of suggestions with confidence scores
 */
async function suggestFormMatch(formRaw, limit = 3) {
  if (!formRaw || typeof formRaw !== 'string') {
    return [];
  }

  try {
    // Get all dosage form options
    const formOptions = await DosageOption.findAll({
      attributes: ['DosageOptionId', 'DosageFormClean', 'PhysicalState', 'SubstitutionRelationship'],
      raw: true
    });

    const formRawLower = formRaw.toLowerCase().trim();
    const matches = [];

    for (const option of formOptions) {
      const formClean = (option.DosageFormClean || '').toLowerCase().trim();
      
      let score = 0;
      let matchType = null;

      // Exact match (highest priority)
      if (formClean === formRawLower) {
        score = 100;
        matchType = 'exact';
      }
      // Starts with match
      else if (formClean && formRawLower.startsWith(formClean)) {
        score = 90;
        matchType = 'starts_with';
      }
      // Contains match
      else if (formClean && formRawLower.includes(formClean)) {
        score = 80;
        matchType = 'contains';
      }
      // FormRaw contains the form name
      else if (formClean && formClean.includes(formRawLower)) {
        score = 75;
        matchType = 'contained_in';
      }
      // Fuzzy match - use Levenshtein distance
      else {
        const dist = formClean ? levenshteinDistance(formRawLower, formClean) : 999;
        
        // Only consider if distance is reasonable
        const maxLen = Math.max(formRawLower.length, formClean ? formClean.length : 0);
        if (dist <= maxLen * 0.4) { // 40% tolerance
          score = Math.max(10, 50 - (dist * 5));
          matchType = 'fuzzy';
        }
      }

      if (score > 0) {
        matches.push({
          dosageOptionId: option.DosageOptionId,
          dosageFormClean: option.DosageFormClean,
          physicalState: option.PhysicalState,
          substitutionRelationship: option.SubstitutionRelationship,
          confidence: score,
          matchType
        });
      }
    }

    // Sort by confidence descending
    matches.sort((a, b) => b.confidence - a.confidence);

    // Return top matches
    const topMatches = matches.slice(0, limit);
    
    logger.info(`Found ${topMatches.length} suggestions for FormRaw "${formRaw}"`);
    
    return topMatches;
  } catch (error) {
    logger.error(`Error suggesting form match for "${formRaw}":`, error);
    throw new Error(`Failed to suggest form matches: ${error.message}`);
  }
}

/**
 * Get all drugs affected by a FormRaw value
 * 
 * @param {string} formRaw - FormRaw value to query
 * @param {number} limit - Maximum records to return (default: 100)
 * @returns {Array<Object>} Array of drug records
 */
async function getAffectedDrugs(formRaw, limit = 100) {
  try {
    const drugs = await Drug.findAll({
      where: { 
        FormRaw: formRaw,
        [Op.or]: [
          { NotMarketed: false },
          { NotMarketed: null }
        ]
      },
      attributes: ['DrugID', 'DrugName', 'Form', 'FormRaw', 'Route', 'Dosage', 'Manufacturer', 'NotMarketed'],
      limit,
      raw: true
    });

    logger.info(`Found ${drugs.length} drugs with FormRaw "${formRaw}"`);
    
    return drugs;
  } catch (error) {
    logger.error(`Error getting affected drugs for FormRaw "${formRaw}":`, error);
    throw new Error(`Failed to get affected drugs: ${error.message}`);
  }
}

/**
 * Preview form mappings before applying
 * Shows what will change
 * 
 * @param {Array<Object>} mappings - Array of {formRaw, newForm}
 * @returns {Object} Preview data with affected counts and sample drugs
 */
async function previewFormMapping(mappings) {
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
      const { formRaw, newForm } = mapping;

      if (!formRaw || !newForm) {
        continue;
      }

      // Count affected drugs (marketed only)
      const count = await Drug.count({
        where: { 
          FormRaw: formRaw,
          [Op.or]: [
            { NotMarketed: false },
            { NotMarketed: null }
          ]
        }
      });

      // Get sample drugs (up to 5)
      const sampleDrugs = await Drug.findAll({
        where: { 
          FormRaw: formRaw,
          [Op.or]: [
            { NotMarketed: false },
            { NotMarketed: null }
          ]
        },
        attributes: ['DrugID', 'DrugName', 'Form', 'FormRaw'],
        limit: 5,
        raw: true
      });

      preview.totalAffectedDrugs += count;
      preview.mappingDetails.push({
        formRaw,
        newForm,
        affectedCount: count,
        sampleDrugs
      });
    }

    logger.info(`Preview: ${preview.totalAffectedDrugs} drugs will be affected by ${mappings.length} mappings`);
    
    return preview;
  } catch (error) {
    logger.error('Error previewing form mappings:', error);
    throw new Error(`Failed to preview mappings: ${error.message}`);
  }
}

/**
 * Apply form mappings to drug table
 * Updates Form field for all drugs matching FormRaw values
 * 
 * @param {Array<Object>} mappings - Array of {formRaw, newForm}
 * @param {string} sessionId - Session identifier
 * @param {number} userId - User applying changes
 * @returns {Object} Result with updated counts
 */
async function applyFormMappings(mappings, sessionId, userId) {
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
        where: { 
          FormRaw: mapping.formRaw,
          [Op.or]: [
            { NotMarketed: false },
            { NotMarketed: null }
          ]
        },
        attributes: ['DrugID', 'DrugName', 'Form', 'FormRaw'],
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
      const { formRaw, newForm } = mapping;

      if (!formRaw || !newForm) {
        results.mappingResults.push({
          formRaw,
          newForm,
          success: false,
          updatedCount: 0,
          error: 'Missing formRaw or newForm'
        });
        continue;
      }

      try {
        const [updatedCount] = await Drug.update(
          { 
            Form: newForm,
            UpdatedDate: new Date()
          },
          {
            where: { 
              FormRaw: formRaw,
              [Op.or]: [
                { NotMarketed: false },
                { NotMarketed: null }
              ]
            },
            transaction
          }
        );

        results.totalUpdated += updatedCount;
        results.mappingResults.push({
          formRaw,
          newForm,
          success: true,
          updatedCount
        });

        logger.info(`Updated ${updatedCount} drugs: FormRaw "${formRaw}" → Form "${newForm}"`);
      } catch (mappingError) {
        logger.error(`Error applying mapping ${formRaw} → ${newForm}:`, mappingError);
        results.mappingResults.push({
          formRaw,
          newForm,
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

    logger.info(`Successfully applied ${mappings.length} form mappings, updated ${results.totalUpdated} drugs`);
    
    return results;
  } catch (error) {
    await transaction.rollback();
    logger.error('Error applying form mappings:', error);
    throw new Error(`Failed to apply mappings: ${error.message}`);
  }
}

/**
 * Rollback form changes using backup file
 * Restores original Form values from session backup
 * 
 * @param {string} sessionId - Session identifier
 * @returns {Object} Rollback result
 */
async function rollbackFormChanges(sessionId) {
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

    // Restore each drug's Form value
    for (const drug of backup.data) {
      await Drug.update(
        { 
          Form: drug.Form,
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
    logger.error('Error rolling back form changes:', error);
    throw new Error(`Failed to rollback changes: ${error.message}`);
  }
}

/**
 * Get statistics about Form data quality
 * 
 * @returns {Object} Statistics about forms
 */
async function getFormStats() {
  try {
    // Only count marketed drugs (NotMarketed = false or null)
    const totalDrugs = await Drug.count({
      where: {
        [Op.or]: [
          { NotMarketed: false },
          { NotMarketed: null }
        ]
      }
    });
    
    const drugsWithForm = await Drug.count({
      where: {
        Form: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' }
          ]
        },
        [Op.or]: [
          { NotMarketed: false },
          { NotMarketed: null }
        ]
      }
    });

    const drugsWithFormRaw = await Drug.count({
      where: {
        FormRaw: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' }
          ]
        },
        [Op.or]: [
          { NotMarketed: false },
          { NotMarketed: null }
        ]
      }
    });

    const uniqueFormRaws = await Drug.count({
      distinct: true,
      col: 'FormRaw',
      where: {
        FormRaw: {
          [Op.and]: [
            { [Op.ne]: null },
            { [Op.ne]: '' }
          ]
        },
        [Op.or]: [
          { NotMarketed: false },
          { NotMarketed: null }
        ]
      }
    });

    // Explicitly count marketed drugs without forms
    const drugsWithoutForm = await Drug.count({
      where: {
        [Op.or]: [
          { Form: null },
          { Form: '' }
        ],
        [Op.and]: [
          {
            [Op.or]: [
              { NotMarketed: false },
              { NotMarketed: null }
            ]
          }
        ]
      }
    });

    return {
      totalDrugs,
      drugsWithForm,
      drugsWithFormRaw,
      drugsWithoutForm,
      uniqueFormRaws,
      cleanPercentage: totalDrugs > 0 ? ((drugsWithForm / totalDrugs) * 100).toFixed(2) : 0
    };
  } catch (error) {
    logger.error('Error getting form stats:', error);
    throw new Error(`Failed to get form stats: ${error.message}`);
  }
}

module.exports = {
  getUniqueFormRaw,
  suggestFormMatch,
  getAffectedDrugs,
  previewFormMapping,
  applyFormMappings,
  rollbackFormChanges,
  getFormStats
};
