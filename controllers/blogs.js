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

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter
