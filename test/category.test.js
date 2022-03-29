//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const mongoose = require('mongoose');
const request = require("supertest");
const mongooseConnect = require('../db/mongoConnect');
const mongooseDisconnect = require('../db/mongoDisconnect');
require('dotenv').config({path: require('path').resolve('.env.test.local')});
// MODELS
const Category = require('../models/category').model;
const ChildCategory = require('../models/category').ChildCategoryModel;
const Option = require('../models/options').model;

const expect = require("chai").expect;
//Require the dev-dependencies
let app = require('../server/app');

before( () => {
  mongooseConnect(mongoose);
});
after(async () => {
  await mongooseDisconnect();
});

// Create category
describe("POST /api/v1/category", () => {
  it("should return status 201 when a category is created", async () => {
    const res = await request(app).post("/api/v1/category").send({
        name: 'Category of test'
      });
    const data = res.body;
    expect(res.status).to.equal(201);
    expect(data).to.have.property("data");
    expect(data).to.have.property("success", true);
    expect(data.data).to.have.property("_id");
    expect(data.data).to.have.property("name", "Category of test");
  });
});


describe("POST /api/v1/category", () => {
  it('should return status 500 when try to add a category that have the same name', async () => {
    const res = await request(app).post('/api/v1/category').send({
        name: 'Category of test'
      });
    const data = res.body;
    console.log(data);
    expect(res.status).to.equal(500);
    expect(data).to.have.property('error');
    expect(data).to.have.property('error', true);
    expect(data).to.have.property('message');
  });
});

// Upadte category
describe('PATCH /api/v1/category/id', () => {
  it('should return status 200 when a category is updated', async () => {
    let category = await Category.findOne({name: 'Category of test'}).exec();
    const res = await request(app).patch(`/api/v1/category/${category._id}`).send({
      name: 'Category of test (updated)'
    });
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('name', 'Category of test (updated)');
  });
});

// Get category
describe('GET /api/v1/category/id', () => {
  it('should return status 200 when retrieve a category', async () => {
    let category = await Category.findOne({name: 'Category of test (updated)'}).exec();
    const res = await request(app).get(`/api/v1/category/${category._id}`);
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('name', 'Category of test (updated)');
  });
});

// Create child category
describe('POST /api/v1/category/child', () => {
  it('should return status 201 when a child category is created', async () => {
    let category = await Category.findOne({name: 'Category of test (updated)'}).exec();
    const res = await request(app).post(`/api/v1/category/child`).send({
        name: 'Child Category test',
        parent: category._id,
        abbr: 'CCT',
        options: [],
      });
    const data = res.body;
    expect(res.status).to.equal(201);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('options');
    expect(data.data.parent).equal(category._id.toString());
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('abbr');
    expect(data.data).to.have.property('name');
  });
});

// Get child category
describe('GET /api/v1/category/child/id', () => {
  it('should return status 200 when retrieve a child category', async () => {
    let childCategory = await ChildCategory.findOne({name: 'Child Category test'}).exec();
    const res = await request(app).get(`/api/v1/category/child/${childCategory._id}`);
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id', childCategory._id.toString());
    expect(data.data).to.have.property('parent', childCategory.parent.toString());
    expect(data.data).to.have.property('abbr', childCategory.abbr);
    expect(data.data).to.have.property('name', childCategory.name);
  });
});

// Update child category
describe('PATCH /api/v1/category/child/id', () => {
  it('should return status 200 when a child category updated', async () => {
    let childCategory = await ChildCategory.findOne({name: 'Child Category test'}).exec();
    const res = await request(app).patch(`/api/v1/category/child/${childCategory._id}`).send({
      name: 'Child Category test (updated)',
      abbr: 'New Abbreviation'
    });
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id', childCategory._id.toString());
    expect(data.data).to.have.property('name', 'Child Category test (updated)');
    expect(data.data).to.have.property('abbr', 'New Abbreviation');
  });
});

// Add child category option
describe('PUT /api/v1/category/child/id/option', () => {
  it('should return status 200 when a child category option is added', async () => {
    new Option({
      name: 'Test option',
    }).save((err, doc) => {
      if (err) console.log(err);
    });
    let childCategory = await ChildCategory.findOne({name: 'Child Category test (updated)'}).exec();
    let option = await Option.findOne({
      name: 'Test option',
    }).exec();

    const res = await request(app).put(`/api/v1/category/child/${childCategory._id}/option`).send({
        option: option._id,
    });
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id', childCategory._id.toString());
    expect(data.data).to.have.property('parent', childCategory.parent.toString());
    expect(data.data).to.have.property('name', childCategory.name);
    expect(data.data).to.have.property('abbr', childCategory.abbr);
    expect(...data.data.options).equal(option._id.toString());
  });
});
// Delete child category option
describe('DELETE /api/v1/category/child/id/option', () => {
  it('should return status 200 when a child category option is deleted', async () => {
    let option = await Option.findOne({name: 'Test option'}).exec();
    // Delete the option
    Option.findOneAndDelete({name: 'Test option'}).exec();
    // ----------------------------------------------
    let childCategory = await ChildCategory.findOne({name: 'Child Category test (updated)'}).exec();
    const res = await request(app).delete(`/api/v1/category/child/${childCategory._id}/option`).send({
      option: option._id,
    });
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id', childCategory._id.toString());
    expect(data.data).to.have.property('parent', childCategory.parent.toString());
    expect(data.data).to.have.property('name', childCategory.name);
    expect(data.data).to.have.property('abbr', childCategory.abbr);
    expect(data.data.options).to.have.lengthOf(0);
  });
});
// Delete child category
describe('DELETE /api/v1/category/child/id', () => {
  it('should return status 200 when a child category is deleted', async () => {
    let childCategory = await ChildCategory.findOne({name: 'Child Category test (updated)'}).exec();
    const res = await request(app).delete(`/api/v1/category/child/${childCategory._id}`);
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id', childCategory._id.toString());
    expect(data.data.name).equal(childCategory.name);
    expect(data.data.abbr).equal(childCategory.abbr);
    expect(data.data.options).to.have.lengthOf(0);
  });
});

// Delete category
describe('DELETE /api/v1/category/id', () => {
  it('should return status 200 when a category is deleted', async () => {
    let category = await Category.findOne({name: 'Category of test (updated)'}).exec();
    const res = await request(app).delete(`/api/v1/category/${category._id}`);
    const data = res.body;
    expect(res.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('name', 'Category of test (updated)');
  });
});
