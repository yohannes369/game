const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');
const env = require('./env');

let io = null;

function initSocket(server) {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: env.clientOrigin || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication token missing.'));
    }

    try {
      socket.user = verifyAccessToken(token);
      next();
    } catch (err) {
      next(new Error('Invalid authentication token.'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('join_conversation', (conversationId) => {
      if (conversationId) {
        socket.join(`conversation:${conversationId}`);
      }
    });

    socket.on('leave_conversation', (conversationId) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    socket.on('disconnect', () => {
      // no-op: user leaves rooms automatically
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO has not been initialized.');
  }
  return io;
}

module.exports = { initSocket, getIO };
