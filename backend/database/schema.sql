-- Create database
CREATE DATABASE IF NOT EXISTS game
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE game;


-- Groups table
CREATE TABLE IF NOT EXISTS `groups` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  leader_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role ENUM('admin', 'group_leader', 'user') NOT NULL DEFAULT 'user',
  group_id INT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_group 
    FOREIGN KEY (group_id) REFERENCES `groups`(id) 
    ON DELETE SET NULL
) ENGINE=InnoDB;


-- Add group leader relation
ALTER TABLE `groups`
  ADD CONSTRAINT fk_groups_leader 
  FOREIGN KEY (leader_id) REFERENCES users(id) 
  ON DELETE SET NULL;


-- Refresh token table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(512) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tokens_user 
    FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE
) ENGINE=InnoDB;


-- Indexes
CREATE INDEX idx_refresh_tokens_user 
ON refresh_tokens(user_id);

CREATE INDEX idx_users_group 
ON users(group_id);