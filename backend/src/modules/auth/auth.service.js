const { pool } = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const env = require('../../config/env');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function toPublicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    fullName: row.full_name,
    role: row.role,
    groupId: row.group_id,
    isActive: !!row.is_active,
    createdAt: row.created_at,
  };
}

function buildTokenPayload(user) {
  return { id: user.id, username: user.username, role: user.role, groupId: user.group_id };
}

async function findUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

/**
 * Public self-registration always creates a plain 'user' role.
 * Admins can create group_leader / admin accounts via the users module.
 */
async function registerUser({ username, password, fullName }) {
  const existing = await findUserByUsername(username);
  if (existing) {
    throw new HttpError(409, 'This username is already taken.');
  }

  const passwordHash = await hashPassword(password);
  const [result] = await pool.query(
    'INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
    [username, passwordHash, fullName, 'user']
  );

  const created = await findUserById(result.insertId);
  return toPublicUser(created);
}

async function storeRefreshToken(userId, token, expiresAt) {
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );
}

async function issueTokens(user) {
  const payload = buildTokenPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // 7 days from now (matches JWT_REFRESH_EXPIRES_IN default) - stored so it can be revoked on logout
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  await storeRefreshToken(user.id, refreshToken, expiresAt);
  return { accessToken, refreshToken };
}

async function login({ username, password }) {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new HttpError(401, 'Invalid username or password.');
  }
  if (!user.is_active) {
    throw new HttpError(403, 'This account has been deactivated.');
  }

  const passwordMatches = await comparePassword(password, user.password_hash);
  if (!passwordMatches) {
    throw new HttpError(401, 'Invalid username or password.');
  }

  const tokens = await issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new HttpError(400, 'Refresh token is required.');
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new HttpError(401, 'Invalid or expired refresh token.');
  }

  const [rows] = await pool.query(
    'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? LIMIT 1',
    [refreshToken, payload.id]
  );
  if (!rows[0]) {
    throw new HttpError(401, 'Refresh token has been revoked.');
  }

  const user = await findUserById(payload.id);
  if (!user || !user.is_active) {
    throw new HttpError(401, 'Account no longer available.');
  }

  // Rotate: delete the old refresh token and issue a new pair
  await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
  const tokens = await issueTokens(user);
  return { user: toPublicUser(user), ...tokens };
}

async function logout(refreshToken) {
  if (!refreshToken) return;
  await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
}

module.exports = {
  HttpError,
  toPublicUser,
  registerUser,
  login,
  refreshAccessToken,
  logout,
  findUserById,
};
