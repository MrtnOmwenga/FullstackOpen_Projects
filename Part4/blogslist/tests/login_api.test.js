const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

describe('Test login function', () => {
  test('Correct username and password returns token', async () => {
    const ValidUser = {
      username: '_kevinlacey',
      password: 'KevinLacey123'
    };

    const result = await api
      .post('/api/login')
      .send(ValidUser)
      .expect(200);
    
    expect(result.body.token).toBeDefined();
  }, 100000);
});

afterAll(async () => {
  await mongoose.connection.close();
});