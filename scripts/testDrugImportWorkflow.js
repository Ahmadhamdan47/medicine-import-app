// scripts/testDrugImportWorkflow.js
// Automated end-to-end test of the interactive drug import workflow without using curl.
// It will:
// 1. Create a sample CSV file
// 2. Call /drug-import/available-columns
// 3. Upload & analyze the file
// 4. Set a mapping
// 5. Preview changes
// 6. Apply changes to working table
// 7. Get final changes
// 8. Rollback (to avoid modifying production data)
// 9. Print a concise summary

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Base configuration
const HOST = process.env.DRUG_IMPORT_HOST || 'http://localhost:8066';
const BASE_URL = `${HOST}/drug-import`;
const SAMPLE_FILE = path.join(__dirname, 'sample-drug-data.csv');

function logSection(title) {
  console.log(`\n=== ${title} ===`);
}

async function createSampleCsv() {
  const content = [
    // Header
    'Code,Registration number,Brand name,Strength,Presentation,Form,Agent,Manufacturer,Country,Public Price LL,Stratum',
    // Rows (Lebanese Lira prices for conversion test)
    '10001,REG-A-2025,Testpara,500mg,Box of 20 tablets,Tablet,Local Agent A,PharmaCorp Lebanon,Lebanon,1790000,A',
    '10002,REG-B-2025,AmoxiPlus,250mg,Box of 12 capsules,Capsule,Import Agent B,EuroPharm,Germany,895000,B',
    '10003,REG-C-2025,InsuPen,100 units/ml,1 pen,Injectable,DiabAgent,Novo Nordisk,Denmark,3580000,C',
    '10004,REG-D-2025,CoughEaze,100ml,1 bottle,Syrup,CoughAgent,Local Meds,Lebanon,268500,A'
  ].join('\n');
  fs.writeFileSync(SAMPLE_FILE, content, 'utf8');
  return SAMPLE_FILE;
}

async function getAvailableColumns() {
  const { data } = await axios.get(`${BASE_URL}/available-columns`);
  return data;
}

async function uploadAndAnalyze(filePath) {
  const form = new FormData();
  form.append('csvFile', fs.createReadStream(filePath));
  const { data } = await axios.post(`${BASE_URL}/upload-analyze`, form, { headers: form.getHeaders() });
  return data;
}

async function setMapping(sessionId, headers, suggestedMappings) {
  // Build mapping: prefer suggested; ensure Code -> MoPHCode and Brand name -> DrugName, Public Price LL -> PublicPrice
  const mapping = {};
  headers.forEach(h => {
    if (suggestedMappings[h]) {
      mapping[h] = suggestedMappings[h];
    } else {
      // Manual picks for key fields
      if (h === 'Code') mapping[h] = 'MoPHCode';
      if (h === 'Brand name') mapping[h] = 'DrugName';
      if (h === 'Strength') mapping[h] = 'Dosage';
      if (h === 'Public Price LL') mapping[h] = 'PublicPrice';
      if (h === 'Form') mapping[h] = 'Form';
      if (h === 'Agent') mapping[h] = 'Agent';
      if (h === 'Manufacturer') mapping[h] = 'Manufacturer';
      if (h === 'Country') mapping[h] = 'Country';
      if (h === 'Presentation') mapping[h] = 'Presentation';
      if (h === 'Stratum') mapping[h] = 'Stratum';
    }
  });
  const { data } = await axios.post(`${BASE_URL}/set-mapping`, { sessionId, columnMapping: mapping });
  return data;
}

async function preview(sessionId) {
  const { data } = await axios.get(`${BASE_URL}/preview/${sessionId}`);
  return data;
}

async function applyChanges(sessionId) {
  const { data } = await axios.post(`${BASE_URL}/apply/${sessionId}`);
  return data;
}

async function finalChanges(sessionId) {
  const { data } = await axios.get(`${BASE_URL}/final-changes/${sessionId}`);
  return data;
}

async function rollback(sessionId) {
  const { data } = await axios.post(`${BASE_URL}/rollback/${sessionId}`);
  return data;
}

async function run() {
  const summary = { steps: [] };
  try {
    logSection('Creating Sample CSV');
    const filePath = await createSampleCsv();
    console.log('File:', filePath);
    summary.steps.push({ step: 'create-sample', success: true });

    logSection('Available Columns');
    const available = await getAvailableColumns();
    console.log('Columns count:', available.availableColumns.length);
    summary.steps.push({ step: 'available-columns', success: true });

    logSection('Upload & Analyze');
    const analysis = await uploadAndAnalyze(filePath);
    console.log('Session ID:', analysis.sessionId);
    console.log('Detected headers:', analysis.analysis.headers);
    summary.sessionId = analysis.sessionId;
    summary.steps.push({ step: 'upload-analyze', success: true });

    logSection('Set Mapping');
    const mappingResult = await setMapping(analysis.sessionId, analysis.analysis.headers, analysis.analysis.suggestedMappings);
    console.log('Mapped columns:', Object.keys(mappingResult.validation.mappedColumns).length);
    if (!mappingResult.validation.hasRequiredMoPHCode) throw new Error('MoPHCode not mapped');
    summary.steps.push({ step: 'set-mapping', success: true });

    logSection('Preview Changes');
    const previewResult = await preview(analysis.sessionId);
    console.log('Rows:', previewResult.preview.summary.totalRows,
                'Updates:', previewResult.preview.summary.updates,
                'Inserts:', previewResult.preview.summary.inserts);
    summary.steps.push({ step: 'preview', success: true });

    logSection('Apply Changes');
    const applyResult = await applyChanges(analysis.sessionId);
    console.log('Updated:', applyResult.result.updatedCount, 'Inserted:', applyResult.result.insertedCount);
    summary.steps.push({ step: 'apply', success: true });

    logSection('Final Changes');
    const finalResult = await finalChanges(analysis.sessionId);
    console.log('Change records:', finalResult.changeCount);
    summary.steps.push({ step: 'final-changes', success: true });

    logSection('Rollback');
    const rollbackResult = await rollback(analysis.sessionId);
    console.log(rollbackResult.message);
    summary.steps.push({ step: 'rollback', success: true });

  } catch (err) {
    console.error('\nERROR:', err.response?.data || err.message);
    summary.error = err.response?.data || err.message;
  } finally {
    logSection('Summary');
    console.table(summary.steps);
    if (summary.error) {
      console.log('Final Status: FAILED');
      console.log('Error Detail:', summary.error);
      process.exitCode = 1;
    } else {
      console.log('Final Status: SUCCESS');
    }
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };
