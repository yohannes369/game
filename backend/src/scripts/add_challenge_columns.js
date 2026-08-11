const { pool } = require('../config/db');

const COLUMNS = [
  `payment_status_creator ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING'`,
  `payment_status_challenger ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING'`,
  `sender_name_creator VARCHAR(150) NULL`,
  `sender_name_challenger VARCHAR(150) NULL`,
  `phone_creator VARCHAR(50) NULL`,
  `phone_challenger VARCHAR(50) NULL`,
  `ticket_number_creator VARCHAR(100) NULL`,
  `ticket_number_challenger VARCHAR(100) NULL`,
  `winner_ticket_number VARCHAR(100) NULL`,
  `commission_rate_percent DECIMAL(5,2) NULL`,
  `commission_amount DECIMAL(12,2) NULL`,
  `payout_net_amount DECIMAL(12,2) NULL`,
  `bank_name VARCHAR(100) NULL`,
  `account_number VARCHAR(50) NULL`,
  `account_name VARCHAR(150) NULL`,
  `payout_transaction_id VARCHAR(100) NULL`,
  `payout_screenshot_path VARCHAR(255) NULL`,
  `payout_approved_by INT NULL`,
  `payout_approved_at DATETIME NULL`,
  `payout_rejection_reason VARCHAR(255) NULL`,
];

async function run() {
  try {
    console.log('[migrate] Ensuring challenge columns exist...');

    for (const column of COLUMNS) {
      try {
        await pool.query(`ALTER TABLE challenges ADD COLUMN IF NOT EXISTS ${column}`);
      } catch (err) {
        if (err && err.errno === 1060) {
          continue; // column already exists
        }
        throw err;
      }
    }

    console.log('[migrate] Migration applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[migrate] Migration failed:', err && err.message);
    process.exit(1);
  }
}

run();
