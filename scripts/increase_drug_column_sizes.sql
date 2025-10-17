-- SQL script to increase column sizes in drug table to accommodate TBFMED.csv data
-- Run this before executing the fill_missing_drugs_from_csv.py script

USE ommal_medapiv2;

-- Increase ATCRelatedIngredient from 255 to 500 chars (current max: 453)
ALTER TABLE drug MODIFY COLUMN ATCRelatedIngredient VARCHAR(500);

-- Increase other columns that might be close to limits
ALTER TABLE drug MODIFY COLUMN DrugName VARCHAR(150); -- current max: 102, increase from default
ALTER TABLE drug MODIFY COLUMN Form VARCHAR(150); -- current max: 114, increase from default  
ALTER TABLE drug MODIFY COLUMN Presentation VARCHAR(150); -- current max: 127, increase from default
ALTER TABLE drug MODIFY COLUMN RouteLNDI VARCHAR(100); -- current max: 91, increase from default
ALTER TABLE drug MODIFY COLUMN Manufacturer VARCHAR(300); -- current max: 255, increase slightly
ALTER TABLE drug MODIFY COLUMN Agent VARCHAR(100); -- current max: 43, increase from default
ALTER TABLE drug MODIFY COLUMN FormLNDI VARCHAR(100); -- current max: 59, increase from default
ALTER TABLE drug MODIFY COLUMN PresentationLNDI VARCHAR(100); -- current max: 54, increase from default
ALTER TABLE drug MODIFY COLUMN Country VARCHAR(50); -- current max: 20, increase from default
ALTER TABLE drug MODIFY COLUMN Dosage VARCHAR(50); -- current max: 32, increase from default

-- Show the updated column definitions
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ommal_medapiv2' 
    AND TABLE_NAME = 'drug' 
    AND COLUMN_NAME IN (
        'ATCRelatedIngredient', 'DrugName', 'Form', 'Presentation', 
        'RouteLNDI', 'Manufacturer', 'Agent', 'FormLNDI', 
        'PresentationLNDI', 'Country', 'Dosage'
    )
ORDER BY COLUMN_NAME;