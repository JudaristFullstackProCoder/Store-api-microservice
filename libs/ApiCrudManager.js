const mongoose = require('mongoose');
const responses = require('../middlewares/responses');

class ApiCrudManager {
  /**
     * @param {Object} ctx {req : {express.Request},
     * res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model
     * @param {Array} requiredFields
     */
  async create(ctx, Model, requiredFields = []) {
    this.SkipEslintClassMethodsUseThisRule = true; // skip eslint ruel : class-methods-use-this
    // required field
    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!ctx.req.body[requiredFields[i]]) {
        return ctx.next(new Error(`${requiredFields[i]} is required`));
      }
    }

    let obj = new Model(ctx.req.body);
    try {
      obj = await obj.save();
    } catch (err) {
      return ctx.next(err);
    }

    return responses.created(ctx.res, obj);
  }

  /**
     * @param {Object} ctx {req : {express.Request},
     *  res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model
     * @param {Array} requiredFields
     */
  async read(ctx, model) {
    this.SkipEslintClassMethodsUseThisRule = true; // skip eslint ruel : class-methods-use-this
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
  async update(ctx, model) {
    this.SkipEslintClassMethodsUseThisRule = true; // skip eslint ruel : class-methods-use-this
    let updated = null;

    try {
      updated = await model.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(ctx.req.params.id),
      }, ctx.req.body, {
        new: true,
      }).exec();
    } catch (err) {
      return ctx.next(err);
    }

    return responses.ok(ctx.res, updated);
  }

  /**
     * @param {Object} ctx {req : {express.Request},
     *  res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model
     * @params {Object} options {
     *  afterDelete : function : any
     * }
     */
  async delete(ctx, model, options) {
    this.SkipEslintClassMethodsUseThisRule = true; // skip eslint ruel : class-methods-use-this
    let deleted = null;

    try {
      deleted = await model.findOneAndDelete({
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

    return responses.ok(ctx.res, deleted);
  }
}

module.exports = ApiCrudManager;
