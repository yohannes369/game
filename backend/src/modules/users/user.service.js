const { pool } = require('../../config/db');
const { hashPassword } = require('../../utils/password');
const { HttpError, toPublicUser } = require('../auth/auth.service');

async function listUsers() {
  const [rows] = await pool.query(
    `SELECT u.*, g.name AS group_name
     FROM users u
     LEFT JOIN \`groups\` g ON g.id = u.group_id
     ORDER BY u.created_at DESC`
  );
  return rows.map((row) => ({ ...toPublicUser(row), groupName: row.group_name }));
}

async function getUser(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  if (!rows[0]) throw new HttpError(404, 'User not found.');
  return toPublicUser(rows[0]);
}

async function createUser({ username, password, fullName, role, groupId }) {
  const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  if (existing[0]) throw new HttpError(409, 'This username is already taken.');

  const passwordHash = await hashPassword(password);
  const [result] = await pool.query(
    'INSERT INTO users (username, password_hash, full_name, role, group_id) VALUES (?, ?, ?, ?, ?)',
    [username, passwordHash, fullName, role || 'user', groupId || null]
  );
  return getUser(result.insertId);
}

async function updateUser(id, { fullName, role, groupId, isActive, password }) {
  const fields = [];
  const values = [];

  if (fullName !== undefined) {
    fields.push('full_name = ?');
    values.push(fullName);
  }
  if (role !== undefined) {
    fields.push('role = ?');
    values.push(role);
  }
  if (groupId !== undefined) {
    fields.push('group_id = ?');
    values.push(groupId);
  }
  if (isActive !== undefined) {
    fields.push('is_active = ?');
    values.push(isActive ? 1 : 0);
  }
  if (password) {
    fields.push('password_hash = ?');
    values.push(await hashPassword(password));
  }

  if (fields.length === 0) {
    return getUser(id);
  }

  values.push(id);
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return getUser(id);
}

async function deleteUser(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new HttpError(404, 'User not found.');
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
