const { pool } = require('../config/db');

async function run() {
  try {
    console.log('[migrate] Adding payment_status_creator/payment_status_challenger to challenges...');
    await pool.query(
      `ALTER TABLE challenges
         ADD COLUMN IF NOT EXISTS payment_status_creator ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
         ADD COLUMN IF NOT EXISTS payment_status_challenger ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING'`);
    console.log('[migrate] Migration applied successfully.');
    process.exit(0);
  } catch (err) {
    // MySQL older versions may not support IF NOT EXISTS on ADD COLUMN;
    // try a safe fallback that ignores duplicate column errors (ER_DUP_FIELDNAME: 1060)
    if (err && err.errno === 1060) {
      console.log('[migrate] Columns already exist, nothing to do.');
      process.exit(0);
    }
    console.error('[migrate] Migration failed:', err && err.message);
    process.exit(1);
  }
}

run();
