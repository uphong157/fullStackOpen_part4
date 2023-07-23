const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('creating a user', () => {
  test('succeeds with a valid input', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'username1',
      name: 'name1',
      password: 'pwd1'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(usersAtEnd.map(user => user.username)).toContain(newUser.username)
  })

  test('with invalid data returns 400', async () => {
    const usersAtStart = await helper.usersInDb()

    const shortPwdData = {
      username: 'username1',
      name: 'name1',
      password: 'p'
    }

    const result = await api
      .post('/api/users')
      .send(shortPwdData)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('invalid password')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('with duplicate username returns 400', async () => {
    const duplicateUsername = {
      username: 'root',
      name: 'name1',
      password: 'pwd1'
    }

    await api
      .post('/api/users')
      .send(duplicateUsername)
      .expect(400)
  }, 10000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
