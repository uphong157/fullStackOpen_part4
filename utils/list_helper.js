const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const addAllLikes = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(addAllLikes, 0)
}

module.exports = {
  dummy, totalLikes
}
