// const { pool, withTransaction } = require('../../config/db');
// const { HttpError } = require('../auth/auth.service');
// const { secureShuffle, generateSeed } = require('../../utils/random');
// const notificationService = require('../notification/notification.service');

// /**
//  * Runs the full draw for a lottery: locks it, loads every ticket, picks one
//  * winning ticket per prize tier using a CSPRNG-backed shuffle (never
//  * Math.random()), stores the result. Called by the scheduler automatically,
//  * or manually via POST /lotteries/:id/draw.
//  */
// async function runDraw(lotteryId) {
//   return withTransaction(async (conn) => {
//     const [lotteryRows] = await conn.query('SELECT * FROM lotteries WHERE id = ? FOR UPDATE', [lotteryId]);
//     if (!lotteryRows[0]) throw new HttpError(404, 'Lottery not found.');
//     const lottery = lotteryRows[0];
//     if (!['active', 'locked'].includes(lottery.status)) {
//       throw new HttpError(422, `Lottery is not ready to be drawn (status: ${lottery.status}).`);
//     }

//     await conn.query('UPDATE lotteries SET status = ? WHERE id = ?', ['spinning', lotteryId]);

//     const [prizes] = await conn.query(
//       'SELECT * FROM lottery_prizes WHERE lottery_id = ? ORDER BY rank_position',
//       [lotteryId]
//     );
//     if (prizes.length === 0) throw new HttpError(422, 'No prizes configured for this lottery.');

//     const [tickets] = await conn.query('SELECT id, ticket_number, user_id FROM tickets WHERE lottery_id = ?', [lotteryId]);
//     if (tickets.length < prizes.length) {
//       throw new HttpError(422, 'Not enough tickets sold to award all prizes.');
//     }

//     const seed = generateSeed();
//     const shuffled = secureShuffle(tickets); // unbiased order; seed stored for audit
//     const winningTickets = shuffled.slice(0, prizes.length);

//     const results = [];
//     for (let i = 0; i < prizes.length; i++) {
//       const prize = prizes[i];
//       const ticket = winningTickets[i];

//       await conn.query('UPDATE tickets SET is_winner = 1 WHERE id = ?', [ticket.id]);

//       await conn.query(
//         `INSERT INTO winners (lottery_id, prize_id, ticket_id, user_id, prize_amount) VALUES (?, ?, ?, ?, ?)`,
//         [lotteryId, prize.id, ticket.id, ticket.user_id, prize.prize_amount]
//       );

//       await notificationService.create(
//         {
//           userId: ticket.user_id,
//           type: 'winner',
//           title: 'Congratulations!',
//           body: `Your ticket ${ticket.ticket_number} won ${prize.prize_amount} Birr (${prize.label || `Rank ${prize.rank_position}`}).`,
//         },
//         conn
//       );

//       results.push({ rank: prize.rank_position, ticket: ticket.ticket_number, userId: ticket.user_id, amount: prize.prize_amount });
//     }

//     await conn.query('UPDATE lotteries SET status = ?, random_seed = ? WHERE id = ?', ['completed', seed, lotteryId]);

//     return { lotteryId, seed, results };
//   });
// }

// async function listPublicWinners() {
//   const [rows] = await pool.query(
//     `SELECT l.name AS lottery_name, u.full_name AS winner_name, t.ticket_number,
//             w.prize_amount, w.announced_at,
//             (wd.status IS NOT NULL AND wd.status = 'paid') AS payment_completed
//      FROM winners w
//      JOIN lotteries l ON l.id = w.lottery_id
//      JOIN users u ON u.id = w.user_id
//      JOIN tickets t ON t.id = w.ticket_id
//      LEFT JOIN withdrawals wd ON wd.winner_id = w.id
//      ORDER BY w.announced_at DESC
//      LIMIT 100`
//   );
//   return rows;
// }

// async function myWins(userId) {
//   const [rows] = await pool.query(
//     `SELECT w.id, l.name AS lottery_name, t.ticket_number, w.prize_amount, w.announced_at
//      FROM winners w
//      JOIN lotteries l ON l.id = w.lottery_id
//      JOIN tickets t ON t.id = w.ticket_id
//      WHERE w.user_id = ?
//      ORDER BY w.announced_at DESC`,
//     [userId]
//   );
//   return rows;
// }

// module.exports = { runDraw, listPublicWinners, myWins };


// const { pool, withTransaction } = require('../../config/db');
// const { HttpError } = require('../auth/auth.service');
// const { secureShuffle, generateSeed } = require('../../utils/random');
// const notificationService = require('../notification/notification.service');
// const { formatEthiopianDateTime } = require('../../utils/time');

