-- ============================================================
-- GAME / LOTTERY PLATFORM
-- Aiven MySQL Database Schema
-- Database: defaultdb
--
-- IMPORTANT:
-- This script does NOT create or select a database.
-- Aiven already provides the database (defaultdb).
-- ============================================================


-- ============================================================
-- 1. GROUPS
-- ============================================================

CREATE TABLE IF NOT EXISTS `groups` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  leader_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,

  phone_number VARCHAR(20) NOT NULL UNIQUE,
  location VARCHAR(150) NULL,

  role ENUM(
    'admin',
    'group_leader',
    'user',
    'lottery_manager',
    'payment_admin',
    'finance_admin'
  ) NOT NULL DEFAULT 'user',

  group_id INT NULL,

  is_age_verified TINYINT(1) NOT NULL DEFAULT 0,
  agreed_to_terms TINYINT(1) NOT NULL DEFAULT 0,
  self_exclusion_until DATETIME NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_users_group
    FOREIGN KEY (group_id)
    REFERENCES `groups`(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;


-- ============================================================
-- 3. GROUP LEADER RELATION
-- ============================================================

ALTER TABLE `groups`
  ADD CONSTRAINT fk_groups_leader
  FOREIGN KEY (leader_id)
  REFERENCES users(id)
  ON DELETE SET NULL;


-- ============================================================
-- 4. REFRESH TOKENS
-- ============================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,

  token VARCHAR(512) NOT NULL,
  expires_at DATETIME NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_tokens_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 5. LOTTERIES
-- ============================================================

CREATE TABLE IF NOT EXISTS lotteries (
  id INT AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(150) NOT NULL,
  description TEXT NULL,

  ticket_price DECIMAL(12,2) NOT NULL,

  ticket_mode ENUM(
    'fixed',
    'package',
    'custom'
  ) NOT NULL DEFAULT 'fixed',

  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  spin_at DATETIME NOT NULL,

  status ENUM(
    'draft',
    'active',
    'locked',
    'spinning',
    'completed',
    'cancelled'
  ) NOT NULL DEFAULT 'draft',

  random_seed VARCHAR(255) NULL,

  created_by INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_lotteries_creator
    FOREIGN KEY (created_by)
    REFERENCES users(id)
) ENGINE=InnoDB;


-- ============================================================
-- 6. LOTTERY PRIZES
-- ============================================================

CREATE TABLE IF NOT EXISTS lottery_prizes (
  id INT AUTO_INCREMENT PRIMARY KEY,

  lottery_id INT NOT NULL,
  rank_position INT NOT NULL,

  prize_amount DECIMAL(14,2) NOT NULL,
  label VARCHAR(100) NULL,

  CONSTRAINT fk_prizes_lottery
    FOREIGN KEY (lottery_id)
    REFERENCES lotteries(id)
    ON DELETE CASCADE,

  UNIQUE KEY uq_lottery_rank (
    lottery_id,
    rank_position
  )
) ENGINE=InnoDB;


-- ============================================================
-- 7. TICKET PACKAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS ticket_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,

  lottery_id INT NOT NULL,

  name VARCHAR(100) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  ticket_count INT NOT NULL,

  is_active TINYINT(1) NOT NULL DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_packages_lottery
    FOREIGN KEY (lottery_id)
    REFERENCES lotteries(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 8. PAYMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,
  lottery_id INT NOT NULL,
  package_id INT NULL,

  amount DECIMAL(12,2) NOT NULL,

  method ENUM(
    'cbe',
    'telebirr',
    'bank'
  ) NOT NULL,

  sender_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(100) NOT NULL,

  screenshot_path VARCHAR(255) NULL,

  status ENUM(
    'pending',
    'approved',
    'rejected'
  ) NOT NULL DEFAULT 'pending',

  rejection_reason VARCHAR(255) NULL,

  reviewed_by INT NULL,
  reviewed_at DATETIME NULL,

  tickets_generated INT NOT NULL DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_payments_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_payments_lottery
    FOREIGN KEY (lottery_id)
    REFERENCES lotteries(id),

  CONSTRAINT fk_payments_package
    FOREIGN KEY (package_id)
    REFERENCES ticket_packages(id),

  CONSTRAINT fk_payments_reviewer
    FOREIGN KEY (reviewed_by)
    REFERENCES users(id),

  UNIQUE KEY uq_payment_txn (
    method,
    transaction_id
  )
) ENGINE=InnoDB;

CREATE INDEX idx_payments_status
  ON payments(status);

CREATE INDEX idx_payments_user
  ON payments(user_id);


-- ============================================================
-- 9. TICKETS
-- ============================================================

CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,

  ticket_number VARCHAR(20) NOT NULL UNIQUE,

  lottery_id INT NOT NULL,
  user_id INT NOT NULL,
  payment_id INT NOT NULL,

  is_winner TINYINT(1) NOT NULL DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_tickets_lottery
    FOREIGN KEY (lottery_id)
    REFERENCES lotteries(id),

  CONSTRAINT fk_tickets_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_tickets_payment
    FOREIGN KEY (payment_id)
    REFERENCES payments(id)
) ENGINE=InnoDB;

