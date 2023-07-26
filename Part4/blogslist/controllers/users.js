const bcrypt = require('bcryptjs');
const User = require('../models/users');
const UserRoutes = require('express').Router();
require('express-async-errors');

UserRoutes.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs');
  response.json(users);
});

UserRoutes.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3) {
    return response.status(400).send({error: 'Invalid Password'});
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    name,
    passwordHash,
  });

  const saved = await newUser.save();
  response.status(201).json(saved);
});

module.exports = UserRoutes;