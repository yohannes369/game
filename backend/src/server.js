const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./config/db');

async function start() {
  try {
    await testConnection();
    app.listen(env.port, () => {
      console.log(`[server] Auth system API running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    console.error('Make sure MySQL is running and the schema has been imported (see database/schema.sql).');
    process.exit(1);
  }
}

start();
