const { pool } = require('../../config/db');

async function getAnalytics() {
  const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
  const [[{ activeLotteries }]] = await pool.query("SELECT COUNT(*) AS activeLotteries FROM lotteries WHERE status = 'active'");
  const [[{ ticketsSold }]] = await pool.query('SELECT COUNT(*) AS ticketsSold FROM tickets');
  const [[{ revenue }]] = await pool.query("SELECT COALESCE(SUM(amount), 0) AS revenue FROM payments WHERE status = 'approved'");
  const [[{ paidWinners }]] = await pool.query("SELECT COUNT(*) AS paidWinners FROM withdrawals WHERE status = 'paid'");

  const [dailySales] = await pool.query(
    `SELECT DATE(created_at) AS day, COUNT(*) AS tickets, SUM(amount) AS revenue
     FROM payments WHERE status = 'approved' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     GROUP BY DATE(created_at) ORDER BY day`
  );

  const [monthlyRevenue] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS revenue
     FROM payments WHERE status = 'approved'
     GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY month`
  );

  return {
    totalUsers,
    activeLotteries,
    ticketsSold,
    revenue,
    paidWinners,
    charts: { dailySales, monthlyRevenue },
  };
}

async function getSetting(key, fallback = null) {
  const [rows] = await pool.query('SELECT value FROM settings WHERE `key` = ?', [key]);
  return rows[0] ? rows[0].value : fallback;
}

async function setSetting(key, value) {
  await pool.query(
    'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
    [key, JSON.stringify(value), JSON.stringify(value)]
  );
}

module.exports = { getAnalytics, getSetting, setSetting };
