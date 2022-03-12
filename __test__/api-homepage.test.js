const request = require('supertest');
const { app } = require('../server/app');

describe('It should get the root path', () => {
    test('The response status code must be 200', () => {
        request(app).get('/').then((response) => expect(response.statusCode).toBe(200));
    });
});

describe('It should get the root path', () => {
    test('The response status code is equal to 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});
