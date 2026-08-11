// const { pool, withTransaction } = require('../../config/db');
// const { HttpError } = require('../auth/auth.service');
// const ticketService = require('../ticket/ticket.service');
// const notificationService = require('../notification/notification.service');
// const { formatEthiopianDateTime } = require('../../utils/time');

// /**
//  * Works out how many tickets a payment is worth, based on the lottery's
//  * ticket_mode (fixed / package / custom) — the "Dynamic Ticket System".
//  */
// async function resolveTicketCount(conn, lottery, { amount, packageId }) {
//   if (lottery.ticket_mode === 'package') {
//     if (!packageId) throw new HttpError(422, 'packageId is required for this lottery.');
//     const [rows] = await conn.query(
//       'SELECT * FROM ticket_packages WHERE id = ? AND lottery_id = ? AND is_active = 1',
//       [packageId, lottery.id]
//     );
//     if (!rows[0]) throw new HttpError(404, 'Ticket package not found.');
//     if (Number(amount) !== Number(rows[0].price)) {
//       throw new HttpError(422, `Amount must equal the package price (${rows[0].price}).`);
//     }
//     return { ticketCount: rows[0].ticket_count, remainder: 0 };
//   }

//   if (lottery.ticket_mode === 'custom') {
//     const price = Number(lottery.ticket_price);
//     const ticketCount = Math.floor(Number(amount) / price);
//     if (ticketCount < 1) throw new HttpError(422, `Minimum amount is ${price}.`);
//     const remainder = Number(amount) - ticketCount * price;
//     return { ticketCount, remainder };
//   }

//   // fixed mode: amount must be an exact multiple of ticket price
//   const price = Number(lottery.ticket_price);
//   if (Number(amount) % price !== 0) {
//     throw new HttpError(422, `Amount must be a multiple of ${price}.`);
//   }
//   return { ticketCount: Number(amount) / price, remainder: 0 };
// }

// async function submitPayment(userId, body, screenshotPath) {
//   const { lotteryId, packageId, amount, method, senderName, phoneNumber, transactionId } = body;

//   const [lotteryRows] = await pool.query('SELECT * FROM lotteries WHERE id = ?', [lotteryId]);
//   if (!lotteryRows[0]) throw new HttpError(404, 'Lottery not found.');
//   const lottery = lotteryRows[0];
//   if (lottery.status !== 'active') throw new HttpError(422, 'This lottery is not accepting payments right now.');

//   // Validate early so the user gets immediate feedback (tickets are only
//   // generated on admin approval, not here).
//   await resolveTicketCount(pool, lottery, { amount, packageId });

//   const [existing] = await pool.query(
//     'SELECT id FROM payments WHERE method = ? AND transaction_id = ?',
//     [method, transactionId]
//   );
//   if (existing[0]) throw new HttpError(409, 'This transaction ID has already been submitted.');

//   const [result] = await pool.query(
//     `INSERT INTO payments
//       (user_id, lottery_id, package_id, amount, method, sender_name, phone_number, transaction_id, screenshot_path, status)
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
//     [userId, lotteryId, packageId || null, amount, method, senderName, phoneNumber, transactionId, screenshotPath || null]
//   );

//   return getPayment(result.insertId);
// }

// async function getPayment(id) {
//   const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
//   if (!rows[0]) throw new HttpError(404, 'Payment not found.');
//   return rows[0];
// }

// function normalizePaymentMethod(value) {
//   if (!value) return value;
//   return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_');
// }

// async function listPending() {
//   const [rows] = await pool.query(
//     `SELECT p.*, u.full_name, u.username, u.phone_number AS user_phone, l.name AS lottery_name
//      FROM payments p
//      JOIN users u ON u.id = p.user_id
//      JOIN lotteries l ON l.id = p.lottery_id
//      WHERE p.status = 'pending' ORDER BY p.created_at ASC`
//   );
//   return rows.map((row) => ({
//     ...row,
//     method: normalizePaymentMethod(row.method),
//     createdAtEt: formatEthiopianDateTime(row.created_at),
//   }));
// }

