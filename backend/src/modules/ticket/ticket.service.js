const { formatTicketNumber } = require('../../utils/random');

/**
 * Called inside a transaction right after a payment is approved.
 * Creates `count` ticket rows and returns their formatted numbers.
 * `conn` must be a transaction connection from withTransaction().
 */
async function generateForPayment(conn, { lotteryId, userId, paymentId, count }) {
  const numbers = [];
  for (let i = 0; i < count; i++) {
    const [result] = await conn.query(
      'INSERT INTO tickets (ticket_number, lottery_id, user_id, payment_id) VALUES (?, ?, ?, ?)',
      ['PENDING', lotteryId, userId, paymentId]
    );
    const ticketNumber = formatTicketNumber(result.insertId);
    await conn.query('UPDATE tickets SET ticket_number = ? WHERE id = ?', [ticketNumber, result.insertId]);
    numbers.push(ticketNumber);
  }
  return numbers;
}

async function listForUser(pool, { lotteryId, userId }) {
  const [rows] = await pool.query(
    'SELECT id, ticket_number, is_winner, created_at FROM tickets WHERE lottery_id = ? AND user_id = ? ORDER BY id',
    [lotteryId, userId]
  );
  return rows.map((row) => ({
    id: row.id,
    ticketNumber: row.ticket_number,
    isWinner: row.is_winner,
    createdAt: row.created_at,
  }));
}

module.exports = { generateForPayment, listForUser };
