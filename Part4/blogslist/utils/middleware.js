const jwt = require('jsonwebtoken');
const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const TokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    const token =  authorization.replace('Bearer ', '');

    try {
      const DecodedToken = jwt.verify(token, process.env.SECRET);
      request.token = DecodedToken;
    } catch (err) {
      request.token = null;
    }
  }else {
    request.token = null;
  }
  
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  TokenExtractor
};