# Route Options and Dosage Options Setup Guide

This document describes the implementation of the Route Options and Dosage Options features.

## Overview

Two new database tables have been created:
- `routeoptions` - Stores route administration options for medications
- `dosageoptions` - Stores dosage form options and their properties

## Database Tables

### routeoptions Table Structure
```sql
RouteOptionId INT PRIMARY KEY AUTO_INCREMENT
Acronym VARCHAR(50)
Route VARCHAR(200)
Category VARCHAR(100)
SoloMultiple VARCHAR(50)
MultipleOption TEXT
CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
UpdatedDate DATETIME
CreatedBy INT
UpdatedBy INT
```

### dosageoptions Table Structure
```sql
DosageOptionId INT PRIMARY KEY AUTO_INCREMENT
DosageFormClean VARCHAR(500)
PhysicalState VARCHAR(100)
SubstitutionRelationship VARCHAR(200)
CreatedDate DATETIME DEFAULT CURRENT_TIMESTAMP
UpdatedDate DATETIME
CreatedBy INT
UpdatedBy INT
```

## Installation & Setup

### Step 1: Install Required Dependencies

Make sure you have the `csv-parser` package installed:

```bash
npm install csv-parser
```

### Step 2: Run the Database Setup Script

Run the script to create tables and populate them with data from CSV files:

```bash
node scripts/createRouteAndDosageOptions.js
```

This script will:
1. Create the `routeoptions` table
2. Create the `dosageoptions` table
3. Read data from `src/data/routeOptions.csv`
4. Read data from `src/data/dosageOptions.csv`
5. Populate both tables with the CSV data

## API Endpoints

### Route Options API

Base URL: `/routeOptions`

#### Get All Route Options
```
GET /routeOptions
```
Returns all route options ordered by route name.

#### Get Route Option by ID
```
GET /routeOptions/:RouteOptionId
```
Returns a specific route option by ID.

#### Search Route Options
```
GET /routeOptions/search?search=<term>
```
Search route options by acronym, route name, or category.

#### Add New Route Option
```
POST /routeOptions/add
```
Request Body:
```json
{
  "Acronym": "IV",
  "Route": "Intravenous",
  "Category": "Parenteral",
  "SoloMultiple": "Multiple",
  "MultipleOption": "with other parenteral",
  "CreatedBy": 1
}
```

#### Update Route Option
```
PUT /routeOptions/:RouteOptionId
```
Request Body:
```json
{
  "Route": "Intravenous (updated)",
  "UpdatedBy": 1
}
```

#### Delete Route Option
```
DELETE /routeOptions/:RouteOptionId
```

---

### Dosage Options API

Base URL: `/dosageOptions`

#### Get All Dosage Options
```
GET /dosageOptions
```
Returns all dosage options ordered by dosage form name.

#### Get Dosage Option by ID
```
GET /dosageOptions/:DosageOptionId
```
Returns a specific dosage option by ID.

#### Search Dosage Options
```
GET /dosageOptions/search?search=<term>
```
Search dosage options by dosage form, physical state, or substitution relationship.

#### Add New Dosage Option
```
POST /dosageOptions/add
```
Request Body:
```json
{
  "DosageFormClean": "Tablet",
  "PhysicalState": "Solid",
  "SubstitutionRelationship": "S1S2S7",
  "CreatedBy": 1
}
```

#### Update Dosage Option
```
PUT /dosageOptions/:DosageOptionId
```
Request Body:
```json
{
  "DosageFormClean": "Tablet, coated",
  "UpdatedBy": 1
}
```

#### Delete Dosage Option
```
DELETE /dosageOptions/:DosageOptionId
```

## Project Structure

### Models
- `src/models/routeOption.js` - RouteOption Sequelize model
- `src/models/dosageOption.js` - DosageOption Sequelize model

### Services
- `src/services/routeOptionService.js` - Business logic for route options
- `src/services/dosageOptionService.js` - Business logic for dosage options

### Controllers
- `src/controllers/routeOptionController.js` - HTTP request handlers for route options
- `src/controllers/dosageOptionController.js` - HTTP request handlers for dosage options

### Routes
- `src/routes/routeOptionRoutes.js` - Route definitions for route options API
- `src/routes/dosageOptionRoutes.js` - Route definitions for dosage options API

### Scripts
- `scripts/createRouteAndDosageOptions.js` - Database setup and data population script

### Data Files
- `src/data/routeOptions.csv` - Source data for route options (48 records)
- `src/data/dosageOptions.csv` - Source data for dosage options (90 records)

## Testing the APIs

You can test the APIs using:
- Swagger UI at `/api-docs`
- Postman or similar API testing tools
- cURL commands

### Example cURL Commands

Get all route options:
```bash
curl http://localhost:8066/routeOptions
```

Search for route options:
```bash
curl "http://localhost:8066/routeOptions/search?search=oral"
```

Get all dosage options:
```bash
curl http://localhost:8066/dosageOptions
```

Search for dosage options:
```bash
curl "http://localhost:8066/dosageOptions/search?search=tablet"
```

## Notes

- The CSV files contain the source data. The `routeOptions.csv` has a typo in the header ("Catgeory" instead of "Category") which is handled in the script.
- Both tables include audit fields (CreatedDate, UpdatedDate, CreatedBy, UpdatedBy) for tracking changes.
- The search functionality uses SQL LIKE queries for flexible matching across multiple fields.
- All routes are documented with Swagger annotations and will appear in the API documentation.

## Troubleshooting

If you encounter any issues:

1. **Database Connection Error**: Ensure your database configuration in `config/databasePharmacy.js` is correct.
2. **CSV Reading Error**: Verify that the CSV files exist at `src/data/routeOptions.csv` and `src/data/dosageOptions.csv`.
3. **Duplicate Data**: If you need to re-run the script, first drop or truncate the tables to avoid duplicate entries.

To drop tables and start fresh:
```sql
DROP TABLE IF EXISTS routeoptions;
DROP TABLE IF EXISTS dosageoptions;
```

Then re-run the setup script.
