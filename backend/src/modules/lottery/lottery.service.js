// const { pool } = require('../../config/db');
// const { HttpError } = require('../auth/auth.service');

// function toPublicLottery(row) {
//   if (!row) return null;
//   return {
//     id: row.id,
//     name: row.name,
//     description: row.description,
//     ticketPrice: row.ticket_price,
//     ticketMode: row.ticket_mode,
//     startDate: row.start_date,
//     endDate: row.end_date,
//     spinAt: row.spin_at,
//     status: row.status,
//     createdBy: row.created_by,
//     createdAt: row.created_at,
//   };
// }

// async function createLottery({ name, description, ticketPrice, ticketMode, startDate, endDate, spinAt, prizes }, creatorId) {
//   const [result] = await pool.query(
//     `INSERT INTO lotteries
//       (name, description, ticket_price, ticket_mode, start_date, end_date, spin_at, status, created_by)
//      VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
//     [name, description || null, ticketPrice, ticketMode || 'fixed', startDate, endDate, spinAt, creatorId]
//   );

//   const lotteryId = result.insertId;

//   if (Array.isArray(prizes) && prizes.length > 0) {
//     const values = prizes.map((p, idx) => [lotteryId, idx + 1, p.amount, p.label || null]);
//     await pool.query(
//       'INSERT INTO lottery_prizes (lottery_id, rank_position, prize_amount, label) VALUES ?',
//       [values]
//     );
//   }

//   return getLottery(lotteryId);
// }

// async function addPackages(lotteryId, packages) {
//   if (!Array.isArray(packages) || packages.length === 0) {
//     throw new HttpError(422, 'At least one package is required.');
//   }
//   const values = packages.map((p) => [lotteryId, p.name, p.price, p.ticketCount]);
//   await pool.query(
//     'INSERT INTO ticket_packages (lottery_id, name, price, ticket_count) VALUES ?',
//     [values]
//   );
//   return getLottery(lotteryId);
// }

// async function getLottery(id) {
//   const [rows] = await pool.query('SELECT * FROM lotteries WHERE id = ? LIMIT 1', [id]);
//   if (!rows[0]) throw new HttpError(404, 'Lottery not found.');

//   const [prizes] = await pool.query(
//     'SELECT id, rank_position, prize_amount, label FROM lottery_prizes WHERE lottery_id = ? ORDER BY rank_position',
//     [id]
//   );
//   const [packages] = await pool.query(
//     'SELECT id, name, price, ticket_count, is_active FROM ticket_packages WHERE lottery_id = ?',
//     [id]
//   );

//   return { ...toPublicLottery(rows[0]), prizes, packages };
// }

// async function listLotteries(status) {
//   const [rows] = status
//     ? await pool.query(
//         `SELECT id, name, ticket_price, ticket_mode, start_date, end_date, spin_at, status
//          FROM lotteries WHERE status = ? ORDER BY spin_at DESC`,
//         [status]
//       )
//     : await pool.query(
//         `SELECT id, name, ticket_price, ticket_mode, start_date, end_date, spin_at, status
//          FROM lotteries ORDER BY spin_at DESC`
//       );
//   return rows.map(toPublicLottery);
// }

// async function setStatus(id, status) {
//   const allowed = ['draft', 'active', 'locked', 'spinning', 'completed', 'cancelled'];
//   if (!allowed.includes(status)) throw new HttpError(422, 'Invalid status.');

//   const [result] = await pool.query('UPDATE lotteries SET status = ? WHERE id = ?', [status, id]);
//   if (result.affectedRows === 0) throw new HttpError(404, 'Lottery not found.');

//   return getLottery(id);
// }

// /** Countdown + a user's ticket count/odds — feeds the dashboard widget. */
// async function getDashboardSummary(lotteryId, userId) {
//   const lottery = await getLottery(lotteryId);

//   const [[{ totalTickets }]] = await pool.query(
//     'SELECT COUNT(*) AS totalTickets FROM tickets WHERE lottery_id = ?',
//     [lotteryId]
//   );
//   const [[{ userTickets }]] = await pool.query(
//     'SELECT COUNT(*) AS userTickets FROM tickets WHERE lottery_id = ? AND user_id = ?',
//     [lotteryId, userId]
//   );

//   return {
//     lottery,
//     totalTickets,
//     userTickets,
//     winningChance: totalTickets > 0 ? `${userTickets}/${totalTickets}` : '0/0',
//   };
// }

// module.exports = {
//   toPublicLottery,
//   createLottery,
//   addPackages,
//   getLottery,
//   listLotteries,
//   setStatus,
//   getDashboardSummary,
// };
const { pool } = require('../../config/db');
const { HttpError } = require('../auth/auth.service');
const notificationService = require('../notification/notification.service');
const { toDbDateTime, formatEthiopianDateTime } = require('../../utils/time');

