// const { pool, withTransaction } = require('../../config/db');
// const { HttpError } = require('../auth/auth.service');
// const notificationService = require('../notification/notification.service');

// async function requestWithdrawal(userId, { winnerId, bankName, accountNumber, accountName }) {
//   const [winnerRows] = await pool.query('SELECT * FROM winners WHERE id = ? AND user_id = ?', [winnerId, userId]);
//   if (!winnerRows[0]) throw new HttpError(404, 'Winner record not found for this user.');

//   const [existing] = await pool.query('SELECT id FROM withdrawals WHERE winner_id = ?', [winnerId]);
//   if (existing[0]) throw new HttpError(422, 'A withdrawal has already been requested for this prize.');

//   const [result] = await pool.query(
//     `INSERT INTO withdrawals (winner_id, user_id, bank_name, account_number, account_name, status)
//      VALUES (?, ?, ?, ?, ?, 'waiting_payment')`,
//     [winnerId, userId, bankName, accountNumber, accountName]
//   );

//   return getWithdrawal(result.insertId);
// }

// async function getWithdrawal(id) {
//   const [rows] = await pool.query('SELECT * FROM withdrawals WHERE id = ?', [id]);
//   if (!rows[0]) throw new HttpError(404, 'Withdrawal not found.');
//   return rows[0];
// }

// async function listPending() {
//   const [rows] = await pool.query(
//     `SELECT wd.*, u.full_name, w.prize_amount
//      FROM withdrawals wd
//      JOIN users u ON u.id = wd.user_id
//      JOIN winners w ON w.id = wd.winner_id
//      WHERE wd.status = 'waiting_payment'
//      ORDER BY wd.created_at ASC`
//   );
//   return rows;
// }

// async function markPaid(withdrawalId, adminId, { adminTransactionId, screenshotPath }) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM withdrawals WHERE id = ? FOR UPDATE', [withdrawalId]);
//     if (!rows[0]) throw new HttpError(404, 'Withdrawal not found.');
//     const wd = rows[0];
//     if (wd.status !== 'waiting_payment') throw new HttpError(422, 'This withdrawal has already been processed.');

//     await conn.query(
//       `UPDATE withdrawals SET status = 'paid', admin_transaction_id = ?, payment_screenshot_path = ?,
//         processed_by = ?, processed_at = NOW() WHERE id = ?`,
//       [adminTransactionId, screenshotPath || null, adminId, withdrawalId]
//     );

//     const [winnerRows] = await conn.query('SELECT prize_amount FROM winners WHERE id = ?', [wd.winner_id]);

//     await conn.query(
//       `INSERT INTO transactions (user_id, type, reference_id, amount) VALUES (?, 'withdrawal', ?, ?)`,
//       [wd.user_id, withdrawalId, winnerRows[0].prize_amount]
//     );

//     await notificationService.create(
//       { userId: wd.user_id, type: 'withdrawal_paid', title: 'Prize Paid', body: 'Your prize payment has been sent.' },
//       conn
//     );

//     return getWithdrawal(withdrawalId);
//   });
// }

// module.exports = { requestWithdrawal, getWithdrawal, listPending, markPaid };
const { pool, withTransaction } = require('../../config/db');
const { HttpError } = require('../auth/auth.service');
const notificationService = require('../notification/notification.service');

async function requestWithdrawal(userId, { winnerId, bankName, accountNumber, accountName }) {
  const [winnerRows] = await pool.query('SELECT * FROM winners WHERE id = ? AND user_id = ?', [winnerId, userId]);
  if (!winnerRows[0]) throw new HttpError(404, 'Winner record not found for this user.');

  const [existing] = await pool.query(
    "SELECT id FROM withdrawals WHERE winner_id = ? AND status != 'rejected'",
    [winnerId]
  );
  if (existing[0]) throw new HttpError(422, 'A withdrawal has already been requested for this prize.');

  const [result] = await pool.query(
    `INSERT INTO withdrawals (winner_id, user_id, bank_name, account_number, account_name, status)
     VALUES (?, ?, ?, ?, ?, 'waiting_payment')`,
    [winnerId, userId, bankName, accountNumber, accountName]
  );

  return getWithdrawal(result.insertId);
}

