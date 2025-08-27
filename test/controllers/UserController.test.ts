import { createApp } from '../../app'
import request from 'supertest'
import { connection } from '../../database/connect'
import dotenv from 'dotenv'
import { Express } from 'express'

let app: Express
beforeAll(async () => {
  app = await createApp()
})

dotenv.config()

afterAll(async () => {
  await (await connection).end()
})

describe('UserController Routes Functions', () => {
  const agent = request.agent(app)

  test('askForCode', async () => {
    const cases = [
      {
        body: { name: '', email: '' },
        expect: 400
      },
      {
        body: { email: 'johnDoe' },
        expect: 400
      },
      {
        body: { email: 'example@gmail.com' },
        expect: 200
      },
      {
        body: {},
        expect: 400
      }
    ]

    for (const c of cases) {
      const response = await request(app).post('/api/user/askForCode').send(c.body)
      expect(response.status).toBe(c.expect)
    }

    const response = await agent.post('/api/user/askForCode').send(
      { name: 'jannael', email: 'example@gmail.com', password: '123456', testCode: process.env.SECRET_CODE_TEST as string }
    )

    expect(response.headers['set-cookie']).toHaveLength(1)
  })

  test('verifyCode', async () => {
    const response = await agent.post('/api/user/verifyCode').send({ email: 'example@gmail.com', code: '1234' })

    expect(response.headers['set-cookie'][1]).toContain('emailVerified')
    expect(response.text).toBe('email verified')
    expect(response.status).toBe(200)
  })

  test('register', async () => {
    const response = await agent.put('/api/user/register')
      .send({ name: 'jannael', email: 'example@gmail.com', password: '123456' })

    expect(response.headers['set-cookie'][1]).toContain('accessToken')
    expect(response.headers['set-cookie'][2]).toContain('refreshToken')
    expect(response.status).toBe(201)
  })

  test('refreshToken', async () => {
    const response = await agent.get('/api/user/refreshToken')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Token refreshed')
  })

  test('loginValidation', async () => {
    const response = await agent.post('/api/user/loginValidation')
      .send({ name: 'jannael', email: 'example@gmail.com', password: '123456', testCode: process.env.SECRET_CODE_TEST as string })

    expect(response.status).toBe(200)
    expect(response.text).toBe('Email sent')
  })

  test('login', async () => {
    const response = await agent.post('/api/user/login')
      .send({ name: 'jannael', email: 'example@gmail.com', password: '123456', code: 1234 })

    expect(response.status).toBe(200)
    expect(response.text).toBe('Logged in')
  })

  test('delete', async () => {
    const response = await agent.delete('/api/user/delete')
    expect(response.status).toBe(204)
  })
})
