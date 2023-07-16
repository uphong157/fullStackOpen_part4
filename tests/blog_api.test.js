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

describe('when adding a new blog', () => {
  test('it succeeds with valid data', async () => {
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

  test('if the likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'newBlog',
      author: 'newAuthor',
      url: 'newUrl'
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    const blogs = await helper.blogsInDb()
    const savedBlog = blogs.find(blog => blog.id === result.body.id)
    expect(savedBlog.likes).toBe(0)
  })

  test('if the title or url property is missing, respond with 400', async () => {
    const noTitleBlog = {
      author: 'newAuthor',
      url: 'newUrl',
      likes: 0
    }
    const noUrlBlog = {
      title: 'newBlog',
      author: 'newAuthor',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(noTitleBlog)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
