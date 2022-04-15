/* eslint class-methods-use-this: "off"  */
const mongoose = require('mongoose');
const mongooseConnection = require('../db/mongoConnect');
const responses = require('../middlewares/responses');

mongooseConnection(mongoose);
class ApiCrudManager {
  /**
     * @param {Object} ctx {req : {express.Request},
     * res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model
     * @param {Object} options
     */
  async create(ctx, Model, options = {}) {
    let obj = new Model(ctx.req.body);
    try {
      if (Object.prototype.toString.call(options.beforeCreate || null) === '[object Function]') {
        // Then the argument is a valid function
        options.beforeCreate();
      }
      obj = await obj.save();
    } catch (err) {
      return ctx.next(err);
    }
    if (Object.prototype.toString.call(options.afterCreate || null) === '[object Function]') {
      // Then the argument is a valid function
      options.afterCreate();
    }
    return responses.created(ctx.res, options.message || obj);
  }

  /**
     * @param {Object} ctx {req : {express.Request},
     *  res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model
     * @param {Array} requiredFields
     */
  async read(ctx, model) {
    let product = null;

    try {
      product = await model.findOne({
        _id: ctx.req.params.id,
      }).exec();
    } catch (err) {
      return ctx.next(err);
    }

    return responses.ok(ctx.res, product);
  }

  /**
     * @param {Object} ctx {req : {express.Request},
     *  res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model
     */
  async update(ctx, model, options = {}) {
    try {
      await model.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(ctx.req.params.id),
      }, ctx.req.body, {
        new: true,
      }).exec();
    } catch (err) {
      return ctx.next(err);
    }

    return responses.ok(ctx.res, options.message || 'updated');
  }

  /**
     * @param {Object} ctx {req : {express.Request},
     *  res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model
     * @params {Object} options {
     * beforeDelete: function :any
     *  afterDelete : function : any
     * }
     */
  async delete(ctx, model, options = {}) {
    if (Object.prototype.toString.call(options.beforeDelete || null) === '[object Function]') {
      // Then the argument is a valid function
      options.beforeDelete();
    }
    try {
      await model.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(ctx.req.params.id),
      }).exec();
      // if we want to do something after the db resource was deleted
      if (Object.prototype.toString.call(options.afterDelete || null) === '[object Function]') {
        // Then the argument is a valid function
        options.afterDelete();
      }
    } catch (err) {
      return ctx.next(err);
    }

    return responses.ok(ctx.res, options.message || 'created');
  }
}

module.exports = ApiCrudManager;
