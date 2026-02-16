/**
 * Dosage Parser Utility
 * 
 * Parses free-text dosage strings from drug.Dosage field into structured
 * numerator/denominator components for the dosage table.
 * 
 * Supported formats:
 * - Simple: "500mg", "20mcg", "1g"
 * - Ratios: "100mg/5ml", "50mg/ml", "2.5mg/ml"
 * - Percentages: "2%", "10%", "0.9%"
 * - Complex units: "1440 ELISA units/ml", "50,000IU"
 * - Multi-ingredient: "0.1mg/g + 2.5mg + 50mg + 20mg"
 * 
 * @module dosageParser
 */

/**
 * Parse a dosage string into structured components
 * 
 * @param {string} dosageString - The free-text dosage string from drug.Dosage
 * @returns {Array<Object>} Array of parsed dosage components (up to 3)
 *   Each object contains:
 *   - numerator: number (supports decimals)
 *   - numeratorUnit: string
 *   - denominator: number (0 if none)
 *   - denominatorUnit: string (empty string if none)
 * 
 * @example
 * parseDosage("500mg")
 * // => [{numerator: 500, numeratorUnit: "mg", denominator: 0, denominatorUnit: ""}]
 * 
 * @example
 * parseDosage("100mg/5ml")
 * // => [{numerator: 100, numeratorUnit: "mg", denominator: 5, denominatorUnit: "ml"}]
 * 
 * @example
 * parseDosage("0.1mg/g + 2.5mg + 50mg")
 * // => [
 * //   {numerator: 0.1, numeratorUnit: "mg", denominator: 1, denominatorUnit: "g"},
 * //   {numerator: 2.5, numeratorUnit: "mg", denominator: 0, denominatorUnit: ""},
 * //   {numerator: 50, numeratorUnit: "mg", denominator: 0, denominatorUnit: ""}
 * // ]
 */
function parseDosage(dosageString) {
  // Handle null, undefined, or empty strings
  if (!dosageString || typeof dosageString !== 'string') {
    return [];
  }

  // Normalize the string: trim whitespace
  const normalized = dosageString.trim();
  
  if (normalized === '') {
    return [];
  }

  // Split by '+' to handle multi-ingredient drugs
  // Support both '+' and ' + ' patterns
  const ingredients = normalized.split(/\s*\+\s*/).filter(part => part.trim() !== '');

  const results = [];

  for (let i = 0; i < ingredients.length && i < 3; i++) {
    const ingredient = ingredients[i].trim();
    const parsed = parseSingleDosage(ingredient);
    
    if (parsed) {
      results.push(parsed);
    }
  }

  return results;
}

/**
 * Parse a single dosage component (one ingredient)
 * 
 * @private
 * @param {string} dosageStr - Single ingredient dosage string
 * @returns {Object|null} Parsed dosage object or null if unparseable
 */
