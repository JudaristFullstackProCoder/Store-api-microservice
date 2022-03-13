const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/app');

const should = chai.should();

chai.use(chaiHttp);

describe('API', () => {
  describe('homepage', () => {
    it('should respond with status 200', (done) => {
      chai.request(server)
        .get('/').send({}).end((err, res) => {
            if (err) console.log(err);
          res.should.have.status(200);
          done();
        });
    });
  });
});
