import { server } from '../app'
// import request from 'supertest'
import { connection } from '../controllers/user'
import { sendEmail } from '../utils/utils'

afterAll(async () => {
  server.close()
  await (await connection).end()
})

describe('UserController Routes Functions', () => {
  test('sendEmail', async () => {
    const email = 'floo234.clashroyale@gmail.com'
    const code = 1234
    const response = await sendEmail(email, code)
    expect(response).toBe(true)
  })
})
