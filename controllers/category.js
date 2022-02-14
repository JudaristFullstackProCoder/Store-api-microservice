const Mongoose = require('mongoose');
const responses = require('../middlewares/responses');
const Category = require('../models/category').model;
const { ChildCategoryModel } = require('../models/category');

const createCategory = async function createCtg(req, res, next) {
  // required fields
  // Only the name is required
  const requiredFields = ['name'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return next(new Error(`${requiredFields[i]} is required`));
    }
  }
  // One name per Option
  const named = await Category.findOne({
    name: req.body.name,
  }, 'name').exec();

  /**
     * @var {Array|null} name
     * @conditon Then category's name already used
     */
  if (named != null) {
    return next(new Error('this name is already assigned to a category'));
  }

  let category = new Category(req.body);
  try {
    category = await category.save();
  } catch (err) {
    return next(err);
  }
  return responses.ok(category, res);
};

const updateCategory = async function upCtg(req, res, next) {
  let updated = null;
  try {
    updated = await Option.findOneAndUpdate({
      _id: new Mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(updated, res);
};

// deleted === the deleted category and
// if the category wasn't found then deleted === null
const deleteCategory = async function delCtg(req, res, next) {
  let deleted = null;
  try {
    deleted = await Category.findOneAndDelete({
      _id: new Mongoose.Types.ObjectId(req.params.id),
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(deleted, res);
};

const getCategory = async function getCtg(req, res, next) {
  let option = null;
  try {
    option = await Category.findOne({
      _id: req.params.id,
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(option, res);
};

/**
 * CRUD for Child Category entity
 * @returns
 */
const createChildCategory = async function createChCtg(req, res, next) {
  // required fields
  // Only the name is required
  const requiredFields = ['name', 'parent'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return next(new Error(`${requiredFields[i]} is required`));
    }
  }
  // One name per Option
  const named = await ChildCategoryModel.findOne({
    name: req.body.name,
  }, 'name').exec();

  /**
     * @var {Array|null} name
     */
  if (named != null) {
    return next(new Error('this name is already assigned to a child category'));
  }

  let childCategory = new ChildCategoryModel(req.body);
  try {
    childCategory = await childCategory.save();
  } catch (err) {
    return next(err);
  }
  return responses.ok(childCategory, res);
};

// deleted === the deleted category is the category was found
// deleted === null if the category was not found
const deleteChildCategory = async function delChCtg(req, res, next) {
  let deleted = null;
  try {
    deleted = await ChildCategoryModel.findOneAndDelete({
      _id: new Mongoose.Types.ObjectId(req.params.id),
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(deleted, res);
};

const updateChildCategory = async function upChCtg(req, res, next) {
  let updated = null;
  try {
    updated = await ChildCategoryModel.findOneAndUpdate({
      _id: new Mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(updated, res);
};

const getChildCategory = async function getChCtg(req, res, next) {
  let child = null;
  try {
    child = await ChildCategoryModel.findOne({
      _id: req.params.id,
    }).exec();
  } catch (err) {
    return next(err);
  }

  return responses.ok(child, res);
};

const addChildCategoryOption = async function addChCtgOpt(req, res, next) {
  // required fields
  const requiredFields = ['option'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return next(new Error(`${requiredFields[i]} is required`));
    }
  }

  // check if the option that we want to add already exist
  try {
    const child = await ChildCategoryModel.findOne({
      _id: req.params.id,
    }).exec();
    // verify now
    const childOptions = [...child.options];
    for (let i = 0; i < childOptions.length; i += 1) {
      if (childOptions[i].valueOf() === req.body.option) {
        return responses.ok(child, res);
      }
    }
  } catch (err) {
    return next(err);
  }

  ChildCategoryModel.updateOne(
    { _id: req.params.id },
    {
      $push: {
        options: req.body.option,
      },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) return next(err);
      return responses.ok(result, res);
    },
  );
  return false;
};

const deleteChildCategoryOption = async function delChCtgOpt(req, res, next) {
  // required fields
  const requiredFields = ['option'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return next(new Error(`${requiredFields[i]} is required`));
    }
  }
  // remove the option
  ChildCategoryModel.updateOne(
    { _id: req.params.id },
    {
      $pull: { options: req.body.option },
      // $pullAll : {options : [req.body.option]}
    },
    {
    },
    (err, result) => {
      if (err) return next(err);
      return responses.ok(result, res);
    },
  );
  return false;
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  createChildCategory,
  deleteChildCategory,
  updateChildCategory,
  getChildCategory,
  addChildCategoryOption,
  deleteChildCategoryOption,
};
