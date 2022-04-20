//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const request = require("supertest");
const { ChildCategoryModel: ChildCategory } = require("../models/category");
const Option = require("../models/options").model;
const Category = require("../models/category").model;
const Product = require("../models/product").model;
const { ProductVariation } = require("../models/product");
const PromoCode = require("../models/promoCode");
const Store = require("../models/store").model;

const expect = require("chai").expect;
//Require the dev-dependencies
let app = require('../server/app');

describe("Z Clear database 😊", () => {
  it("should clear all the db", async () => {
   await ProductVariation.deleteMany({});
   await Product.deleteMany({});
   await Category.deleteMany({});
   await Option.deleteMany({});
   await ChildCategory.deleteMany({});
   await Store.deleteMany({});
   await PromoCode.deleteMany({});
  })
});
