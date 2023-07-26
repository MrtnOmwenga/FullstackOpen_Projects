const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const helper = require('./blogs_helper');
const Blog = require('../models/blogs');
const log = require('../utils/logger');
const { ObjectId } = require('mongodb');

const api = supertest(app);

const Login = async () => {
  const CurrUser = {
    username: '_kevinlacey',
    password: 'KevinLacey123'
  };
  const login = await api.post('/api/login').send(CurrUser);
  return {
    token: 'Bearer ' + login.body.token,
    id: login.body.id
  };
};

beforeEach(async () => {
  await Blog.deleteMany({});
  log.info('Cleared database');

  const InitialBlogs = helper.initialBlogs
    .map(async(object) => {
      return new Blog({
        ...object,
        user: await helper.RandomUser()
      });
    });
  
  const UpdatedBlogs = await Promise.all(InitialBlogs);
  const PromiseArray = UpdatedBlogs
    .map(blogObject => blogObject.save());

  await Promise.all(PromiseArray);

  const token = await Login();
  const UsersBlog = new Blog({
    title: 'Users To Be Deleted',
    author: '_',
    url: 'https://to_be_deleted.com',
    likes: 0,
    user: new ObjectId(token.id)
  });
  const NotUsersBlog = new Blog({
    title: 'Not Users To Be Deleted',
    author: '_',
    url: 'https://to_be_deleted.com',
    likes: 0,
    user: new ObjectId('64c02e09a9cdd526b3196efc')
  });

  await UsersBlog.save();
  await NotUsersBlog.save();
}, 100000);

describe('Getting data from database', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length + 2);
  });

  test('blog object defines id not _id', async () => {
    const response = await api
      .get('/api/blogs');

    expect(response.body[0].id).toBeDefined();
  });
});

describe('Posting data to database',  () => {
  test('a valid blog can be added', async () => {
    const token = await Login();
    const newBlog = {
      title: 'HoneyPot.cult',
      author: 'Community',
      url: 'https://cult.honeypot.io/reads',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization', token.token)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length + 3);
    const titles = response.body.map(blog => blog.title);
    expect(titles).toContain(newBlog.title);
  });

  test('blogs have likes added by default', async () => {
    const token = await Login();
    const newBlog = {
      title: 'HackerRank',
      author: 'Community',
      url: 'https://www.hackerrank.com/',
    };

    const createdBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization', token.token)
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
      const token = await Login();

      const sansTitle = {
        author: 'Unknown',
        url: 'https://placeholder.com',
        likes: 0,
      };

      const sansUrl = {
        title: 'SansUrl',
        author: 'Unknown',
        likes: 0
      };

      await api.post('/api/blogs')
        .send(sansTitle)
        .set('authorization', token.token)
        .expect(400);

      await api.post('/api/blogs')
        .send(sansUrl)
        .set('authorization', token.token)
        .expect(400);
    });

  test('Request rejected when wrong token is passed', async () => {
    const newBlog = {
      title: 'HoneyPot.cult',
      author: 'Community',
      url: 'https://cult.honeypot.io/reads',
      likes: 0,
    };

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('authorization', 'randomassortmentoflettersandnumbers1234')
      .expect(400);

    expect(result.body.error).toBeDefined();
  });
});

describe('Deletion of a note', () => {
  test('Succeeds with status code 204 if id is valid', async () => {
    const token = await Login();
    const BlogsAtStart = await helper.blogsInDB();
    const BlogToDelete = await Blog.find({title: 'Users To Be Deleted'});

    await api
      .delete(`/api/blogs/${BlogToDelete[0].id}`)
      .set('authorization', token.token)
      .expect(204);
  
    const BlogsAtEnd = await helper.blogsInDB();
  
    expect(BlogsAtEnd.length).toBe(
      BlogsAtStart.length - 1
    );
  
    const titles = BlogsAtEnd.map(r => r.title);
    expect(titles).not.toContain(BlogToDelete.title);
  });

  test('Doesnt succeed if Blog wasnt posted by user', async () => {
    const token = await Login();
    const BlogToDelete = await Blog.find({title: 'Not Users To Be Deleted'});

    const result = await api
      .delete(`/api/blogs/${BlogToDelete[0].id}`)
      .set('authorization', token.token)
      .expect(405);

    expect(result.body.error).toBeDefined();
  });

  test('Doesnt succeed if wrong token is passed', async () => {
    const BlogsAtStart = await helper.blogsInDB();
    const BlogToDelete = await Blog.find({title: 'Users To Be Deleted'});

    await api
      .delete(`/api/blogs/${BlogToDelete[0].id}`)
      .set('authorization', 'randomassortmentoflettersandnumbers1234')
      .expect(400);
  
    const BlogsAtEnd = await helper.blogsInDB();
  
    expect(BlogsAtEnd.length).toBe(BlogsAtStart.length);
  
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