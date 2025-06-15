-- Create pharmacy_service role
CREATE ROLE pharmacy_service;

-- Grant permissions to pharmacy_service role
GRANT SELECT, INSERT, UPDATE ON medicines TO pharmacy_service;
GRANT SELECT, INSERT, UPDATE ON inventory TO pharmacy_service;
GRANT SELECT, INSERT, UPDATE ON orders TO pharmacy_service;
GRANT SELECT ON suppliers TO pharmacy_service;
GRANT SELECT ON categories TO pharmacy_service;

-- Create test user for pharmacy service
CREATE USER pharmacy_test_user WITH PASSWORD 'password123';

-- Assign role to test user
GRANT pharmacy_service TO pharmacy_test_user;

-- Grant login permission
ALTER USER pharmacy_test_user WITH LOGIN;

-- Display confirmation
SELECT 'Pharmacy service test account created successfully' AS status;
