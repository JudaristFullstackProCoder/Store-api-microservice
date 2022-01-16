const Schema = require("mongoose").Schema;
const Mongoose = require("mongoose");
const Store = require("../models/store").model;
const responses = require("../middlewares/responses");
const ObjectId = require("mongoose").Types.ObjectId;
const axios = require('axios').default;

const createStore = async function (req, res, next) {
    // required fields
    let required_fields = ["name"];
    for (let i = 0; i <required_fields.length; i++) {
        if(!req.body[required_fields[i]]){
            return next(new Error(`${required_fields[i]} is required`));
        }
    }
    
    try{
        await axios.post("http://localhost:4422/authentication/user/is-authenticated").then((data) => {
            // I don't need data because axios throw error and 
            // end script the when the request fails with status of 403
            // the call to url http://localhost:4422/authentication/user/is-authenticated return status 403 if user
            // isn't authenticated and status 200 if the user is authenticated and if
            // axios get the status 403 he end the script this is while i surounded this with try catch
            // this permit me to handle the case when axios throw an error when the call to the api response with status 403 
    });
    }catch(err){
        //return next(new Error("Authentication required !"));
    }
    // One name per store
    let named = await Store.findOne({
        name : req.body.name,
    }, "name").exec();

    /**
     * @var {Array} email
     * @conditon Then email address already used
     */
    if (named != null){
        return next(new Error("this name is already assigned to a shop"));
    }

    let store =  new Store(req.body);
     try{
         store = await store.save();
     }catch(err){
         return next(err);
     }
    return responses.ok(store, res);
}

const deleteStore = async function (req, res, next) {
    let store = null;
    try {
        store = await Store.findOneAndDelete({
            _id: new ObjectId(req.params.id)
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(store, res);
}

const updateStore = async function (req, res, next) {
    // only update primary information
    // delete the request field that aren't allowed to be modified
    delete req.body.shopkeeper
    delete req.body.products
    delete req.body.settings
    let updated = null;
    
    try {
        updated = await Store.findOneAndUpdate({
            _id: new Mongoose.Types.ObjectId(req.params.id || "")
        }, req.body,{
            new: true
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(updated, res);
}

const updateStoreSettings = async function (req, res, next) {
    // update store settings informations
      //find the store first, then update the settings of the store
      let updated = null;
    try{
            updated = await  Store.findOneAndUpdate(
                { "_id": req.params.id},
            { 
                "$set": {
                    "settings": req.body
                }
            });
           return responses.ok(updated, res);
    }catch(err){
        next(err);
    }
}

const getStore = async function (req, res, next) {
    // only retrieve store information (name and settings) not products
    let store = null;
    try{
        store = await Store.findOne({ 
            _id: req.params.id,
        }, "name shopkeeper settings").exec();
    }catch(err){
        return next(err);
    }
    return responses.ok("store", res);
}

const getStoreProductsWithPagination = async function (req, res, next) {
    // only retrieve store products 
    let store = null;
    try{
        store = await Store.findOne({ 
            _id: new Schema.Types.ObjectId(req.params.id)
        }, "products");
    }catch(err){
        return next(err);
    }
    return responses.ok(store, res);
}

module.exports = {
    createStore : createStore,
    deleteStore : deleteStore,
    updateStore : updateStore,
    getStore : getStore,
    getAllProducts : getStoreProductsWithPagination,
    updateStoreSettings: updateStoreSettings
}
