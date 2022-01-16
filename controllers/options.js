const Option = require("../models/options").model;
const responses = require("../middlewares/responses");
const Mongoose = require("mongoose");

const createOption = async function (req, res, next) {
    // required fields
    let required_fields = ["name"];
    for (let i = 0; i <required_fields.length; i++) {
        if(!req.body[required_fields[i]]){
            return next(new Error(`${required_fields[i]} is required`));
        }
    }
    // One name per Option
    let named = await Option.findOne({
        name : req.body.name,
    }, "name").exec();

    /**
     * @var {Array} email
     * @conditon Then email address already used
     */
    if (named != null){
        return next(new Error("this name is already assigned to an option"));
    }

    let option =  new Option(req.body);
     try{
         option = await option.save();
     }catch(err){
         return next(err);
     }
    return responses.created(option, res);
}

const deleteOption = async function (req, res, next) {
    let option = null;
    try {
        option = await Option.findOneAndDelete({
            _id: new Mongoose.Types.ObjectId(req.params.id)
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(option, res);
}

const updateOption = async function (req, res, next) {
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

const getOption = async function (req, res, next) {
    let option = null;
    try{
        option = await Option.findOne({ 
            _id: req.params.id,
        }).exec();
    }catch(err){
        return next(err);
    }
    return responses.ok(option, res);
}


module.exports = {
    createOption: createOption,
    deleteOption: deleteOption,
    updateOption: updateOption,
    getOption: getOption
}
