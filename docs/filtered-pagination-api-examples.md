# Filtered Pagination API - Usage Examples

## Endpoint
`GET /api/drugs/paginated-filtered`

## Overview
This API provides flexible filtering capabilities for fetching drugs with pagination. You can filter by any column in the drug table using various filter types.

## Filter Types Supported

### 1. Exact Match
Filter by exact value:
```
?DrugName=Aspirin
?Manufacturer=Pfizer
?MoPHCode=12345
```

### 2. Partial Match (LIKE)
Use wildcards (`*` or `%`) for partial matching:
```
?DrugName=Asp*
?DrugName=%aspirin%
?Manufacturer=*Pharma
```

### 3. Numeric Comparisons
Use operators for numeric fields:
```
?Price=>10           (greater than 10)
?Price=<100          (less than 100)
?Price=>=50          (greater than or equal to 50)
?Price=<=100         (less than or equal to 100)
?Price==25           (equal to 25)

?SubsidyPercentage=>50
?Amount=>=100
```

### 4. Boolean Values
Filter by true/false:
```
?isOTC=true
?NotMarketed=false
?Substitutable=true
?HospPricing=false
```

### 5. Multiple Values (IN operator)
Use comma-separated values:
```
?Form=Tablet,Capsule,Syrup
?ProductType=Brand,Generic
?Country=Lebanon,France,USA
```

## Example API Calls

### Example 1: Get OTC Tablets
```
GET /api/drugs/paginated-filtered?isOTC=true&Form=Tablet&page=1&limit=50
```

### Example 2: Filter by Price Range
```
GET /api/drugs/paginated-filtered?Price=>=10&Price=<=100&page=1&limit=100
```
**Note:** For multiple conditions on the same field, you might need to adjust the backend logic or use a different approach.

### Example 3: Search by Manufacturer with Wildcard
```
GET /api/drugs/paginated-filtered?Manufacturer=*Pharma&page=1&limit=50
```

### Example 4: Filter by Multiple Forms
```
GET /api/drugs/paginated-filtered?Form=Tablet,Capsule&page=1&limit=100
```

### Example 5: Complex Multi-Filter Query
```
GET /api/drugs/paginated-filtered?isOTC=true&Form=Tablet&Substitutable=true&Price=<50&page=1&limit=50
```

### Example 6: Filter by Country and Product Type
```
GET /api/drugs/paginated-filtered?Country=Lebanon&ProductType=Brand&page=1&limit=100
```

### Example 7: Filter by ATC Code
```
GET /api/drugs/paginated-filtered?ATC_Code=N02BE01&page=1&limit=50
```

### Example 8: Filter by Registration Number
```
GET /api/drugs/paginated-filtered?RegistrationNumber=REG12345&page=1
```

### Example 9: Get Drugs with High Subsidy
```
GET /api/drugs/paginated-filtered?SubsidyPercentage=>80&page=1&limit=100
```

### Example 10: Filter by GTIN Barcode
```
GET /api/drugs/paginated-filtered?GTIN=1234567890123&page=1
```

## Available Filter Fields

You can filter by any of these columns:
- `DrugName` - Drug name (English)
- `DrugNameAR` - Drug name (Arabic)
- `ATC_Code` - ATC classification code
- `GTIN` - Global Trade Item Number (barcode)
- `isOTC` - Over-the-counter status (boolean)
- `Form` - Drug form (Tablet, Capsule, etc.)
- `FormLNDI` - Standardized form
- `FormRaw` - Raw form data
- `IsScored` - Scored tablet status (boolean)
- `Presentation` - Presentation description
- `Stratum` - Drug stratum
- `Dosage` - Dosage information
- `Amount` - Amount/quantity
- `Route` - Administration route
- `Parentaral` - Parenteral information
- `RouteParent` - Parent route
- `Agent` - Active ingredient/agent
- `Manufacturer` - Manufacturer name
- `ResponsibleParty` - Responsible party
- `Country` - Country of origin
- `ResponsiblePartyCountry` - Responsible party country
- `RegistrationNumber` - Registration number
- `Notes` - Additional notes
- `Description` - Drug description
- `Indication` - Medical indication
- `Price` - Price in USD
- `SubsidyPercentage` - Subsidy percentage
- `HospPricing` - Hospital pricing (boolean)
- `Substitutable` - Substitutability (boolean)
- `ProductType` - Product type (Brand/Generic)
- `MoPHCode` - Ministry of Public Health code
- `CargoShippingTerms` - Shipping terms

## Response Format

```json
{
  "drugs": [
    {
      "DrugID": 1,
      "DrugName": "Aspirin 100mg",
      "Price": 5.50,
      "priceInLBP": 492250,
      "unitPrice": 0.55,
      "unitPriceInLBP": 49225,
      "Form": "Tablet",
      "Manufacturer": "Bayer",
      "isOTC": true,
      // ... other drug fields
      "Dosages": [...],
      "DrugPresentations": [...]
    }
    // ... more drugs
  ],
  "totalPages": 10,
  "totalCount": 1000,
  "currentPage": 1,
  "filters": {
    "isOTC": "true",
    "Form": "Tablet"
  }
}
```

## Pagination Parameters
- `page` - Page number (default: 1)
- `limit` - Number of items per page (default: 100)

## JavaScript/Axios Example

```javascript
// Example 1: Filter OTC tablets
const response = await axios.get('/api/drugs/paginated-filtered', {
  params: {
    isOTC: true,
    Form: 'Tablet',
    page: 1,
    limit: 50
  }
});

// Example 2: Filter by price range and manufacturer
const response2 = await axios.get('/api/drugs/paginated-filtered', {
  params: {
    Price: '>=10',
    Manufacturer: '*Pharma',
    page: 1,
    limit: 100
  }
});

// Example 3: Multiple forms
const response3 = await axios.get('/api/drugs/paginated-filtered', {
  params: {
    Form: 'Tablet,Capsule,Syrup',
    Country: 'Lebanon',
    page: 1,
    limit: 50
  }
});
```

## Notes

1. **Default Behavior**: By default, drugs where `NotMarketed = true` are excluded from results.

2. **Case Sensitivity**: String filters are case-sensitive by default. Use wildcards for flexible matching.

3. **Multiple Filters**: You can combine multiple filters - they are applied with AND logic.

4. **Empty Values**: Empty or null filter values are ignored.

5. **Numeric Fields**: For numeric comparisons, ensure to use proper operators (>, <, >=, <=, =).

6. **Performance**: Adding more filters generally improves performance by reducing the result set.

7. **Pagination**: Always use pagination for better performance and user experience.

## Testing with cURL

```bash
# Test OTC drugs
curl "http://localhost:3000/api/drugs/paginated-filtered?isOTC=true&page=1&limit=10"

# Test with multiple filters
curl "http://localhost:3000/api/drugs/paginated-filtered?Form=Tablet&isOTC=true&Price=>5&page=1"

# Test with wildcard search
curl "http://localhost:3000/api/drugs/paginated-filtered?DrugName=*aspirin*&page=1"
```
