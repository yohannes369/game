const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runMigration() {
  // Read database config from env
  const env = require('./src/config/env');
  
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
  });

  try {
    console.log('[Migration] Starting...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../backend/migrations/add_payment_rejection_reasons.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute each SQL statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        console.log(`[Migration] Executing: ${trimmed.substring(0, 80)}...`);
        await connection.query(trimmed);
      }
    }
    
    console.log('[Migration] ✅ Successfully completed!');
    process.exit(0);
  } catch (err) {
    console.error('[Migration] ❌ Error:', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
