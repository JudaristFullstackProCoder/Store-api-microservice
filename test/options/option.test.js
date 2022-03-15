const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios').default;
const User = require('../../models/category');
const test = require('mocha').test;
let process = require('process');

chai.use(chaiHttp);

function returnRes (res) {
    return function () {
        console.log(res);
        return res;
    };
}
async function Get () {
    const res = await axios.post('http://127.0.0.1:2222/api/v1/option', {name: 'Color'}, {});
    setTimeout( returnRes(res), 500);
}

Get();


describe('API OPTION CRUD', () => {
  describe('create option', () => {
    test('should respond with status 201', (done) => {
      const fakeOption = {
        name : "Color",
      }
    //   const response = Get();
    //   console.log(response);
    //   assert.equal(response.status, 201, 'expect response status code to be 201');
      done();
    });
  });

  describe('update option', () => {
    it('should return status 200', (done) => {
      const fakeOptionReplacement = {
        name: "Electronics"
      }
      console.log(`http://127.0.0.1:2222/api/v1/option/${process.env._id_option}`);
      axios.patch(`http://127.0.0.1:2222/api/v1/option/${process.env._id_option}`, {...fakeOptionReplacement}, {})
      .then(response => {
        assert.equal(response.status, 200, 'expect response status code to be 200');
      });
      done();
    });
  })

  describe('Delete option', () => {
    it('should return status 200', (done) => {
      axios.delete(`http://127.0.0.1:2222/api/v1/option/${process.env._id_option}`, {}, {})
      .then(response => {
        assert.equal(response.status, 200, 'expect response status code to be 200');
        done();
      });
      done();
    });
  })

  describe('Delete option', () => {
    it('should return status 200', (done) => {
      axios.get(`http://127.0.0.1:2222/api/v1/option/${process.env._id_option}`, {}, {})
      .then(response => {
        assert.equal(response.status, 200, 'expect response status code to be 200');
      });
      done();
    });
  })

});