// async function listAll(query = {}) {
//   const filters = [];
//   const values = [];

//   if (query.status) {
//     filters.push('p.status = ?');
//     values.push(query.status);
//   }

//   if (query.search) {
//     filters.push('(u.full_name LIKE ? OR u.username LIKE ? OR l.name LIKE ? OR p.transaction_id LIKE ?)');
//     const term = `%${query.search}%`;
//     values.push(term, term, term, term);
//   }

//   const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
//   const [rows] = await pool.query(
//     `SELECT p.*, u.full_name, u.username, u.phone_number AS user_phone, l.name AS lottery_name
//      FROM payments p
//      JOIN users u ON u.id = p.user_id
//      JOIN lotteries l ON l.id = p.lottery_id
//      ${whereClause}
//      ORDER BY p.created_at DESC`,
//     values
//   );

//   return rows.map((row) => ({
//     ...row,
//     method: normalizePaymentMethod(row.method),
//     createdAtEt: formatEthiopianDateTime(row.created_at),
//   }));
// }

// async function summarizePayments(query = {}) {
//   const filters = [];
//   const values = [];

//   if (query.status) {
//     filters.push('p.status = ?');
//     values.push(query.status);
//   }

//   if (query.search) {
//     filters.push('(u.full_name LIKE ? OR u.username LIKE ? OR l.name LIKE ? OR p.transaction_id LIKE ?)');
//     const term = `%${query.search}%`;
//     values.push(term, term, term, term);
//   }

//   const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
//   const [rows] = await pool.query(
//     `SELECT COUNT(*) AS totalPayments, COALESCE(SUM(p.amount), 0) AS totalAmount
//      FROM payments p
//      JOIN users u ON u.id = p.user_id
//      JOIN lotteries l ON l.id = p.lottery_id
//      ${whereClause}`,
//     values
//   );
//   return rows[0];
// }

// async function listMine(userId) {
//   const [rows] = await pool.query(
//     `SELECT p.*, l.name AS lottery_name
//      FROM payments p
//      JOIN lotteries l ON l.id = p.lottery_id
//      WHERE p.user_id = ?
//      ORDER BY p.created_at DESC`,
//     [userId]
//   );

//   const result = [];
//   for (const row of rows) {
//     const [tickets] = await pool.query('SELECT ticket_number FROM tickets WHERE payment_id = ? ORDER BY id', [row.id]);
//     result.push({
//       ...row,
//       ticketNumbers: tickets.map((ticket) => ticket.ticket_number),
//       createdAtEt: formatEthiopianDateTime(row.created_at),
//     });
//   }
//   return result;
// }

// async function approvePayment(paymentId, adminId) {
//   return withTransaction(async (conn) => {
//     const [rows] = await conn.query('SELECT * FROM payments WHERE id = ? FOR UPDATE', [paymentId]);
//     if (!rows[0]) throw new HttpError(404, 'Payment not found.');
//     const payment = rows[0];
//     if (payment.status !== 'pending') throw new HttpError(422, 'This payment has already been reviewed.');

//     const [lotteryRows] = await conn.query('SELECT * FROM lotteries WHERE id = ?', [payment.lottery_id]);
//     const lottery = lotteryRows[0];
//     if (!lottery) throw new HttpError(404, 'Lottery not found.');

//     const { ticketCount } = await resolveTicketCount(conn, lottery, {
//       amount: payment.amount,
//       packageId: payment.package_id,
//     });

//     const ticketNumbers = await ticketService.generateForPayment(conn, {
//       lotteryId: payment.lottery_id,
//       userId: payment.user_id,
//       paymentId: payment.id,
//       count: ticketCount,
//     });

//     await conn.query(
//       `UPDATE payments SET status = 'approved', tickets_generated = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?`,
//       [ticketCount, adminId, paymentId]
//     );

//     await conn.query(
//       `INSERT INTO transactions (user_id, type, reference_id, amount) VALUES (?, 'ticket_purchase', ?, ?)`,
//       [payment.user_id, paymentId, payment.amount]
//     );

