const mongoose = require("mongoose");
const responses = require("../middlewares/responses");

class ApiCrudManager {

    constructor () {}

    /**
     * @param {Object} ctx {req : {express.Request}, res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model 
     * @param {Array} requiredFields 
     */
    create = async (ctx, model, requiredFields = []) => {

        // required fields
        for (let i = 0; i <requiredFields.length; i++) {
            if(!ctx.req.body[requiredFields[i]]){
                return ctx.next(new Error(`${requiredFields[i]} is required`));
            }
        }

        let obj =  new model(ctx.req.body);
        try{
            obj = await obj.save();
        }catch(err){
            return ctx.next(err);
        }

        return responses.ok(obj, ctx.res);

    }


    /**
     * @param {Object} ctx {req : {express.Request}, res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model 
     * @param {Array} requiredFields 
     */    
    read  = async (ctx, model) => {

        let product = null;

        try{
            product = await model.findOne({ 
                _id: ctx.req.params.id,
            }).exec();
        }catch(err){
            return ctx.next(err);
        }

        return responses.ok(product, ctx.res);

    }


    /**
     * @param {Object} ctx {req : {express.Request}, res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model 
     */ 
    update = async (ctx, model) => {

        let updated = null;

        try {
            updated = await model.findOneAndUpdate({
                _id: new mongoose.Types.ObjectId(ctx.req.params.id)
            }, ctx.req.body,{
                new: true
            }).exec();
        }catch(err){
            return ctx.next(err);
        }

        return responses.ok(updated, ctx.res);

    }


    /**
     * @param {Object} ctx {req : {express.Request}, res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model 
     * @params {Object} options {
     *  afterDelete : function : any
     * }
     */ 
    delete = async (ctx, model, options) => {

        let deleted = null;

        try {
            deleted = await model.findOneAndDelete({
                _id: new mongoose.Types.ObjectId(ctx.req.params.id)
            }).exec();
            // if we want to do something after file deletion
            if (Object.prototype.toString.call(options.afterDelete || null) === "[object Function]"){
                // Then the argument is a valid function
                options.afterDelete();
            }
        }catch(err){
            return ctx.next(err);
        }

        return responses.ok(deleted, ctx.res);
        
    }

}

module.exports = ApiCrudManager;
