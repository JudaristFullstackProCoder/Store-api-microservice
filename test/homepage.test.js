//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';
const request = require("supertest");

const expect = require("chai").expect;
//Require the dev-dependencies
let app = require('../server/app');

describe("GET / API homepage", () => {
  it("should return status 200 when trying to get the homepage", async () => {
    const res = await request(app).get("/");
    expect(res.status).to.equal(200);
  });
});
