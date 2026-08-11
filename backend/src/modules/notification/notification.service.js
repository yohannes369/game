// const { pool } = require('../../config/db');

// /**
//  * Creates a notification. Pass a transaction connection as `conn` so the
//  * notification commits atomically with whatever triggered it (payment
//  * approval, a draw, a payout) — defaults to the shared pool otherwise.
//  */
// async function create({ userId, userIds, type, title, body }, conn = pool) {
//   const ids = Array.isArray(userIds) ? userIds : userId === null || userId === undefined ? [] : [userId];
//   if (ids.length === 0) {
//     return;
//   }

//   await Promise.all(
//     ids.map((targetUserId) =>
//       conn.query(
//         'INSERT INTO notifications (user_id, type, title, body) VALUES (?, ?, ?, ?)',
//         [targetUserId, type, title, body]
//       )
//     )
//   );
// }

// async function listForUser(userId, onlyUnread = false) {
//   const sql = onlyUnread
//     ? 'SELECT id, type, title, body, is_read, created_at FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC LIMIT 100'
//     : 'SELECT id, type, title, body, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100';
//   const [rows] = await pool.query(sql, [userId]);
//   return rows;
// }

// async function markRead(userId, notificationId) {
//   await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notificationId, userId]);
// }

// module.exports = { create, listForUser, markRead };
const { pool } = require('../../config/db');

let getIO = null;
try {
  // Lazily wired so this module still works (e.g. in tests) even if
  // Socket.IO hasn't been initialized yet.
  ({ getIO } = require('../../config/socket'));
} catch {
  getIO = null;
}

function emitToUser(userId, notification) {
  if (!getIO) return;
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit('notification', notification);
  } catch {
    // Socket.IO not initialized (e.g. running a script/test) — safe to ignore.
  }
}

/**
 * Creates a notification. Pass a transaction connection as `conn` so the
 * notification commits atomically with whatever triggered it (payment
 * approval, a draw, a payout) — defaults to the shared pool otherwise.
 */
async function create({ userId, userIds, type, title, body }, conn = pool) {
  const ids = Array.isArray(userIds) ? userIds : userId === null || userId === undefined ? [] : [userId];
  if (ids.length === 0) {
    return;
  }

  await Promise.all(
    ids.map(async (targetUserId) => {
      const [result] = await conn.query(
        'INSERT INTO notifications (user_id, type, title, body) VALUES (?, ?, ?, ?)',
        [targetUserId, type, title, body]
      );

      // Only push live if this actually committed on the shared pool.
      // For transactional inserts (conn !== pool), the caller's transaction
      // may still roll back, so we don't want to notify prematurely; the
      // client will pick the notification up on next poll/reconnect instead.
      if (conn === pool) {
        emitToUser(targetUserId, {
          id: result.insertId,
          type,
          title,
          body,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
    })
  );
}

function mapRow(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    isRead: !!row.is_read,
    createdAt: row.created_at,
  };
}

async function listForUser(userId, onlyUnread = false) {
  const sql = onlyUnread
    ? 'SELECT id, type, title, body, is_read, created_at FROM notifications WHERE user_id = ? AND is_read = 0 ORDER BY created_at DESC LIMIT 100'
    : 'SELECT id, type, title, body, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100';
  const [rows] = await pool.query(sql, [userId]);
  return rows.map(mapRow);
}

async function markRead(userId, notificationId) {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notificationId, userId]);
}

module.exports = { create, listForUser, markRead };