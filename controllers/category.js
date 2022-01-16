const responses = require("../middlewares/responses");
const Category = require("../models/category").model;
const childCategoryModel = require("../models/category").childCategoryModel;
const Mongoose = require("mongoose");

const createCategory = async function (req, res, next) {
    // required fields
    // Only the name is required 
    let required_fields = ["name"];
    for (let i = 0; i <required_fields.length; i++) {
        if(!req.body[required_fields[i]]){
            return next(new Error(`${required_fields[i]} is required`));
        }
    }
    // One name per Option
    let named = await Category.findOne({
        name : req.body.name,
    }, "name").exec();

    /**
     * @var {Array|null} name
     * @conditon Then category's name already used
     */
    if (named != null){
        return next(new Error("this name is already assigned to a category"));
    }

    let category =  new Category(req.body);
    try{
        category = await category.save();
    }catch(err){
        return next(err);
    }
   return responses.ok(category, res);
}

const updateCategory = async function (req, res, next) {
    let updated = null;
    try {
        updated = await Option.findOneAndUpdate({
            _id: new Mongoose.Types.ObjectId(req.params.id || "")
        }, req.body,{
            new: true
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(updated, res);
}

// deleted === the deleted category and 
// if the category wasn't found then deleted === null
const deleteCategory = async function (req, res, next) {
    let deleted = null;
    try {
        deleted = await Category.findOneAndDelete({
            _id: new Mongoose.Types.ObjectId(req.params.id)
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(deleted, res);
}

const getCategory = async function (req, res, next) {
    let option = null;
    try{
        option = await Category.findOne({ 
            _id: req.params.id,
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(option, res);
}

/**
 * CRUD for Child Category entity
 * @returns 
 */
const createChildCategory = async function (req, res, next) {
    // required fields
    // Only the name is required 
    let required_fields = ["name", "parent"];
    for (let i = 0; i <required_fields.length; i++) {
        if(!req.body[required_fields[i]]){
            return next(new Error(`${required_fields[i]} is required`));
        }
    }
    // One name per Option
    let named = await childCategoryModel.findOne({
        name : req.body.name,
    }, "name").exec();

    /**
     * @var {Array|null} name
     */
    if (named != null){
        return next(new Error("this name is already assigned to a child category"));
    }

    let childCategory =  new childCategoryModel(req.body);
    try{
        childCategory = await childCategory.save();
    }catch(err){
        return next(err);
    }
   return responses.ok(childCategory, res);
    
}

// deleted === the deleted category is the category was found
// deleted === null if the category was not found
const deleteChildCategory = async function (req, res, next) {
    let deleted = null;
    try {
        deleted = await childCategoryModel.findOneAndDelete({
            _id: new Mongoose.Types.ObjectId(req.params.id)
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(deleted, res);
}

const updateChildCategory = async function (req, res, next) {
    let updated = null;
    try {
        updated = await childCategoryModel.findOneAndUpdate({
            _id: new Mongoose.Types.ObjectId(req.params.id || "")
        }, req.body,{
            new: true
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(updated, res);
}

const getChildCategory = async function (req, res, next) {
    let child = null;
    try{
        child = await childCategoryModel.findOne({ 
            _id: req.params.id,
        }).exec();
    }catch(err){
        return next(err);
    }

    return responses.ok(child, res);
}

const addChildCategoryOption = async function (req, res, next) {
        // required fields
    let required_fields = ["option"];
    for (let i = 0; i <required_fields.length; i++) {
        if(!req.body[required_fields[i]]){
            return next(new Error(`${required_fields[i]} is required`));
        }
    }

    // check if the option that we want to add already exist
    try{
        child = await childCategoryModel.findOne({ 
            _id: req.params.id,
        }).exec();
        //verify now
        for (let value of child.options){
            if (value.valueOf() === req.body.option) {
                // option already exists return ok
                return responses.ok(child, res);
            }
        }
    }catch(err){
        return next(err);
    }
    
    childCategoryModel.updateOne(
        {_id : req.params.id},
        {$push : {
            options : req.body.option
        }},{
            new : true
        }, function (err, result) {
            if (err) return next(err);
            return responses.ok(result, res);
        }
    );
}

const deleteChildCategoryOption = async function (req, res, next) {
    // required fields
    let required_fields = ["option"];
    for (let i = 0; i <required_fields.length; i++) {
        if(!req.body[required_fields[i]]){
            return next(new Error(`${required_fields[i]} is required`));
        }
    }
    // remove the option
    childCategoryModel.updateOne(
        {_id : req.params.id},
        {
            $pull : {options : req.body.option } ,
            //$pullAll : {options : [req.body.option]}
        },
        {
        }, function (err, result){
            if (err) return next(err);
            return responses.ok(result, res);
        }
    );
}


module.exports = {
    createCategory: createCategory,
    updatecategory: updateCategory,
    deletecategory: deleteCategory,
    getCategory: getCategory,
    createChildCategory: createChildCategory,
    deleteChildCategory: deleteChildCategory,
    updateChildCategory: updateChildCategory,
    getChildCategory: getChildCategory,
    addChildCategoryOption: addChildCategoryOption,
    deleteChildCategoryOption: deleteChildCategoryOption
}
