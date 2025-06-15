import request from 'supertest'
import { app, server } from '../../app'
import { connection } from '../../database/connect'

afterAll(async () => {
  await server.close()
  await (await connection).end()
})

describe('threadMsgController', () => {
  const agent = request.agent(app)
  let threadId: string
  beforeAll(async () => {
    await agent.post('/api/user/askForCode')
      .send({ name: 'createThreadMsgController', email: 'example@gmail.com', password: '123456', testCode: process.env.SECRET_CODE_TEST as string })
    await agent.post('/api/user/verifyCode')
      .send({ email: 'example@gmail.com', code: '1234' })
    await agent.put('/api/user/register')
      .send({ name: 'createThreadMsgController', email: 'example@gmail.com', password: '123456' })

    // then lets create a thread to work with
    const response = await agent.post('/api/thread')
      .send({ name: 'jannael', description: 'test' })
    threadId = response.body.threadId
  })

  afterAll(async () => {
    await agent.delete('/api/user/delete')
      .send({ email: 'example@gmail.com', code: '1234' })
  })

  test('getAll', async () => {
    const response = await request(app).get('/api/threadMsg/')
      .send({ threadId })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.any(Array))
  })

  test('createMsg', async () => {
    const response = await agent.post('/api/threadMsg/createMsg')
      .send({ threadId, msg: 'test' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual({ ID_MSG: expect.any(String) })
  })
})
