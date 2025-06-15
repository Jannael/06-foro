import { app, server } from '../../app'
import { connection } from '../../database/connect'
import request from 'supertest'

afterAll(async () => {
  await server.close()
  await (await connection).end()
})

describe('ThreadController', () => {
  test('getAll', async () => {
    const response = await request(app).get('/api/thread')
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.any(Array))
  })
})
