const blogs = require('express').Router();
const Blog = require('../models/blogs');
const { ObjectId } = require('mongodb');

blogs.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});
  
blogs.post('/', (request, response, next) => {
  const blog = new Blog(request.body);
  
  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch(error => next(error));
});
  
blogs.delete('/:id', (request, response, next) => {
  Blog.deleteOne({ _id: new ObjectId(request.params.id) })
    .then(response.status(204).end())
    .catch(error => next(error));
});

module.exports = blogs;