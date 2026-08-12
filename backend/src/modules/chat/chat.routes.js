// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const { authenticate } = require('../../middleware/auth.middleware');
// const chatController = require('./chat.controller');

// // Configure file storage & types
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, process.env.UPLOAD_DIR || 'uploads/'),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max limit
//   fileFilter: (req, file, cb) => {
//     const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'];
//     if (allowedMimes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type for chat attachments.'));
//     }
//   }
// });

// router.use(authenticate);

// // Conversation management
// router.post('/conversations', chatController.getOrCreateConversation);
// router.patch('/conversations/:conversationId/status', chatController.updateStatus);

// // Messages
// router.post('/messages', upload.single('attachment'), chatController.sendMessage);
// router.get('/conversations/:conversationId/messages', chatController.getMessages);
// router.patch('/conversations/:conversationId/read', chatController.markAsRead);

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { authenticate } = require('../../middleware/auth.middleware');
const chatController = require('./chat.controller');

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads/');
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1E9);

    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  }
});

// Configure upload
const upload = multer({
  storage,

  // 25 MB maximum file size
  limits: {
    fileSize: 25 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      // Images
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',

      // Audio
      'audio/webm',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      'audio/x-m4a',
      'audio/aac'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error(
        `Invalid file type for chat attachments: "${file.originalname}" (mimetype: ${file.mimetype})`
      );

      error.statusCode = 415;
      error.rejectedFile = file.originalname;
      error.rejectedMimetype = file.mimetype;

      cb(error);
    }
  }
});

// All chat routes require authentication
router.use(authenticate);

// ========================================
// Conversation Management
// ========================================

router.post(
  '/conversations',
  chatController.getOrCreateConversation
);

router.patch(
  '/conversations/:conversationId/status',
  chatController.updateStatus
);

// ========================================
// Messages
// ========================================

router.post(
  '/messages',
  upload.single('attachment'),
  chatController.sendMessage
);

router.get(
  '/conversations/:conversationId/messages',
  chatController.getMessages
);

router.patch(
  '/conversations/:conversationId/read',
  chatController.markAsRead
);

module.exports = router;