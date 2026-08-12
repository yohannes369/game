const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./config/db');
const { initializeDatabase } = require('./config/dbInit');
const { initSocket } = require('./config/socket');
const lotteryScheduler = require('./jobs/lotteryScheduler');

async function start() {
  try {
    // Initialize database schema
    await initializeDatabase();
    
    // Test connection
    await testConnection();

    const server = http.createServer(app);
    const io = initSocket(server);

    server.listen(env.port, () => {
      console.log(`[server] Auth system API running on http://localhost:${env.port}`);
      lotteryScheduler.start();
    });
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    console.error('Make sure MySQL is running and the schema has been imported (see database/schema.sql).');
    process.exit(1);
  }
}

start();
