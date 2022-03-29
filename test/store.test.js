//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const { default: mongoose } = require('mongoose');
const request = require('supertest');
const mongooseConnect = require('../db/mongoConnect');
const mongooseDisconnect = require('../db/mongoDisconnect');
require('dotenv').config({path: require('path').resolve('.env.test.local')});
// MODELS
const Store = require('../models/store').model;

const expect = require('chai').expect;

let app = require('../server/app');
const logger = require('../libs/logger');

before(() => {
  mongooseConnect(mongoose);
});
after(async () => {
  await mongooseDisconnect();
})

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
          expect(data.data.settings).to.have.property('_id');
     });
});

describe('PATCH /api/v1/store/:id', () => {
     it('it should return 200 status when we updated a store', async () => {
          let store = await Store.findOne({
               name: 'store exemple',
          }).exec();
          let updatedName = 'Alibaba shopping';
          const response = await request(app).patch(`/api/v1/store/${store._id}`).send({
               name: updatedName,
          });
          const data = response.body;
          expect(response.status).to.equal(200);
          expect(data).to.have.property('data');
          expect(data).to.have.property('success', true);
          expect(data.data).to.have.property('_id', store._id.toString());
          expect(data.data).to.have.property('shopkeeper', store.shopkeeper.toString());
          expect(data.data).to.have.property('name', updatedName);
          expect(data.data.settings).to.have.property('_id', store.settings._id.toString());
     })
})

describe('GET /api/store/:id', () => {
     it('it should return status 200 when we retrieve a store informations', async () => {
          let name = 'Alibaba shopping';
          let store = await Store.findOne({
               name,
          }).exec();
          let response = await request(app).get(`/api/v1/store/${store._id}`);
          const data = response.body;
          expect(response.status).to.equal(200);
          expect(data).to.have.property('data');
          expect(data).to.have.property('success', true);
          expect(data.data).to.have.property('_id', store._id.toString());
          expect(data.data).to.have.property('shopkeeper', store.shopkeeper.toString());
          expect(data.data).to.have.property('name', name);
          expect(data.data.settings).to.have.property('_id', store.settings._id.toString());
     })
});

// Delete a store
describe('DELETE /api/v1/store/:id', () => {
     it('should return status 200 when delete store', async () => {
          // Create fake Id for shopkeeper
          let store = await Store.findOne({
               name: 'Alibaba shopping',
          }).exec();
          const res = await request(app).delete(`/api/v1/store/${store._id}`);
          const data = res.body;
          expect(res.status).to.equal(200);
          expect(data).to.have.property('data');
          expect(data).to.have.property('success', true);
          expect(data.data).to.have.property('_id', store._id.toString());
          expect(data.data).to.have.property('shopkeeper', store.shopkeeper.toString());
          expect(data.data).to.have.property('name', store.name);
          expect(data.data.settings).to.has.property('_id', store.settings._id.toString());
     });
});