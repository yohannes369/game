// const http = require('http');
// const app = require('./app');
// const env = require('./config/env');
// const { testConnection } = require('./config/db');
// const { initializeDatabase } = require('./config/dbInit');
// const { initSocket } = require('./config/socket');
// const lotteryScheduler = require('./jobs/lotteryScheduler');

// async function start() {
//   try {
//     // Initialize database schema
//     await initializeDatabase();
    
//     // Test connection
//     await testConnection();

//     const server = http.createServer(app);
//     const io = initSocket(server);

//     server.listen(env.port, () => {
//       console.log(`[server] Auth system API running on http://localhost:${env.port}`);
//       lotteryScheduler.start();
//     });
//   } catch (err) {
//     console.error('[server] Failed to start:', err.message);
//     console.error('Make sure MySQL is running and the schema has been imported (see database/schema.sql).');
//     process.exit(1);
//   }
// }

// start();


// const http = require('http');
// const app = require('./app');
// const env = require('./config/env');
// const { testConnection } = require('./config/db');
// const { initializeDatabase } = require('./config/dbInit');
// const { initSocket } = require('./config/socket');
// const lotteryScheduler = require('./jobs/lotteryScheduler');

// async function start() {
//   try {
//     console.log('[server] Starting backend...');

//     // Initialize database
//     await initializeDatabase();
//     console.log('[db] Database initialization completed');

//     // Test database connection
//     await testConnection();

//     // Create HTTP server
//     const server = http.createServer(app);

//     // Initialize Socket.IO
//     initSocket(server);

//     // Render provides the PORT environment variable.
//     // env.port already reads process.env.PORT.
//     server.listen(env.port, '0.0.0.0', () => {
//       console.log(`[server] API running on port ${env.port}`);

//       // Start lottery scheduler
//       lotteryScheduler.start();
//       console.log('[scheduler] Lottery scheduler started');
//     });

//     // Graceful shutdown
//     process.on('SIGTERM', () => {
//       console.log('[server] SIGTERM received. Shutting down...');

//       server.close(() => {
//         console.log('[server] Server closed');
//         process.exit(0);
//       });
//     });

//     process.on('SIGINT', () => {
//       console.log('[server] SIGINT received. Shutting down...');

//       server.close(() => {
//         console.log('[server] Server closed');
//         process.exit(0);
//       });
//     });

//   } catch (err) {
//     console.error('[server] Failed to start:', err);
//     process.exit(1);
//   }
// }

// start();

const http = require('http');

const app = require('./app');
const env = require('./config/env');
const {
  pool,
  testConnection,
} = require('./config/db');

const { initializeDatabase } = require('./config/dbInit');
const { initSocket } = require('./config/socket');

const lotteryScheduler = require('./jobs/lotteryScheduler');

async function start() {
  try {
    console.log('[server] Starting backend...');

    // =====================================================
    // INITIALIZE DATABASE
    // =====================================================

    await initializeDatabase();

    console.log('[db] Database initialization completed');

    // =====================================================
    // TEST DATABASE CONNECTION
    // =====================================================

    await testConnection();

    // =====================================================
    // DEBUG: SHOW DATABASE RENDER IS ACTUALLY USING
    // =====================================================

    const [dbInfo] = await pool.query(`
      SELECT
        DATABASE() AS database_name,
        @@hostname AS mysql_hostname,
        @@port AS mysql_port,
        USER() AS connected_user,
        CURRENT_USER() AS mysql_user
    `);

    console.log('[db] Render database info:', dbInfo[0]);

    // =====================================================
    // DEBUG: SHOW TABLES
    // =====================================================

    const [tables] = await pool.query(`
      SHOW TABLES
    `);

    console.log('[db] Render tables:', tables);

    // =====================================================
    // CREATE HTTP SERVER
    // =====================================================

    const server = http.createServer(app);

    // =====================================================
    // SOCKET.IO
    // =====================================================

    initSocket(server);

    // =====================================================
    // START SERVER
    // =====================================================

    server.listen(env.port, '0.0.0.0', () => {
      console.log(
        `[server] API running on port ${env.port}`
      );

      lotteryScheduler.start();

      console.log(
        '[scheduler] Lottery scheduler started'
      );
    });

    // =====================================================
    // GRACEFUL SHUTDOWN
    // =====================================================

    process.on('SIGTERM', () => {
      console.log(
        '[server] SIGTERM received. Shutting down...'
      );

      server.close(() => {
        console.log('[server] Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log(
        '[server] SIGINT received. Shutting down...'
      );

      server.close(() => {
        console.log('[server] Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error(
      '[server] Failed to start:',
      err
    );

    process.exit(1);
  }
}

start();