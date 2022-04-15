const mongoose = require('mongoose');
const mongooseConnect = require('../db/mongoConnect');
const Option = require('../models/options').model;
const CM = require('../libs/ApiCrudManager');

const crudManager = new CM();

mongooseConnect(mongoose);

const createOption = async function createOpt(req, res, next) {
  try {
    // One name per Option
    const named = await Option.findOne({
      name: req.body.name,
    }).exec();

    if (named !== null) {
      return next(new Error('this name is already assigned to an option'));
    }
    return crudManager.create({ req, res, next }, Option, {
      message: 'option crated uccessfully',
    });
  } catch (error) {
    return next(error);
  }
};

const deleteOption = async function delOpt(req, res, next) {
  try {
    return crudManager.delete({ req, res, next }, Option, {
      message: 'option deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const updateOption = async function upOpt(req, res, next) {
  try {
    return crudManager.update({ req, res, next }, Option, {
      message: 'option updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getOption = async function getOpt(req, res, next) {
  try {
    return crudManager.read({ req, res, next }, Option);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOption,
  deleteOption,
  updateOption,
  getOption,
};
