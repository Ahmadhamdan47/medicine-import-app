/**
 * Dosage Cleaning Service
 * 
 * Provides functionality for cleaning and standardizing dosage data.
 * Supports editing structured dosage table records and reconstructing
 * the drug.Dosage field from structured data (reverse of dosageParser).
 * 
 * @module dosageCleaningService
 */

const { Op } = require('sequelize');
const sequelize = require('../../config/databasePharmacy');
const Drug = require('../models/drug');
const Dosage = require('../models/dosage');
const DosageOption = require('../models/dosageOption');
const sessionService = require('./cleaningSessionService');
const dosageParser = require('../utils/dosageParser');
const logger = require('../../config/logger');

/**
 * Get unique dosage forms (Form field) with drug counts
 * Used for filtering dosage records by form type
 * 
 * @param {Object} options - Query options
 * @param {boolean} options.includeNull - Include null/empty Form values (default: false)
 * @returns {Array<Object>} Array of {form, drugCount, matchingDosageOption}
 */
async function getUniqueDosageForms(options = {}) {
  const { includeNull = false } = options;

  try {
    const whereClause = includeNull ? {
      [Op.or]: [
        { NotMarketed: false },
        { NotMarketed: null }
      ]
    } : {
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
    };

    // Get unique Form values with counts
    const results = await Drug.findAll({
      attributes: [
        'Form',
        [sequelize.fn('COUNT', sequelize.col('DrugID')), 'drugCount']
      ],
      where: whereClause,
      group: ['Form'],
      order: [[sequelize.literal('drugCount'), 'DESC']],
      raw: true
    });

    // Enrich with matching dosageOptions
    const enrichedResults = [];

    for (const result of results) {
      const form = result.Form;
      
      // Try to find matching dosageOption
      let matchingOption = null;
      if (form) {
        matchingOption = await DosageOption.findOne({
          where: {
            DosageFormClean: {
              [Op.like]: `%${form}%`
            }
          },
          attributes: ['DosageOptionId', 'DosageFormClean', 'PhysicalState', 'SubstitutionRelationship'],
          raw: true
        });
      }

      enrichedResults.push({
        form,
        drugCount: parseInt(result.drugCount),
        matchingDosageOption: matchingOption
      });
    }

    logger.info(`Found ${enrichedResults.length} unique dosage forms`);
    
    return enrichedResults;
  } catch (error) {
    logger.error('Error fetching unique dosage forms:', error);
    throw new Error(`Failed to get unique dosage forms: ${error.message}`);
  }
}

/**
 * Get dosage records for cleaning
 * Joins dosage table with drug table, optionally filtered by Form
 * 
 * @param {Object} options - Query options
 * @param {string} options.formFilter - Filter by drug Form (optional)
 * @param {number} options.limit - Maximum records to return (default: 100)
 * @param {number} options.offset - Pagination offset (default: 0)
 * @returns {Object} {records, total, hasMore}
 */
async function getDosageRecordsForCleaning(options = {}) {
  const { formFilter = null, limit = 100, offset = 0 } = options;

  try {
    const whereClause = {
      [Op.or]: [
        { NotMarketed: false },
        { NotMarketed: null }
      ]
    };
    
    if (formFilter) {
      whereClause.Form = formFilter;
    }

    // Get dosage records with drug info
    const { count, rows } = await Dosage.findAndCountAll({
      include: [{
        model: Drug,
        attributes: ['DrugID', 'DrugName', 'Form', 'Dosage', 'Route', 'Manufacturer'],
        where: whereClause,
        required: true
      }],
      limit,
      offset,
      order: [['DosageId', 'ASC']],
      raw: false
    });

    const records = rows.map(dosageRecord => {
      const record = dosageRecord.toJSON();
      
      // Check if can be reconstructed
      const canReconstruct = dosageParser.canReconstructDosage(record);
      
      // Get current reconstructed value
      let reconstructedDosage = null;
      if (canReconstruct) {
        reconstructedDosage = dosageParser.reconstructDrugDosageString(record);
      }

      return {
        ...record,
        canReconstruct,
        reconstructedDosage,
        currentDrugDosage: record.drug ? record.drug.Dosage : null
      };
    });

    logger.info(`Retrieved ${records.length} dosage records (total: ${count})`);
    
    return {
      records,
      total: count,
      hasMore: (offset + limit) < count,
      limit,
      offset
    };
  } catch (error) {
    logger.error('Error getting dosage records for cleaning:', error);
    throw new Error(`Failed to get dosage records: ${error.message}`);
  }
}

