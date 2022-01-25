const mongoose = require("mongoose");
const responses = require("../middlewares/responses");

class ApiCrudManager {

    constructor () {}

    /**
     * @param {Object} ctx {req : {express.Request}, res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model 
     * @param {Array} requiredFields 
     */
    create (ctx, model, requiredFields) {

        // required fields
        for (let i = 0; i <requiredFields.length; i++) {
            if(!ctx.req.body[requiredFields[i]]){
                return ctx.next(new Error(`${requiredFields[i]} is required`));
            }
        }

        let obj =  new model(req.body);
        try{
            obj = await obj.save();
        }catch(err){
            return next(err);
        }

        return responses.ok(obj, res);

    }


    /**
     * @param {Object} ctx {req : {express.Request}, res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model 
     * @param {Array} requiredFields 
     */    
    read (ctx, model) {

        let product = null;

        try{
            product = await model.findOne({ 
                _id: ctx.req.params.id,
            }).exec();
        }catch(err){
            return ctx.next(err);
        }

        return responses.ok(product, res);

    }


    /**
     * @param {Object} ctx {req : {express.Request}, res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model 
     */ 
    update (ctx, model) {

        let updated = null;

        try {
            updated = await model.findOneAndUpdate({
                _id: new mongoose.Types.ObjectId(req.params.id)
            }, ctx.req.body,{
                new: true
            }).exec();
        }catch(err){
            return ctx.next(err);
        }

        return responses.ok(updated, res);

    }


    /**
     * @param {Object} ctx {req : {express.Request}, res : {express.Response}, next : {express.NextFunction}}
     * @param {mongoose.Model} model 
     * @param {Array} requiredFields 
     */ 
    delete (ctx, model) {

        let deleted = null;

        try {
            deleted = await model.findOneAndDelete({
                _id: new mongoose.Types.ObjectId(ctx.req.params.id)
            }).exec();
        }catch(err){
            return ctx.next(err);
        }

        return responses.ok(deleted, res);
        
    }

}

module.exports = ApiCrudManager;
