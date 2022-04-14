//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const mongoose = require('mongoose');
const request = require("supertest");
const mongooseConnect = require('../db/mongoConnect');
require('dotenv').config({path: require('path').resolve('.env.test.local')});
// MODELS
const Product = require('../models/product').model;
const Category = require('../models/category').model;
const Store = require('../models/store').model;
const Option = require('../models/options').model;

const expect = require("chai").expect;
const logger = require('../libs/logger');
//Require the dev-dependencies
let app = require('../server/app');
// connect this mongoose instance
mongooseConnect(mongoose);


// Create Product
describe('POST /api/v1/product', () => {
  it('should return status 201 when we create a product', async () => {
      let ctgid = null;
      let storeid = null;
      let shid = (new mongoose.Types.ObjectId()).toString();

      // create category
      let ctg = await new Category({
        name: 'category',
      }).save()
      ctgid = ctg._id.toString();

      // create store
      let store = await new Store({
        name: 'store',
        shopkeeper: (new mongoose.Types.ObjectId()).toString(),
      }).save();
      storeid = store._id.toString();

       const product = {
          name: 'product-name',
          price: 10,
          description: 'A product',
          options: {},
          category: ctgid,
          online: true,
          shopkeeper: shid,
          store: storeid,
          images: {},
          image: {},
          pre_video: {},
       }
       const response = await request(app).post('/api/v1/product').send({
        ...product
       });
       const data = response.body;
       console.log(data);
       expect(response.status).to.equal(201);
       expect(data).to.have.property('data');
       expect(data).to.have.property('success', true);
       expect(data.data).to.have.property('_id');
       expect(data.data).to.have.property('images');
       // expect(data.data).to.have.property('image');
       expect(data.data).to.have.property('name', product.name);
       expect(data.data).to.have.property('online', product.online);
       expect(data.data).to.have.property('price', product.price);
       expect(data.data).to.have.property('description', product.description);
       expect(data.data).to.have.property('category', product.category);
       expect(data.data).to.have.property('shopkeeper', product.shopkeeper);
       expect(data.data).to.have.property('store', product.store);
  });
});

// Add option to a product

describe('POST /api/v1/product/id/option', () => {
  it('Should return the good status when we add an option o a product', async () => {
    const product = await Product.findOne({
      name: "product-name",
    }).exec();
    // create an option for test
    let option = await new Option({
      name: 'op-test-product',
    }).save();
    option = await Option.findOne({
      name: "op-test-product"
    }).exec();
    const response = await request(app).post(`/api/v1/product/${product._id}/option`).send({
      option: option._id.toString(),
      value: "exemple value",
    });
    const data = response.body;
    expect(response.statusCode).equal(200);
    // response should have both error and data property
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('name');
    expect(data.data).to.have.property('price');
    expect(data.data).to.have.property('description');
    expect(data.data).to.have.property('options');
    // check sub options into product
    expect(data.data.options[0]).to.have.property('_id');
    // check if the first sub option matches the criteria
    expect(data.data.options[1]).to.have.property('option');
    expect(data.data.options[1]).to.have.property('_id');
    expect(data.data.options[1]).to.have.property('value');
    // end verification of the first sub options
    expect(data.data).to.have.property('category');
    expect(data.data).to.have.property('online');
    expect(data.data).to.have.property('shopkeeper');
    expect(data.data).to.have.property('store');
    expect(data.data).to.have.property('images');
  });
})

// Add option that already exist to a product

describe('POST /api/v1/product/id/option', () => {
  it('Should return the 500 status when we add an option that already exist in product', async () => {
    const product = await Product.findOne({
      name: "product-name",
    }).exec();

    let option = await Option.findOne({
      name: "op-test-product"
    }).exec();

    const response = await request(app).post(`/api/v1/product/${product._id}/option`).send({
      option: option._id.toString(),
      value: "exemple value",
    });

    const data = response.body;
    // response should have both error and data property
    expect(data).to.have.property('error', true);
    expect(data).to.have.property('data');
    // check ig the status is 500
    expect(response.statusCode).equal(500);
  });
});

// Get product option

describe('GET /api/v1/product/:id/option/:optionId', () => {
  it('Should return good headers after we get a product option', async () => {
    const product = await Product.findOne({
      name: "product-name",
    }).exec();

    let option = await Option.findOne({
      name: "op-test-product"
    }).exec();
    const response = await request(app).get(`/api/v1/product/${product._id}/option/${option._id}`);
    const data = response.body;
    /**
      data format:
      {
      "success": true,
      "data": {
        "option": {
          "_id": "62577c81451d7f23ecd169e9",
          "name": "op-test-product",
          "__v": 0
        },
        "value": "exemple value",
        "_id": "62577c81451d7f23ecd169ed"
       }
      }
     */
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.have.property('option');
    expect(data.data.option).to.have.property('_id', option._id.toString());
    expect(data.data.option).to.have.property('name', option.name);
    expect(data.data).to.have.property('value');
  });
});

