import { test } from 'tap'
import { build } from '../src/app'
import { FastifyInstance } from 'fastify'

test('user endpoints', async (t) => {
  const app: FastifyInstance = await build()

  t.teardown(() => app.close())

  // 测试创建用户
  const createUserPayload = {
    name: 'Test User',
    email: 'test@example.com'
  }

  const createResponse = await app.inject({
    method: 'POST',
    url: '/api/users',
    payload: createUserPayload
  })

  t.equal(createResponse.statusCode, 201)
  const createdUser = JSON.parse(createResponse.payload)
  t.equal(createdUser.name, createUserPayload.name)
  t.equal(createdUser.email, createUserPayload.email)
  t.type(createdUser.id, 'number')

  // 测试获取单个用户
  const getResponse = await app.inject({
    method: 'GET',
    url: `/api/users/${createdUser.id}`
  })

  t.equal(getResponse.statusCode, 200)
  const fetchedUser = JSON.parse(getResponse.payload)
  t.equal(fetchedUser.id, createdUser.id)
  t.equal(fetchedUser.name, createUserPayload.name)
  t.equal(fetchedUser.email, createUserPayload.email)

  // 测试获取所有用户
  const getAllResponse = await app.inject({
    method: 'GET',
    url: '/api/users'
  })

  t.equal(getAllResponse.statusCode, 200)
  const users = JSON.parse(getAllResponse.payload)
  t.type(users, 'array')
  t.ok(users.length >= 1)

  // 测试更新用户
  const updatePayload = {
    name: 'Updated User',
    email: 'updated@example.com'
  }

  const updateResponse = await app.inject({
    method: 'PUT',
    url: `/api/users/${createdUser.id}`,
    payload: updatePayload
  })

  t.equal(updateResponse.statusCode, 200)
  const updatedUser = JSON.parse(updateResponse.payload)
  t.equal(updatedUser.id, createdUser.id)
  t.equal(updatedUser.name, updatePayload.name)
  t.equal(updatedUser.email, updatePayload.email)

  // 测试删除用户
  const deleteResponse = await app.inject({
    method: 'DELETE',
    url: `/api/users/${createdUser.id}`
  })

  t.equal(deleteResponse.statusCode, 200)

  // 验证用户已被删除
  const getDeletedUserResponse = await app.inject({
    method: 'GET',
    url: `/api/users/${createdUser.id}`
  })

  t.equal(getDeletedUserResponse.statusCode, 404)
})

// 测试错误情况
test('user error cases', async (t) => {
  const app: FastifyInstance = await build()

  t.teardown(() => app.close())

  // 测试获取不存在的用户
  const getResponse = await app.inject({
    method: 'GET',
    url: '/api/users/999999'
  })

  t.equal(getResponse.statusCode, 404)

  // 测试创建用户时的验证
  const invalidUserPayload = {
    name: '',
    email: 'invalid-email'
  }

  const createResponse = await app.inject({
    method: 'POST',
    url: '/api/users',
    payload: invalidUserPayload
  })

  t.equal(createResponse.statusCode, 400)

  // 测试更新不存在的用户
  const updateResponse = await app.inject({
    method: 'PUT',
    url: '/api/users/999999',
    payload: {
      name: 'Test User',
      email: 'test@example.com'
    }
  })

  t.equal(updateResponse.statusCode, 404)

  // 测试删除不存在的用户
  const deleteResponse = await app.inject({
    method: 'DELETE',
    url: '/api/users/999999'
  })

  t.equal(deleteResponse.statusCode, 404)
})