async function getWithdrawal(id) {
  const [rows] = await pool.query('SELECT * FROM withdrawals WHERE id = ?', [id]);
  if (!rows[0]) throw new HttpError(404, 'Withdrawal not found.');
  return rows[0];
}

async function listPending() {
  const [rows] = await pool.query(
    `SELECT wd.id, wd.winner_id, wd.user_id, wd.bank_name, wd.account_number, wd.account_name,
            wd.status, wd.created_at, u.full_name AS username, u.phone_number,
            l.name AS lottery_title, lp.label AS prize_name, w.prize_amount,
            wd.account_name AS account_name_value
     FROM withdrawals wd
     JOIN users u ON u.id = wd.user_id
     JOIN winners w ON w.id = wd.winner_id
     JOIN lotteries l ON l.id = w.lottery_id
     LEFT JOIN lottery_prizes lp ON lp.id = w.prize_id
     WHERE wd.status = 'waiting_payment'
     ORDER BY wd.created_at ASC`
  );
  return rows.map((row) => ({
    ...row,
    winnerUserId: row.user_id,
    lotteryTitle: row.lottery_title,
    prizeName: row.prize_name || 'Prize',
    bankName: row.bank_name,
    accountNumber: row.account_number,
    accountName: row.account_name_value || row.account_name,
    username: row.username || row.full_name,
  }));
}

async function markPaid(withdrawalId, adminId, { adminTransactionId, screenshotPath }) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM withdrawals WHERE id = ? FOR UPDATE', [withdrawalId]);
    if (!rows[0]) throw new HttpError(404, 'Withdrawal not found.');
    const wd = rows[0];
    if (wd.status !== 'waiting_payment') throw new HttpError(422, 'This withdrawal has already been processed.');

    await conn.query(
      `UPDATE withdrawals SET status = 'paid', admin_transaction_id = ?, payment_screenshot_path = ?,
        processed_by = ?, processed_at = NOW() WHERE id = ?`,
      [adminTransactionId, screenshotPath || null, adminId, withdrawalId]
    );

    const [winnerRows] = await conn.query('SELECT prize_amount FROM winners WHERE id = ?', [wd.winner_id]);

    await conn.query(
      `INSERT INTO transactions (user_id, type, reference_id, amount) VALUES (?, 'withdrawal', ?, ?)`,
      [wd.user_id, withdrawalId, winnerRows[0].prize_amount]
    );

    await notificationService.create(
      { userId: wd.user_id, type: 'withdrawal_paid', title: 'Prize Paid', body: 'Your prize payment has been sent.' },
      conn
    );

    return getWithdrawal(withdrawalId);
  });
}

async function rejectWithdrawal(withdrawalId, adminId, reason) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM withdrawals WHERE id = ? FOR UPDATE', [withdrawalId]);
    if (!rows[0]) throw new HttpError(404, 'Withdrawal not found.');
    const wd = rows[0];
    if (wd.status !== 'waiting_payment') throw new HttpError(422, 'This withdrawal has already been processed.');

    await conn.query(
      `UPDATE withdrawals SET status = 'rejected', rejection_reason = ?,
        processed_by = ?, processed_at = NOW() WHERE id = ?`,
      [reason, adminId, withdrawalId]
    );

    await notificationService.create(
      {
        userId: wd.user_id,
        type: 'withdrawal_rejected',
        title: 'Withdrawal Rejected',
        body: `Your withdrawal request was rejected: ${reason}`,
      },
      conn
    );

    return getWithdrawal(withdrawalId);
  });
}

module.exports = { requestWithdrawal, getWithdrawal, listPending, markPaid, rejectWithdrawal };