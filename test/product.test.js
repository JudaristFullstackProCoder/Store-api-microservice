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
const ProductVariation = require('../models/product').ProductVariation;

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
       /**
         data format:
          {
            "success": true,
            "data": {
              "name": "product-name",
              "price": 10,
              "description": "A product",
              "options": [
                {
                  "_id": "62578bb8054b3386968624f6"
                }
              ],
              "category": "62578bb8054b3386968624ef",
              "online": true,
              "shopkeeper": "62578bb8054b3386968624ee",
              "store": "62578bb8054b3386968624f3",
              "images": [
                {}
              ],
              "compositions": [],
              "_id": "62578bb8054b3386968624f5",
              "__v": 0
            }
          }
        */
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
    /**
     exemple data value:
          {
        "success": true,
        "data": 'product option added succesfully'
     */
    expect(response.statusCode).equal(201);
    // response should have both error and data property
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.be.string('product option added succesfully');
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
    /**
     exmple data format;
     {
        "error": true,
        "data": "option with id 624f55bc229d2cc31798bb5f already exist in this product use the endpoint \n      PATCH /api/v1/product/[product id]/option/[option id] instead "
      }
     */
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
    /**
      exemple data value:
            {
        "success": true,
        "data": 'product option updated succesfully'
     */
    // response should have both error and data property
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.be.string('product option updated succesfully');
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
    /**
      exemple data format:
{
  "success": true,
  "data": {
    "_id": "626083a9fce9518edd18e41c",
    "name": "product-name",
    "price": 10,
    "description": "A product",
    "options": [
      {
        "_id": "626083a9fce9518edd18e41d"
      },
      {
        "option": {
          "_id": "626083b6234702a0e4687644",
          "name": "op-test-product"
        },
        "value": "exemple value",
        "_id": "626083b6234702a0e4687648"
      }
    ],
    "category": {
      "_id": "626083a9fce9518edd18e416",
      "name": "category"
    },
    "online": true,
    "shopkeeper": "626083a9fce9518edd18e415",
    "store": "626083a9fce9518edd18e41a",
    "images": [
      {}
    ],
    "compositions": [],
    "__v": 0
  }
}
     */
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

// create Product variation

describe('POST /api/v1/product/:id/variation', () => {
  it('Should return the good response when we add a variation to a product', async () => {
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();
    const response = await request(app).post(`/api/v1/product/${product._id}/variation`).send({
      price: 200,
      product: product._id.toString(),
      name: 'variation',
    });
    const data = response.body;
    /**
      response data format:
      {
        success; true,
        data: 'product variation created sucessfully'
      }
     */
    expect(response.statusCode).equal(201);
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.be.string('product variation created sucessfully');
  });
});

// get all variation of a given product

describe('GET /api/v1/product/:id/variation', () => {
  it('Should return all the variations of a given product', async () => {
   
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();
    const response = await request(app).get(`/api/v1/product/${product._id}/variation`);
    const data = response.body;
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    /**
     * response format:
    {
      success: true,
      data: {
        [
          {
            _id: '625ba31f58df8d4404a26172',
            price: 0,
            product: '625ba31f58df8d4404a26158',
            name: 'variation',
            options: [],
            __v: 0
          },
          { ... },
          { ... }
        ]
      }
    }
     */
  });
});

// Add production variation option

describe('POST /api/v1/product/:id/variation/:variationId/option', () => {
  it('Should return the good response and http headers when adding prod variation option', async () => {
    
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();

    const prodVariationOptionExemple = await (new Option({
      name: 'color',
    })).save();

    const variations = await request(app).get(`/api/v1/product/${product._id}/variation`);
    const {data: variationsData} = variations.body;
    const firstVariation = variationsData[0];
    const response = await request(app).post(`/api/v1/product/${product._id}/variation/${firstVariation._id}/option`).send({
      option: prodVariationOptionExemple._id.toString(),
      value: 'red',
    });
    const data = response.body;
    expect(response.statusCode).equal(201);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.be.string('product variation option created successfully');
  });
});

// get product variation option

