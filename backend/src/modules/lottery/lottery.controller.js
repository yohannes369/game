
const { validationResult } = require('express-validator');
const lotteryService = require('./lottery.service');
const { HttpError } = require('../auth/auth.service');

function checkValidation(req) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError(422, errors.array()[0].msg);
  }
}

async function create(req, res, next) {
  try {
    checkValidation(req);

    const data = {
      ...req.body,

      // support both naming styles
      ticketPrice:
        req.body.ticketPrice || req.body.ticket_price,

      ticket_price:
        req.body.ticket_price || req.body.ticketPrice
    };

    const lottery = await lotteryService.createLottery(
      data,
      req.user.id
    );

    res.status(201).json({
      message: 'Lottery created successfully.',
      lottery
    });

  } catch (err) {
    next(err);
  }
}


async function addPackages(req, res, next) {
  try {

    const lottery = await lotteryService.addPackages(
      req.params.id,
      req.body.packages
    );

    res.json({
      message: 'Packages added successfully.',
      lottery
    });

  } catch (err) {
    next(err);
  }
}


async function getOne(req, res, next) {
  try {

    const lottery = await lotteryService.getLottery(
      req.params.id
    );

    res.json({
      lottery
    });

  } catch (err) {
    next(err);
  }
}


async function list(req, res, next) {
  try {

    const lotteries = await lotteryService.listLotteries(
      req.query.status
    );

    res.json({
      lotteries
    });

  } catch (err) {
    next(err);
  }
}


async function setStatus(req, res, next) {
  try {

    const lottery = await lotteryService.setStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      message: 'Lottery status updated.',
      lottery
    });

  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const lottery = await lotteryService.updateLottery(req.params.id, req.body);
    res.json({ message: 'Lottery updated successfully.', lottery });
  } catch (err) {
    next(err);
  }
}

async function dashboard(req, res, next) {
  try {

    const summary =
      await lotteryService.getDashboardSummary(
        req.params.id,
        req.user.id
      );

    res.json(summary);

  } catch (err) {
    next(err);
  }
}
async function remove(req, res, next) {
  try {
    const result = await lotteryService.deleteLottery(req.params.id);

    res.json({
      message: 'Lottery deleted successfully.',
      result
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  addPackages,
  getOne,
  list,
  setStatus,
  update,
  dashboard,
  remove
};