-- Create database
-- CREATE DATABASE IF NOT EXISTS game
-- CHARACTER SET utf8mb4
-- COLLATE utf8mb4_unicode_ci;

-- USE game;


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

  phone_number VARCHAR(20) NOT NULL UNIQUE,
  location VARCHAR(150) NULL,

  role ENUM('admin', 'group_leader', 'user') NOT NULL DEFAULT 'user',
  group_id INT NULL,
  is_age_verified TINYINT(1) NOT NULL DEFAULT 0,
  agreed_to_terms TINYINT(1) NOT NULL DEFAULT 0,
  self_exclusion_until DATETIME NULL,
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


-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 13, 2026 at 12:47 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

