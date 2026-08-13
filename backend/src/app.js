


// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const env = require('./config/env');
// const { notFound, errorHandler } = require('./middleware/error.middleware');

// const authRoutes = require('./modules/auth/auth.routes');
// const userRoutes = require('./modules/users/user.routes');
// const groupRoutes = require('./modules/groups/group.routes');

// // Lottery platform modules
// const lotteryRoutes = require('./modules/lottery/lottery.routes');
// const ticketRoutes = require('./modules/ticket/ticket.routes');
// const paymentRoutes = require('./modules/payment/payment.routes');
// const winnerRoutes = require('./modules/winner/winner.routes');
// const challengeRoutes = require('./modules/challenge/challenge.routes');
// const { startChallengeDrawWorker } = require('./modules/challenge/challenge.worker');
// const withdrawalRoutes = require('./modules/withdrawal/withdrawal.routes');
// const notificationRoutes = require('./modules/notification/notification.routes');
// const analyticsRoutes = require('./modules/analytics/analytics.routes');

// const app = express();

// app.use(cors({ origin: env.clientOrigin, credentials: true }));
// app.use(express.json());

// // Serves uploaded payment/withdrawal screenshots (see middleware/upload.middleware.js)
// app.use(`/${process.env.UPLOAD_DIR || 'uploads'}`, express.static(path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

// app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/groups', groupRoutes);

// // Lottery platform routes
// app.use('/api/lotteries', lotteryRoutes);
// app.use('/api/tickets', ticketRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/winners', winnerRoutes);
// app.use('/api/challenges', challengeRoutes);
// app.use('/api/withdrawals', withdrawalRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/admin', analyticsRoutes);

// app.use(notFound);
// app.use(errorHandler);

// // Background worker: polls for challenges whose scheduled draw time has
// // arrived and runs the draw automatically (see markAdminReview in
// // challenge.service.js, which sets draw_at to +2 minutes on approval).
// // Skipped during tests so test runs don't spin up a live timer.
// if (process.env.NODE_ENV !== 'test') {
//   startChallengeDrawWorker();
// }

// module.exports = app;

// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const env = require('./config/env');
// const { notFound, errorHandler } = require('./middleware/error.middleware');

// const authRoutes = require('./modules/auth/auth.routes');
// const userRoutes = require('./modules/users/user.routes');
// const groupRoutes = require('./modules/groups/group.routes');

// // Chat module
// const chatRoutes = require('./modules/chat/chat.routes');

// // Lottery platform modules
// const lotteryRoutes = require('./modules/lottery/lottery.routes');
// const ticketRoutes = require('./modules/ticket/ticket.routes');
// const paymentRoutes = require('./modules/payment/payment.routes');
// const winnerRoutes = require('./modules/winner/winner.routes');
// const challengeRoutes = require('./modules/challenge/challenge.routes');
// const { startChallengeDrawWorker } = require('./modules/challenge/challenge.worker');
// const withdrawalRoutes = require('./modules/withdrawal/withdrawal.routes');
// const notificationRoutes = require('./modules/notification/notification.routes');
// const analyticsRoutes = require('./modules/analytics/analytics.routes');

// const app = express();

// app.use(cors({ origin: env.clientOrigin, credentials: true }));
// app.use(express.json());

// // Serves uploaded payment/withdrawal screenshots & chat attachments
// app.use(`/${process.env.UPLOAD_DIR || 'uploads'}`, express.static(path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

// app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/groups', groupRoutes);

// // Chat route integration
// app.use('/api/chat', chatRoutes);

// // Lottery platform routes
// app.use('/api/lotteries', lotteryRoutes);
// app.use('/api/tickets', ticketRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/winners', winnerRoutes);
// app.use('/api/challenges', challengeRoutes);
// app.use('/api/withdrawals', withdrawalRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/admin', analyticsRoutes);

// app.use(notFound);
// app.use(errorHandler);

