//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const request = require('supertest');
const mongoose = require('mongoose');
const mongooseConnect = require('../db/mongoConnect');
const mongooseDisconnect = require('../db/mongoDisconnect');
require('dotenv').config({path: require('path').resolve('.env.test.local')});
// MODELS
const Option = require('../models/options').model;

const expect = require('chai').expect;
//Require the dev-dependencies
let app = require('../server/app');

before(async () => {
  await mongooseConnect(mongoose);
});
after(async () => {
  await mongooseDisconnect();
});
// Create option
describe('POST /api/v1/option', () => {
it('should return status 201 when we create an option', async () => {
     const res = await request(app).post('/api/v1/option').send({
          name: 'Option test',
     });
     const data = res.body;
     /**
       response data format:
       {
            success: true,
            data: 'option crated uccessfully'
       }
      */
     expect(res.status).to.equal(201);
     expect(data).to.have.property('data');
     expect(data).to.have.property('success', true);
  });
});

// Create option
describe('POST /api/v1/option', () => {
     it('should return status 500 if the name is not available (already taken by another option)', async () => {
          const res = await request(app).post('/api/v1/option').send({
               name: 'Option test',
          });
          const data = res.body;
          expect(res.status).to.equal(500);
          expect(data).to.have.property('data');
          expect(data).to.have.property('error', true);
     });
});

// Retrieve an option
describe('GET /api/v1/option', () => {
     it('should return status 200 when we retrieve an option', async () => {
          const option = await Option.findOne({
               name: 'Option test',
          }).exec();
          const res = await request(app).get(`/api/v1/option/${option._id}`);
          const data = res.body;
          expect(res.status).to.equal(200);
          expect(data).to.have.property('data');
          expect(data).to.have.property('success', true);
          expect(data.data).to.have.property('_id', option._id.toString());
          expect(data.data).to.have.property('name', option.name);
     });
});

// Update an option
describe('PATCH /api/v1/option', () => {
     it('should return status 200 when we update an option', async () => {
          const option = await Option.findOne({
               name: 'Option test',
          }).exec();
          const res = await request(app).patch(`/api/v1/option/${option._id}`).send({
               name: 'Another name !',
          });
          const data = res.body;
          /**
            response data format:
            {
                 success: true,
                 data: 'option updated successfully'
            }
           */
          expect(res.status).to.equal(200);
          expect(data).to.have.property('data');
          expect(data.data).to.be.string('option updated successfully');
          expect(data).to.have.property('success', true);
     });
});

// Delete category
describe('DELETE /api/v1/option', () => {
 it('should return status 200 when we delete an option', async () => {
      const option = await Option.findOne({
           name: 'Another name !',
      }).exec();
     const res = await request(app).delete(`/api/v1/option/${option._id}`).send({
          name: 'Option test',
     });
     const data = res.body;
     /**
       response data format:
       {
            success: true,
            data: 'option deleted successfully'
       }
      */
     expect(res.status).to.equal(200);
     expect(data).to.have.property('data');
     expect(data).to.have.property('success', true);
  });
});
