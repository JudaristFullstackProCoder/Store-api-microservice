const Mongoose = require('mongoose');
const Option = require('../models/options').model;
const responses = require('../middlewares/responses');

const createOption = async function createOpt(req, res) {
  // required fields
  const requiredFields = ['name'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return responses.error(res, `${requiredFields[i]} is required`);
    }
  }
  // One name per Option
  const named = await Option.findOne({
    name: req.body.name,
  }, 'name').exec();

  /**
     * @var {Array} email
     * @conditon Then email address already used
     */
  if (named != null) {
    return responses.error(res, 'this name is already assigned to an option');
  }

  let option = new Option(req.body);
  try {
    option = await option.save();
  } catch (err) {
    return responses.error(res, err.message);
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
    return responses.error(res, err.message);
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
    return responses.error(res, err.message);
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
    return responses.error(res, err.message);
  }
  return responses.ok(res, option);
};

module.exports = {
  createOption,
  deleteOption,
  updateOption,
  getOption,
};
