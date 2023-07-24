const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const helper = require('./helper');
const Blog = require('../models/blogs');
const log = require('../utils/logger');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  log.info('Cleared database');

  const PromiseArray = helper.initialBlogs
    .map(object => new Blog(object))
    .map(blogObject => blogObject.save());

  await Promise.all(PromiseArray);
}, 100000);

describe('Getting data from database', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blog object defines id not _id', async () => {
    const response = await api
      .get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('Posting data to database', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'HoneyPot.cult',
      author: 'Community',
      url: 'https://cult.honeypot.io/reads',
      likes: 0
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    const titles = response.body.map(blog => blog.title);
    expect(titles).toContain(newBlog.title);
  });

  test('blogs have likes added by default', async () => {
    const newBlog = {
      title: 'HackerRank',
      author: 'Community',
      url: 'https://www.hackerrank.com/',
    };

    const createdBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get(`/api/blogs/${createdBlog.body.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body[0].likes).toBeDefined();
  });

  test('POST request without title or url returns 400 Bad Request',
    async () => {
      const sansTitle = {
        author: 'Unknown',
        url: 'https://placeholder.com',
        likes: 0
      };

      const sansUrl = {
        title: 'SansUrl',
        author: 'Unknown',
        likes: 0
      };

      await api.post('/api/blogs')
        .send(sansTitle)
        .expect(400);

      await api.post('/api/blogs')
        .send(sansUrl)
        .expect(400);
    });
});

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogsToDelete = blogsAtStart[0];
    
    await api
      .delete(`/api/blogs/${blogsToDelete.id}`)
      .expect(204);
  
    const blogsAtEnd = await helper.blogsInDB();
  
    expect(blogsAtEnd.length).toBeGreaterThanOrEqual(
      helper.initialBlogs.length - 1
    );
  
    const titles = blogsAtEnd.map(r => r.title);
    expect(titles).not.toContain(blogsToDelete.title);
  });
});

describe('Updating blog', () => {
  test('Blog with valid id updates correctly', async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogsToUpdate = blogsAtStart[0];
    const newBlog = {
      title: 'New Title',
      author: 'New Author',
      url: 'https://new_url.com',
      likes: 10
    };

    const updatedBlog = await api.put(`/api/blogs/${blogsToUpdate.id}`)
      .send(newBlog);

    /* console.log(updatedBlog); */
    expect(updatedBlog.body.likes).toEqual(10);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});