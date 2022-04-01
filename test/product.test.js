//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const mongoose = require('mongoose');
const request = require("supertest");
const mongooseConnect = require('../db/mongoConnect');
const mongooseDisconnect = require('../db/mongoDisconnect');
require('dotenv').config({path: require('path').resolve('.env.test.local')});
// MODELS
const Product = require('../models/product').model;
const Category = require('../models/category').model;
const Store = require('../models/store').model;

const expect = require("chai").expect;
const logger = require('../libs/logger');
//Require the dev-dependencies
let app = require('../server/app');

before( () => {
  mongooseConnect(mongoose);
});
after(async () => {
  await mongooseDisconnect();
});

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
      // delete entities crated for testi
      await Category.deleteMany({}).exec();
      await Store.deleteMany({}).exec();

       const res = await request(app).post('/api/v1/product').send({
        ...product
       });
       const data = res.body;
       expect(res.status).to.equal(201);
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

// Delete Product
describe('DELETE /api/v1/product/id', () => {
  it('should return status 200 when we delete a product', async () => {
      
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();

    const res = await request(app).delete(`/api/v1/product/${product._id}`);
    const data = res.body;
    expect(res.status).to.equal(200);
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
