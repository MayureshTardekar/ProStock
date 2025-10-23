-- ProStock Database Schema
-- Execute this SQL file to create the database and tables

CREATE DATABASE IF NOT EXISTS prostock;
USE prostock;

-- Users table for authentication and profile data
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  balance DECIMAL(14,2) DEFAULT 500000.00,
  profile_json JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Portfolio holdings for each user
CREATE TABLE IF NOT EXISTS portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  symbol VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  exchange VARCHAR(10) DEFAULT 'NSE',
  quantity INT NOT NULL DEFAULT 0,
  avg_price DECIMAL(12,2) NOT NULL,
  current_price DECIMAL(12,2) DEFAULT 0,
  invested_amount DECIMAL(14,2) DEFAULT 0,
  last_updated TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_stock (user_id, symbol),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders history (buy/sell)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  symbol VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  exchange VARCHAR(10) DEFAULT 'NSE',
  order_type ENUM('BUY','SELL') NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  total DECIMAL(14,2) NOT NULL,
  status ENUM('COMPLETED','PENDING','CANCELLED') DEFAULT 'COMPLETED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions log (deposits, withdrawals, trades)
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tx_type ENUM('DEPOSIT','WITHDRAW','BUY','SELL') NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  balance_after DECIMAL(14,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Watchlist for users
CREATE TABLE IF NOT EXISTS watchlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  symbol VARCHAR(32) NOT NULL,
  name VARCHAR(255),
  exchange VARCHAR(10) DEFAULT 'NSE',
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_watchlist (user_id, symbol),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications for users
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  type ENUM('BUY','SELL','DEPOSIT','WITHDRAW','SYSTEM') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create a default demo user (password: demo123)
-- Password hash for 'demo123' using bcrypt (10 rounds)
INSERT INTO users (full_name, email, password_hash, balance, profile_json) VALUES
('Mayuresh Patil', 'demo@prostock.com', '$2b$10$YourHashedPasswordHere', 500000.00, 
'{"gender":"Male","dob":"1998-05-15","pan":"ABCDE1234F","mobile":"+91 9876543210","ckyc":"XXXXXXXXXXXXXX","incomeRange":"₹5L - ₹10L","depository":"CDSL","exchanges":{"BSE":true,"NSE":true,"MCX":false,"NCDEX":false,"ICEX":false}}');

-- Create initial welcome transaction for demo user
INSERT INTO transactions (user_id, tx_type, amount, balance_after, description) VALUES
(1, 'DEPOSIT', 500000.00, 500000.00, 'Welcome to ProStock! Paper trading account credited.');
