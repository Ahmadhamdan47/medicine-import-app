// src/services/drugUpdateService.js
// Correctly import sequelize instance (databasePharmacy exports the instance directly)
const sequelize = require('../../config/databasePharmacy');
const path = require('path');
const fs = require('fs').promises;
const csv = require('csv-parser');
const { createReadStream, createWriteStream } = require('fs');
const { Op } = require('sequelize');
const { execFile } = require('child_process');

class DrugUpdateService {
    constructor() {
        this.sessionId = null;
        this.backupTableName = null;
        this.workingTableName = null;
        this.userColumnMapping = null; // User-defined column mapping
        this.commitPerformed = false; // Track whether commit has been executed
        
        // Default CSV header mapping to database columns (fallback)
        this.defaultHeaderMapping = {
            'Code': 'MoPHCode',
            'Registration number': 'RegistrationNumber', 
            'Brand name': 'DrugName',
            'Strength': 'Dosage',
            'Presentation': 'Presentation',
            'Form': 'Form',
            'Agent': 'Agent',
            'Manufacturer': 'Manufacturer',
            'Country': 'Country',
            'Public Price LL': 'PublicPrice', // Will be converted from LBP to USD
            'Pharmacist Margin': 'PharmacistMargin', // Custom field if exists
            'Stratum': 'Stratum',
            'public price Decision 119/1 20230126': 'PriceDecision119', // Custom field if exists
            'Responsible Party Name': 'ResponsiblePartyName', // Custom field if exists
            'Responsible Party Country': 'ResponsiblePartyCountry', // Custom field if exists
            'Exch_Dates': 'ExchangeDates' // Custom field if exists
        };
        
        // Exchange rate: 1 USD = 89500 LBP
        this.LBP_TO_USD_RATE = 89500;
        
        // Columns that should be treated as currency conversion from LBP to USD
        this.currencyColumns = ['Public Price LL', 'PublicPrice LL', 'Price LL'];
    }

