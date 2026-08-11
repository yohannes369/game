const notificationService = require('./notification.service');

async function list(req, res, next) {
  try {
    const notifications = await notificationService.listForUser(req.user.id, req.query.unread === 'true');
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
}

async function markRead(req, res, next) {
  try {
    await notificationService.markRead(req.user.id, req.params.id);
    res.json({ message: 'Marked as read.' });
  } catch (err) {
    next(err);
  }
}

async function send(req, res, next) {
  try {
    const { userId, userIds, title, body, type } = req.body;
    if (!title || !body || (!userId && !userIds)) {
      return res.status(422).json({ message: 'userId/userIds, title and body are required.' });
    }
    await notificationService.create({ userId, userIds, title, body, type: type || 'admin_message' });
    res.json({ message: 'Notification sent.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, markRead, send };