CREATE INDEX idx_tickets_lottery
  ON tickets(lottery_id);

CREATE INDEX idx_tickets_user
  ON tickets(user_id);


-- ============================================================
-- 10. WINNERS
-- ============================================================

CREATE TABLE IF NOT EXISTS winners (
  id INT AUTO_INCREMENT PRIMARY KEY,

  lottery_id INT NOT NULL,
  prize_id INT NOT NULL,
  ticket_id INT NOT NULL,
  user_id INT NOT NULL,

  prize_amount DECIMAL(14,2) NOT NULL,

  announced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_winners_lottery
    FOREIGN KEY (lottery_id)
    REFERENCES lotteries(id),

  CONSTRAINT fk_winners_prize
    FOREIGN KEY (prize_id)
    REFERENCES lottery_prizes(id),

  CONSTRAINT fk_winners_ticket
    FOREIGN KEY (ticket_id)
    REFERENCES tickets(id),

  CONSTRAINT fk_winners_user
    FOREIGN KEY (user_id)
    REFERENCES users(id),

  UNIQUE KEY uq_lottery_prize (
    lottery_id,
    prize_id
  )
) ENGINE=InnoDB;


-- ============================================================
-- 11. WITHDRAWALS
-- ============================================================

CREATE TABLE IF NOT EXISTS withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,

  winner_id INT NOT NULL,
  user_id INT NOT NULL,

  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_name VARCHAR(150) NOT NULL,

  status ENUM(
    'waiting_payment',
    'paid',
    'rejected'
  ) NOT NULL DEFAULT 'waiting_payment',

  admin_transaction_id VARCHAR(100) NULL,
  payment_screenshot_path VARCHAR(255) NULL,

  processed_by INT NULL,
  processed_at DATETIME NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_withdrawals_winner
    FOREIGN KEY (winner_id)
    REFERENCES winners(id),

  CONSTRAINT fk_withdrawals_user
    FOREIGN KEY (user_id)
    REFERENCES users(id),

  CONSTRAINT fk_withdrawals_admin
    FOREIGN KEY (processed_by)
    REFERENCES users(id)
) ENGINE=InnoDB;


-- ============================================================
-- 12. TRANSACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,

  type ENUM(
    'ticket_purchase',
    'challenge_payment',
    'withdrawal'
  ) NOT NULL,

  reference_id INT NOT NULL,

  amount DECIMAL(14,2) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_transactions_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
) ENGINE=InnoDB;


-- ============================================================
-- 13. CHALLENGES
-- ============================================================

CREATE TABLE IF NOT EXISTS challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,

  challenge_id VARCHAR(32) NOT NULL,

  creator_id INT NOT NULL,
  challenger_id INT NULL,

  amount DECIMAL(12,2) NOT NULL,

  status ENUM(
    'WAITING',
    'ACCEPTED',
    'PAYMENT_PENDING',
    'ADMIN_REVIEW',
    'APPROVED',
    'NUMBERS_ASSIGNED',
    'DRAW_SCHEDULED',
    'DRAW_COMPLETED',
    'WINNER_REQUESTED_PAYOUT',
    'PAYOUT_REVIEW',
    'PAID',
    'CANCELLED'
  ) NOT NULL DEFAULT 'WAITING',

  payment_reference_creator VARCHAR(255) NULL,
  screenshot_creator VARCHAR(255) NULL,

  payment_reference_challenger VARCHAR(255) NULL,
  screenshot_challenger VARCHAR(255) NULL,

  approved_by INT NULL,
  approved_at DATETIME NULL,

  random_seed VARCHAR(255) NULL,

  winner_user_id INT NULL,
  winner_ticket_number VARCHAR(100) NULL,

  draw_at DATETIME NULL,

  payout_requested_at DATETIME NULL,

  payout_status ENUM(
    'waiting_payment',
    'paid',
    'rejected'
  ) NULL,

  payment_status_creator ENUM(
    'PENDING',
    'APPROVED',
    'REJECTED'
  ) NOT NULL DEFAULT 'PENDING',

  payment_status_challenger ENUM(
    'PENDING',
    'APPROVED',
    'REJECTED'
  ) NOT NULL DEFAULT 'PENDING',

  payout_transaction_id VARCHAR(100) NULL,
  payout_screenshot_path VARCHAR(255) NULL,

  payout_approved_by INT NULL,
  payout_approved_at DATETIME NULL,

  payout_rejection_reason VARCHAR(255) NULL,

  bank_name VARCHAR(100) NULL,
  account_number VARCHAR(50) NULL,
  account_name VARCHAR(150) NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_challenges_creator
    FOREIGN KEY (creator_id)
    REFERENCES users(id),

  CONSTRAINT fk_challenges_challenger
    FOREIGN KEY (challenger_id)
    REFERENCES users(id),

  CONSTRAINT fk_challenges_approved_by
    FOREIGN KEY (approved_by)
    REFERENCES users(id),

  CONSTRAINT fk_challenges_winner
    FOREIGN KEY (winner_user_id)
    REFERENCES users(id),

  CONSTRAINT fk_challenges_payout_approved_by
    FOREIGN KEY (payout_approved_by)
    REFERENCES users(id),

  UNIQUE KEY uq_challenges_challenge_id (
    challenge_id
  ),

  INDEX idx_challenges_status (
    status
  ),

  INDEX idx_challenges_creator (
    creator_id
  ),

  INDEX idx_challenges_challenger (
    challenger_id
  )
) ENGINE=InnoDB;


