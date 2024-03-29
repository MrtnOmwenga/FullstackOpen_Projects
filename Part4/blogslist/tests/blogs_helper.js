const Blog = require('../models/blogs');
const User = require('../models/users');

const initialBlogs = [
  {
    title: 'Hacker news',
    author: 'Paul Graham',
    url: 'https://news.ycombinator.com/newest',
    likes: 0
  },
  {
    title: 'Dev',
    author: 'Community',
    url: 'https://dev.to/',
    likes: 0
  },
  {
    title: 'Hackr',
    author: 'Community',
    url: 'https://hackr.io/blog',
    likes: 0
  },
  {
    title: 'Hackernoon',
    author: 'Community',
    url: 'https://hackernoon.com/',
    likes: 0
  },
  {
    title: 'FreeCodeCamp',
    author: 'FreeCodeCamp',
    url: 'https://www.freecodecamp.org/news/',
    likes: 0
  }
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

const RandomUser = async () => {
  const users = await User.find({});
  const UserIds = users.map(user => user._id);
  return UserIds[Math.floor(Math.random() * UserIds.length)];
};

module.exports = {
  initialBlogs, blogsInDB, RandomUser
};