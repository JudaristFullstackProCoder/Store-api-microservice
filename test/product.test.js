//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const mongoose = require('mongoose');
const request = require("supertest");
const mongooseConnect = require('../db/mongoConnect');
const mongooseDisconnect = require('../db/mongoDisconnect');
require('dotenv').config({path: require('path').resolve('.env.test.local')});
// MODELS
const Product = require('../models/product').model;

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
