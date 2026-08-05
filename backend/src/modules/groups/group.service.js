const { pool } = require('../../config/db');
const { HttpError } = require('../auth/auth.service');

function toPublicGroup(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    leaderId: row.leader_id,
    leaderName: row.leader_name || null,
    memberCount: row.member_count !== undefined ? Number(row.member_count) : undefined,
    createdAt: row.created_at,
  };
}

async function listGroups() {
  const [rows] = await pool.query(
    `SELECT g.*, u.full_name AS leader_name,
            (SELECT COUNT(*) FROM users m WHERE m.group_id = g.id) AS member_count
     FROM \`groups\` g
     LEFT JOIN users u ON u.id = g.leader_id
     ORDER BY g.created_at DESC`
  );
  return rows.map(toPublicGroup);
}

async function createGroup({ name, description, leaderId }) {
  const [result] = await pool.query(
    'INSERT INTO `groups` (name, description, leader_id) VALUES (?, ?, ?)',
    [name, description || null, leaderId || null]
  );

  if (leaderId) {
    await pool.query('UPDATE users SET role = ?, group_id = ? WHERE id = ?', ['group_leader', result.insertId, leaderId]);
  }

  return getGroup(result.insertId);
}

async function getGroup(id) {
  const [rows] = await pool.query(
    `SELECT g.*, u.full_name AS leader_name,
            (SELECT COUNT(*) FROM users m WHERE m.group_id = g.id) AS member_count
     FROM \`groups\` g
     LEFT JOIN users u ON u.id = g.leader_id
     WHERE g.id = ? LIMIT 1`,
    [id]
  );
  if (!rows[0]) throw new HttpError(404, 'Group not found.');
  return toPublicGroup(rows[0]);
}

async function updateGroup(id, { name, description, leaderId }) {
  const fields = [];
  const values = [];

  if (name !== undefined) {
    fields.push('name = ?');
    values.push(name);
  }
  if (description !== undefined) {
    fields.push('description = ?');
    values.push(description);
  }
  if (leaderId !== undefined) {
    fields.push('leader_id = ?');
    values.push(leaderId);
  }

  if (fields.length > 0) {
    values.push(id);
    await pool.query(`UPDATE \`groups\` SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  if (leaderId) {
    await pool.query('UPDATE users SET role = ?, group_id = ? WHERE id = ?', ['group_leader', id, leaderId]);
  }

  return getGroup(id);
}

async function deleteGroup(id) {
  const [result] = await pool.query('DELETE FROM `groups` WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new HttpError(404, 'Group not found.');
}

async function getGroupMembers(groupId) {
  const [rows] = await pool.query(
    'SELECT id, username, full_name, role, is_active, created_at FROM users WHERE group_id = ? ORDER BY full_name',
    [groupId]
  );
  return rows.map((r) => ({
    id: r.id,
    username: r.username,
    fullName: r.full_name,
    role: r.role,
    isActive: !!r.is_active,
    createdAt: r.created_at,
  }));
}

/** Finds the group led by a given user (used by the group_leader dashboard). */
async function getGroupByLeader(leaderId) {
  const [rows] = await pool.query('SELECT * FROM `groups` WHERE leader_id = ? LIMIT 1', [leaderId]);
  return rows[0] || null;
}

module.exports = {
  listGroups,
  createGroup,
  getGroup,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  getGroupByLeader,
};
