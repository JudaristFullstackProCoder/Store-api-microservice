const Mongoose = require('mongoose');
const Option = require('../models/options').model;
const responses = require('../middlewares/responses');

const createOption = async function createOpt(req, res) {
  // required fields
  const requiredFields = ['name'];
  if (!req.body[requiredFields[0]]) {
    return responses.error(res, false, `${requiredFields[0]} is required`);
  }
  // One name per Option
  const named = await Option.findOne({
    name: req.body.name,
  }, 'name').exec();

  /**
     * @var {Array} email
     * @conditon Then email address already used
     */
  if (named) {
    return responses.error(res, false, 'this name is already assigned to an option');
  }

  let option = new Option(req.body);
  try {
    option = await option.save();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.created(res, option);
};

const deleteOption = async function delOpt(req, res) {
  let option = null;
  try {
    option = await Option.findOneAndDelete({
      _id: new Mongoose.Types.ObjectId(req.params.id),
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.ok(res, option);
};

const updateOption = async function upOpt(req, res) {
  let updated = null;
  try {
    updated = await Option.findOneAndUpdate({
      _id: new Mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.ok(res, updated);
};

const getOption = async function getOpt(req, res) {
  let option = null;
  try {
    option = await Option.findOne({
      _id: req.params.id,
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.ok(res, option);
};

module.exports = {
  createOption,
  deleteOption,
  updateOption,
  getOption,
};