-- ============================================================
-- 14. MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,

  payment_id INT NULL,

  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,

  body TEXT NOT NULL,

  attachment_path VARCHAR(255) NULL,

  is_read TINYINT(1) NOT NULL DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_messages_payment
    FOREIGN KEY (payment_id)
    REFERENCES payments(id),

  CONSTRAINT fk_messages_sender
    FOREIGN KEY (sender_id)
    REFERENCES users(id),

  CONSTRAINT fk_messages_receiver
    FOREIGN KEY (receiver_id)
    REFERENCES users(id)
) ENGINE=InnoDB;


-- ============================================================
-- 15. NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,

  type VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,

  is_read TINYINT(1) NOT NULL DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_notifications_user
  ON notifications(user_id, is_read);


-- ============================================================
-- 16. AUDIT LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,

  actor_id INT NULL,

  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id INT NULL,

  meta JSON NULL,

  ip_address VARCHAR(45) NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_audit_actor
    FOREIGN KEY (actor_id)
    REFERENCES users(id)
) ENGINE=InnoDB;


-- ============================================================
-- 17. SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(100) PRIMARY KEY,

  `value` JSON NOT NULL,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- 18. CHAT CONVERSATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS chat_conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,

  admin_id INT NOT NULL,
  user_id INT NOT NULL,

  status ENUM(
    'open',
    'closed'
  ) NOT NULL DEFAULT 'open',

  last_message_at DATETIME NULL,

  admin_last_read_at DATETIME NULL,
  user_last_read_at DATETIME NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_chat_conversation_admin
    FOREIGN KEY (admin_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_chat_conversation_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  UNIQUE KEY uq_admin_user_chat (
    admin_id,
    user_id
  ),

  INDEX idx_chat_admin (
    admin_id
  ),

  INDEX idx_chat_user (
    user_id
  ),

  INDEX idx_chat_status (
    status
  ),

  INDEX idx_chat_updated (
    updated_at
  ),

  INDEX idx_chat_last_message (
    last_message_at
  )
) ENGINE=InnoDB;


-- ============================================================
-- 19. CHAT MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  conversation_id INT NOT NULL,

  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,

  message_type ENUM(
    'text',
    'image',
    'voice'
  ) NOT NULL DEFAULT 'text',

  message_text TEXT NULL,

  file_url VARCHAR(1000) NULL,
  file_name VARCHAR(255) NULL,
  file_mime_type VARCHAR(100) NULL,
  file_size BIGINT NULL,

  voice_duration INT NULL,

  is_read TINYINT(1) NOT NULL DEFAULT 0,
  read_at DATETIME NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_chat_message_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES chat_conversations(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_chat_message_sender
    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_chat_message_receiver
    FOREIGN KEY (receiver_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  INDEX idx_messages_conversation (
    conversation_id
  ),

  INDEX idx_messages_sender (
    sender_id
  ),

  INDEX idx_messages_receiver (
    receiver_id
  ),

  INDEX idx_messages_created (
    created_at
  ),

  INDEX idx_messages_read (
    is_read
  ),

  INDEX idx_messages_conversation_read (
    conversation_id,
    receiver_id,
    is_read
  )
) ENGINE=InnoDB;


-- ============================================================
-- 20. CHAT ATTACHMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS chat_attachments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  message_id BIGINT NOT NULL,

  attachment_type ENUM(
    'image',
    'voice'
  ) NOT NULL,

  file_url VARCHAR(1000) NOT NULL,

  file_name VARCHAR(255) NULL,
  mime_type VARCHAR(100) NULL,
  file_size BIGINT NULL,

  duration_seconds INT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_chat_attachment_message
    FOREIGN KEY (message_id)
    REFERENCES chat_messages(id)
    ON DELETE CASCADE,

  INDEX idx_attachment_message (
    message_id
  )
) ENGINE=InnoDB;


-- ============================================================
-- DONE
-- ============================================================