//     await notificationService.create(
//       {
//         userId: payment.user_id,
//         type: 'payment_approved',
//         title: 'Payment Approved',
//         body: `Your payment is approved. You received ${ticketCount} ticket(s): ${ticketNumbers.join(', ')}.`,
//       },
//       conn
//     );

//     return { paymentId, ticketCount, ticketNumbers };
//   });
// }

// async function rejectPayment(paymentId, adminId, reason) {
//   const payment = await getPayment(paymentId);
//   if (payment.status !== 'pending') throw new HttpError(422, 'This payment has already been reviewed.');

//   await pool.query(
//     `UPDATE payments SET status = 'rejected', rejection_reason = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?`,
//     [reason || null, adminId, paymentId]
//   );

//   await notificationService.create({
//     userId: payment.user_id,
//     type: 'payment_rejected',
//     title: 'Payment Rejected',
//     body: reason ? `Your payment was rejected: ${reason}` : 'Your payment was rejected.',
//   });

//   return getPayment(paymentId);
// }

// module.exports = { submitPayment, getPayment, listPending, listAll, summarizePayments, listMine, approvePayment, rejectPayment, resolveTicketCount };
const { pool, withTransaction } = require('../../config/db');
const { HttpError } = require('../auth/auth.service');
const ticketService = require('../ticket/ticket.service');
const notificationService = require('../notification/notification.service');
const { formatEthiopianDateTime } = require('../../utils/time');

/**
 * Works out how many tickets a payment is worth, based on the lottery's
 * ticket_mode (fixed / package / custom) — the "Dynamic Ticket System".
 */
async function resolveTicketCount(conn, lottery, { amount, packageId }) {
  if (lottery.ticket_mode === 'package') {
    if (!packageId) throw new HttpError(422, 'packageId is required for this lottery.');
    const [rows] = await conn.query(
      'SELECT * FROM ticket_packages WHERE id = ? AND lottery_id = ? AND is_active = 1',
      [packageId, lottery.id]
    );
    if (!rows[0]) throw new HttpError(404, 'Ticket package not found.');
    if (Number(amount) !== Number(rows[0].price)) {
      throw new HttpError(422, `Amount must equal the package price (${rows[0].price}).`);
    }
    return { ticketCount: rows[0].ticket_count, remainder: 0 };
  }

  if (lottery.ticket_mode === 'custom') {
    const price = Number(lottery.ticket_price);
    const ticketCount = Math.floor(Number(amount) / price);
    if (ticketCount < 1) throw new HttpError(422, `Minimum amount is ${price}.`);
    const remainder = Number(amount) - ticketCount * price;
    return { ticketCount, remainder };
  }

  // fixed mode: amount must be an exact multiple of ticket price
  const price = Number(lottery.ticket_price);
  if (Number(amount) % price !== 0) {
    throw new HttpError(422, `Amount must be a multiple of ${price}.`);
  }
  return { ticketCount: Number(amount) / price, remainder: 0 };
}

