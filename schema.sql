CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL,
    first_name VARCHAR (100) NOT NULL,
    last_name VARCHAR (100) NOT NULL,
    profile_image VARCHAR (255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banners (
    banner_id SERIAL PRIMARY KEY,
    banner_name VARCHAR (100) NOT NULL,
    banner_image VARCHAR (255) NOT NULL,
    description VARCHAR (256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    service_code VARCHAR (255) UNIQUE NOT NULL,
    service_name VARCHAR (255) NOT NULL,
    service_icon VARCHAR (255),
    service_tariff NUMERIC (15, 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE balances (
    balance_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    balance NUMERIC(15, 0) NOT NULL DEFAULT 0,
    CONSTRAINT fk_user_balances FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TYPE trx_type AS ENUM ('TOPUP', 'PAYMENT');

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    transaction_type trx_type NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount NUMERIC(15, 0) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_transactions FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_service_transactions FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
);