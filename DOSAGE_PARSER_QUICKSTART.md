# Dosage Parser - Quick Start

## What This Does
Parses free-text dosage strings like "100mg/5ml" or "2.5mg + 50mg" into structured database fields that support decimal values.

## Quick Setup (5 minutes)

### 1. Run SQL Migration
```bash
mysql -u username -p ommal_medapiv2 < sql/migrate_dosage_to_decimal.sql
```
✓ Changes dosage table INT fields to DECIMAL(10,4)

### 2. Test the Parser
```bash
node tests/dosageParser.test.js
```
✓ Should show: "48 Passed: 48, Failed: 0"

### 3. Dry Run
```bash
node scripts/migrateDosageData.js --dry-run --limit=50 --verbose
```
✓ Preview parsing results without changing database

### 4. Run Migration
```bash
node scripts/migrateDosageData.js --verbose
```
✓ Populates dosage table for all drugs

### 5. Verify
```sql
SELECT d.GenericEn, d.Dosage, dos.Numerator1, dos.Numerator1Unit, dos.Denominator1, dos.Denominator1Unit
FROM drug d
JOIN dosage dos ON d.DrugID = dos.DrugId
LIMIT 10;
```

## Supported Formats

| Input | Parsed As |
|-------|-----------|
| `500mg` | 500 mg, no denominator |
| `100mg/5ml` | 100 mg per 5 ml |
| `50mg/ml` | 50 mg per 1 ml (implicit) |
| `2.5mg` | 2.5 mg (decimal support) |
| `2%` | 2%, no denominator |
| `1440 ELISA units/ml` | 1440 ELISA units per 1 ml |
| `50,000IU` | 50000 IU |
| `0.1mg/g + 2.5mg + 50mg` | 3 ingredients |

## Files Created

```
sql/migrate_dosage_to_decimal.sql          ← Run first
src/utils/dosageParser.js                   ← Core parser
scripts/migrateDosageData.js                ← Migration script
tests/dosageParser.test.js                  ← Tests
docs/dosage-parser-migration-guide.md       ← Full documentation
```

## Usage in Code

```javascript
const { parseDosage } = require('./src/utils/dosageParser');

const result = parseDosage('100mg/5ml');
// [{numerator: 100, numeratorUnit: 'mg', denominator: 5, denominatorUnit: 'ml'}]
```

## Common Issues

**Issue:** Tests fail  
**Fix:** Check Node.js version, ensure all dependencies installed

**Issue:** Migration fails  
**Fix:** Verify SQL migration ran first, check database connection

**Issue:** Some dosages not parsed  
**Fix:** Check `failed_dosage_migrations.json` for patterns

## Next Steps

- Review full documentation: [docs/dosage-parser-migration-guide.md](docs/dosage-parser-migration-guide.md)
- Check failed parsings: `cat failed_dosage_migrations.json`
- Integrate with existing APIs using `drugService.getDosageByDrugId()`

---

Need help? See [dosage-parser-migration-guide.md](dosage-parser-migration-guide.md) for detailed troubleshooting.
