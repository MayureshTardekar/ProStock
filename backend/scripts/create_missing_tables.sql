-- Create missing tables for ProStock application
-- Run this script to add stop_loss_orders and price_alerts tables

USE prostock;

-- Stop Loss Orders table
CREATE TABLE IF NOT EXISTS stop_loss_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  symbol VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  trigger_price DECIMAL(12,2) NOT NULL,
  quantity INT NOT NULL,
  status ENUM('PENDING', 'TRIGGERED', 'CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Price Alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  symbol VARCHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  target_price DECIMAL(12,2) NOT NULL,
  condition_type ENUM('ABOVE', 'BELOW') NOT NULL,
  status ENUM('ACTIVE', 'TRIGGERED', 'CANCELLED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Verify tables were created
SELECT 'stop_loss_orders table created' AS status;
SELECT 'price_alerts table created' AS status;
