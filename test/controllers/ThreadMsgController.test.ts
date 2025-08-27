import request from 'supertest'
import { createApp } from '../../app'
import { connection } from '../../database/connect'
import { Express } from 'express'

let app: Express

beforeAll(async () => {
  app = await createApp()
})

afterAll(async () => {
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

  let msgId: string
  test('createMsg', async () => {
    const response = await agent.post('/api/threadMsg/createMsg')
      .send({ threadId, msg: 'test' })

    msgId = response.body.ID_MSG
    expect(response.status).toBe(201)
    expect(response.body).toEqual({ ID_MSG: expect.any(String) })
  })

  test('updateMsg', async () => {
    const response = await agent.patch('/api/threadMsg/updateMsg')
      .send({ threadId, msgId, msg: 'test2' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'Msg updated' })
  })

  test('deleteMsg', async () => {
    const response = await agent.delete('/api/threadMsg/deleteMsg')
      .send({ threadId, msgId })

    expect(response.status).toBe(204)
  })
})
