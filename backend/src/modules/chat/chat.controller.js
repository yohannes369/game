const chatService = require('./chat.service');

exports.getOrCreateConversation = async (req, res, next) => {
  try {
    let { admin_id, user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'user_id is required.' });
    }

    if (!admin_id && req.user.role === 'admin') {
      admin_id = req.user.id;
    }

    const conversation = await chatService.getOrCreateConversation(admin_id, user_id);
    return res.status(200).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { conversation_id, message_type, message_text, voice_duration } = req.body;
    const file = req.file;

    if (!conversation_id) {
      return res.status(400).json({ success: false, message: 'Missing conversation_id.' });
    }

    if (!['text', 'image', 'voice'].includes(message_type)) {
      return res.status(400).json({ success: false, message: 'Invalid message_type.' });
    }

    if (message_type !== 'text' && !file) {
      return res.status(400).json({ success: false, message: 'Media file attachment required for image/voice.' });
    }

    const conversation = await chatService.getConversationById(conversation_id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    const senderId = req.user.id;
    const receiverId = senderId === conversation.admin_id ? conversation.user_id : conversation.admin_id;

    const payload = {
      conversation_id: parseInt(conversation_id, 10),
      sender_id: senderId,
      receiver_id: receiverId,
      message_type,
      message_text: message_text || null,
      voice_duration: voice_duration ? parseInt(voice_duration, 10) : null,
      file: file ? {
        url: `/${process.env.UPLOAD_DIR || 'uploads'}/${file.filename}`,
        name: file.originalname,
        mime_type: file.mimetype,
        size: file.size
      } : null
    };

    const message = await chatService.sendMessage(payload);

    const { getIO } = require('../../config/socket');
    try {
      const io = getIO();
      io.to(`conversation:${payload.conversation_id}`).emit('chat_message', message);
      io.to(`user:${payload.receiver_id}`).emit('chat_message', message);
      io.to(`user:${payload.sender_id}`).emit('chat_message', message);
    } catch (emitError) {
      console.warn('Socket emit failed:', emitError.message || emitError);
    }

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;

    const messages = await chatService.getMessagesByConversation(conversationId, limit, offset);
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { reader_id, role } = req.body; // role: 'admin' | 'user'

    if (!reader_id || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'reader_id and valid role required.' });
    }

    await chatService.markConversationAsRead(conversationId, reader_id, role);
    return res.status(200).json({ success: true, message: 'Messages marked as read.' });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { status } = req.body;

    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    await chatService.updateConversationStatus(conversationId, status);
    return res.status(200).json({ success: true, message: `Conversation status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
};