/**
 * Update a single dosage table record
 * 
 * @param {number} dosageId - DosageId to update
 * @param {Object} updates - Fields to update (Numerator1, Denominator1, etc.)
 * @param {number} userId - User making the update
 * @returns {Object} Updated dosage record
 */
async function updateDosageRecord(dosageId, updates, userId) {
  if (!dosageId) {
    throw new Error('DosageId is required');
  }

  try {
    const dosageRecord = await Dosage.findByPk(dosageId);
    
    if (!dosageRecord) {
      throw new Error(`Dosage record ${dosageId} not found`);
    }

    // Validate and apply updates
    const allowedFields = [
      'Numerator1', 'Numerator1Unit', 'Denominator1', 'Denominator1Unit',
      'Numerator2', 'Numerator2Unit', 'Denominator2', 'Denominator2Unit',
      'Numerator3', 'Numerator3Unit', 'Denominator3', 'Denominator3Unit'
    ];

    const updateData = { UpdatedDate: new Date() };

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateData[key] = value;
      }
    }

    await dosageRecord.update(updateData);

    logger.info(`Updated dosage record ${dosageId}`);
    
    return dosageRecord.toJSON();
  } catch (error) {
    logger.error(`Error updating dosage record ${dosageId}:`, error);
    throw new Error(`Failed to update dosage record: ${error.message}`);
  }
}

/**
 * Reconstruct drug.Dosage field from dosage table record
 * Uses dosageParser.reconstructDrugDosageString() to format
 * 
 * @param {number} drugId - DrugID to reconstruct
 * @returns {Object} {drugId, oldDosage, newDosage, updated}
 */