function parseSingleDosage(dosageStr) {
  if (!dosageStr) {
    return null;
  }

  // Remove commas from numbers (e.g., "50,000IU" -> "50000IU")
  let cleanStr = dosageStr.replace(/,/g, '').trim();

  // Try to match with multi-word units like "ELISA units" FIRST
  // Before we try to strip drug names, check if this is a multi-word unit case
  // Pattern: number space word(s) potentially with /denominator
  if (/^\d+\.?\d*\s+[a-zA-Z]+\s+[a-zA-Z]/.test(cleanStr)) {
    // Has potential multi-word unit
    const multiWordPattern = /^(\d+\.?\d*|\.\d+)\s+([a-zA-Z]+\s+[a-zA-Z]+)(?:\/(\d+\.?\d*|\.\d+)?\s*([a-zA-Z]+))?$/;
    const multiWordMatch = cleanStr.match(multiWordPattern);
    
    if (multiWordMatch) {
      const [, numeratorStr, numeratorUnit, denominatorStr, denominatorUnit] = multiWordMatch;
      
      const numerator = parseFloat(numeratorStr);
      if (isNaN(numerator)) {
        return null;
      }
      
      let denominator = 0;
      let denomUnit = '';
      
      if (denominatorUnit) {
        if (denominatorStr && denominatorStr.trim()) {
          denominator = parseFloat(denominatorStr);
          if (isNaN(denominator)) {
            denominator = 1;
          }
        } else {
          denominator = 1;
        }
        denomUnit = denominatorUnit.trim();
      }
      
      return {
        numerator,
        numeratorUnit: numeratorUnit.trim(),
        denominator,
        denominatorUnit: denomUnit
      };
    }
  }

  // Handle drug names that appear BEFORE the dosage
  // Pattern: "menthol 2.5mg" or "bismuth subgallate 50mg"
  // Look for: text followed by a dosage pattern
  const drugBeforePattern = /^[a-z\s]+?([\d.]+\s*[a-zA-Z%]+(?:\/[\d.]*\s*[a-zA-Z%]+)?)$/i;
  const drugBeforeMatch = cleanStr.match(drugBeforePattern);
  if (drugBeforeMatch) {
    cleanStr = drugBeforeMatch[1].trim();
  } else {
    // Handle drug names that appear AFTER the dosage
    // Pattern: "0.1mg/g fluocinolone acetonide"
    const drugAfterPattern = /^([\d.]+\s*[a-zA-Z%]+(?:\/[\d.]*\s*[a-zA-Z%]+)?)\s+[a-z]/i;
    const drugAfterMatch = cleanStr.match(drugAfterPattern);
    if (drugAfterMatch) {
      cleanStr = drugAfterMatch[1].trim();
    }
  }

  // Regular pattern for simple units (no spaces in unit name)
  const pattern = /^(\d+\.?\d*|\.\d+)\s*([a-zA-Z%]+)(?:\/((?:\d+\.?\d*|\.\d+)\s*)?([a-zA-Z%]+))?$/;
  const match = cleanStr.match(pattern);

  if (!match) {
    return null;
  }

  const [, numeratorStr, numeratorUnit, denominatorStr, denominatorUnit] = match;

  const numerator = parseFloat(numeratorStr);
  
  if (isNaN(numerator)) {
    return null;
  }

  let denominator = 0;
  let denomUnit = '';

  if (denominatorUnit) {
    if (denominatorStr && denominatorStr.trim()) {
      denominator = parseFloat(denominatorStr);
      if (isNaN(denominator)) {
        denominator = 1;
      }
    } else {
      denominator = 1;
    }
    denomUnit = denominatorUnit.trim();
  }

  return {
    numerator,
    numeratorUnit: numeratorUnit.trim(),
    denominator,
    denominatorUnit: denomUnit
  };
}

/**
 * Format parsed dosage components back to a human-readable string
 * Useful for verification and display
 * 
 * @param {Array<Object>} parsedDosages - Array of parsed dosage objects
 * @returns {string} Formatted dosage string
 * 
 * @example
 * formatDosage([{numerator: 100, numeratorUnit: "mg", denominator: 5, denominatorUnit: "ml"}])
 * // => "100mg/5ml"
 */
function formatDosage(parsedDosages) {
  if (!Array.isArray(parsedDosages) || parsedDosages.length === 0) {
    return '';
  }

  return parsedDosages.map(d => {
    let str = `${d.numerator}${d.numeratorUnit}`;
    if (d.denominator && d.denominator !== 0) {
      str += `/${d.denominator}${d.denominatorUnit}`;
    }
    return str;
  }).join(' + ');
}

/**
 * Validate a parsed dosage object
 * 
 * @param {Object} dosage - Parsed dosage object
 * @returns {boolean} True if valid
 */
function isValidParsedDosage(dosage) {
  if (!dosage || typeof dosage !== 'object') {
    return false;
  }

  const { numerator, numeratorUnit, denominator, denominatorUnit } = dosage;

  // Numerator must be a valid number > 0
  if (typeof numerator !== 'number' || isNaN(numerator) || numerator <= 0) {
    return false;
  }

  // Numerator unit must be a non-empty string
  if (typeof numeratorUnit !== 'string' || numeratorUnit.trim() === '') {
    return false;
  }

  // Denominator must be a number >= 0
  if (typeof denominator !== 'number' || isNaN(denominator) || denominator < 0) {
    return false;
  }

  // Denominator unit must be a string
  if (typeof denominatorUnit !== 'string') {
    return false;
  }

  // If denominator is 0, unit should be empty (convention)
  if (denominator === 0 && denominatorUnit !== '') {
    return false;
  }

  // If denominator > 0, unit should not be empty
  if (denominator > 0 && denominatorUnit.trim() === '') {
    return false;
  }

  return true;
}