function normalizeLotteryPayload(payload = {}) {
  const normalized = { ...payload };

  if (typeof normalized.name === 'undefined' && typeof normalized.title !== 'undefined') {
    normalized.name = normalized.title;
  }

  if (typeof normalized.ticketPrice === 'undefined' && typeof normalized.ticket_price !== 'undefined') {
    normalized.ticketPrice = normalized.ticket_price;
  }
  if (typeof normalized.ticket_price === 'undefined' && typeof normalized.ticketPrice !== 'undefined') {
    normalized.ticket_price = normalized.ticketPrice;
  }

  if (typeof normalized.ticketPrice !== 'undefined') {
    normalized.ticketPrice = Number(normalized.ticketPrice);
  }
  if (typeof normalized.ticket_price !== 'undefined') {
    normalized.ticket_price = Number(normalized.ticket_price);
  }

  if (typeof normalized.ticketMode === 'undefined' && typeof normalized.ticket_mode !== 'undefined') {
    normalized.ticketMode = normalized.ticket_mode;
  }
  if (typeof normalized.ticket_mode === 'undefined' && typeof normalized.ticketMode !== 'undefined') {
    normalized.ticket_mode = normalized.ticketMode;
  }

  if (typeof normalized.startDate === 'undefined' && typeof normalized.start_date !== 'undefined') {
    normalized.startDate = normalized.start_date;
  }
  if (typeof normalized.start_date === 'undefined' && typeof normalized.startDate !== 'undefined') {
    normalized.start_date = normalized.startDate;
  }

  if (typeof normalized.endDate === 'undefined' && typeof normalized.end_date !== 'undefined') {
    normalized.endDate = normalized.end_date;
  }
  if (typeof normalized.end_date === 'undefined' && typeof normalized.endDate !== 'undefined') {
    normalized.end_date = normalized.endDate;
  }

  if (typeof normalized.spinAt === 'undefined' && typeof normalized.spin_at !== 'undefined') {
    normalized.spinAt = normalized.spin_at;
  }
  if (typeof normalized.spin_at === 'undefined' && typeof normalized.spinAt !== 'undefined') {
    normalized.spin_at = normalized.spinAt;
  }

  return normalized;
}

function toPublicLottery(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    ticketPrice: row.ticket_price,
    ticketMode: row.ticket_mode,
    startDate: row.start_date,
    endDate: row.end_date,
    spinAt: row.spin_at,
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    startDateEt: formatEthiopianDateTime(row.start_date),
    endDateEt: formatEthiopianDateTime(row.end_date),
    spinAtEt: formatEthiopianDateTime(row.spin_at),
  };
}

