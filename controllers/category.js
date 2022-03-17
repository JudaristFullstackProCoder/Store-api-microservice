const Mongoose = require('mongoose');
const responses = require('../middlewares/responses');
const Category = require('../models/category').model;
const { ChildCategoryModel } = require('../models/category');

const createCategory = async function createCtg(req, res) {
  // required fields
  // Only the name is required
  const requiredFields = ['name'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return responses.error(res, `${requiredFields[i]} is required`);
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
    return responses.error(res, 'this name is already assigned to a category');
  }

  let category = new Category(req.body);
  try {
    category = await category.save();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.created(res, category);
};

const updateCategory = async function upCtg(req, res) {
  let updated = null;
  try {
    updated = await Category.findOneAndUpdate({
      _id: new Mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.ok(res, updated);
};

// deleted === the deleted category and
// if the category wasn't found then deleted === null
const deleteCategory = async function delCtg(req, res) {
  let deleted = null;
  try {
    deleted = await Category.findOneAndDelete({
      _id: new Mongoose.Types.ObjectId(req.params.id),
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.ok(res, deleted);
};

const getCategory = async function getCtg(req, res) {
  let option = null;
  try {
    option = await Category.findOne({
      _id: req.params.id,
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.ok(res, option);
};

/**
 * CRUD for Child Category entity
 * @returns
 */
const createChildCategory = async function createChCtg(req, res) {
  // required fields
  // Only the name is required
  const requiredFields = ['name', 'parent'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return responses.error(res, `${requiredFields[i]} is required`);
    }
  }
  // One name per Option
  const named = await ChildCategoryModel.findOne({
    name: req.body.name,
  }, 'name').exec();

  if (named) {
    return responses.error(res, new Error(), 'this name is already assigned to a child category');
  }

  let childCategory = new ChildCategoryModel(req.body);
  try {
    childCategory = await childCategory.save();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.created(res, childCategory);
};

// deleted === the deleted category is the category was found
// deleted === null if the category was not found
const deleteChildCategory = async function delChCtg(req, res) {
  let deleted = null;
  try {
    deleted = await ChildCategoryModel.findOneAndDelete({
      _id: new Mongoose.Types.ObjectId(req.params.id),
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.ok(res, deleted);
};

const updateChildCategory = async function upChCtg(req, res) {
  let updated = null;
  try {
    updated = await ChildCategoryModel.findOneAndUpdate({
      _id: new Mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }
  return responses.ok(res, updated);
};

const getChildCategory = async function getChCtg(req, res) {
  let child = null;
  try {
    child = await ChildCategoryModel.findOne({
      _id: req.params.id,
    }).exec();
  } catch (err) {
    return responses.error(res, err, err.message);
  }

  return responses.ok(res, child);
};

const addChildCategoryOption = async function addChCtgOpt(req, res, next) {
  // required fields
  const requiredFields = ['option'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return responses.error(res, `${requiredFields[i]} is required`);
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
        return responses.ok(res, child);
      }
    }
  } catch (err) {
    return responses.error(res, err, err.message);
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
    async (err) => {
      if (err) return next(err);
      const child = await ChildCategoryModel.findOne({
        _id: req.params.id,
      }).exec();
      return responses.ok(res, child);
    },
  );
  return false;
};

const deleteChildCategoryOption = async function delChCtgOpt(req, res, next) {
  // required fields
  const requiredFields = ['option'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return responses.error(res, `${requiredFields[i]} is required`);
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
    async (err) => {
      if (err) return next(err);
      const child = await ChildCategoryModel.findOne({
        _id: req.params.id,
      }).exec();
      return responses.ok(res, child);
    },
  );
  return responses.error(res);
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