    /**
     * Initialize a new update session
     */
    async initializeSession() {
        this.sessionId = `drug_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.backupTableName = `drug_backup_${this.sessionId}`;
        this.workingTableName = `drug_working_${this.sessionId}`;
        
        return {
            sessionId: this.sessionId,
            backupTable: this.backupTableName,
            workingTable: this.workingTableName
        };
    }

    /**
     * Set user-defined column mapping
     */
    setColumnMapping(userMapping) {
        this.userColumnMapping = userMapping;
        return {
            success: true,
            mappingCount: Object.keys(userMapping).length,
            mapping: userMapping
        };
    }

    /**
     * Get current column mapping (user-defined or default)
     */
    getCurrentMapping() {
        return this.userColumnMapping || this.defaultHeaderMapping;
    }

    /**
     * Analyze CSV file and return headers for user mapping
     */
    async analyzeCSVForMapping(filePath, delimiter = '\t') {
        return new Promise((resolve, reject) => {
            const stream = createReadStream(filePath)
                .pipe(csv({
                    separator: delimiter,
                    skipEmptyLines: true,
                    trim: true
                }));

            let headers = null;
            let sampleData = [];
            let rowCount = 0;
            
            stream.on('data', (data) => {
                if (!headers) {
                    headers = Object.keys(data);
                }
                
                if (rowCount < 3) { // Get first 3 rows as sample
                    sampleData.push(data);
                }
                rowCount++;
                
                if (rowCount >= 3) {
                    stream.destroy(); // Stop after getting sample
                }
            });

            stream.on('close', async () => {
                try {
                    // Get available database columns
                    const dbColumns = await this.getTableColumns();
                    const availableDbColumns = Object.keys(dbColumns);
                    
                    // Suggest mappings based on default mapping
                    const suggestedMappings = {};
                    const unmappedHeaders = [];
                    
                    headers.forEach(header => {
                        const trimmedHeader = header.trim();
                        const defaultMapping = this.defaultHeaderMapping[trimmedHeader];
                        
                        if (defaultMapping && availableDbColumns.includes(defaultMapping)) {
                            suggestedMappings[trimmedHeader] = defaultMapping;
                        } else if (availableDbColumns.includes(trimmedHeader)) {
                            // Direct match with database column
                            suggestedMappings[trimmedHeader] = trimmedHeader;
                        } else {
                            unmappedHeaders.push(trimmedHeader);
                        }
                    });

                    resolve({
                        headers: headers,
                        sampleData: sampleData,
                        rowCount: rowCount,
                        availableDbColumns: availableDbColumns,
                        suggestedMappings: suggestedMappings,
                        unmappedHeaders: unmappedHeaders,
                        currencyColumns: this.currencyColumns,
                        exchangeRate: this.LBP_TO_USD_RATE
                    });
                } catch (error) {
                    reject(error);
                }
            });

            stream.on('error', reject);
        });
    }

    /**
     * Normalize CSV headers to database column names using current mapping
     */
    normalizeHeaders(rawHeaders) {
        const normalizedHeaders = {};
        const currentMapping = this.getCurrentMapping();
        
        Object.keys(rawHeaders).forEach(rawHeader => {
            const trimmedHeader = rawHeader.trim();
            const mappedColumn = currentMapping[trimmedHeader];
            
            if (mappedColumn) {
                normalizedHeaders[mappedColumn] = rawHeaders[rawHeader];
            } else {
                // Keep unmapped headers as-is for potential direct database column matches
                normalizedHeaders[trimmedHeader] = rawHeaders[rawHeader];
            }
        });
        
        return normalizedHeaders;
    }

    /**
     * Process and clean data values with type conversions
     */
    processDataValue(columnName, value, originalColumnName) {
        if (!value || value === '') return null;
        
        const cleanValue = value.toString().trim();
        
        // Check if this column should be converted from LBP to USD
        const shouldConvertCurrency = this.currencyColumns.includes(originalColumnName) || 
                                    (columnName === 'PublicPrice' && this.currencyColumns.includes(originalColumnName));
        
        // Handle specific column types
        switch (columnName) {
            case 'MoPHCode':
                return parseInt(cleanValue) || 0;
                
            case 'PublicPrice':
            case 'Price':
            case 'PriceForeign':
                if (shouldConvertCurrency) {
                    const lbpPrice = parseFloat(cleanValue) || 0;
                    return lbpPrice / this.LBP_TO_USD_RATE;
                }
                return parseFloat(cleanValue) || 0.0;
                
            case 'NotMarketed':
            case 'isOTC':
            case 'isScored':
            case 'HospPricing':
            case 'Substitutable':
                return parseInt(cleanValue) || 0;
                
            case 'SubsidyPercentage':
                return parseFloat(cleanValue) || 0.0;
                
            default:
                return cleanValue || '';
        }
    }

    /**
     * Read and parse CSV file with header normalization
     */
    async parseCsvFile(filePath, delimiter = '\t') {
        return new Promise((resolve, reject) => {
            const results = [];
            const stream = createReadStream(filePath)
                .pipe(csv({
                    separator: delimiter,
                    skipEmptyLines: true,
                    trim: true
                }));

            stream.on('data', (rawData) => {
                // Normalize headers first
                const normalizedData = this.normalizeHeaders(rawData);
                
                // Process and clean data values
                const cleanedData = {};
                Object.keys(normalizedData).forEach(columnName => {
                    // Find the original column name for currency conversion logic
                    const currentMapping = this.getCurrentMapping() || {};
                    // Safely attempt to resolve the original header that mapped to this column
                    let originalColumnName = Object.keys(rawData).find(rawKey => {
                        const trimmed = rawKey.trim();
                        return currentMapping[trimmed] === columnName || trimmed === columnName;
                    });
                    // Fallback: if not found and columnName itself exists in rawData keys (case-insensitive)
                    if (!originalColumnName) {
                        originalColumnName = Object.keys(rawData).find(k => k.trim().toLowerCase() === columnName.toLowerCase());
                    }
                    
                    const processedValue = this.processDataValue(
                        columnName, 
                        normalizedData[columnName], 
                        originalColumnName?.trim()
                    );
                    
                    cleanedData[columnName] = processedValue;
                });
                
                results.push(cleanedData);
            });

            stream.on('end', () => resolve(results));
            stream.on('error', reject);
        });
    }

    /**
     * Create backup of the current drug table
     */
    async createBackup() {
        if (!this.sessionId) {
            throw new Error('Session not initialized. Call initializeSession() first.');
        }

        const transaction = await sequelize.transaction();
        
        try {
            // Create a physical backup file on disk before any changes
            const backupInfo = await this._createPhysicalBackupFile('pre-preview');
            console.info('[DrugUpdateService] Physical backup (pre-preview) created:', backupInfo);

            // Create backup table with same structure as drug table
            await sequelize.query(`CREATE TABLE ${this.backupTableName} LIKE drug`, {
                transaction
            });

            // Copy all data to backup
            await sequelize.query(`INSERT INTO ${this.backupTableName} SELECT * FROM drug`, {
                transaction
            });

            // Get record count for verification
            const [countResult] = await sequelize.query(
                `SELECT COUNT(*) as count FROM ${this.backupTableName}`,
                { transaction }
            );

            await transaction.commit();

            return {
                success: true,
                backupTable: this.backupTableName,
                recordCount: countResult[0].count,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to create backup: ${error.message}`);
        }
    }

    /**
     * Create working copy from backup for applying changes
     */
    async createWorkingCopy() {
        if (!this.backupTableName) {
            throw new Error('Backup not created. Call createBackup() first.');
        }

        const transaction = await sequelize.transaction();
        
        try {
            // Create working table from backup
            await sequelize.query(`CREATE TABLE ${this.workingTableName} LIKE ${this.backupTableName}`, {
                transaction
            });

            await sequelize.query(`INSERT INTO ${this.workingTableName} SELECT * FROM ${this.backupTableName}`, {
                transaction
            });

            await transaction.commit();

            return {
                success: true,
                workingTable: this.workingTableName,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to create working copy: ${error.message}`);
        }
    }

    /**
     * Get column information for the drug table
     */
    async getTableColumns() {
        const [columns] = await sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'drug' AND TABLE_SCHEMA = DATABASE()
            ORDER BY ORDINAL_POSITION
        `);

        return columns.reduce((acc, col) => {
            acc[col.COLUMN_NAME] = {
                dataType: col.DATA_TYPE,
                maxLength: col.CHARACTER_MAXIMUM_LENGTH,
                nullable: col.IS_NULLABLE === 'YES'
            };
            return acc;
        }, {});
    }

    /**
     * Preview changes that would be made by CSV data
     */
    async previewChanges(csvData) {
        if (!csvData || !Array.isArray(csvData)) {
            throw new Error('Invalid CSV data provided');
        }

        const transaction = await sequelize.transaction();
        
        try {
            // Get current data from backup table
            const [currentData] = await sequelize.query(
                `SELECT * FROM ${this.backupTableName}`,
                { transaction }
            );

            // Create lookup map for current data
            const currentDataMap = {};
            currentData.forEach(row => {
                currentDataMap[row.MoPHCode] = row;
            });

            // Get column information for validation
            const columnInfo = await this.getTableColumns();

            // Analyze changes
            const changes = {
                updates: [],
                inserts: [],
                errors: [],
                skippedColumns: new Set() // Track columns that don't exist in DB
            };

            csvData.forEach((csvRow, index) => {
                const rowNumber = index + 1;
                
                // Validate MoPHCode
                if (!csvRow.MoPHCode || csvRow.MoPHCode === 0) {
                    changes.errors.push({
                        row: rowNumber,
                        error: 'Missing or invalid MoPHCode',
                        data: csvRow
                    });
                    return;
                }

                // Filter out columns that don't exist in database
                const validCsvRow = {};
                Object.keys(csvRow).forEach(column => {
                    if (columnInfo[column]) {
                        validCsvRow[column] = csvRow[column];
                    } else {
                        changes.skippedColumns.add(column);
                    }
                });

                // Check if record exists
                const existingRecord = currentDataMap[csvRow.MoPHCode];
                
                if (existingRecord) {
                    // Check for updates
                    const updates = {};
                    Object.keys(validCsvRow).forEach(column => {
                        if (column === 'MoPHCode') return; // Skip primary key
                        
                        const newValue = validCsvRow[column];
                        const currentValue = existingRecord[column];
                        
                        // Compare values (handle type conversions and null values)
                        let valuesAreDifferent = false;
                        
                        if (typeof newValue === 'number' && typeof currentValue === 'number') {
                            valuesAreDifferent = Math.abs(newValue - currentValue) > 0.000001;
                        } else {
                            // Handle null/empty comparisons
                            const newStr = newValue === null || newValue === undefined ? '' : String(newValue);
                            const currentStr = currentValue === null || currentValue === undefined ? '' : String(currentValue);
                            valuesAreDifferent = newStr !== currentStr;
                        }
                        
                        if (valuesAreDifferent) {
                            updates[column] = {
                                from: currentValue,
                                to: newValue
                            };
                        }
                    });

                    if (Object.keys(updates).length > 0) {
                        changes.updates.push({
                            MoPHCode: csvRow.MoPHCode,
                            changes: updates
                        });
                    }
                } else {
                    // New record to insert - only include valid columns
                    changes.inserts.push(validCsvRow);
                }
            });

            await transaction.commit();

            return {
                summary: {
                    totalRows: csvData.length,
                    updates: changes.updates.length,
                    inserts: changes.inserts.length,
                    errors: changes.errors.length,
                    skippedColumns: Array.from(changes.skippedColumns)
                },
                details: changes
            };
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to preview changes: ${error.message}`);
        }
    }

    /**
     * Apply changes to the working table
     */
    async applyChangesToWorkingTable(csvData) {
        if (!this.workingTableName) {
            throw new Error('Working table not created. Call createWorkingCopy() first.');
        }

        const transaction = await sequelize.transaction();
        
        try {
            const columnInfo = await this.getTableColumns();
            let updatedCount = 0;
            let insertedCount = 0;
            let skippedColumnsGlobal = new Set();

            for (const csvRow of csvData) {
                if (!csvRow.MoPHCode || csvRow.MoPHCode === 0) {
                    continue; // Skip invalid rows
                }

                // Filter out columns that don't exist in database
                const validCsvRow = {};
                Object.keys(csvRow).forEach(column => {
                    if (columnInfo[column]) {
                        validCsvRow[column] = csvRow[column];
                    } else {
                        skippedColumnsGlobal.add(column);
                    }
                });

                // Check if record exists in working table
                const [existingRecords] = await sequelize.query(
                    `SELECT MoPHCode FROM ${this.workingTableName} WHERE MoPHCode = ?`,
                    {
                        replacements: [csvRow.MoPHCode],
                        transaction
                    }
                );

                if (existingRecords.length > 0) {
                    // Update existing record - only update columns that exist in DB
                    const updateParts = [];
                    const updateValues = [];
                    
                    Object.keys(validCsvRow).forEach(column => {
                        if (column === 'MoPHCode') return; // Skip primary key
                        if (columnInfo[column]) {
                            updateParts.push(`${column} = ?`);
                            updateValues.push(validCsvRow[column]);
                        }
                    });

                    if (updateParts.length > 0) {
                        updateValues.push(csvRow.MoPHCode);
                        await sequelize.query(
                            `UPDATE ${this.workingTableName} SET ${updateParts.join(', ')} WHERE MoPHCode = ?`,
                            {
                                replacements: updateValues,
                                transaction
                            }
                        );
                        updatedCount++;
                    }
                } else {
                    // Insert new record - only insert valid columns
                    const columns = Object.keys(validCsvRow).filter(col => columnInfo[col]);
                    
                    if (columns.length > 0) {
                        const placeholders = columns.map(() => '?').join(', ');
                        const values = columns.map(col => validCsvRow[col]);
                        
                        await sequelize.query(
                            `INSERT INTO ${this.workingTableName} (${columns.join(', ')}) VALUES (${placeholders})`,
                            {
                                replacements: values,
                                transaction
                            }
                        );
                        insertedCount++;
                    }
                }
            }

            await transaction.commit();

            return {
                success: true,
                updatedCount,
                insertedCount,
                totalProcessed: updatedCount + insertedCount,
                skippedColumns: Array.from(skippedColumnsGlobal),
                message: skippedColumnsGlobal.size > 0 
                    ? `Note: Skipped ${skippedColumnsGlobal.size} columns that don't exist in database: ${Array.from(skippedColumnsGlobal).join(', ')}`
                    : 'All CSV columns were successfully mapped to database columns'
            };
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to apply changes: ${error.message}`);
        }
    }

    /**
     * Compare working table with original to show final changes
     */
    async getFinalChanges() {
        if (!this.workingTableName || !this.backupTableName) {
            throw new Error('Tables not ready for comparison');
        }
        // MySQL/MariaDB do not support FULL OUTER JOIN, so we emulate it using UNION of LEFT/RIGHT joins
        // Also use DrugName (actual column) instead of BrandName
        const [rows] = await sequelize.query(`
            (
                SELECT 
                    w.MoPHCode AS MoPHCode,
                    'INSERT' AS ChangeType,
                    NULL AS Original_DrugName,
                    w.DrugName AS New_DrugName,
                    NULL AS Original_PublicPrice,
                    w.PublicPrice AS New_PublicPrice,
                    NULL AS Original_NotMarketed,
                    w.NotMarketed AS New_NotMarketed
                FROM ${this.workingTableName} w
                LEFT JOIN ${this.backupTableName} b ON w.MoPHCode = b.MoPHCode
                WHERE b.MoPHCode IS NULL
            )
            UNION ALL
            (
                SELECT 
                    b.MoPHCode AS MoPHCode,
                    'DELETE' AS ChangeType,
                    b.DrugName AS Original_DrugName,
                    NULL AS New_DrugName,
                    b.PublicPrice AS Original_PublicPrice,
                    NULL AS New_PublicPrice,
                    b.NotMarketed AS Original_NotMarketed,
                    NULL AS New_NotMarketed
                FROM ${this.backupTableName} b
                LEFT JOIN ${this.workingTableName} w ON w.MoPHCode = b.MoPHCode
                WHERE w.MoPHCode IS NULL
            )
            UNION ALL
            (
                SELECT 
                    w.MoPHCode AS MoPHCode,
                    'UPDATE' AS ChangeType,
                    b.DrugName AS Original_DrugName,
                    w.DrugName AS New_DrugName,
                    b.PublicPrice AS Original_PublicPrice,
                    w.PublicPrice AS New_PublicPrice,
                    b.NotMarketed AS Original_NotMarketed,
                    w.NotMarketed AS New_NotMarketed
                FROM ${this.workingTableName} w
                INNER JOIN ${this.backupTableName} b ON w.MoPHCode = b.MoPHCode
                WHERE (
                    ( (w.DrugName IS NULL AND b.DrugName IS NOT NULL) OR (w.DrugName IS NOT NULL AND b.DrugName IS NULL) OR w.DrugName != b.DrugName )
                    OR ABS(IFNULL(w.PublicPrice,0) - IFNULL(b.PublicPrice,0)) > 0.000001
                    OR IFNULL(w.NotMarketed,'') != IFNULL(b.NotMarketed,'')
                )
            )
            ORDER BY MoPHCode;
        `);

        return rows;
    }

    /**
     * Commit changes - replace original drug table with working table
     */
    async commitChanges() {
        if (!this.workingTableName) {
            throw new Error('No working table to commit');
        }

        const transaction = await sequelize.transaction();
        
        try {
            // Create a physical backup file of the current live table just before commit
            const backupInfo = await this._createPhysicalBackupFile('pre-commit');
            console.info('[DrugUpdateService] Physical backup (pre-commit) created:', backupInfo);

            // Rename tables atomically
            const tempTableName = `drug_old_${this.sessionId}`;
            
            await sequelize.query(`RENAME TABLE drug TO ${tempTableName}`, { transaction });
            await sequelize.query(`RENAME TABLE ${this.workingTableName} TO drug`, { transaction });
            
            // Drop the old table
            await sequelize.query(`DROP TABLE ${tempTableName}`, { transaction });

            await transaction.commit();

            // Mark commit as performed so rollback logic knows state
            this.commitPerformed = true;

            return {
                success: true,
                message: 'Changes committed successfully',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to commit changes: ${error.message}`);
        }
    }

    /**
     * Rollback changes:
     * If commit has NOT been performed yet, the original `drug` table is untouched.
     * In that case we only need to drop the working and backup tables and reset session state.
     * If commit WAS performed, we cannot safely rollback (renaming the live table with FK constraints may fail).
     * We return an explicit error in that scenario to avoid destructive operations.
     */
    async rollbackChanges() {
        // If commit already executed, disallow rollback to prevent FK issues
        if (this.commitPerformed) {
            throw new Error('Cannot rollback after commit has been performed');
        }

        // Pre-commit rollback: just drop session tables
        const transaction = await sequelize.transaction();
        try {
            if (this.workingTableName) {
                await sequelize.query(`DROP TABLE IF EXISTS ${this.workingTableName}`, { transaction });
            }
            if (this.backupTableName) {
                await sequelize.query(`DROP TABLE IF EXISTS ${this.backupTableName}`, { transaction });
            }

            await transaction.commit();

            // Reset session state
            this.sessionId = null;
            this.backupTableName = null;
            this.workingTableName = null;
            this.userColumnMapping = null;

            return {
                success: true,
                message: 'Rollback successful (session tables dropped; original table untouched)',
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to rollback changes: ${error.message}`);
        }
    }

    /**
     * Clean up session tables
     */
    async cleanupSession() {
        const transaction = await sequelize.transaction();
        
        try {
            const tablesToDrop = [];
            
            if (this.backupTableName) {
                tablesToDrop.push(this.backupTableName);
            }
            if (this.workingTableName) {
                tablesToDrop.push(this.workingTableName);
            }

            for (const tableName of tablesToDrop) {
                try {
                    await sequelize.query(`DROP TABLE IF EXISTS ${tableName}`, { transaction });
                } catch (error) {
                    // Continue cleanup even if some tables don't exist
                    console.warn(`Failed to drop table ${tableName}:`, error.message);
                }
            }

            await transaction.commit();

            // Reset session
            this.sessionId = null;
            this.backupTableName = null;
            this.workingTableName = null;

            return {
                success: true,
                message: 'Session cleaned up successfully'
            };
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to cleanup session: ${error.message}`);
        }
    }

    /**
     * Create a physical SQL dump of the live 'drug' table into the local db/ folder.
     * The file name includes timestamp and session id for traceability.
     */
    async _createPhysicalBackupFile(label = 'auto') {
        try {
            // Resolve output directory under project root (two levels up from src/services)
            // __dirname => <project>/src/services, so ../../ => <project>
            const projectRoot = path.resolve(__dirname, '../../');
            const backupsDir = path.join(projectRoot, 'db');
            await fs.mkdir(backupsDir, { recursive: true });

            const ts = new Date();
            const stamp = [
                ts.getFullYear(),
                String(ts.getMonth() + 1).padStart(2, '0'),
                String(ts.getDate()).padStart(2, '0'),
                '-'
            ].join('') +
            [
                String(ts.getHours()).padStart(2, '0'),
                String(ts.getMinutes()).padStart(2, '0'),
                String(ts.getSeconds()).padStart(2, '0')
            ].join('');

            const safeSession = this.sessionId || 'no_session';
            const fileName = `drug_table_backup_${label}_${stamp}_${safeSession}.sql`;
            const outputPath = path.join(backupsDir, fileName);

            // Extract connection details from sequelize instance
            const cfg = sequelize.config || {};
            const connection = {
                host: cfg.host || '127.0.0.1',
                user: cfg.username || cfg.user || 'root',
                password: cfg.password || '',
                database: cfg.database,
                port: cfg.port || 3306
            };

            if (!connection.database) {
                throw new Error('Database name not found in sequelize config');
            }

            // Try Node library first, then fallback to CLI tool, then JSON export
            try {
                const mysqldump = require('mysqldump');
                await mysqldump.dump({
                    connection,
                    dumpToFile: outputPath,
                    tables: ['drug']
                });
                return { success: true, file: outputPath, method: 'node-lib' };
            } catch (libErr) {
                try {
                    await new Promise((resolve, reject) => {
                        const args = [];
                        if (connection.host) args.push('-h', connection.host);
                        if (connection.port) args.push('-P', String(connection.port));
                        if (connection.user) args.push('-u', connection.user);
                        if (typeof connection.password === 'string' && connection.password.length > 0) {
                            args.push(`-p${connection.password}`);
                        }
                        args.push('--result-file', outputPath, connection.database, 'drug');

                        execFile('mysqldump', args, { windowsHide: true }, (error, stdout, stderr) => {
                            if (error) {
                                const hint = error.code === 'ENOENT'
                                    ? 'mysqldump CLI not found in PATH. Install MySQL client tools or add mysqldump to PATH.'
                                    : (stderr || error.message);
                                return reject(new Error(`mysqldump CLI failed: ${hint}`));
                            }
                            resolve();
                        });
                    });
                    return { success: true, file: outputPath, method: 'cli' };
                } catch (cliErr) {
                    // Final fallback: create a JSON export of the table contents
                    const jsonPath = outputPath.replace(/\.sql$/i, '.json');
                    await this._exportDrugTableToJson(jsonPath);
                    return { success: true, file: jsonPath, method: 'json-export' };
                }
            }
        } catch (err) {
            // Fail fast: physical backup is required before proceeding
            throw new Error(`Physical backup failed: ${err.message}`);
        }
    }

    /**
     * Fallback physical backup: export the 'drug' table rows to a JSON file in batches.
     */
    async _exportDrugTableToJson(jsonPath) {
        // Count rows
        const [[{ count }]] = await sequelize.query("SELECT COUNT(*) as count FROM drug");
        const total = Number(count) || 0;
        const batchSize = 5000;
        const stream = createWriteStream(jsonPath, { encoding: 'utf8' });

        await new Promise(async (resolve, reject) => {
            stream.on('error', reject);
            stream.write('[\n');
            let written = 0;
            try {
                for (let offset = 0; offset < total; offset += batchSize) {
                    const [rows] = await sequelize.query(`SELECT * FROM drug LIMIT ${batchSize} OFFSET ${offset}`);
                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];
                        const prefix = (written > 0) ? ',\n' : '';
                        stream.write(prefix + JSON.stringify(row));
                        written += 1;
                    }
                }
                stream.write('\n]');
                stream.end(resolve);
            } catch (e) {
                stream.destroy();
                reject(e);
            }
        });
        return { rows: total };
    }

    /**
     * Get available header mappings and database columns
     */
    getHeaderMappingInfo() {
        return {
            defaultMappings: this.defaultHeaderMapping,
            currentMappings: this.getCurrentMapping(),
            isUsingCustomMapping: !!this.userColumnMapping,
            currencyConversion: {
                columns: this.currencyColumns,
                rate: this.LBP_TO_USD_RATE,
                description: 'Lebanese Lira values in these columns are automatically converted to USD'
            },
            instructions: {
                requiredColumn: 'MoPHCode column mapping is required for updates and inserts',
                optionalColumns: 'All other columns are optional. Missing columns will be skipped.',
                headerNormalization: 'Headers can be mapped dynamically by the user or use default mappings.'
            }
        };
    }

    /**
     * Validate column mapping against database schema
     */
    async validateColumnMapping(mapping) {
        try {
            const dbColumns = await this.getTableColumns();
            const availableDbColumns = Object.keys(dbColumns);
            
            const validation = {
                valid: true,
                errors: [],
                warnings: [],
                mappedColumns: {},
                hasRequiredMoPHCode: false
            };

            Object.keys(mapping).forEach(csvColumn => {
                const dbColumn = mapping[csvColumn];
                
                if (dbColumn) {
                    if (availableDbColumns.includes(dbColumn)) {
                        validation.mappedColumns[csvColumn] = dbColumn;
                        if (dbColumn === 'MoPHCode') {
                            validation.hasRequiredMoPHCode = true;
                        }
                    } else {
                        validation.errors.push(`Database column '${dbColumn}' does not exist`);
                        validation.valid = false;
                    }
                } else {
                    validation.warnings.push(`CSV column '${csvColumn}' is not mapped to any database column`);
                }
            });

            if (!validation.hasRequiredMoPHCode) {
                validation.errors.push('Required MoPHCode column mapping is missing');
                validation.valid = false;
            }

            return validation;
        } catch (error) {
            return {
                valid: false,
                errors: [`Failed to validate mapping: ${error.message}`],
                warnings: [],
                mappedColumns: {},
                hasRequiredMoPHCode: false
            };
        }
    }

    /**
     * Validate CSV headers against available mappings
     */
    async validateCsvHeaders(csvFilePath, delimiter = '\t') {
        return new Promise((resolve, reject) => {
            const stream = createReadStream(csvFilePath)
                .pipe(csv({
                    separator: delimiter,
                    skipEmptyLines: true,
                    trim: true
                }));

            let headers = null;
            
            stream.on('data', (data) => {
                if (!headers) {
                    headers = Object.keys(data);
                    stream.destroy(); // Stop after reading first row for headers
                }
            });

            stream.on('close', async () => {
                if (headers) {
                    try {
                        const dbColumns = await this.getTableColumns();
                        const currentMapping = this.getCurrentMapping();
                        
                        const validation = {
                            originalHeaders: headers,
                            mappedHeaders: {},
                            unmappedHeaders: [],
                            hasRequiredColumn: false,
                            availableDbColumns: Object.keys(dbColumns),
                            isUsingCustomMapping: !!this.userColumnMapping
                        };

                        headers.forEach(header => {
                            const trimmedHeader = header.trim();
                            const mappedColumn = currentMapping[trimmedHeader];
                            
                            if (mappedColumn) {
                                validation.mappedHeaders[trimmedHeader] = mappedColumn;
                                if (mappedColumn === 'MoPHCode') {
                                    validation.hasRequiredColumn = true;
                                }
                            } else {
                                validation.unmappedHeaders.push(trimmedHeader);
                                // Check if it directly matches a column name
                                if (trimmedHeader === 'MoPHCode') {
                                    validation.hasRequiredColumn = true;
                                }
                            }
                        });

                        resolve(validation);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error('Unable to read CSV headers'));
                }
            });

            stream.on('error', reject);
        });
    }

    /**
     * Get session info
     */
    getSessionInfo() {
        return {
            sessionId: this.sessionId,
            backupTable: this.backupTableName,
            workingTable: this.workingTableName,
            initialized: !!this.sessionId
        };
    }
}

module.exports = DrugUpdateService;