async function reconstructDrugDosage(drugId) {
  if (!drugId) {
    throw new Error('DrugID is required');
  }

  const transaction = await sequelize.transaction();

  try {
    // Get dosage record for this drug
    const dosageRecord = await Dosage.findOne({
      where: { DrugId: drugId },
      raw: true
    });

    if (!dosageRecord) {
      throw new Error(`No dosage record found for DrugID ${drugId}`);
    }

    // Get current drug record
    const drug = await Drug.findByPk(drugId);
    
    if (!drug) {
      throw new Error(`Drug ${drugId} not found`);
    }

    const oldDosage = drug.Dosage;

    // Reconstruct dosage string
    const newDosage = dosageParser.reconstructDrugDosageString(dosageRecord);

    // Update drug record
    await drug.update(
      { 
        Dosage: newDosage,
        UpdatedDate: new Date()
      },
      { transaction }
    );

    await transaction.commit();

    logger.info(`Reconstructed dosage for DrugID ${drugId}: "${oldDosage}" → "${newDosage}"`);
    
    return {
      drugId,
      oldDosage,
      newDosage,
      updated: oldDosage !== newDosage
    };
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error reconstructing dosage for DrugID ${drugId}:`, error);
    throw new Error(`Failed to reconstruct drug dosage: ${error.message}`);
  }
}

/**
 * Bulk reconstruct dosages for multiple drugs
 * Useful after batch editing dosage table records
 * 
 * @param {Array<number>} drugIds - Array of DrugIDs
 * @param {string} sessionId - Session identifier
 * @returns {Object} {totalProcessed, successCount, failureCount, results}
 */
async function bulkReconstructDosages(drugIds, sessionId) {
  if (!Array.isArray(drugIds) || drugIds.length === 0) {
    throw new Error('Array of DrugIDs is required');
  }

  const session = sessionService.getSession(sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  try {
    // Get affected drugs for backup (marketed only)
    const affectedDrugs = await Drug.findAll({
      where: { 
        DrugID: { [Op.in]: drugIds },
        [Op.or]: [
          { NotMarketed: false },
          { NotMarketed: null }
        ]
      },
      attributes: ['DrugID', 'DrugName', 'Dosage'],
      raw: true
    });

    // Create backup
    const backupFile = await sessionService.createBackupFile(sessionId, affectedDrugs);
    logger.info(`Created backup: ${backupFile}`);

    const results = {
      totalProcessed: 0,
      successCount: 0,
      failureCount: 0,
      reconstructions: []
    };

    // Process each drug
    for (const drugId of drugIds) {
      results.totalProcessed++;

      try {
        const result = await reconstructDrugDosage(drugId);
        results.successCount++;
        results.reconstructions.push({
          ...result,
          success: true
        });
      } catch (error) {
        results.failureCount++;
        results.reconstructions.push({
          drugId,
          success: false,
          error: error.message
        });
        logger.error(`Failed to reconstruct DrugID ${drugId}:`, error);
      }
    }

    // Update session
    sessionService.updateSession(sessionId, {
      status: 'applied',
      affectedCount: results.successCount
    });

    logger.info(`Bulk reconstruction complete: ${results.successCount}/${results.totalProcessed} successful`);
    
    return results;
  } catch (error) {
    logger.error('Error in bulk reconstruct dosages:', error);
    throw new Error(`Failed to bulk reconstruct dosages: ${error.message}`);
  }
}

/**
 * Preview dosage changes before applying
 * Shows what drug.Dosage field will become
 * 
 * @param {Array<Object>} updates - Array of {dosageId, ...fields}
 * @returns {Array<Object>} Preview of changes
 */
async function previewDosageChanges(updates) {
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new Error('Updates array is required');
  }

  try {
    const previews = [];

    for (const update of updates) {
      const { dosageId, ...fields } = update;

      // Get current dosage record
      const currentRecord = await Dosage.findOne({
        where: { DosageId: dosageId },
        include: [{
          model: Drug,
          attributes: ['DrugID', 'DrugName', 'Dosage'],
          where: {
            [Op.or]: [
              { NotMarketed: false },
              { NotMarketed: null }
            ]
          }
        }],
        raw: false
      });

      if (!currentRecord) {
        previews.push({
          dosageId,
          error: 'Dosage record not found'
        });
        continue;
      }

      const currentData = currentRecord.toJSON();
      const currentDrugDosage = currentData.drug ? currentData.drug.Dosage : null;
      const currentReconstructed = dosageParser.reconstructDrugDosageString(currentData);

      // Apply updates to a copy
      const updatedData = { ...currentData };
      Object.assign(updatedData, fields);

      // Try to reconstruct with new values
      const newReconstructed = dosageParser.reconstructDrugDosageString(updatedData);
      const canReconstruct = dosageParser.canReconstructDosage(updatedData);

      previews.push({
        dosageId,
        drugId: currentData.DrugId,
        drugName: currentData.drug ? currentData.drug.DrugName : null,
        currentDrugDosage,
        currentReconstructed,
        newReconstructed,
        willChange: currentDrugDosage !== newReconstructed,
        canReconstruct,
        updates: fields
      });
    }

    logger.info(`Generated preview for ${previews.length} dosage updates`);
    
    return previews;
  } catch (error) {
    logger.error('Error previewing dosage changes:', error);
    throw new Error(`Failed to preview dosage changes: ${error.message}`);
  }
}

/**
 * Rollback dosage changes using backup file
 * 
 * @param {string} sessionId - Session identifier
 * @returns {Object} Rollback result
 */
async function rollbackDosageChanges(sessionId) {
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

    // Restore each drug's Dosage value
    for (const drug of backup.data) {
      await Drug.update(
        { 
          Dosage: drug.Dosage,
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
    logger.error('Error rolling back dosage changes:', error);
    throw new Error(`Failed to rollback changes: ${error.message}`);
  }
}

/**
 * Suggest dosage form match from dosageOptions
 * 
 * @param {string} form - Form value to match
 * @param {number} limit - Maximum suggestions (default: 3)
 * @returns {Array<Object>} Suggested dosage options
 */
async function suggestDosageFormMatch(form, limit = 3) {
  if (!form || typeof form !== 'string') {
    return [];
  }

  try {
    const formLower = form.toLowerCase().trim();

    // Search dosageOptions
    const matches = await DosageOption.findAll({
      where: {
        DosageFormClean: {
          [Op.like]: `%${form}%`
        }
      },
      attributes: ['DosageOptionId', 'DosageFormClean', 'PhysicalState', 'SubstitutionRelationship'],
      limit,
      raw: true
    });

    // Calculate confidence scores
    const scoredMatches = matches.map(match => {
      const cleanLower = (match.DosageFormClean || '').toLowerCase();
      
      let confidence = 50;
      if (cleanLower === formLower) {
        confidence = 100;
      } else if (cleanLower.startsWith(formLower)) {
        confidence = 90;
      } else if (cleanLower.includes(formLower)) {
        confidence = 70;
      }

      return {
        ...match,
        confidence
      };
    });

    // Sort by confidence
    scoredMatches.sort((a, b) => b.confidence - a.confidence);

    logger.info(`Found ${scoredMatches.length} suggestions for Form "${form}"`);
    
    return scoredMatches;
  } catch (error) {
    logger.error(`Error suggesting dosage form match for "${form}":`, error);
    throw new Error(`Failed to suggest dosage form matches: ${error.message}`);
  }
}

/**
 * Get statistics about dosage data quality
 * 
 * @returns {Object} Statistics
 */
async function getDosageStats() {
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
    
    const drugsWithDosage = await Drug.count({
      where: {
        Dosage: {
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

    const totalDosageRecords = await Dosage.count({
      include: [{
        model: Drug,
        attributes: [],
        where: {
          [Op.or]: [
            { NotMarketed: false },
            { NotMarketed: null }
          ]
        },
        required: true
      }]
    });

    const drugsWithDosageRecords = await Dosage.count({
      distinct: true,
      col: 'DrugId',
      include: [{
        model: Drug,
        attributes: [],
        where: {
          [Op.or]: [
            { NotMarketed: false },
            { NotMarketed: null }
          ]
        },
        required: true
      }]
    });

    // Explicitly count marketed drugs without dosage
    const drugsWithoutDosage = await Drug.count({
      where: {
        [Op.or]: [
          { Dosage: null },
          { Dosage: '' }
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

    // Explicitly count marketed drugs without dosage records
    const drugsWithoutDosageRecords = await Drug.count({
      where: {
        DrugID: {
          [Op.notIn]: sequelize.literal(`(
            SELECT DISTINCT DrugId 
            FROM dosage d 
            INNER JOIN drug dr ON d.DrugId = dr.DrugID 
            WHERE (dr.NotMarketed = 0 OR dr.NotMarketed IS NULL)
          )`)
        },
        [Op.or]: [
          { NotMarketed: false },
          { NotMarketed: null }
        ]
      }
    });

    return {
      totalDrugs,
      drugsWithDosage,
      drugsWithoutDosage,
      totalDosageRecords,
      drugsWithDosageRecords,
      drugsWithoutDosageRecords,
      dosageFieldPopulation: totalDrugs > 0 ? ((drugsWithDosage / totalDrugs) * 100).toFixed(2) : 0,
      structuredDosagePopulation: totalDrugs > 0 ? ((drugsWithDosageRecords / totalDrugs) * 100).toFixed(2) : 0
    };
  } catch (error) {
    logger.error('Error getting dosage stats:', error);
    throw new Error(`Failed to get dosage stats: ${error.message}`);
  }
}

module.exports = {
  getUniqueDosageForms,
  getDosageRecordsForCleaning,
  updateDosageRecord,
  reconstructDrugDosage,
  bulkReconstructDosages,
  previewDosageChanges,
  rollbackDosageChanges,
  suggestDosageFormMatch,
  getDosageStats
};
