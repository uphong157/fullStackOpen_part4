const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'title1',
    author: 'author1',
    url: 'url1',
    likes: 0
  },
  {
    title: 'title2',
    author: 'author2',
    url: 'url2',
    likes: 1
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}
