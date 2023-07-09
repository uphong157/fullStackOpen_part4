const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('blog post has id property', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('a blog can be added', async () => {
  const newBlog = {
    title: 'newBlog',
    author: 'newAuthor',
    url: 'newUrl',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
})

afterAll(async () => {
  await mongoose.connection.close()
})