// // Background worker: polls for challenges whose scheduled draw time has
// // arrived and runs the draw automatically (see markAdminReview in
// // challenge.service.js, which sets draw_at to +2 minutes on approval).
// // Skipped during tests so test runs don't spin up a live timer.
// if (process.env.NODE_ENV !== 'test') {
//   startChallengeDrawWorker();
// }

// module.exports = app;

const express = require('express');
const cors = require('cors');
const path = require('path');

const env = require('./config/env');
const {
  notFound,
  errorHandler,
} = require('./middleware/error.middleware');

// =========================================================
// AUTH / USER MODULES
// =========================================================

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const groupRoutes = require('./modules/groups/group.routes');

// =========================================================
// CHAT MODULE
// =========================================================

const chatRoutes = require('./modules/chat/chat.routes');

// =========================================================
// LOTTERY MODULES
// =========================================================

const lotteryRoutes = require('./modules/lottery/lottery.routes');
const ticketRoutes = require('./modules/ticket/ticket.routes');
const paymentRoutes = require('./modules/payment/payment.routes');
const winnerRoutes = require('./modules/winner/winner.routes');
const challengeRoutes = require('./modules/challenge/challenge.routes');
const withdrawalRoutes = require('./modules/withdrawal/withdrawal.routes');
const notificationRoutes = require('./modules/notification/notification.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');

// =========================================================
// CHALLENGE WORKER
// =========================================================

const {
  startChallengeDrawWorker,
} = require('./modules/challenge/challenge.worker');

// =========================================================
// APP
// =========================================================

const app = express();

// =========================================================
// CORS
// =========================================================

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);

// =========================================================
// BODY PARSING
// =========================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// STATIC FILES
// =========================================================

const uploadDir = process.env.UPLOAD_DIR || 'uploads';

app.use(
  `/${uploadDir}`,
  express.static(
    path.resolve(process.cwd(), uploadDir)
  )
);

// =========================================================
// HEALTH CHECK
// =========================================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    time: new Date().toISOString(),
  });
});

// =========================================================
// AUTH ROUTES
// =========================================================
//
// POST /api/auth/login
// POST /api/auth/register
// POST /api/auth/refresh
// GET  /api/auth/me
// POST /api/auth/logout
//

app.use('/api/auth', authRoutes);

// =========================================================
// USER ROUTES
// =========================================================

app.use('/api/users', userRoutes);

// =========================================================
// GROUP ROUTES
// =========================================================

app.use('/api/groups', groupRoutes);

// =========================================================
// CHAT ROUTES
// =========================================================

app.use('/api/chat', chatRoutes);

// =========================================================
// LOTTERY ROUTES
// =========================================================

app.use('/api/lotteries', lotteryRoutes);

// =========================================================
// TICKET ROUTES
// =========================================================

app.use('/api/tickets', ticketRoutes);

// =========================================================
// PAYMENT ROUTES
// =========================================================

app.use('/api/payments', paymentRoutes);

// =========================================================
// WINNER ROUTES
// =========================================================

app.use('/api/winners', winnerRoutes);

// =========================================================
// CHALLENGE ROUTES
// =========================================================

app.use('/api/challenges', challengeRoutes);

// =========================================================
// WITHDRAWAL ROUTES
// =========================================================

app.use('/api/withdrawals', withdrawalRoutes);

// =========================================================
// NOTIFICATION ROUTES
// =========================================================

app.use('/api/notifications', notificationRoutes);

// =========================================================
// ADMIN / ANALYTICS ROUTES
// =========================================================

app.use('/api/admin', analyticsRoutes);

// =========================================================
// 404 HANDLER
// =========================================================

app.use(notFound);

// =========================================================
// GLOBAL ERROR HANDLER
// =========================================================

app.use(errorHandler);

// =========================================================
// CHALLENGE BACKGROUND WORKER
// =========================================================

if (process.env.NODE_ENV !== 'test') {
  startChallengeDrawWorker();
}

// =========================================================
// EXPORT APP
// =========================================================

module.exports = app;