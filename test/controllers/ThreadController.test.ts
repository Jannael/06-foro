import { app, server } from '../../app'
import { connection } from '../../database/connect'
import request from 'supertest'

afterAll(async () => {
  await server.close()
  await (await connection).end()
})

describe('ThreadController', () => {
  const agent = request.agent(app)
  beforeAll(async () => {
    // first lest ask for a code
    await agent.post('/api/user/askForCode')
      .send({ name: 'createThreadController', email: 'example@gmail.com', password: '123456', testCode: process.env.SECRET_CODE_TEST as string })
    // then verify code
    await agent.post('/api/user/verifyCode')
      .send({ email: 'example@gmail.com', code: '1234' })
    // then register
    await agent.put('/api/user/register')
      .send({ name: 'createThreadController', email: 'example@gmail.com', password: '123456' })
  })

  afterAll(async () => {
    await agent.delete('/api/user/delete')
      .send({ email: 'example@gmail.com', code: '1234' })
  })

  test('getAll', async () => {
    const response = await request(app).get('/api/thread')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.any(Array))
  })

  test('createThread', async () => {
    const response = await agent.post('/api/thread')
      .send({ name: 'jannael', description: 'test' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ threadId: expect.any(String), name: 'jannael', description: 'test' })
  })
})
