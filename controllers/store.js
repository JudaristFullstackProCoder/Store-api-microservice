const { Schema } = require('mongoose');
const Mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

const Store = require('../models/store').model;
const responses = require('../middlewares/responses');

const createStore = async function createStore(req, res, next) {
  // required fields
  const requiredFields = ['name'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return next(new Error(`${requiredFields[i]} is required`));
    }
  }

  // One name per store
  const named = await Store.findOne({
    name: req.body.name,
  }, 'name').exec();

  /**
     * @var {Array} email
     * @conditon Then email address already used
     */
  if (named != null) {
    return next(new Error('this name is already assigned to a shop'));
  }

  let store = new Store(req.body);
  try {
    store = await store.save();
  } catch (err) {
    return next(err);
  }
  return responses.ok(store, res);
};

const deleteStore = async function delStore(req, res, next) {
  let store = null;
  try {
    store = await Store.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(store, res);
};

const updateStore = async function upStore(req, res, next) {
  // only update primary information
  // delete the request field that aren't allowed to be modified
  delete req.body.shopkeeper;
  delete req.body.products;
  delete req.body.settings;
  let updated = null;

  try {
    updated = await Store.findOneAndUpdate({
      _id: new Mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(updated, res);
};

const updateStoreSettings = async function upStoreSettings(req, res, next) {
  // update store settings informations
  // find the store first, then update the settings of the store
  let updated = null;
  try {
    updated = await Store.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          settings: req.body,
        },
      },
    );
    return responses.ok(updated, res);
  } catch (err) {
    next(err);
  }
  return false;
};

const getStore = async function getStore(req, res, next) {
  // only retrieve store information (name and settings) not products
  let store = null;
  try {
    store = await Store.findOne({
      _id: req.params.id,
    }, 'name shopkeeper settings').exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(store, res);
};

const getStoreProductsWithPagination = async function getStoreProdWithPage(req, res, next) {
  // only retrieve store products
  let store = null;
  try {
    store = await Store.findOne({
      _id: new Schema.Types.ObjectId(req.params.id),
    }, 'products');
  } catch (err) {
    return next(err);
  }
  return responses.ok(store, res);
};

module.exports = {
  createStore,
  deleteStore,
  updateStore,
  getStore,
  getAllProducts: getStoreProductsWithPagination,
  updateStoreSettings,
};