// /**
//  * Runs the full draw for a lottery: locks it, loads every ticket, picks one
//  * winning ticket per prize tier using a CSPRNG-backed shuffle (never
//  * Math.random()), stores the result. Called by the scheduler automatically,
//  * or manually via POST /lotteries/:id/draw.
//  */
// async function runDraw(lotteryId) {
//   return withTransaction(async (conn) => {
//     const [lotteryRows] = await conn.query('SELECT * FROM lotteries WHERE id = ? FOR UPDATE', [lotteryId]);
//     if (!lotteryRows[0]) throw new HttpError(404, 'Lottery not found.');
//     const lottery = lotteryRows[0];
//     if (lottery.status === 'completed') {
//       throw new HttpError(422, 'This lottery has already been drawn.');
//     }
//     if (!['active', 'locked'].includes(lottery.status)) {
//       throw new HttpError(422, `Lottery is not ready to be drawn (status: ${lottery.status}).`);
//     }

//     await conn.query('UPDATE lotteries SET status = ? WHERE id = ?', ['spinning', lotteryId]);

//     let [prizes] = await conn.query(
//       'SELECT * FROM lottery_prizes WHERE lottery_id = ? ORDER BY rank_position',
//       [lotteryId]
//     );

//     if (prizes.length === 0) {
//       // No prize tiers were ever configured for this lottery. Rather than
//       // refusing to draw (which just means "nobody ever wins"), fall back
//       // to a single winner-takes-the-pool prize equal to the total of all
//       // approved payments, so buying a ticket always has a real payoff.
//       const [[{ totalCollected }]] = await conn.query(
//         `SELECT COALESCE(SUM(amount), 0) AS totalCollected
//          FROM payments
//          WHERE lottery_id = ? AND status = 'approved'`,
//         [lotteryId]
//       );

//       if (Number(totalCollected) <= 0) {
//         throw new HttpError(422, 'No approved payments to draw a prize from.');
//       }

//       const [insertResult] = await conn.query(
//         `INSERT INTO lottery_prizes (lottery_id, rank_position, prize_amount, label)
//          VALUES (?, 1, ?, ?)`,
//         [lotteryId, totalCollected, 'Grand Prize']
//       );

//       prizes = [
//         {
//           id: insertResult.insertId,
//           lottery_id: lotteryId,
//           rank_position: 1,
//           prize_amount: totalCollected,
//           label: 'Grand Prize',
//         },
//       ];
//     }

//     const [tickets] = await conn.query(
//       `SELECT t.id, t.ticket_number, t.user_id
//        FROM tickets t
//        JOIN payments p ON p.id = t.payment_id
//        WHERE t.lottery_id = ? AND p.status = 'approved'`,
//       [lotteryId]
//     );
//     if (tickets.length < prizes.length) {
//       throw new HttpError(422, 'Not enough approved tickets sold to award all prizes.');
//     }

//     const seed = generateSeed();
//     const shuffled = secureShuffle(tickets); // unbiased order; seed stored for audit
//     const winningTickets = shuffled.slice(0, prizes.length);

//     const results = [];
//     for (let i = 0; i < prizes.length; i++) {
//       const prize = prizes[i];
//       const ticket = winningTickets[i];

//       await conn.query('UPDATE tickets SET is_winner = 1 WHERE id = ?', [ticket.id]);

//       await conn.query(
//         `INSERT INTO winners (lottery_id, prize_id, ticket_id, user_id, prize_amount) VALUES (?, ?, ?, ?, ?)`,
//         [lotteryId, prize.id, ticket.id, ticket.user_id, prize.prize_amount]
//       );

//       await notificationService.create(
//         {
//           userId: ticket.user_id,
//           type: 'winner',
//           title: 'Congratulations!',
//           body: `Your ticket ${ticket.ticket_number} won ${prize.prize_amount} Birr (${prize.label || `Rank ${prize.rank_position}`}).`,
//         },
//         conn
//       );

//       results.push({ rank: prize.rank_position, ticket: ticket.ticket_number, userId: ticket.user_id, amount: prize.prize_amount });
//     }

//     await conn.query('UPDATE lotteries SET status = ?, random_seed = ? WHERE id = ?', ['completed', seed, lotteryId]);

//     const participantIds = [...new Set(tickets.map((ticket) => ticket.user_id))];
//     if (participantIds.length > 0) {
//       await notificationService.create({
//         userIds: participantIds,
//         type: 'lottery_draw_started',
//         title: 'Lottery Draw Started',
//         body: `The draw for ${lottery.name} has started.`,
//       }, conn);