/**
 * Convert dosage table row format to parsed dosage array format
 * Handles up to 3 dosage components from the dosage table structure
 * 
 * @param {Object} dosageRecord - Dosage table record with Numerator1-3, Denominator1-3, etc.
 * @returns {Array<Object>} Array of parsed dosage objects
 * 
 * @example
 * convertDosageTableRow({
 *   Numerator1: 100, Numerator1Unit: "mg",
 *   Denominator1: 5, Denominator1Unit: "ml",
 *   Numerator2: null, Numerator2Unit: null
 * })
 * // => [{numerator: 100, numeratorUnit: "mg", denominator: 5, denominatorUnit: "ml"}]
 */
function convertDosageTableRow(dosageRecord) {
  if (!dosageRecord || typeof dosageRecord !== 'object') {
    return [];
  }

  const dosages = [];

  for (let i = 1; i <= 3; i++) {
    const numKey = `Numerator${i}`;
    const numUnitKey = `Numerator${i}Unit`;
    const denomKey = `Denominator${i}`;
    const denomUnitKey = `Denominator${i}Unit`;

    const numerator = dosageRecord[numKey];
    const numeratorUnit = dosageRecord[numUnitKey];
    const denominator = dosageRecord[denomKey];
    const denominatorUnit = dosageRecord[denomUnitKey];

    // Skip if numerator is missing or invalid
    if (!numerator || !numeratorUnit) {
      continue;
    }

    const parsedNum = typeof numerator === 'number' ? numerator : parseFloat(numerator);
    const parsedDenom = denominator ? (typeof denominator === 'number' ? denominator : parseFloat(denominator)) : 0;

    if (isNaN(parsedNum) || parsedNum <= 0) {
      continue;
    }

    dosages.push({
      numerator: parsedNum,
      numeratorUnit: String(numeratorUnit).trim(),
      denominator: parsedDenom || 0,
      denominatorUnit: (parsedDenom && denominatorUnit) ? String(denominatorUnit).trim() : ''
    });
  }

  return dosages;
}

/**
 * Reconstruct drug.Dosage field from dosage table record
 * This is the reverse operation of parseDosage
 * 
 * @param {Object} dosageRecord - Dosage table record
 * @returns {string} Formatted dosage string for drug.Dosage field
 * 
 * @example
 * reconstructDrugDosageString({
 *   Numerator1: 500, Numerator1Unit: "mg",
 *   Denominator1: 0, Denominator1Unit: ""
 * })
 * // => "500mg"
 */
function reconstructDrugDosageString(dosageRecord) {
  const dosages = convertDosageTableRow(dosageRecord);
  return formatDosage(dosages);
}

/**
 * Validate if a dosage table record can be reconstructed cleanly
 * Checks if all populated fields are valid
 * 
 * @param {Object} dosageRecord - Dosage table record
 * @returns {boolean} True if record can be reconstructed
 */
function canReconstructDosage(dosageRecord) {
  if (!dosageRecord || typeof dosageRecord !== 'object') {
    return false;
  }

  // Must have at least Numerator1
  if (!dosageRecord.Numerator1 || !dosageRecord.Numerator1Unit) {
    return false;
  }

  const dosages = convertDosageTableRow(dosageRecord);
  
  // Must have at least one valid dosage
  if (dosages.length === 0) {
    return false;
  }

  // All converted dosages must be valid
  return dosages.every(d => isValidParsedDosage(d));
}

/**
 * Format multiple dosage records into a single combined string
 * Used when multiple dosage table records need to be combined
 * 
 * @param {Array<Object>} dosageRecords - Array of dosage table records
 * @returns {string} Combined dosage string
 */
function formatMultipleDosages(dosageRecords) {
  if (!Array.isArray(dosageRecords) || dosageRecords.length === 0) {
    return '';
  }

  const allDosages = [];
  
  for (const record of dosageRecords) {
    const dosages = convertDosageTableRow(record);
    allDosages.push(...dosages);
  }

  // Limit to 3 components (based on table structure)
  const limitedDosages = allDosages.slice(0, 3);
  
  return formatDosage(limitedDosages);
}

module.exports = {
  parseDosage,
  formatDosage,
  isValidParsedDosage,
  parseSingleDosage, // Exported for testing
  convertDosageTableRow,
  reconstructDrugDosageString,
  canReconstructDosage,
  formatMultipleDosages
};