async function createLottery(payload, creatorId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const normalizedPayload = normalizeLotteryPayload(payload);
    const { name, description, ticketPrice, ticketMode, startDate, endDate, spinAt, prizes } = normalizedPayload;

    const normalizedStartDate = toDbDateTime(startDate);
    const normalizedEndDate = toDbDateTime(endDate);
    const normalizedSpinAt = toDbDateTime(spinAt);

    const [result] = await connection.query(
      `INSERT INTO lotteries
        (name, description, ticket_price, ticket_mode, start_date, end_date, spin_at, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
      [name, description || null, ticketPrice, ticketMode || 'fixed', normalizedStartDate, normalizedEndDate, normalizedSpinAt, creatorId]
    );

    const lotteryId = result.insertId;

    if (Array.isArray(prizes) && prizes.length > 0) {
      const values = prizes.map((p, idx) => [lotteryId, idx + 1, p.amount, p.label || null]);
      await connection.query(
        'INSERT INTO lottery_prizes (lottery_id, rank_position, prize_amount, label) VALUES ?',
        [values]
      );
    }

    const [allUsers] = await connection.query('SELECT id FROM users');
    if (allUsers.length > 0) {
      await notificationService.create({
        userIds: allUsers.map((row) => row.id),
        type: 'new_lottery_created',
        title: 'New Lottery Created',
        body: `A new lottery, ${name}, is now available.`,
      }, connection);
    }

    await connection.commit();
    return getLottery(lotteryId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function addPackages(lotteryId, packages) {
  if (!Array.isArray(packages) || packages.length === 0) {
    throw new HttpError(422, 'At least one package is required.');
  }

  // Ensure lottery exists first
  await getLottery(lotteryId);

  const values = packages.map((p) => [lotteryId, p.name, p.price, p.ticketCount]);
  await pool.query(
    'INSERT INTO ticket_packages (lottery_id, name, price, ticket_count) VALUES ?',
    [values]
  );

  return getLottery(lotteryId);
}

async function updateLottery(id, payload) {
  const normalizedPayload = normalizeLotteryPayload(payload);
  const existing = await pool.query('SELECT id, status FROM lotteries WHERE id = ? LIMIT 1', [id]);
  if (!existing[0][0]) throw new HttpError(404, 'Lottery not found.');

  if (['completed', 'spinning'].includes(existing[0][0].status)) {
    throw new HttpError(422, 'Cannot edit a lottery after the draw has started.');
  }

  const updates = [];
  const values = [];

  if (typeof normalizedPayload.name !== 'undefined') {
    updates.push('name = ?');
    values.push(normalizedPayload.name);
  }
  if (typeof normalizedPayload.description !== 'undefined') {
    updates.push('description = ?');
    values.push(normalizedPayload.description || null);
  }
  if (typeof normalizedPayload.ticketPrice !== 'undefined') {
    updates.push('ticket_price = ?');
    values.push(normalizedPayload.ticketPrice);
  }
  if (typeof normalizedPayload.ticketMode !== 'undefined') {
    updates.push('ticket_mode = ?');
    values.push(normalizedPayload.ticketMode || 'fixed');
  }
  if (typeof normalizedPayload.startDate !== 'undefined') {
    updates.push('start_date = ?');
    values.push(toDbDateTime(normalizedPayload.startDate));
  }
  if (typeof normalizedPayload.endDate !== 'undefined') {
    updates.push('end_date = ?');
    values.push(toDbDateTime(normalizedPayload.endDate));
  }
  if (typeof normalizedPayload.spinAt !== 'undefined') {
    updates.push('spin_at = ?');
    values.push(toDbDateTime(normalizedPayload.spinAt));
  }

  if (updates.length > 0) {
    values.push(id);
    await pool.query(`UPDATE lotteries SET ${updates.join(', ')} WHERE id = ?`, values);
  }

  if (Array.isArray(normalizedPayload.prizes)) {
    await pool.query('DELETE FROM lottery_prizes WHERE lottery_id = ?', [id]);
    if (normalizedPayload.prizes.length > 0) {
      const prizeRows = normalizedPayload.prizes.map((p, idx) => [id, idx + 1, p.amount, p.label || null]);
      await pool.query('INSERT INTO lottery_prizes (lottery_id, rank_position, prize_amount, label) VALUES ?', [prizeRows]);
    }
  }

  return getLottery(id);
}

async function getLottery(id) {
  const [rows] = await pool.query('SELECT * FROM lotteries WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) throw new HttpError(404, 'Lottery not found.');

  const [prizes] = await pool.query(
    'SELECT id, rank_position, prize_amount, label FROM lottery_prizes WHERE lottery_id = ? ORDER BY rank_position',
    [id]
  );
  const [packages] = await pool.query(
    'SELECT id, name, price, ticket_count, is_active FROM ticket_packages WHERE lottery_id = ?',
    [id]
  );

  return { ...toPublicLottery(rows[0]), prizes, packages };
}

async function listLotteries(status) {
  const [rows] = status
    ? await pool.query(
        `SELECT id, name, ticket_price, ticket_mode, start_date, end_date, spin_at, status, created_at
         FROM lotteries WHERE status = ? ORDER BY spin_at DESC`,
        [status]
      )
    : await pool.query(
        `SELECT id, name, ticket_price, ticket_mode, start_date, end_date, spin_at, status, created_at
         FROM lotteries ORDER BY spin_at DESC`
      );
  return rows.map(toPublicLottery);
}

async function setStatus(id, status) {
  const allowed = ['draft', 'active', 'locked', 'spinning', 'completed', 'cancelled'];
  if (!allowed.includes(status)) throw new HttpError(422, 'Invalid status.');

  const [result] = await pool.query('UPDATE lotteries SET status = ? WHERE id = ?', [status, id]);
  if (result.affectedRows === 0) throw new HttpError(404, 'Lottery not found.');

  return getLottery(id);
}

async function deleteLottery(id) {
  const [lotteryRows] = await pool.query('SELECT * FROM lotteries WHERE id = ? LIMIT 1', [id]);
  if (!lotteryRows[0]) throw new HttpError(404, 'Lottery not found.');

  if (lotteryRows[0].status === 'completed') {
    throw new HttpError(422, 'Cannot delete a lottery after the draw is completed.');
  }

  const [result] = await pool.query('DELETE FROM lotteries WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new HttpError(404, 'Lottery not found.');
  return { message: 'Lottery deleted successfully.' };
}

async function getDashboardSummary(lotteryId, userId) {
  const lottery = await getLottery(lotteryId);

  const [[{ totalTickets }]] = await pool.query(
    'SELECT COUNT(*) AS totalTickets FROM tickets WHERE lottery_id = ?',
    [lotteryId]
  );
  const [[{ userTickets }]] = await pool.query(
    'SELECT COUNT(*) AS userTickets FROM tickets WHERE lottery_id = ? AND user_id = ?',
    [lotteryId, userId]
  );

  return {
    lottery,
    totalTickets,
    userTickets,
    winningChance: totalTickets > 0 ? `${userTickets}/${totalTickets}` : '0/0',
  };
}

module.exports = {
  normalizeLotteryPayload,
  toPublicLottery,
  createLottery,
  addPackages,
  updateLottery,
  getLottery,
  listLotteries,
  setStatus,
  deleteLottery,
  getDashboardSummary,
};