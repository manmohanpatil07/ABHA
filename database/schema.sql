CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NULL,
    password_hash VARCHAR(255) NULL,
    date_of_birth DATE NULL,
    gender VARCHAR(20) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    blood_group VARCHAR(10) NULL,
    emergency_contact VARCHAR(15) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE providers (
    provider_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NULL,
    password_hash VARCHAR(255) NOT NULL,
    provider_type VARCHAR(50) DEFAULT 'healthcare_provider',
    clinic_name VARCHAR(150) NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE health_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    record_type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    record_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE vaccinations (
    vaccination_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    vaccine_name VARCHAR(150) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE NULL,
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE qr_access (
    access_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    provider_id INT,
    access_token VARCHAR(255) UNIQUE NOT NULL,
    permission VARCHAR(30) DEFAULT 'view',
    expires_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (provider_id) REFERENCES providers(provider_id)
);

CREATE TABLE hospitals (
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NULL,
    hospital_type VARCHAR(50) NULL,
    phone VARCHAR(20) NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    pmjay_status BOOLEAN DEFAULT FALSE,
    verified_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
