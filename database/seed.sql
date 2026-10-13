-- Development seed data
-- NOTE: password_hash below is bcrypt hash of "password123"
INSERT INTO users (full_name, mobile, email, password_hash, date_of_birth, gender, city, state, blood_group) VALUES
('Test User', '9876543210', 'test@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '1990-05-15', 'Male', 'Mumbai', 'Maharashtra', 'O+');

INSERT INTO providers (full_name, mobile, email, password_hash, clinic_name, provider_type, city, state) VALUES
('Dr. Ramesh Sharma', '9988776655', 'dr.ramesh@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sharma Clinic', 'healthcare_provider', 'Mumbai', 'Maharashtra');

-- Development hospitals with real-ish coordinate data
INSERT INTO hospitals (hospital_name, address, city, state, pincode, hospital_type, phone, latitude, longitude, pmjay_status, verified_at) VALUES
('City General Hospital', '123 Main St, Andheri West', 'Mumbai', 'Maharashtra', '400053', 'Government', '+91 22 1234 5678', 19.1136, 72.8397, TRUE, NOW()),
('Sunshine Multi-specialty Clinic', '45 Park Avenue, Bandra', 'Mumbai', 'Maharashtra', '400050', 'Private', '+91 22 9876 5432', 19.0596, 72.8295, FALSE, NULL),
('Pune Care Center', '78 FC Road', 'Pune', 'Maharashtra', '411005', 'Private', '+91 20 5555 1234', 18.5195, 73.8553, TRUE, NOW()),
('Delhi Metro Hospital', '22 Connaught Place', 'New Delhi', 'Delhi', '110001', 'Government', '+91 11 2345 6789', 28.6304, 77.2177, TRUE, NOW());
