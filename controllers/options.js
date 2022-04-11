const mongoose = require('mongoose');
const mongooseConnect = require('../db/mongoConnect');
const Option = require('../models/options').model;
const responses = require('../middlewares/responses');

mongooseConnect(mongoose);

const createOption = async function createOpt(req, res, next) {
  // One name per Option
  const named = await Option.findOne({
    name: req.body.name,
  }).exec();

  if (named !== null) {
    return next(new Error('this name is already assigned to an option'));
  }

  let option = new Option(req.body);
  try {
    option = await option.save();
  } catch (err) {
    return next(res, err, err.message);
  }
  return responses.created(res, option);
};

const deleteOption = async function delOpt(req, res, next) {
  let option = null;
  try {
    option = await Option.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.params.id),
    }).exec();
  } catch (err) {
    return next(res, err, err.message);
  }
  return responses.ok(res, option);
};

const updateOption = async function upOpt(req, res, next) {
  let updated = null;
  try {
    updated = await Option.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
  } catch (err) {
    return next(res, err, err.message);
  }
  return responses.ok(res, updated);
};

const getOption = async function getOpt(req, res, next) {
  let option = null;
  try {
    option = await Option.findOne({
      _id: req.params.id,
    }).exec();
  } catch (err) {
    return next(res, err, err.message);
  }
  return responses.ok(res, option);
};

module.exports = {
  createOption,
  deleteOption,
  updateOption,
  getOption,
};
