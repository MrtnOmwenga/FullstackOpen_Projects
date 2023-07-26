const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const helper = require('./users_helper');
const User = require('../models/users');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  
  const InitialUsers = helper.initialUsers
    .map(async (object) => {
      return new User({
        username: object.username,
        name: object._name,
        passwordHash: await bcrypt.hash(object.password, 10),
      });
    });
  const HashedUsers = await Promise.all(InitialUsers);
  const PromiseArray = HashedUsers
    .map(user => user.save());

  await Promise.all(PromiseArray);
}, 100000);

describe('Getting sata from database', () => {
  test('Getting all users from database', async () => {
    const result = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body).toHaveLength(helper.initialUsers.length);
  });
});

describe('Adding data to database', () => {
  test('Adding valid user to database', async () => {
    const validUser = {
      username: '_jeremyclarkson',
      name: 'Jeremy Clarkson',
      password: 'JeremyClarkson123',
    };

    const result = await api
      .post('/api/users')
      .send(validUser)
      .expect(201);
    
    expect(result.body.username).toContain(validUser.username);
  });

  test('User with Short password gets rejected with 400 error code', async () => {
    const invalidUser = {
      username: '_shortpassword',
      name: 'Short Password',
      password: 'ps'
    };

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400);

    expect(result.body.error).toContain('Invalid Password');
  });

  test('User with short username gets rejected with 500 error code', async () => {
    const invalidUser = {
      username: '_',
      name: '_',
      password: '_InvalidUser'
    };

    const result = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400);

    expect(result.body.error).toBeDefined();
  });

  test('User with non-unique username is rejected with 400 error code', async () => {
    const duplicateUser = {
      username: '_kevinlacey',
      name: 'Kevin Lacey',
      password: 'KevinLacey123',
    };

    const result = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400);

    expect(result.body.error).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});