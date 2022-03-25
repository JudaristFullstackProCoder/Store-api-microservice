//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const { default: mongoose } = require('mongoose');
const request = require('supertest');
const mongooseConnect = require('../db/mongoConnect');
require('dotenv').config({path: require('path').resolve('.env.test.local')});
// MODELS
const Store = require('../models/store').model;

const expect = require('chai').expect;

let app = require('../server/app');
const logger = require('../libs/log');

before(async () => {
  await mongooseConnect(process.env.TESTMONGODBURI);
});

// Create store
describe('POST /api/v1/store', () => {
it('should return status 201 when we create an store', async () => {
     // Create fake Id for shopkeeper
     const res = await request(app).post('/api/v1/store').send({
          name: 'store exemple',
          shopkeeper: '623d3f36e507bb9be1d9c5a6',
     });
     const data = res.body;
     expect(res.status).to.equal(201);
     expect(data).to.have.property('data');
     expect(data).to.have.property('success', true);
     expect(data.data).to.have.property('_id');
     expect(data.data).to.have.property('name', 'store exemple');
  });
});

// Delete a store
describe('DELETE /api/v1/store', () => {
     it('should return status 200 when delete store', async () => {
          // Create fake Id for shopkeeper
          let store = await Store.findOne({
               name: 'store exemple'
          }).exec();
          logger.info(store.settings);
          const res = await request(app).delete(`/api/v1/store/${store._id}`);
          const data = res.body;
          expect(res.status).to.equal(200);
          expect(data).to.have.property('data');
          expect(data).to.have.property('success', true);
          expect(data.data).to.have.property('_id', store._id.toString());
          expect(data.data).to.have.property('shopkeeper', store.shopkeeper.toString());
          expect(data.data).to.have.property('name', store.name);
     });
});