const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogs = require('./controllers/blogs');
const users = require('./controllers/users');
const login = require('./controllers/login');
const config = require('./utils/config');
const log = require('./utils/logger');
const middleware = require('./utils/middleware');

mongoose.set('strictQuery', false);

log.info(`connecting to ${config.MONGODB_URI}`);
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    log.info('connected to mongodb');
  }).catch((error) => {
    log.error('error connecting to MongoDB:', error.message);
  });

const app = express();

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.TokenExtractor);

app.use('/api/blogs', blogs);
app.use('/api/users', users);
app.use('/api/login', login);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;