//       await notificationService.create({
//         userIds: participantIds,
//         type: 'winner_announced',
//         title: 'Winner Announced',
//         body: `The winner for ${lottery.name} has been announced.`,
//       }, conn);
//     }

//     return { lotteryId, seed, results };
//   });
// }

// async function listPublicWinners() {
//   const [rows] = await pool.query(
//     `SELECT l.name AS lottery_name, u.full_name AS winner_name, t.ticket_number,
//             w.prize_amount, w.announced_at,
//             (wd.status IS NOT NULL AND wd.status = 'paid') AS payment_completed
//      FROM winners w
//      JOIN lotteries l ON l.id = w.lottery_id
//      JOIN users u ON u.id = w.user_id
//      JOIN tickets t ON t.id = w.ticket_id
//      LEFT JOIN withdrawals wd ON wd.winner_id = w.id
//      ORDER BY w.announced_at DESC
//      LIMIT 100`
//   );
//   return rows.map((row) => ({
//     ...row,
//     announcedAtEt: formatEthiopianDateTime(row.announced_at),
//   }));
// }

// async function myWins(userId) {
//   const [rows] = await pool.query(
//     `SELECT w.id, l.name AS lottery_name, t.ticket_number, w.prize_amount, w.announced_at
//      FROM winners w
//      JOIN lotteries l ON l.id = w.lottery_id
//      JOIN tickets t ON t.id = w.ticket_id
//      WHERE w.user_id = ?
//      ORDER BY w.announced_at DESC`,
//     [userId]
//   );
//   return rows.map((row) => ({
//     ...row,
//     announcedAtEt: formatEthiopianDateTime(row.announced_at),
//   }));
// }

// module.exports = { runDraw, listPublicWinners, myWins };

const { pool, withTransaction } = require('../../config/db');
const { HttpError } = require('../auth/auth.service');
const { secureShuffle, generateSeed } = require('../../utils/random');
const notificationService = require('../notification/notification.service');
const { formatEthiopianDateTime } = require('../../utils/time');

/**
 * Runs the full draw for a lottery: locks it, loads every ticket, picks one
 * winning ticket per prize tier using a CSPRNG-backed shuffle (never
 * Math.random()), stores the result. Called by the scheduler automatically,
 * or manually via POST /lotteries/:id/draw.
 */
async function runDraw(lotteryId) {
  return withTransaction(async (conn) => {
    const [lotteryRows] = await conn.query('SELECT * FROM lotteries WHERE id = ? FOR UPDATE', [lotteryId]);
    if (!lotteryRows[0]) throw new HttpError(404, 'Lottery not found.');
    const lottery = lotteryRows[0];
    if (lottery.status === 'completed') {
      throw new HttpError(422, 'This lottery has already been drawn.');
    }
    if (!['active', 'locked'].includes(lottery.status)) {
      throw new HttpError(422, `Lottery is not ready to be drawn (status: ${lottery.status}).`);
    }

    await conn.query('UPDATE lotteries SET status = ? WHERE id = ?', ['spinning', lotteryId]);

    let [prizes] = await conn.query(
      'SELECT * FROM lottery_prizes WHERE lottery_id = ? ORDER BY rank_position',
      [lotteryId]
    );

    if (prizes.length === 0) {
      // No prize tiers were ever configured for this lottery. Rather than
      // refusing to draw (which just means "nobody ever wins"), fall back
      // to a single winner-takes-the-pool prize equal to the total of all
      // approved payments, so buying a ticket always has a real payoff.
      const [[{ totalCollected }]] = await conn.query(
        `SELECT COALESCE(SUM(amount), 0) AS totalCollected
         FROM payments
         WHERE lottery_id = ? AND status = 'approved'`,
        [lotteryId]
      );

      if (Number(totalCollected) <= 0) {
        throw new HttpError(422, 'No approved payments to draw a prize from.');
      }

      const [insertResult] = await conn.query(
        `INSERT INTO lottery_prizes (lottery_id, rank_position, prize_amount, label)
         VALUES (?, 1, ?, ?)`,
        [lotteryId, totalCollected, 'Grand Prize']
      );

      prizes = [
        {
          id: insertResult.insertId,
          lottery_id: lotteryId,
          rank_position: 1,
          prize_amount: totalCollected,
          label: 'Grand Prize',
        },
      ];
    }

    const [tickets] = await conn.query(
      `SELECT t.id, t.ticket_number, t.user_id
       FROM tickets t
       JOIN payments p ON p.id = t.payment_id
       WHERE t.lottery_id = ? AND p.status = 'approved'`,
      [lotteryId]
    );
    if (tickets.length < prizes.length) {
      throw new HttpError(422, 'Not enough approved tickets sold to award all prizes.');
    }

    const seed = generateSeed();
    const shuffled = secureShuffle(tickets); // unbiased order; seed stored for audit
    const winningTickets = shuffled.slice(0, prizes.length);

    const results = [];
    for (let i = 0; i < prizes.length; i++) {
      const prize = prizes[i];
      const ticket = winningTickets[i];

      await conn.query('UPDATE tickets SET is_winner = 1 WHERE id = ?', [ticket.id]);

      await conn.query(
        `INSERT INTO winners (lottery_id, prize_id, ticket_id, user_id, prize_amount) VALUES (?, ?, ?, ?, ?)`,
        [lotteryId, prize.id, ticket.id, ticket.user_id, prize.prize_amount]
      );

      await notificationService.create(
        {
          userId: ticket.user_id,
          type: 'winner',
          title: 'Congratulations!',
          body: `Your ticket ${ticket.ticket_number} won ${prize.prize_amount} Birr (${prize.label || `Rank ${prize.rank_position}`}).`,
        },
        conn
      );

      results.push({ rank: prize.rank_position, ticket: ticket.ticket_number, userId: ticket.user_id, amount: prize.prize_amount });
    }

    await conn.query('UPDATE lotteries SET status = ?, random_seed = ? WHERE id = ?', ['completed', seed, lotteryId]);

    const participantIds = [...new Set(tickets.map((ticket) => ticket.user_id))];
    if (participantIds.length > 0) {
      await notificationService.create({
        userIds: participantIds,
        type: 'lottery_draw_started',
        title: 'Lottery Draw Started',
        body: `The draw for ${lottery.name} has started.`,
      }, conn);

      await notificationService.create({
        userIds: participantIds,
        type: 'winner_announced',
        title: 'Winner Announced',
        body: `The winner for ${lottery.name} has been announced.`,
      }, conn);
    }

    return { lotteryId, seed, results };
  });
}

