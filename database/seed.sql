INSERT INTO users (full_name, mobile, email, password_hash) VALUES
('Test User', '9876543210', 'test@example.com', '$2b$10$abcdefghijklmnopqrstuv');

INSERT INTO providers (full_name, mobile, email, password_hash, clinic_name) VALUES
('Dr. Smith', '9988776655', 'smith@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'Smith Clinic');

INSERT INTO hospitals (hospital_name, address, city, state, pmjay_status) VALUES
('City General Hospital', '123 Main St', 'Mumbai', 'Maharashtra', TRUE);
