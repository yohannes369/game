/**
 * Creates the default admin account if it does not already exist.
 * Run with: npm run seed
 */
const { pool } = require('./config/db');
const { hashPassword } = require('./utils/password');
const env = require('./config/env');

async function seed() {
  const { username, password, fullName } = env.seedAdmin;

  const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  if (existing[0]) {
    console.log(`[seed] Admin "${username}" already exists. Skipping.`);
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);
  await pool.query(
    'INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
    [username, passwordHash, fullName, 'admin']
  );

  console.log('[seed] Default admin created:');
  console.log(`        username: ${username}`);
  console.log(`        password: ${password}`);
  console.log('        Change this password after first login.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err.message);
  process.exit(1);
});
