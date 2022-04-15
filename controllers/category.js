const mongoose = require('mongoose');
const responses = require('../middlewares/responses');
const Category = require('../models/category').model;
const { ChildCategoryModel } = require('../models/category');
const mongooseConnect = require('../db/mongoConnect');
const CM = require('../libs/ApiCrudManager');

const crudManager = new CM();

mongooseConnect(mongoose);

const createCategory = async function createCtg(req, res, next) {
  try {
    // One name per Option
    const named = await Category.findOne({
      name: req.body.name,
    }, 'name').exec();

    if (named != null) {
      return next(new Error('this name is already assigned to a category'));
    }

    return crudManager.create({ req, res, next }, Category);
  } catch (error) {
    return next(error);
  }
};

const updateCategory = async function upCtg(req, res, next) {
  try {
    return crudManager.update({ req, res, next }, Category, {
      message: 'category updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

// deleted === the deleted category and
// if the category wasn't found then deleted === null
const deleteCategory = async function delCtg(req, res, next) {
  try {
    return crudManager.delete({ req, res, next }, Category, {
      message: 'category deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getCategory = async function getCtg(req, res, next) {
  try {
    return crudManager.read({ req, res, next }, Category);
  } catch (error) {
    return next(error);
  }
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
      return next(res, `${requiredFields[i]} is required`);
    }
  }
  // One name per Option
  const named = await ChildCategoryModel.findOne({
    name: req.body.name,
  }, 'name').exec();

  if (named) {
    return next(res, new Error(), 'this name is already assigned to a child category');
  }

  let childCategory = new ChildCategoryModel(req.body);
  try {
    childCategory = await childCategory.save();
  } catch (err) {
    return next(err);
  }
  return responses.created(res, childCategory);
};

// deleted === the deleted category is the category was found
// deleted === null if the category was not found
const deleteChildCategory = async function delChCtg(req, res, next) {
  let deleted = null;
  try {
    deleted = await ChildCategoryModel.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.params.id),
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(res, deleted);
};

const updateChildCategory = async function upChCtg(req, res, next) {
  let updated = null;
  try {
    updated = await ChildCategoryModel.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(req.params.id || ''),
    }, req.body, {
      new: true,
    }).exec();
  } catch (err) {
    return next(err);
  }
  return responses.ok(res, updated);
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

  return responses.ok(res, child);
};

const addChildCategoryOption = async function addChCtgOpt(req, res, next) {
  // required fields
  const requiredFields = ['option'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    if (!req.body[requiredFields[i]]) {
      return next(res, `${requiredFields[i]} is required`);
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

/* eslint consistent-return: "off" */
const deleteChildCategoryOption = async function delChCtgOpt(req, res, next) {
  try {
    // remove the option
    ChildCategoryModel.updateOne(
      { _id: req.params.id },
      {
        $pull: { options: req.body.option },
      },
      {},
      async (err) => {
        if (err) return next(err);
        const child = await ChildCategoryModel.findOne({
          _id: req.params.id,
        }).exec();
        return responses.ok(res, child);
      },
    );
  } catch (err) {
    return next(err);
  }
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
