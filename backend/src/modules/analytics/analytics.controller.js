const analyticsService = require('./analytics.service');

async function analytics(req, res, next) {
  try {
    const data = await analyticsService.getAnalytics();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getSetting(req, res, next) {
  try {
    const value = await analyticsService.getSetting(req.params.key);
    res.json({ key: req.params.key, value });
  } catch (err) {
    next(err);
  }
}

async function setSetting(req, res, next) {
  try {
    await analyticsService.setSetting(req.params.key, req.body.value);
    res.json({ message: 'Setting updated.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { analytics, getSetting, setSetting };