function mapPublicRow(row) {
  return {
    lotteryName: row.lottery_name,
    winnerName: row.winner_name,
    ticketNumber: row.ticket_number,
    prizeAmount: Number(row.prize_amount),
    announcedAt: row.announced_at,
    announcedAtEt: formatEthiopianDateTime(row.announced_at),
    paymentCompleted: !!row.payment_completed,
  };
}

async function listPublicWinners() {
  const [rows] = await pool.query(
    `SELECT l.name AS lottery_name, u.full_name AS winner_name, t.ticket_number,
            w.prize_amount, w.announced_at,
            (wd.status IS NOT NULL AND wd.status = 'paid') AS payment_completed
     FROM winners w
     JOIN lotteries l ON l.id = w.lottery_id
     JOIN users u ON u.id = w.user_id
     JOIN tickets t ON t.id = w.ticket_id
     LEFT JOIN withdrawals wd ON wd.winner_id = w.id
     ORDER BY w.announced_at DESC
     LIMIT 100`
  );
  return rows.map(mapPublicRow);
}

function mapMineRow(row) {
  const withdrawalStatus = row.withdrawal_status || 'unrequested';
  return {
    id: row.id,
    winnerId: row.id,
    lotteryName: row.lottery_name,
    lotteryTitle: row.lottery_name,
    ticketNumber: row.ticket_number,
    prizeName: row.prize_name || 'Prize',
    prizeAmount: Number(row.prize_amount || 0),
    announcedAt: row.announced_at,
    announcedAtEt: formatEthiopianDateTime(row.announced_at),
    withdrawalStatus: withdrawalStatus === 'waiting_payment' ? 'pending' : withdrawalStatus,
    withdrawalStatusRaw: row.withdrawal_status || null,
  };
}

async function myWins(userId) {
  const [rows] = await pool.query(
    `SELECT w.id, l.name AS lottery_name, lp.label AS prize_name, t.ticket_number, w.prize_amount, w.announced_at,
            wd.status AS withdrawal_status
     FROM winners w
     JOIN lotteries l ON l.id = w.lottery_id
     LEFT JOIN lottery_prizes lp ON lp.id = w.prize_id
     JOIN tickets t ON t.id = w.ticket_id
     LEFT JOIN withdrawals wd ON wd.winner_id = w.id
     WHERE w.user_id = ?
     ORDER BY w.announced_at DESC`,
    [userId]
  );
  return rows.map(mapMineRow);
}

module.exports = { runDraw, listPublicWinners, myWins };