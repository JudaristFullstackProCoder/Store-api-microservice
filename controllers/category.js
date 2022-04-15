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
  try {
    // One name per Option
    const named = await ChildCategoryModel.findOne({
      name: req.body.name,
    }, 'name').exec();

    if (named) {
      return next(res, new Error(), 'this name is already assigned to a child category');
    }
    return crudManager.create({ req, res, next }, ChildCategoryModel, {
      message: 'sub-category created successfully',
    });
  } catch (error) {
    return next(error);
  }
};

// deleted === the deleted category is the category was found
// deleted === null if the category was not found
const deleteChildCategory = async function delChCtg(req, res, next) {
  try {
    return crudManager.delete({ req, res, next }, ChildCategoryModel, {
      message: 'sub-category deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const updateChildCategory = async function upChCtg(req, res, next) {
  try {
    return crudManager.update({ req, res, next }, ChildCategoryModel, {
      message: 'sub-category updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const getChildCategory = async function getChCtg(req, res, next) {
  try {
    return crudManager.read({ req, res, next }, ChildCategoryModel);
  } catch (error) {
    return next(error);
  }
};

const addChildCategoryOption = async function addChCtgOpt(req, res, next) {
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
