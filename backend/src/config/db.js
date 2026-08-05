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

// module.exports = { pool, testConnection };
const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host: env.db.host,
  port: Number(env.db.port),
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,

  // Required for Aiven MySQL
  ssl: {
    rejectUnauthorized: false,
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

async function testConnection() {
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.ping();
    console.log('✅ MySQL connection successful');
  } catch (error) {
    console.error('❌ MySQL connection failed');
    console.error(error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  pool,
  testConnection,
};