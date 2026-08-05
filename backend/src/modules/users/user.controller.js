const { validationResult } = require('express-validator');
const userService = require('./user.service');
const { HttpError } = require('../auth/auth.service');

function checkValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(422, errors.array()[0].msg);
  }
}

async function list(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.json({ users });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const user = await userService.getUser(req.params.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    checkValidation(req);
    const user = await userService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully.', user });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ message: 'User updated successfully.', user });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    // Prevent an admin from deleting their own account by mistake
    if (Number(req.params.id) === req.user.id) {
      throw new HttpError(400, 'You cannot delete your own account.');
    }
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove };
