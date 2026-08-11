const { pool } = require('../../config/db');

class ChatService {
  async getDefaultAdminId() {
    const [rows] = await pool.query(
      `SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1`
    );
    if (!rows.length) {
      throw new Error('No admin user available for chat support.');
    }
    return rows[0].id;
  }

  async getOrCreateConversation(adminId, userId) {
    if (!adminId) {
      adminId = await this.getDefaultAdminId();
    }

    const [existing] = await pool.query(
      `SELECT * FROM chat_conversations WHERE admin_id = ? AND user_id = ? LIMIT 1`,
      [adminId, userId]
    );

    if (existing.length > 0) return existing[0];

    try {
      const [result] = await pool.query(
        `INSERT INTO chat_conversations (admin_id, user_id, status) VALUES (?, ?, 'open')`,
        [adminId, userId]
      );

      const [newConversation] = await pool.query(
        `SELECT * FROM chat_conversations WHERE id = ?`,
        [result.insertId]
      );

      return newConversation[0];
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const [conversationRows] = await pool.query(
          `SELECT * FROM chat_conversations WHERE admin_id = ? AND user_id = ? LIMIT 1`,
          [adminId, userId]
        );
        return conversationRows[0];
      }
      throw error;
    }
  }

  async getConversationById(conversationId) {
    const [rows] = await pool.query(
      `SELECT * FROM chat_conversations WHERE id = ? LIMIT 1`,
      [parseInt(conversationId, 10)]
    );
    return rows[0] || null;
  }

  async sendMessage(data) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const now = new Date();

      const [msgResult] = await connection.query(
        `INSERT INTO chat_messages 
         (conversation_id, sender_id, receiver_id, message_type, message_text, file_url, file_name, file_mime_type, file_size, voice_duration, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.conversation_id,
          data.sender_id,
          data.receiver_id,
          data.message_type,
          data.message_text,
          data.file ? data.file.url : null,
          data.file ? data.file.name : null,
          data.file ? data.file.mime_type : null,
          data.file ? data.file.size : null,
          data.voice_duration,
          now
        ]
      );

      const messageId = msgResult.insertId;

      if (data.file && (data.message_type === 'image' || data.message_type === 'voice')) {
        await connection.query(
          `INSERT INTO chat_attachments
           (message_id, attachment_type, file_url, file_name, mime_type, file_size, duration_seconds)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            messageId,
            data.message_type,
            data.file.url,
            data.file.name,
            data.file.mime_type,
            data.file.size,
            data.voice_duration
          ]
        );
      }

      await connection.query(
        `UPDATE chat_conversations SET last_message_at = ? WHERE id = ?`,
        [now, data.conversation_id]
      );

      await connection.commit();

      return {
        id: messageId,
        ...data,
        created_at: now
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getMessagesByConversation(conversationId, limit = 50, offset = 0) {
    const query = `
      SELECT 
        m.*,
        a.id AS attachment_id,
        a.attachment_type,
        a.duration_seconds
      FROM chat_messages m
      LEFT JOIN chat_attachments a ON m.id = a.message_id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(query, [parseInt(conversationId, 10), limit, offset]);
    return rows;
  }

  async markConversationAsRead(conversationId, readerId, role) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const now = new Date();

      await connection.query(
        `UPDATE chat_messages 
         SET is_read = 1, read_at = ? 
         WHERE conversation_id = ? AND receiver_id = ? AND is_read = 0`,
        [now, conversationId, readerId]
      );

      const readColumn = role === 'admin' ? 'admin_last_read_at' : 'user_last_read_at';
      await connection.query(
        `UPDATE chat_conversations SET ${readColumn} = ? WHERE id = ?`,
        [now, conversationId]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateConversationStatus(conversationId, status) {
    await pool.query(
      `UPDATE chat_conversations SET status = ? WHERE id = ?`,
      [status, conversationId]
    );
    return true;
  }
}

module.exports = new ChatService();