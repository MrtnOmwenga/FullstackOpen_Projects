const blogs = require('express').Router();
const Blog = require('../models/blogs');
const { ObjectId } = require('mongodb');
require('express-async-errors');

blogs.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

blogs.get('/:id', (request, response) => {
  Blog
    .find({ _id: new ObjectId(request.params.id) })
    .then(blogs => {
      response.json(blogs);
    });
});

blogs.post('/', async (request, response) => {

  if (!request.body.title || !request.body.url) {
    response.status(400).send({ error: 'Bad request' });
    return;
  }

  if (!request.body.likes) {
    request.body.likes = 0;
  }
  const blog = new Blog(request.body);
  
  const result = await blog.save();
  response.status(201).json(result);
});

blogs.put('/:id', async (request, response) => {
  const body = request.body;

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  response.json(updatedBlog);
});
  
blogs.delete('/:id', (request, response, next) => {
  Blog.deleteOne({ _id: new ObjectId(request.params.id) })
    .then(response.status(204).end())
    .catch(error => next(error));
});

module.exports = blogs;