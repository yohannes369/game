const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');
const mysql2Promise = require('mysql2/promise');
const env = require('./env');

/**
 * Initialize database: creates tables from SQL schema files
 */
async function initializeDatabase() {
  let connection;

  try {
    // First, create a raw connection to create the database
    console.log(`[db-init] Connecting to MySQL server...`);
    const rawConn = mysql.createConnection({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
    });

    // Ensure database exists
    console.log(`[db-init] Creating database if not exists: ${env.db.database}`);
    await new Promise((resolve, reject) => {
      rawConn.query(`CREATE DATABASE IF NOT EXISTS ${env.db.database}`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log(`[db-init] Database ready`);
    rawConn.end();

    // Now create a proper connection with the database selected
    connection = await mysql2Promise.createConnection({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
    });

    // Read and execute main schema
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.warn('[db-init] Schema file not found:', schemaPath);
      return;
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
      // Filter out statements that don't work with prepared statements
      .filter(s => !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE '));

    console.log(`[db-init] Executing ${statements.length} statements from schema.sql`);
    let successCount = 0;
    for (const statement of statements) {
      try {
        await connection.query(statement);
        successCount++;
      } catch (err) {
        // Silently ignore "already exists" errors
        if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
          console.error('[db-init] Error:', err.message.substring(0, 100));
        }
      }
    }
    console.log(`[db-init] Schema initialized (${successCount}/${statements.length} statements executed)`);

    // Read and execute lottery schema
    const lotterySchemaPath = path.join(__dirname, '../../database/lottery_schema.sql');
    if (fs.existsSync(lotterySchemaPath)) {
      const lotterySchema = fs.readFileSync(lotterySchemaPath, 'utf-8');
      const lotteryStatements = lotterySchema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))
        .filter(s => !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE '));

      console.log(`[db-init] Executing ${lotteryStatements.length} statements from lottery_schema.sql`);
      let lotterySuccessCount = 0;
      for (const statement of lotteryStatements) {
        try {
          await connection.query(statement);
          lotterySuccessCount++;
        } catch (err) {
          if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
            console.error('[db-init] Error:', err.message.substring(0, 100));
          }
        }
      }
      console.log(`[db-init] Lottery schema initialized (${lotterySuccessCount}/${lotteryStatements.length} statements executed)`);
    }

    // Run migration files
    const migrationsPath = path.join(__dirname, '../../migrations');
    if (fs.existsSync(migrationsPath)) {
      const migrationFiles = fs.readdirSync(migrationsPath)
        .filter(f => f.endsWith('.sql'))
        .sort();

      for (const file of migrationFiles) {
        const filePath = path.join(migrationsPath, file);
        const migration = fs.readFileSync(filePath, 'utf-8');
        const migrationStatements = migration
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'))
          .filter(s => !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE '));

        for (const statement of migrationStatements) {
          try {
            await connection.query(statement);
          } catch (err) {
            if (!err.message.includes('already exists') && !err.message.includes('Duplicate')) {
              console.error(`[db-init] Error in ${file}:`, err.message.substring(0, 100));
            }
          }
        }
      }
      console.log(`[db-init] Migrations completed`);
    }

    console.log('[db-init] ✓ Database initialization complete');
  } catch (err) {
    console.error('[db-init] ✗ Failed to initialize database:', err.message);
    throw err;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = { initializeDatabase };
