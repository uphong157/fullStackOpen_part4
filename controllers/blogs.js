const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const inputData = request.body

  if (!Object.hasOwn(inputData, 'title') || !Object.hasOwn(inputData, 'url')) {
    response.status(400).end()
    return
  }

  inputData.likes = inputData.likes || 0

  const blog = new Blog(inputData)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter
