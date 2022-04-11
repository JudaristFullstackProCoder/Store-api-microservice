const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const Store = require('../models/store').model;
const responses = require('../middlewares/responses');
const mongooseConnect = require('../db/mongoConnect');

mongooseConnect(mongoose);

const createStore = async function createStore(req, res, next) {
  // One name per store
  try {
    const named = await Store.findOne({
      name: req.body.name,
    }, 'name').exec();

    /**
       * @var {Array} email
       * @conditon Then email address already used
       */
    if (named !== null) {
      return next(new Error('this name is already assigned to a shop'));
    }

    let store = new Store(req.body);
    store = await store.save();
    return responses.created(res, store);
  } catch (err) {
    return next(err);
  }
};

const deleteStore = async function delStore(req, res, next) {
  Store.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(req.params.id),
  }).exec().then((doc) => responses.ok(res, doc)).catch((err) => next(err));
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
      _id: new mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
    return responses.ok(res, updated);
  } catch (err) {
    return next(err);
  }
};

/* eslint consistent-return: "off" */
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
    return responses.ok(res, updated);
  } catch (err) {
    next(err);
  }
};

const getStore = async function getStore(req, res, next) {
  // only retrieve store information (name and settings) not products
  let store = null;
  try {
    store = await Store.findOne({
      _id: req.params.id,
    }, 'name shopkeeper settings').exec();
    return responses.ok(res, store);
  } catch (err) {
    return next(err);
  }
};

const getStoreProductsWithPagination = async function getStoreProdWithPage(req, res, next) {
  // only retrieve store products
  try {
    const store = await Store.findOne({
      _id: new Schema.Types.ObjectId(req.params.id),
    }, 'products');
    return responses.ok(res, store);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createStore,
  deleteStore,
  updateStore,
  getStore,
  getAllProducts: getStoreProductsWithPagination,
  updateStoreSettings,
};
