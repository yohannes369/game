const { validationResult } = require('express-validator');
const groupService = require('./group.service');
const { HttpError } = require('../auth/auth.service');

function checkValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(422, errors.array()[0].msg);
  }
}

async function list(req, res, next) {
  try {
    const groups = await groupService.listGroups();
    res.json({ groups });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    checkValidation(req);
    const group = await groupService.createGroup(req.body);
    res.status(201).json({ message: 'Group created successfully.', group });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const group = await groupService.updateGroup(req.params.id, req.body);
    res.json({ message: 'Group updated successfully.', group });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await groupService.deleteGroup(req.params.id);
    res.json({ message: 'Group deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

async function members(req, res, next) {
  try {
    const group = await groupService.getGroup(req.params.id);
    const groupMembers = await groupService.getGroupMembers(req.params.id);
    res.json({ group, members: groupMembers });
  } catch (err) {
    next(err);
  }
}

/** Group leader's own group + members, resolved from the logged-in user. */
async function myGroup(req, res, next) {
  try {
    const group = await groupService.getGroupByLeader(req.user.id);
    if (!group) {
      return res.json({ group: null, members: [] });
    }
    const groupMembers = await groupService.getGroupMembers(group.id);
    const fullGroup = await groupService.getGroup(group.id);
    res.json({ group: fullGroup, members: groupMembers });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove, members, myGroup };
