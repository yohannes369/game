
// const cron = require('node-cron');
// const { pool } = require('../config/db');
// const winnerService = require('../modules/winner/winner.service');

// /**
//  * Automatic Lottery Engine
//  * 
//  * Checks every minute:
//  * - Finds active lotteries with 2 minutes or less remaining
//  * - Locks them
//  * - Runs automatic draw
//  */

// function start() {
//   cron.schedule('* * * * *', async () => {
//     try {
//       const [dueLotteries] = await pool.query(
//         `
//         SELECT id 
//         FROM lotteries 
//         WHERE status = 'active'
//         AND spin_at <= DATE_ADD(NOW(), INTERVAL 2 MINUTE)
//         `
//       );

//       for (const lottery of dueLotteries) {
//         try {

//           // Lock lottery first to prevent duplicate draws
//           const [lockResult] = await pool.query(
//             `
//             UPDATE lotteries 
//             SET status = ?
//             WHERE id = ?
//             AND status = 'active'
//             `,
//             ['locked', lottery.id]
//           );

//           // If another process already locked it, skip
//           if (lockResult.affectedRows === 0) {
//             continue;
//           }

//           console.log(
//             `[scheduler] Lottery ${lottery.id} locked. Running draw...`
//           );

//           const result = await winnerService.runDraw(lottery.id);

//           console.log(
//             `[scheduler] Lottery ${lottery.id} draw completed`,
//             result
//           );

//         } catch (err) {
//           console.error(
//             `[scheduler] Draw failed for lottery ${lottery.id}:`,
//             err.message
//           );
//         }
//       }

//     } catch (err) {
//       console.error(
//         '[scheduler] Scheduler tick failed:',
//         err.message
//       );
//     }
//   });

//   console.log(
//     '[scheduler] Lottery scheduler started. Checking every minute (2 minutes before spin time).'
//   );
// }

// module.exports = { start };
const { pool } = require('../config/db');
const winnerService = require('../modules/winner/winner.service');

// How often to check for lotteries whose spin time has passed.
const CHECK_INTERVAL_MS = 10 * 1000;

// If a draw fails (e.g. no prizes configured, not enough tickets sold),
// don't retry that same lottery again for this long. Prevents log/DB spam
// when a lottery is misconfigured, while still recovering automatically
// once someone fixes it (e.g. adds a prize) — the next check after the
// cooldown will pick it up.
const RETRY_BACKOFF_MS = 5 * 60 * 1000; // 5 minutes

let running = false; // guards against overlapping runs if a draw is slow
let intervalId = null;
const lastFailureAt = new Map(); // lotteryId -> timestamp of last failed attempt

async function checkAndRunDueDraws() {
  if (running) return;
  running = true;

  try {
    const [rows] = await pool.query(
      `SELECT id, name FROM lotteries
       WHERE status IN ('active', 'locked')
         AND spin_at IS NOT NULL
         AND spin_at <= NOW()`
    );

    const now = Date.now();

    for (const lottery of rows) {
      const failedAt = lastFailureAt.get(lottery.id);
      if (failedAt && now - failedAt < RETRY_BACKOFF_MS) {
        continue; // still in cooldown from a previous failure, skip silently
      }

      try {
        console.log(`[scheduler] Spin time reached for lottery ${lottery.id} (${lottery.name}) — running draw.`);
        await winnerService.runDraw(lottery.id);
        lastFailureAt.delete(lottery.id);
      } catch (err) {
        lastFailureAt.set(lottery.id, now);
        console.error(
          `[scheduler] Draw failed for lottery ${lottery.id} (${lottery.name}): ${err.message} ` +
            `— will retry in ${RETRY_BACKOFF_MS / 60000} min.`
        );
      }
    }
  } catch (err) {
    console.error('[scheduler] Failed to check for due draws:', err.message);
  } finally {
    running = false;
  }
}

function start() {
  if (intervalId) return;
  intervalId = setInterval(checkAndRunDueDraws, CHECK_INTERVAL_MS);
  console.log(`[scheduler] Lottery draw scheduler started (checking every ${CHECK_INTERVAL_MS / 1000}s).`);
  checkAndRunDueDraws();
}

function stop() {
  clearInterval(intervalId);
  intervalId = null;
  lastFailureAt.clear();
}

module.exports = { start, stop };