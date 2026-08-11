// const { pool } = require('../../config/db');

// const COMMISSION_KEY = 'challenge_commission';
// const DEFAULT_RATE = 10; // percent, used only if the settings row is missing

// async function getCommissionRatePercent(conn = pool) {
//   const [rows] = await conn.query(`SELECT value FROM settings WHERE \`key\` = ? LIMIT 1`, [COMMISSION_KEY]);
//   if (!rows[0]) return DEFAULT_RATE;
//   const value = typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
//   return Number(value.ratePercent ?? DEFAULT_RATE);
// }

// async function setCommissionRatePercent(ratePercent) {
//   const rate = Number(ratePercent);
//   if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
//     throw new Error('ratePercent must be a number between 0 and 100.');
//   }
//   await pool.query(
//     `INSERT INTO settings (\`key\`, \`value\`) VALUES (?, JSON_OBJECT('ratePercent', ?))
//      ON DUPLICATE KEY UPDATE value = JSON_OBJECT('ratePercent', ?)`,
//     [COMMISSION_KEY, rate, rate]
//   );
//   return rate;
// }

// module.exports = { getCommissionRatePercent, setCommissionRatePercent };
const { pool } = require('../../config/db');

const COMMISSION_KEY = 'challenge_commission';
const DEFAULT_RATE = 10; // percent — used only if the settings row is somehow missing

/**
 * Reads the current commission rate (percent, e.g. 10 means 10%).
 * Accepts an optional connection so callers inside a transaction can
 * pass their `conn` and read a consistent snapshot.
 */
async function getCommissionRatePercent(conn = pool) {
  const [rows] = await conn.query(`SELECT value FROM settings WHERE \`key\` = ? LIMIT 1`, [COMMISSION_KEY]);
  if (!rows[0]) return DEFAULT_RATE;
  const value = typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
  const rate = Number(value.ratePercent);
  return Number.isFinite(rate) ? rate : DEFAULT_RATE;
}

/**
 * Updates the commission rate. Only affects challenges whose draw runs
 * AFTER this is called — past challenges keep their snapshotted rate.
 */
async function setCommissionRatePercent(ratePercent) {
  const rate = Number(ratePercent);
  if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
    throw new Error('ratePercent must be a number between 0 and 100.');
  }
  await pool.query(
    `INSERT INTO settings (\`key\`, \`value\`) VALUES (?, JSON_OBJECT('ratePercent', ?))
     ON DUPLICATE KEY UPDATE value = JSON_OBJECT('ratePercent', ?)`,
    [COMMISSION_KEY, rate, rate]
  );
  return rate;
}

module.exports = { getCommissionRatePercent, setCommissionRatePercent };