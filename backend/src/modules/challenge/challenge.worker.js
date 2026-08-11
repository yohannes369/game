const { pool } = require('../../config/db');
const challengeService = require('./challenge.service');

const POLL_INTERVAL_MS = 15_000; // check every 15s for challenges whose draw_at has passed

async function processDueDraws() {
  const [rows] = await pool.query(
    `SELECT challenge_id FROM challenges WHERE status = 'DRAW_SCHEDULED' AND draw_at <= NOW()`
  );

  for (const row of rows) {
    try {
      await challengeService.runDraw(row.challenge_id);
      console.log(`[challenge.worker] draw completed for ${row.challenge_id}`);
    } catch (err) {
      // Row-level lock in runDraw prevents double-processing if this
      // ever runs on more than one instance — a lock-wait/timeout here
      // just means another process already handled it.
      console.error(`[challenge.worker] draw failed for ${row.challenge_id}:`, err.message);
    }
  }
}

function startChallengeDrawWorker() {
  const intervalHandle = setInterval(() => {
    processDueDraws().catch((err) => console.error('[challenge.worker] poll error:', err.message));
  }, POLL_INTERVAL_MS);

  console.log(`[challenge.worker] started, polling every ${POLL_INTERVAL_MS}ms`);
  return intervalHandle;
}

module.exports = { startChallengeDrawWorker, processDueDraws };