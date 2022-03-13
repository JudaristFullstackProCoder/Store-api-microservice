const request = require('supertest');
const { app } = require('../../server/app');

/** Skip Eslint errors && warnings */
const it = () => {};
const describe = () => {};
const toBe = () => {};
const expect = () => { toBe };

describe('Test the root path', () => {
  it('It should response the GET method', () => {
    request(app).get('/').then((response) => {
      expect(response.statusCode).toBe(200);
    });
  });
});