// Update product option
describe('PATCH /api/v1/product/id/option/option_id', () => {
  it('should return the good response when we update a product option', async () => {
    const product = await Product.findOne({
      name: "product-name",
    }).exec();

    let option = await Option.findOne({
      name: "op-test-product"
    }).exec();

    const response = await request(app).patch(`/api/v1/product/${product._id}/option/${option._id.toString()}`).send({
      value: "change the value of the option",
    });

    const data = response.body;
    console.log(data);
    // response should have both error and data property
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('name');
    expect(data.data).to.have.property('price');
    expect(data.data).to.have.property('description');
    expect(data.data).to.have.property('options');
    expect(data.data).to.have.property('category');
    expect(data.data).to.have.property('online');
    expect(data.data).to.have.property('shopkeeper');
    expect(data.data).to.have.property('store');
    expect(data.data).to.have.property('images');
    // sub obtions
    expect(data.data).to.have.property('options');
    expect(data.data.options[0]).to.have.property('_id');
    expect(data.data.options[1]).to.have.property('option');
      // sub option is populated by mongoose
    expect(data.data.options[1]).to.have.property('option');
    expect(data.data.options[1]).to.have.property('_id');
    expect(data.data.options[1]).to.have.property('value');
    // sub options
    // check ig the status is 200
    expect(response.statusCode).equal(200);
  });
});

// Get Product
describe('GET /api/v1/product/id', () => {
  it('should return status 200 when we retrieve a product', async () => {
      
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();
    // get category of the product
    const category = await Category.findOne({
      _id: product.category.toString(),
    }).exec();

    const response = await request(app).get(`/api/v1/product/${product._id}`);
    const data = response.body;
    expect(response.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('images');
    // expect(data.data).to.have.property('image');
    expect(data.data).to.have.property('name', product.name);
    expect(data.data).to.have.property('online', product.online);
    expect(data.data).to.have.property('price', product.price);
    expect(data.data).to.have.property('description', product.description);
    // when we retreieve a product, the controller use the populate method of mongoose to fetch date from other table
    // represented in the entites by the id
    // eg: category is represented in product by _id, when we fetch product we alse fetch category informations from
    // category table and replace _id by this information to hava a full product description
    expect(data.data.category).to.have.property('_id', product.category._id.toString());
    expect(data.data.category).to.have.property('_id', category._id.toString());
    expect(data.data.category).to.have.property('name', category.name);
    // product options
    expect(data.data).to.have.property('options');
    expect(data.data.options[0]).to.have.property('_id');
      // sub option is populated by mongoose
      console.log(data.data.options)
    expect(data.data.options[1]).to.have.property('option');
    expect(data.data.options[1].option).to.have.property('_id');
    expect(data.data.options[1].option).to.have.property('name');
    expect(data.data.options[1]).to.have.property('_id');
    expect(data.data.options[1]).to.have.property('value');
    // product options
    expect(data.data).to.have.property('shopkeeper', product.shopkeeper.toString());
    expect(data.data).to.have.property('store', product.store.toString());
  });
});

// Product composition


// Delete product option
describe('DELETE /api/v1/product/:id/option/:optionId', () => {
  it('Should return the good response when we delete a product option', async () => {
    let option = await Option.findOne({
      name: "op-test-product"
    }).exec();
    // retrieve the product from the database to get the id
    const product = await Product.findOne({
      name: "product-name",
    }).exec();

    const response = await request(app).delete(`/api/v1/product/${product._id}/option/${option._id}`);
    const data = response.body;
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('success', true);
    expect(data).to.have.property(data);
    expect(data.data).to.have.property(acknowledged, true);
    expect(data.data).to.have.property(modifiedCount, 1);
    expect(data.data).to.have.property(matchedCount, 1);
    expect(data.data).to.have.property(upsertedCount);
    expect(data.data).to.have.property(upsertedId);
  });
});

// Delete Product
describe('DELETE /api/v1/product/id', () => {
  it('should return status 200 when we delete a product', async () => {
    
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();
    const response = await request(app).delete(`/api/v1/product/${product._id}`);
    // clean the database
    await Category.deleteMany({});
    await Option.deleteMany({});
    await Store.deleteMany({});

    const data = response.body;
    expect(response.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('images');
    // expect(data.data).to.have.property('image');
    expect(data.data).to.have.property('name', product.name);
    expect(data.data).to.have.property('online', product.online);
    expect(data.data).to.have.property('price', product.price);
    expect(data.data).to.have.property('description', product.description);
    expect(data.data).to.have.property('category', product.category.toString());
    expect(data.data).to.have.property('shopkeeper', product.shopkeeper.toString());
    expect(data.data).to.have.property('store', product.store.toString());
  });
});
