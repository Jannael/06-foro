import { app, server } from '../app'
import request from 'supertest'
import { connection } from '../controllers/user'

afterAll(async () => {
  server.close()
  await (await connection).end()
})

describe('UserController Routes Functions', () => {
  const agent = request.agent(app)

  test('askForCode', async () => {
    const cases = [
      {
        body: { name: 'John Doe', email: 'john@doe.com' },
        expect: 400
      },
      {
        body: { name: 'John Doe', email: '' },
        expect: 400
      },
      {
        body: { name: '', email: '', password: '' },
        expect: 400
      }
    ]

    for (const c of cases) {
      const response = await request(app).post('/api/user/askForCode').send(c.body)
      expect(response.status).toBe(c.expect)
    }

    const response = await agent.post('/api/user/askForCode').send(
      { name: 'jannael', email: 'floo234.clashroyale@gmail.com', password: '123456' }
    )

    expect(response.headers['set-cookie']).toHaveLength(1)
  })
})