async function submitPayment(userId, body, screenshotPath) {
  const { lotteryId, packageId, amount, method, senderName, phoneNumber, transactionId } = body;

  const [lotteryRows] = await pool.query('SELECT * FROM lotteries WHERE id = ?', [lotteryId]);
  if (!lotteryRows[0]) throw new HttpError(404, 'Lottery not found.');
  const lottery = lotteryRows[0];
  if (lottery.status !== 'active') throw new HttpError(422, 'This lottery is not accepting payments right now.');

  // Validate early so the user gets immediate feedback (tickets are only
  // generated on admin approval, not here).
  await resolveTicketCount(pool, lottery, { amount, packageId });

  const [existing] = await pool.query(
    'SELECT id FROM payments WHERE method = ? AND transaction_id = ?',
    [method, transactionId]
  );
  if (existing[0]) throw new HttpError(409, 'This transaction ID has already been submitted.');

  const [result] = await pool.query(
    `INSERT INTO payments
      (user_id, lottery_id, package_id, amount, method, sender_name, phone_number, transaction_id, screenshot_path, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [userId, lotteryId, packageId || null, amount, method, senderName, phoneNumber, transactionId, screenshotPath || null]
  );

  return getPayment(result.insertId);
}

async function getPayment(id) {
  const [rows] = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);
  if (!rows[0]) throw new HttpError(404, 'Payment not found.');
  return rows[0];
}

function normalizePaymentMethod(value) {
  if (!value) return value;
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

async function listPending() {
  const [rows] = await pool.query(
    `SELECT p.*, u.full_name, u.username, u.phone_number AS user_phone, l.name AS lottery_name
     FROM payments p
     JOIN users u ON u.id = p.user_id
     JOIN lotteries l ON l.id = p.lottery_id
     WHERE p.status = 'pending' ORDER BY p.created_at ASC`
  );
  return rows.map((row) => ({
    ...row,
    method: normalizePaymentMethod(row.method),
    createdAtEt: formatEthiopianDateTime(row.created_at),
  }));
}

async function listAll(query = {}) {
  const filters = [];
  const values = [];

  if (query.status) {
    filters.push('p.status = ?');
    values.push(query.status);
  }

  if (query.search) {
    filters.push('(u.full_name LIKE ? OR u.username LIKE ? OR l.name LIKE ? OR p.transaction_id LIKE ?)');
    const term = `%${query.search}%`;
    values.push(term, term, term, term);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT p.*, u.full_name, u.username, u.phone_number AS user_phone, l.name AS lottery_name,
     GROUP_CONCAT(t.ticket_number ORDER BY t.id SEPARATOR ',') AS ticket_numbers
     FROM payments p
     JOIN users u ON u.id = p.user_id
     JOIN lotteries l ON l.id = p.lottery_id
     LEFT JOIN tickets t ON t.payment_id = p.id
     ${whereClause}
     GROUP BY p.id
     ORDER BY p.created_at DESC`,
    values
  );

  return rows.map((row) => ({
    ...row,
    method: normalizePaymentMethod(row.method),
    createdAtEt: formatEthiopianDateTime(row.created_at),
    ticketNumbers: row.ticket_numbers ? String(row.ticket_numbers).split(',') : [],
  }));
}

