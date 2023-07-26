const blogs = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/users');
const { ObjectId } = require('mongodb');
require('express-async-errors');


blogs.get('/', (request, response) => {
  Blog
    .find({})
    .populate('user', {username: 1, name: 1})
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
  const body = request.body;

  // const token = jwt.verify(request.token, process.env.SECRET);
  const token = request.token;
  
  if (!token) {
    return response.status(400).send({error: 'Invalid Token'});
  }
  const user = await User.findById(token.id);
  if (!body.title || !body.url) {
    response.status(400).send({ error: 'Bad request' });
    return;
  }

  if (!body.likes) {
    request.body.likes = 0;
  }
  const blog = new Blog({ ...body, user: user._id});
  
  const result = await blog.save();
  response.status(201).json(result);
});

blogs.put('/:id', async (request, response) => {
  const body = request.body;

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true });
  response.json(updatedBlog);
});
  
blogs.delete('/:id', async (request, response) => {
  const token = request.token;
  if (!token) {
    return response.status(400).send({error: 'Invalid Token'});
  }

  const RequestedBlog = await Blog.findById(request.params.id);
  
  if (!(token.id === RequestedBlog.user.toString())) {
    return response.status(405).send({error: 'Operation not allowed'});
  }

  await Blog.deleteOne({ _id: new ObjectId(request.params.id) });
  response.status(204).end();
});

module.exports = blogs;