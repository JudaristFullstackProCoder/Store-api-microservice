//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const request = require('supertest');
const mongoose = require('mongoose');
const mongooseConnect = require('../db/mongoConnect');
const mongooseDisconnect = require('../db/mongoDisconnect');
require('dotenv').config({path: require('path').resolve('.env.test.local')});
// MODELS
const  Promocode = require('../models/promoCode');

const expect = require('chai').expect;
let app = require('../server/app');
const logger = require('../libs/logger');
const Promocde = require('../models/promoCode');

before(async () => {
  mongooseConnect(mongoose);
});
after(async () => {
  await mongooseDisconnect();
})

// Create promocode
describe('POST /api/v1/promocode', () => {
     it('should return status 201 when we create a promocode', async () => {
          let now = Date.now();
          const response = await request(app).post('/api/v1/promocode').send({
                name: 'promo785s',
                discount: 15,
                from: now,
                to: 1650927600000,
                maxuse: 1000,
                remaininguse: 1000,
          });
          const data = response.body;
          expect(response.status).to.equal(201);
          expect(data).to.have.property('data');
          expect(data).to.have.property('success', true);
          expect(data.data).to.have.property('_id');
          expect(data.data).to.have.property('maxuse', 1000);
          expect(data.data).to.have.property('to', 1650927600000);
          expect(data.data).to.have.property('from', now);
          expect(data.data).to.have.property('discount', 15);
          expect(data.data).to.have.property('remaininguse', 1000);
          expect(data.data).to.have.property('name', 'promo785s');
     });
});

// Delete promocode

describe('DELETE /api/v1/promocode/id', () => {
  it('should return status 200 when we delete a promocode', async () => {
    let promocodeName = 'promo785s';
    let promocode =  await Promocde.findOne({
      name: promocodeName,
    }).exec();
    logger.debug(promocode);
    const response = await request(app).delete(`/api/v1/promocode/${promocode._id}`);
    const data = response.body;
    expect(response.status).to.equal(200);
    expect(data).to.have.property('data');
    expect(data).to.have.property('success', true);
    expect(data.data).to.have.property('_id');
    expect(data.data).to.have.property('maxuse', promocode.maxuse);
    expect(data.data).to.have.property('to', promocode.to);
    expect(data.data).to.have.property('from', promocode.from);
    expect(data.data).to.have.property('discount', promocode.discount);
    expect(data.data).to.have.property('remaininguse', promocode.remaininguse);
    expect(data.data).to.have.property('name', promocode.name);
  })
});