describe('GET /api/v1/product/:id/variation/:variationId/option', () => {
  it('Should return the good response when get prod variation option', async () => {
    
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();

    const prodVariationOptionExemple = await Option.findOne({
      name: 'color',
    }).exec();

    const variations = await request(app).get(`/api/v1/product/${product._id}/variation`);
    const {data: variationsData} = variations.body;
    const firstVariation = variationsData[0];
    console.log(`/api/v1/product/${product._id}/variation/${firstVariation._id}/option/${prodVariationOptionExemple._id}`);
    const response = await request(app).get(`/api/v1/product/${product._id}/variation/${firstVariation._id}/option/${prodVariationOptionExemple._id}`);
    const data = response.body;
    /**
      response data format exemple:
      {
        success: true,
        data: {
          option: { _id: '62607ff9466cc0581ad774d6', name: 'color' },
          value: 'red',
          _id: '62607ff9466cc0581ad774da'
        }
      }
    */
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('option');
    expect(data.data).to.have.property('value');
    expect(data.data).to.have.property('_id');
    // expect data option structure
    expect(data.data.option).to.have.property('_id', prodVariationOptionExemple._id.toString());
    expect(data.data.option).to.have.property('name', prodVariationOptionExemple.name);
  });
});

// update product variation option

describe('PATCH /api/v1/product/:id/variation/:variationId/option', () => {
  it('Should return the good response when update prod variation option', async () => {
    
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();

    const prodVariationOptionExemple = await Option.findOne({
      name: 'color',
    }).exec();

    const variations = await request(app).get(`/api/v1/product/${product._id}/variation`);
    const {data: variationsData} = variations.body;
    const firstVariation = variationsData[0];
    const response = await request(app).patch(`/api/v1/product/${product._id}/variation/${firstVariation._id}/option/${prodVariationOptionExemple._id}`).send({
      // change product variation option value from red to purple
      value: 'purple',
    });
    const data = response.body;
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.be.string('product variation option updated successfully');
  });
});

// Delete product variation option

describe('DELETE /api/v1/product/:id/variation/:variationId/option', () => {
  it('Should return the good response when update prod variation option', async () => {
    
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();

    const prodVariationOptionExemple = await Option.findOne({
      name: 'color',
    }).exec();

    const variations = await request(app).get(`/api/v1/product/${product._id}/variation`);
    const {data: variationsData} = variations.body;
    const firstVariation = variationsData[0];
    const response = await request(app).delete(`/api/v1/product/${product._id}/variation/${firstVariation._id}/option/${prodVariationOptionExemple._id}`);
    const data = response.body;
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.be.string('product variation option deleted successfully');
  });
});
// update product variation

describe('PATCH /api/v1/product/:id/variation/variationId', () => {
  it('Should return the goof response when we update a variation', async () => {
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();
    const variation = await ProductVariation.findOne({
      name: 'variation',
    }).exec();
    console.log(variation);
    const response = await request(app).patch(`/api/v1/product/${product._id}/variation/${variation._id}`).send({
      price: 100000,
      name: 'variation2',
    });
    const data = response.body;
    /**
      response data format:
      {
        success; true,
        data: 'product variation updated sucessfully'
      }
     */
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.be.string('product variation updated successfully');
  });
});

// Delete product variation

describe('DELETE /api/v1/product/:id/variation/variationId', () => {
  it('Should return the good response when we delete a variation', async () => {
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();
    const variation = await ProductVariation.findOne({
      name: 'variation2',
      price: 100000,
    }).exec();
    const response = await request(app).delete(`/api/v1/product/${product._id}/variation/${variation._id}`);
    const data = response.body;
    /**
      response data format:
      {
        success; true,
        data: 'product variation deleted sucessfully'
      }
     */
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.be.string('product variation deleted successfully');
  });
});

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
    /**
     exemple data format;
     {
      "success": true,
      "data": 'product option deleted successfully'
    }
     */
    expect(response.statusCode).equal(200);
    expect(data).to.have.property('success', true);
    expect(data).to.have.property('data');
    expect(data.data).to.be.string('product option deleted successfully');
  });
});

// Delete Product
describe('DELETE /api/v1/product/id', () => {
  it('should return status 200 when we delete a product', async () => {
    
    const product = await Product.findOne({
      name: 'product-name',
    }).exec();
    const response = await request(app).delete(`/api/v1/product/${product._id}`);
    const data = response.body;
    /**
     data format exemple:
     {
      "success": true,
      "data": "product deleted successfully"
     */
    expect(response.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data.data).to.be.string('product deleted successfully');
    expect(data).to.have.property('success', true);
  });
});
