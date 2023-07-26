const login = require('express').Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

login.post('/', async (request, response) => {
  const {username, password} = request.body;

  const user = await User.findOne({ username });
  const CorrectPassword = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && CorrectPassword)) {
    return response.status(401).send({error: 'Invalid username or password'});
  }

  const forToken = {
    username: user.username,
    id: user._id
  };
  const token = jwt.sign(forToken, process.env.SECRET);

  response
    .status(200)
    .json({ token, username: user.username, id: user._id });
});

module.exports = login;