async function summarizePayments(query = {}) {
  const filters = [];
  const values = [];

  if (query.status) {
    filters.push('p.status = ?');
    values.push(query.status);
  }

  if (query.search) {
    filters.push('(u.full_name LIKE ? OR u.username LIKE ? OR l.name LIKE ? OR p.transaction_id LIKE ?)');
    const term = `%${query.search}%`;
    values.push(term, term, term, term);
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS totalPayments, COALESCE(SUM(p.amount), 0) AS totalAmount
     FROM payments p
     JOIN users u ON u.id = p.user_id
     JOIN lotteries l ON l.id = p.lottery_id
     ${whereClause}`,
    values
  );
  return rows[0];
}

async function listMine(userId) {
  const [rows] = await pool.query(
    `SELECT p.*, l.name AS lottery_name
     FROM payments p
     JOIN lotteries l ON l.id = p.lottery_id
     WHERE p.user_id = ?
     ORDER BY p.created_at DESC`,
    [userId]
  );

  const result = [];
  for (const row of rows) {
    const [tickets] = await pool.query('SELECT ticket_number FROM tickets WHERE payment_id = ? ORDER BY id', [row.id]);
    result.push({
      ...row,
      ticketNumbers: tickets.map((ticket) => ticket.ticket_number),
      createdAtEt: formatEthiopianDateTime(row.created_at),
    });
  }
  return result;
}

/**
 * Admin view: one row per user who has at least one APPROVED payment,
 * with their total paid amount and total tickets across all lotteries.
 * Supports search (name / username / phone) and pagination.
 */
async function listPaidUsers(query = {}) {
  const filters = ["p.status = 'approved'"];
  const values = [];

  if (query.search) {
    filters.push('(u.full_name LIKE ? OR u.username LIKE ? OR u.phone_number LIKE ?)');
    const term = `%${query.search}%`;
    values.push(term, term, term);
  }

  const whereClause = `WHERE ${filters.join(' AND ')}`;

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 25));
  const offset = (page - 1) * limit;

  const [countRows] = await pool.query(
    `SELECT COUNT(DISTINCT p.user_id) AS total
     FROM payments p
     JOIN users u ON u.id = p.user_id
     ${whereClause}`,
    values
  );
  const total = countRows[0].total;

  const [rows] = await pool.query(
    `SELECT
        u.id,
        u.full_name AS name,
        u.username,
        u.phone_number AS phoneNumber,
        COUNT(p.id) AS paymentCount,
        SUM(p.amount) AS totalPaid,
        COALESCE(SUM(p.tickets_generated), 0) AS ticketCount,
        MAX(p.reviewed_at) AS lastPaymentAt
     FROM payments p
     JOIN users u ON u.id = p.user_id
     ${whereClause}
     GROUP BY u.id, u.full_name, u.username, u.phone_number
     ORDER BY totalPaid DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  const users = rows.map((row) => ({
    ...row,
    totalPaid: Number(row.totalPaid),
    ticketCount: Number(row.ticketCount),
    paymentCount: Number(row.paymentCount),
  }));

  return { users, total, page, limit };
}

async function approvePayment(paymentId, adminId) {
  return withTransaction(async (conn) => {
    const [rows] = await conn.query('SELECT * FROM payments WHERE id = ? FOR UPDATE', [paymentId]);
    if (!rows[0]) throw new HttpError(404, 'Payment not found.');
    const payment = rows[0];
    if (payment.status !== 'pending') throw new HttpError(422, 'This payment has already been reviewed.');

    const [lotteryRows] = await conn.query('SELECT * FROM lotteries WHERE id = ?', [payment.lottery_id]);
    const lottery = lotteryRows[0];
    if (!lottery) throw new HttpError(404, 'Lottery not found.');

    const { ticketCount } = await resolveTicketCount(conn, lottery, {
      amount: payment.amount,
      packageId: payment.package_id,
    });

    const ticketNumbers = await ticketService.generateForPayment(conn, {
      lotteryId: payment.lottery_id,
      userId: payment.user_id,
      paymentId: payment.id,
      count: ticketCount,
    });

    await conn.query(
      `UPDATE payments SET status = 'approved', tickets_generated = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?`,
      [ticketCount, adminId, paymentId]
    );

    await conn.query(
      `INSERT INTO transactions (user_id, type, reference_id, amount) VALUES (?, 'ticket_purchase', ?, ?)`,
      [payment.user_id, paymentId, payment.amount]
    );

    await notificationService.create(
      {
        userId: payment.user_id,
        type: 'payment_approved',
        title: 'Payment Approved',
        body: `Your payment is approved. You received ${ticketCount} ticket(s): ${ticketNumbers.join(', ')}.`,
      },
      conn
    );

    // Also create an explicit ticket assignment notification so clients
    // can show a dedicated "ticket_assigned" event in real-time.
    await notificationService.create(
      {
        userId: payment.user_id,
        type: 'ticket_assigned',
        title: 'Lottery Number Assigned',
        body: `Your lottery number(s): ${ticketNumbers.join(', ')}`,
        meta: { paymentId: paymentId, tickets: ticketNumbers },
      },
      conn
    );

    return { paymentId, ticketCount, ticketNumbers };
  });
}

async function rejectPayment(paymentId, adminId, reason) {
  const payment = await getPayment(paymentId);
  if (payment.status !== 'pending') throw new HttpError(422, 'This payment has already been reviewed.');

  await pool.query(
    `UPDATE payments SET status = 'rejected', rejection_reason = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?`,
    [reason || null, adminId, paymentId]
  );

  await notificationService.create({
    userId: payment.user_id,
    type: 'payment_rejected',
    title: 'Payment Rejected',
    body: reason ? `Your payment was rejected: ${reason}` : 'Your payment was rejected.',
  });

  return getPayment(paymentId);
}

module.exports = {
  submitPayment,
  getPayment,
  listPending,
  listAll,
  summarizePayments,
  listMine,
  listPaidUsers,
  approvePayment,
  rejectPayment,
  resolveTicketCount,
};