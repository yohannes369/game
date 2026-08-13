// const mysql = require('mysql2/promise');
// const env = require('./env');

// const pool = mysql.createPool({
//   host: env.db.host,
//   port: env.db.port,
//   user: env.db.user,
//   password: env.db.password,
//   database: env.db.database,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   dateStrings: true,
// });

// async function testConnection() {
//   const conn = await pool.getConnection();
//   try {
//     await conn.ping();
//     console.log('[db] MySQL connection OK');
//   } finally {
//     conn.release();
//   }
// }

// /**
//  * Runs `callback(conn)` inside a single MySQL transaction, committing on
//  * success and rolling back on any thrown error. Used by the lottery modules
//  * for payment approval, the draw, and payouts, so a failure partway through
//  * never leaves tickets/records half-written.
//  *
//  * Usage: await withTransaction(async (conn) => { await conn.query(...); });
//  */
// async function withTransaction(callback) {
//   const conn = await pool.getConnection();
//   try {
//     await conn.beginTransaction();
//     const result = await callback(conn);
//     await conn.commit();
//     return result;
//   } catch (err) {
//     await conn.rollback();
//     throw err;
//   } finally {
//     conn.release();
//   }
// }

// module.exports = { pool, testConnection, withTransaction };
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const env = require('./env');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,

  ssl: {
    ca: fs.readFileSync(
      path.join(__dirname, '../../certs/ca.pem')
    ),
    rejectUnauthorized: true,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

async function testConnection() {
  const conn = await pool.getConnection();

  try {
    await conn.ping();
    console.log('[db] MySQL connection OK');
  } finally {
    conn.release();
  }
}

async function withTransaction(callback) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const result = await callback(conn);

    await conn.commit();

    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  pool,
  testConnection,
  withTransaction,
};